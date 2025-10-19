from datetime import date, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

# FIX: Explicitly import dependency functions
from auth import get_current_user 
import models
from database import get_db
from schemas.analytics import AnalyticsStats

router = APIRouter(
    prefix="/analytics",
    tags=["analytics"],
    dependencies=[Depends(get_current_user)],
)

def calculate_streak(checkins: list[models.HabitCheckin]) -> int:
    if not checkins:
        return 0

    # Sort check-ins by date in descending order
    sorted_checkins = sorted(checkins, key=lambda c: c.checkin_date, reverse=True)
    
    today = date.today()
    streak = 0
    
    # Check if the most recent check-in is today or yesterday
    if sorted_checkins[0].checkin_date == today or sorted_checkins[0].checkin_date == today - timedelta(days=1):
        streak = 1
        # Traverse backwards from the most recent check-in
        for i in range(len(sorted_checkins) - 1):
            # Check if the next check-in is the day before the current one
            if sorted_checkins[i].checkin_date - timedelta(days=1) == sorted_checkins[i+1].checkin_date:
                streak += 1
            else:
                break # Streak is broken
    
    return streak


@router.get("/stats", response_model=AnalyticsStats)
def get_user_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    habits = db.query(models.Habit).filter(models.Habit.user_id == current_user.id).all()
    
    total_habits = len(habits)
    total_checkins = 0
    longest_streak = 0
    streaks = {}

    for habit in habits:
        checkins = db.query(models.HabitCheckin).filter(models.HabitCheckin.habit_id == habit.id).all()
        total_checkins += len(checkins)
        
        current_habit_streak = calculate_streak(checkins)
        streaks[habit.id] = current_habit_streak
        
        if current_habit_streak > longest_streak:
            longest_streak = current_habit_streak

    return {
        "total_habits": total_habits,
        "total_checkins": total_checkins,
        "longest_streak": longest_streak,
        "streaks": streaks,
    }