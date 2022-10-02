import pusher

from functools import lru_cache
from fastapi import Depends, FastAPI

from config import settings


app = FastAPI()

pusher_client = pusher.Pusher(
    app_id=settings.pusher_app_id,
    key=settings.pusher_key,
    secret=settings.pusher_secret,
    cluster=settings.pusher_cluster,
    ssl=True,
)


@app.get("/")
def index():
    pusher_client.trigger("my-channel", "my-event", "Pizza Rank")
    return "Success"
