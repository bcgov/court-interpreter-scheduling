import base64
from typing import Optional, Tuple

from nacl.secret import SecretBox
import nacl.utils
from core.config import settings

class DecryptError(Exception):
    pass


class Encryptor:
    def __init__(self):
        self._key_id = None
        
        key = self.load_key()
        if key:
            # encrypt a fixed input and nonce
            tpl = self._encrypt(key, b"key_id", b"0" * SecretBox.NONCE_SIZE)
            # use part of the MAC of the message as a key identifier
            self._key_id = base64.b64encode(tpl[-8:]).decode("ascii").strip("=")
        

    def decrypt(self, key_id: str, ciphertext: bytes) -> bytes:
        if not key_id or not ciphertext:
            return ciphertext
        if key_id != self._key_id:
            raise DecryptError("Unexpected key ID")
        box = self.load_key()
        # pass through bytes in case we receive a memoryview from django
        plaintext = box.decrypt(bytes(ciphertext))
        return plaintext

    def encrypt(self, data: bytes, nonce: bytes = None) -> Tuple[Optional[str], bytes]:
        if not self._key_id or not data:
            return [None, data]
        return [self._key_id, self._encrypt(self.load_key(), data, nonce)]

    def _encrypt(self, key: SecretBox, data: bytes, nonce: bytes = None) -> bytes:
        if not nonce:
            nonce = nacl.utils.random(SecretBox.NONCE_SIZE)
        return bytes(key.encrypt(data, nonce))

    @property
    def key_id(self) -> Optional[str]:
        return self._key_id

    def load_key(self) -> Optional[SecretBox]:
        
        prv_key = settings.DATA_SECURITY_KEY
        if len(prv_key)>32 : 
            prv_key = prv_key[0:32]


        if prv_key:
            if len(prv_key) == SecretBox.KEY_SIZE:
                prv_key = prv_key.encode("ascii")
            else:
                prv_key = base64.b64decode(prv_key)
                # exception will be raised by SecretBox if length is incorrect
            return SecretBox(prv_key)
            
