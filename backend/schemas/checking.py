from datetime import date
from typing import Optional

from pydantic import BaseModel


class CheckInBase(BaseModel):
    checkin_date: date
    notes: Optional[str] = None
    status: str = "completed"


class CheckInCreate(CheckInBase):
    pass


class CheckIn(CheckInBase):
    id: int
    habit_id: int

    class Config:
        from_attributes = True