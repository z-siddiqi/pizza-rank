from pydantic import BaseModel
from uuid import UUID


class VoteBase(BaseModel):
    pizza_id: str


class VoteCreate(VoteBase):
    pass


class Vote(VoteBase):
    id: UUID


class AggregateVotes(VoteBase):
    votes: int
