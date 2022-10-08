import uuid

from sqlalchemy import types, Column, String, UniqueConstraint, DateTime
from sqlalchemy.sql import expression
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.compiler import compiles
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# https://gist.github.com/gmolveau/7caeeefe637679005a7bb9ae1b5e421e
class GUID(types.TypeDecorator):
    """Platform-independent GUID type.
    Uses PostgreSQL's UUID type, otherwise uses
    CHAR(32), storing as stringified hex values.
    """

    impl = types.CHAR
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == "postgresql":
            return dialect.type_descriptor(UUID())
        else:
            return dialect.type_descriptor(types.CHAR(32))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        elif dialect.name == "postgresql":
            return str(value)
        else:
            if not isinstance(value, uuid.UUID):
                return "%.32x" % uuid.UUID(value).int
            else:
                # hexstring
                return "%.32x" % value.int

    def _uuid_value(self, value):
        if value is None:
            return value
        else:
            if not isinstance(value, uuid.UUID):
                value = uuid.UUID(value)
            return value

    def process_result_value(self, value, dialect):
        return self._uuid_value(value)

    def sort_key_function(self, value):
        return self._uuid_value(value)


# https://docs.sqlalchemy.org/en/14/core/compiler.html#utc-timestamp-function
class utcnow(expression.FunctionElement):
    type = types.DateTime()
    inherit_cache = True


@compiles(utcnow, "sqlite")
def sqlite_utcnow(element, compiler, **kw):
    return r"(STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW'))"


class Vote(Base):
    __tablename__ = "votes"
    __table_args__ = (UniqueConstraint("user_id", "pizza_id"),)

    id = Column(GUID(), primary_key=True, default=lambda: str(uuid.uuid4()))
    created_at = Column(DateTime, server_default=utcnow())
    user_id = Column(String)
    pizza_id = Column(String, index=True)
