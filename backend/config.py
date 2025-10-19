import os
from dotenv import load_dotenv

# Explicitly load the .env file from the backend directory
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

# Database
DATABASE_URL = os.getenv("DATABASE_URL")

# JWT
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# App
DEBUG = os.getenv("DEBUG", "False").lower() in ("true", "1", "t")