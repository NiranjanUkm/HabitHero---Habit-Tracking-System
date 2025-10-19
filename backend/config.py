import os
from decouple import config as decouple_config # Renamed here

# Database
DATABASE_URL = decouple_config("DATABASE_URL", default="postgresql://user:password@localhost/habit_hero")

# JWT
SECRET_KEY = decouple_config("SECRET_KEY", default="your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# App
DEBUG = decouple_config("DEBUG", default=True, cast=bool)