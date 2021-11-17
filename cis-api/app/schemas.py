from typing import Optional, Any, List, Tuple, Union
from pydantic import Field, BaseModel, BaseConfig, validator, ValidationError, AnyUrl, conint
from enum import Enum
from datetime import datetime, timezone
from uuid import UUID, uuid4
from datetime import datetime
from app.core.utils import validate_api_key
import logging

from app.models.cis import LanguageModel

logger = logging.getLogger(__name__)

"""
This file contains two types of schemas:
- Application level pydantic schemas "application level entities"
- Pydantic schema defintions of sqlalchemy database models "orm level entities"
    The entire application will be using these, except for database defintions and migrations
    All schema definitions that exist to map SQLAlchemy models to pydantic schemas have a Meta class defintion
        This is used so we can simply call:
            pydantic_schema = MyPydanticSchema.parse_obj(dict_here)
            parsed_schema = parse_pydantic_schema(pydantic_schema)
            new_model = MySqlAlchemyModel(**parsed_schema)
"""


##########################
# """
# orm level entities
# """
##########################
class SimpleOrmBase(BaseModel):
    """
    the simplest entity around town, everything should inherit from this
    """
    class Config(BaseConfig):
        # arbitrary_types_allowed = True
        allow_population_by_field_name = True
        orm_mode = True
        json_encoders = {
            datetime: lambda dt: dt.replace(tzinfo=timezone.utc)
            .isoformat()
            .replace("+08:00", "Z")
        }


class BaseUUID(SimpleOrmBase):
    id: UUID = Field(default_factory=uuid4)


class AuditedDbEntity(BaseUUID):
    """
    simple auditing
    """
    created_at: Optional[datetime]
    updated_at: Optional[datetime]


class Language(AuditedDbEntity):
    name: str

    class Meta:
        orm_model = LanguageModel


# ##########################
# """
# application level entities
# """
# ##########################
class SimpleEntityBase(BaseModel):
    """
    the simplest entity around town, everything non datatbase related should inherit from this
    """
    class Config(BaseConfig):
        arbitrary_types_allowed = True
        allow_population_by_field_name = True
        json_encoders = {
            datetime: lambda dt: dt.replace(tzinfo=timezone.utc)
            .isoformat()
            .replace("+08:00", "Z")
        }


class BoolResponse(SimpleEntityBase):
    """
    simple bool response
    """
    success: bool


class ApiKey(BaseModel):
    """
    an api key is a prettified simplified (dashes are removed) uuidv4
    """
    api_key: str

    @validator('api_key')
    def api_key_must_be_valid(cls, v):
        return validate_api_key(v)


class LanguageResponse(Language):
    pass


class Pagination(SimpleEntityBase):
    page: conint(ge=1)
    limit: conint(ge=1, le=10)


# class TypeEnum(str, Enum):
#     field1 = 'FIELD1'
#     field2 = 'FIELD2'


# Pydantic to SQLAlchemy model conversion utilities
def is_pydantic(obj: object):
    """Checks whether an object is pydantic."""
    return type(obj).__class__.__name__ == "ModelMetaclass"


def parse_pydantic_schema(schema):
    """
    Iterates through pydantic schema and parses nested schemas
    to a dictionary containing SQLAlchemy models.
    Only works if nested schemas have specified the Meta.orm_model.
    """
    parsed_schema = dict(schema)
    for key, value in parsed_schema.items():
        try:
            if isinstance(value, list) and len(value):
                if is_pydantic(value[0]):
                    parsed_schema[key] = [schema.Meta.orm_model(**schema.dict()) for schema in value]
            else:
                if is_pydantic(value):
                    parsed_schema[key] = value.Meta.orm_model(**value.dict())
        except AttributeError:
            raise AttributeError("Found nested Pydantic model but Meta.orm_model was not specified.")
    return parsed_schema
