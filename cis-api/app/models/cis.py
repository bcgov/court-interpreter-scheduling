import enum
from uuid import uuid4
from sqlalchemy import Column, Integer, String, Numeric, Float, Boolean, Enum, ForeignKey, Table, DateTime, func, BigInteger
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
metadata = Base.metadata
"""
This file contains all database models expressed using sqlalchemy.
The schemas module contains the pydantic models used in the app.
"""


class BaseUUIDModelMixin(object):
    """
    a shared simple pk id field as uuid, defaulting to a new uuid v4 value
    """
    id = Column(UUID(as_uuid=True),
                primary_key=True,
                index=True,
                default=uuid4)


class AuditedAndUUIDPrimaryKeyModelMixin(BaseUUIDModelMixin):
    """
    a shared simple auditing class for all orm class models
    """
    created_at = Column(DateTime(timezone=True),
                        server_default=func.now(),
                        nullable=False)
    updated_at = Column(DateTime(timezone=True),
                        server_default=func.now(),
                        onupdate=func.now(),
                        nullable=False)


class LanguageModel(AuditedAndUUIDPrimaryKeyModelMixin, Base):
    __tablename__ = "language"
    name = Column(String,
                  unique=True,
                  index=True,
                  nullable=False)


class CourtLocationModel(AuditedAndUUIDPrimaryKeyModelMixin, Base):
    __tablename__ = "court_location"
    location_name = Column(String,
                           unique=True,
                           index=True,
                           nullable=False)
    location_code = Column(String,
                           unique=True,
                           index=False,
                           nullable=False)
    address_line1 = Column(String,
                           unique=False,
                           index=False,
                           nullable=True)
    address_line2 = Column(String,
                           unique=False,
                           index=False,
                           nullable=True)
    city = Column(String,
                  unique=False,
                  index=False,
                  nullable=True)
    postal_code = Column(String,
                         unique=False,
                         index=False,
                         nullable=True)
    location_short_desc = Column(String,
                                 unique=False,
                                 index=False,
                                 nullable=False)
    lat = Column(Float,
                 unique=False,
                 index=False,
                 nullable=True)
    lng = Column(Float,
                 unique=False,
                 index=False,
                 nullable=True)


class BookingStatusModel(enum.Enum):
    PENDING = 'Pending'
    BOOKED = 'Booked'
    CANCELLED = 'Cancelled'


class BookingPeriodModel(enum.Enum):
    MORNING = 'MORNING'
    AFTERNOON = 'AFTERNOON'
    WHOLE_DAY = 'WHOLE_DAY'


class RoleModel(AuditedAndUUIDPrimaryKeyModelMixin, Base):
    __tablename__ = "role"
    role_name = Column(String,
                       unique=True,
                       index=True,
                       nullable=False)


class UserModel(AuditedAndUUIDPrimaryKeyModelMixin, Base):
    __tablename__ = "user"
    gu_id = Column(String,
                   unique=True,
                   index=True,
                   nullable=False)
    kc_id = Column(String,
                   unique=True,
                   index=True,
                   nullable=True)
    first_name = Column(String,
                        unique=False,
                        index=False,
                   nullable=True)
    last_name = Column(String,
                        unique=False,
                        index=False,
                        nullable=True)
    disabled = Column(Boolean,
                      unique=False,
                      index=False,
                      nullable=False,
                      default=False)
    # TODO:// add court_location_id as the user can have an association to a location via the save feature on the frontend


class UserRoleModel(AuditedAndUUIDPrimaryKeyModelMixin, Base):
    __tablename__ = "user_role"
    user_id = Column(UUID(as_uuid=True),
                     ForeignKey('user.id'),
                     name='user_id',
                     nullable=False)
    user = relationship("UserModel")
    role_id = Column(UUID(as_uuid=True),
                     ForeignKey('role.id'),
                     name='role_id',
                     nullable=False)
    role = relationship("RoleModel")

# sample enum column
# a_type = Column(Enum(BookingPeriodModel,
#                                 name='booking_period',
#                                 values_callable=lambda obj: [e.value for e in obj]),
#                            nullable=False,
#                            default=BookingPeriodModel.WHOLE_DAY.value,
#                            server_default=BookingPeriodModel.WHOLE_DAY.value)
