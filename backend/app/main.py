import hashlib
import pusher

import models

from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from pydantic import BaseSettings
from fastapi import Request, APIRouter, FastAPI
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

@router.get("/")
def index(request: Request):
    client_hash = request.headers.get("x-client-hash")
    # pusher_client.trigger("my-channel", "my-event", "Pizza Rank")
    return {"client_hash": client_hash}

# fastapi
app = FastAPI()
app.include_router(router)
