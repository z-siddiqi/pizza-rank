import pusher

from pydantic import BaseSettings
from pathlib import Path
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
