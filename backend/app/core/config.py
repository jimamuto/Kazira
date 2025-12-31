from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    GEMINI_API_KEY: str = ""
    DATABASE_URL: str = "sqlite:///./ajira.db"
    PORT: int = 8000
    
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
