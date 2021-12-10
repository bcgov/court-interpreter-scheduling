import base64
import hashlib
from fastapi import status, HTTPException
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.orm.session import Session

from models.user_model import UserModel
from models.oidc_model import OidcUserModel
from datetime import datetime

# claim = {'sub': '123456-3456-56756-5676-122343253', 'email_verified': False, 'name': 'Full name', 'preferred_username': 'x@bceid', 'given_name': 'first', 'family_name': 'last', 'email': 'abc@gmail.com'}

def oidc_user_repository(claims, db: Session):
    print("____REPOSITORY________")
    # Tries to retrieve a corresponding user in the local database and creates it if applicable.
    try:
        oidc_user_query = db.query(OidcUserModel).filter(OidcUserModel.sub == claims.get('sub'))
        oidc_user_first = oidc_user_query.one()
    except NoResultFound:
        print("______EXEPTION______")
        oidc_user_first = create_oidc_user_from_claims(claims, db)
    else:
        print("______FOUND_______")
        oidc_user_first = update_oidc_user_from_claims(oidc_user_query, claims, db)

    return oidc_user_first

    
def create_oidc_user_from_claims(claims, db: Session):
    # """ Creates an ``OIDCUser`` instance using the claims extracted from an id_token. """
    sub = claims['sub']
    username = base64.urlsafe_b64encode(hashlib.sha1(str.encode(sub)).digest()).rstrip(b'=')    
    user = get_or_create_user(username, claims, db)
    print(sub)
    print(username)
    print(user)
    print(hasattr(user, 'oidcuser'))

    if hasattr(user, 'oidcuser') and len(user.oidcuser)>0:
        oidc_user_query = db.query(OidcUserModel).filter(OidcUserModel.user_id == user.id)
        oidc_user = update_oidc_user_from_claims(oidc_user_query, claims, db)
    else:
        print("ok")
        oidc_user = OidcUserModel(user_id= user.id, user=user, sub=sub, userinfo=claims)
        db.add(oidc_user)
        db.commit()
        db.refresh(oidc_user)
    
    print("___OIDC____")
    print(oidc_user)
    print(oidc_user.user)
    print(oidc_user.user.display_name)
    return oidc_user

def update_oidc_user_from_claims(oidc_user_query, claims, db: Session):
    """ Updates an ``OIDCUser`` instance using the claims extracted from an id_token. """
    oidc_user_query.update({"userinfo": claims})
    jointuser = oidc_user_query.first().user
    updating_user_query = db.query(UserModel).filter(UserModel.id == jointuser.id)      
    updating_user_query.update({
        "email": claims.get('email'),
        "display_name": claims.get('name'),
        "first_name": claims.get('given_name'),
        "last_name": claims.get('family_name'),
    })
    db.commit()
    print("___REFRESH__")
    return oidc_user_query.first()


def get_or_create_user(username, claims, db: Session):
    username = username.decode("utf-8")

    if username:
        users_query = db.query(UserModel).filter(UserModel.username == username)   
    else:
        raise HTTPException(status.HTTP_403_FORBIDDEN,'No Username.')

    print("__GET_OR_CREATE__USER__")

    if len(users_query.all()) == 0:        
        new_user = UserModel(           
            last_login = datetime.now(),  
            username = username,
            first_name = claims.get("given_name") or "", 
            last_name = claims.get("family_name") or "",    
            email =  claims.get("email"),
            is_staff =  False,   
            date_joined = datetime.now(),            
            authorization_id = claims.get("sub"),
            display_name = claims.get("name") or claims.get("family_name") or "Not defined",
        )        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user
    elif len(users_query.all()) == 1:
        return users_query.first()
    else:  # duplicate handling
        current_user = None
        for usr in users_query.all():
            current_user = usr
            if hasattr(usr, 'oidcuser') and len(usr.oidcuser)>0:
                return usr

        return current_user

    