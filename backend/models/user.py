from sqlalchemy import Column, String
from passlib.context import CryptContext
from .base import BaseModel

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(BaseModel):
    __tablename__ = "users"
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    def verify_password(self, password: str) -> bool:
        return pwd_context.verify(password, self.hashed_password)