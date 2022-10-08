import hashlib
import hmac
import pusher

import utils, models, schemas

from datetime import datetime
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.exc import IntegrityError
from pydantic import BaseSettings
from fastapi import Depends, Header, Request, HTTPException, APIRouter, FastAPI
from fastapi.routing import APIRoute

# settings
BASE_DIR = Path(__file__).resolve(strict=True).parent.parent
SQLALCHEMY_DATABASE_URL = "sqlite:///../pizza_rank.db"


class Settings(BaseSettings):
    app_name: str = "Pizza Rank API"
    pusher_app_id: str
    pusher_key: str
    pusher_secret: str
    pusher_cluster: str

    class Config:
        env_file = BASE_DIR / ".env"


settings = Settings()

# database
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

models.Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# pusher
pusher_client = pusher.Pusher(
    app_id=settings.pusher_app_id,
    key=settings.pusher_key,
    secret=settings.pusher_secret,
    cluster=settings.pusher_cluster,
    ssl=True,
)

# router
class ContextIncludedRoute(APIRoute):
    def get_route_handler(self):
        original_route_handler = super().get_route_handler()

        async def custom_route_handler(request: Request):
            client_string = request.client.host + request.headers.get("user-agent", default="")
            client_hash_header = "x-client-hash".encode(), hashlib.md5(client_string.encode()).digest()
            request.headers.__dict__["_list"].append(client_hash_header)
            response = await original_route_handler(request)
            return response

        return custom_route_handler


router = APIRouter(route_class=ContextIncludedRoute)


@router.get("/votes", response_model=list[schemas.AggregateVotes])
def get_votes(db: Session = Depends(get_db)):
    return utils.get_votes(db)


@router.post("/votes", response_model=schemas.VoteDetail)
def post_vote(request: Request, vote: schemas.VoteCreate, db: Session = Depends(get_db)):
    client_hash = request.headers.get("x-client-hash")

    try:
        obj = utils.create_vote(db, vote, client_hash)
        pusher_client.trigger(
            "cache-recent-votes",
            "vote-event",
            {
                "created_at": obj.created_at.isoformat(),
                "pizza_id": obj.pizza_id,
            },
        )
        return schemas.VoteDetail(id=obj.id, pizza_id=obj.pizza_id, created_at=obj.created_at)
    except IntegrityError as e:
        raise HTTPException(status_code=400, detail="Can only vote once")


@router.post("/cache-miss", status_code=204)
async def cache_miss(request: Request, x_pusher_signature: str = Header(None), db: Session = Depends(get_db)):
    if x_pusher_signature:
        raw_input = await request.body()
        input_hmac = hmac.new(key=settings.pusher_secret.encode(), msg=raw_input, digestmod="sha256")

        if not hmac.compare_digest(input_hmac.hexdigest(), x_pusher_signature):
            raise HTTPException(status_code=400, detail="Invalid message signature")

        obj = utils.get_latest_vote(db)

        if obj:
            pusher_client.trigger(
                "cache-recent-votes",
                "vote-event",
                {
                    "created_at": obj.created_at.isoformat(),
                    "pizza_id": obj.pizza_id,
                },
            )
    else:
        raise HTTPException(status_code=400, detail="Missing header '[X-Pusher-Signature]'")


# fastapi
app = FastAPI()
app.include_router(router)
