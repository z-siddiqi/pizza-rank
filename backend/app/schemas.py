from datetime import datetime
from pydantic import BaseModel
from uuid import UUID


class VoteBase(BaseModel):
    pizza_id: str


class VoteCreate(VoteBase):
    pass


class VoteDetail(VoteBase):
    id: UUID
    created_at: datetime


class AggregateVotes(VoteBase):
    votes: int
