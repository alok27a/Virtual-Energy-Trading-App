from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    """
    Manages application settings loaded from environment variables in the .env file.
    """
    MONGO_DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # The gridstatus library will use this key if it is present.
    GRIDSTATUS_API_KEY: Optional[str] = None

    class Config:
        env_file = ".env"

# Create a single, globally accessible instance of the settings
settings = Settings()