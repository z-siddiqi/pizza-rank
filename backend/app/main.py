import pusher

import models

from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from pydantic import BaseSettings
from fastapi import FastAPI

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

# fastapi
app = FastAPI()


@app.get("/")
def index():
    pusher_client.trigger("my-channel", "my-event", "Pizza Rank")
    return "Success"
