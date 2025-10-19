from pydantic import BaseModel
from typing import List, Dict

class AnalyticsStats(BaseModel):
    total_habits: int
    total_checkins: int
    longest_streak: int
    streaks: Dict[str, int] # Maps habit_id to its streak

    class Config:
        from_attributes = True