import os
from dotenv import load_dotenv

dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

# FIX: Changed to a SQLite database URL
# Database
DATABASE_URL = config("DATABASE_URL", default="sqlite:///./habithero.db")

# JWT
SECRET_KEY = os.getenv("SECRET_KEY", "a-sane-default-secret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# App
DEBUG = os.getenv("DEBUG", "True").lower() in ("true", "1", "t")