import json

class TruncatedUserIdBase(str):
    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)

    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def truncate(cls, value: str):
        if value is None:
            return None
        else:
            return value.split('_____')[0]

    @classmethod
    def validate(cls, v):
        if not isinstance(v, str):
            raise TypeError('string required')
        if not v:
            raise TypeError('empty string is not allowed')
        return cls(cls.truncate(v))




class JsonBase(str):
    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)

    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def convert_to_json_type(cls, value: str):
        return json.loads(value)

    @classmethod
    def validate(cls, v):
        if not isinstance(v, str):
            raise TypeError('string required')
        # if not v:
        #     raise TypeError('empty string is not allowed')
        return (cls.convert_to_json_type(v))