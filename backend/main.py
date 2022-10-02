import config

from functools import lru_cache
from fastapi import Depends, FastAPI


app = FastAPI()


@lru_cache()
def get_settings():
    return config.Settings()


@app.get("/")
def index(settings: config.Settings = Depends(get_settings)):
    return "Pizza Rank"
