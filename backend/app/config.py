import os

class Settings:
    PROJECT_NAME: str = "AI Based Water Disease Monitor"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./water_monitor.db")
    MODEL_PATH: str = os.getenv("MODEL_PATH", "./ml_models/best_water_model.joblib")

settings = Settings()
