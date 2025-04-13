# server/app/core/config.py
import os
from dotenv import load_dotenv
from pydantic import BaseSettings

load_dotenv()

class Settings(BaseSettings):
    # Configuración general
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Curso IA App"
    
    # Selección de proveedor de IA
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "gemini")
    
    # Variables de entorno para Gemini
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-pro")
    
    # Variables de entorno para OpenAI
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
    MAX_TOKENS: int = int(os.getenv("MAX_TOKENS", "2000"))
    
    # Variables de entorno para base de datos
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "curso_app")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    
    # Configuración de seguridad
    SECRET_KEY: str = os.getenv("SECRET_KEY", "desarrollo_secreto_temporal")
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
