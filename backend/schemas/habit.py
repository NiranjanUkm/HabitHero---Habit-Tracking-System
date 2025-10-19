from datetime import date
from typing import Optional

from pydantic import BaseModel

class HabitBase(BaseModel):
    name: str
    description: Optional[str] = None
    frequency: str
    target: Optional[int] = None

class HabitCreate(HabitBase):
    pass

class HabitUpdate(HabitBase):
    pass

class Habit(HabitBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True