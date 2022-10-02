from pydantic import BaseSettings
from pathlib import Path

BASE_DIR = Path(__file__).resolve(strict=True).parent.parent


class Settings(BaseSettings):
    app_name: str = "Pizza Rank API"
    pusher_app_id: str
    pusher_key: str
    pusher_secret: str
    pusher_cluster: str

    class Config:
        env_file = BASE_DIR / ".env"


settings = Settings()
