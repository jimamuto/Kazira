from pydantic_settings import BaseSettings, SettingsConfigDict
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "Kazira"
    GEMINI_API_KEY: str = ""
    DATABASE_URL: str = "sqlite:///./kazira.db"
    PORT: int = 8000
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:3001"
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"
    GEMINI_MODEL: str = "gemini-3-flash-preview"
    GEMINI_TEMPERATURE: float = 0.7
    MAX_RETRIES: int = 3
    SCRAPER_TIMEOUT: int = 30
    MARATHON_CYCLE_INTERVAL_MINUTES: int = 30
    SESSION_CLEANUP_HOURS: int = 24

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()

# Validate required environment variables
import warnings
if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "your_gemini_api_key_here":
    warnings.warn("GEMINI_API_KEY not set. Running in mock mode. Application will use mock responses.")
    settings.GEMINI_API_KEY = ""

if settings.ENVIRONMENT not in ["development", "staging", "production"]:
    raise ValueError(f"ENVIRONMENT must be one of: development, staging, production. Got: {settings.ENVIRONMENT}")
