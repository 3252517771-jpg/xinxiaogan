from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


BACKEND_DIR = Path(__file__).resolve().parents[1]
DEFAULT_SQLITE_URL = f"sqlite+aiosqlite:///{(BACKEND_DIR / 'dev.db').as_posix()}"


class Settings(BaseSettings):
    app_name: str = Field(default="小心肝")
    app_version: str = Field(default="2.0.0")
    debug: bool = Field(default=True)
    database_url: str = Field(default=DEFAULT_SQLITE_URL)
    cors_origins: str = Field(default="http://localhost:5173,http://localhost:3000")
    secret_key: str = Field(default="dev-xinxiaogan-secret-key-change-before-deploy")
    jwt_algorithm: str = Field(default="HS256")
    access_token_expire_minutes: int = Field(default=1440)
    ml_models_dir: str = Field(default="backend/ml_models")
    risk_model_filename: str = Field(default="risk_classifier.joblib")
    risk_scaler_filename: str = Field(default="risk_scaler.joblib")
    deepseek_api_key: str = Field(default="")
    deepseek_base_url: str = Field(default="https://api.deepseek.com")
    deepseek_model: str = Field(default="deepseek-chat")
    enable_ai_advice: bool = Field(default=True)

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def ml_models_path(self) -> Path:
        return (BACKEND_DIR.parent / self.ml_models_dir).resolve()


@lru_cache
def get_settings() -> Settings:
    return Settings()
