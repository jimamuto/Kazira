from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Kazira"
    GEMINI_API_KEY: str = ""
    DATABASE_URL: str = "sqlite:///./kazira.db"
    PORT: int = 8000
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
