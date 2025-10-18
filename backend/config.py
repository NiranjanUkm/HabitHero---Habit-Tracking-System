import os
from decouple import config

# Database
DATABASE_URL = config("DATABASE_URL", default="postgresql://user:password@localhost/habit_hero")

# JWT
SECRET_KEY = config("SECRET_KEY", default="your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# App
DEBUG = config("DEBUG", default=True, cast=bool)
