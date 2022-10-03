import models, schemas

from sqlalchemy.sql import func
from sqlalchemy.orm import Session


def get_votes(db: Session):
    return db.query(models.Vote.pizza_id, func.count(models.Vote.id).label("votes")).group_by(models.Vote.pizza_id).all()


def create_vote(db: Session, vote: schemas.VoteCreate, user_id: str):
    db_vote = models.Vote(**vote.dict(), user_id=user_id)
    db.add(db_vote)
    db.commit()
    db.refresh(db_vote)
    return schemas.Vote(id=db_vote.id, pizza_id=db_vote.pizza_id)
