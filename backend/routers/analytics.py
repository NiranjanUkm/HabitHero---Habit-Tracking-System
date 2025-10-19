from datetime import date, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

import auth
import models
from database import get_db
from schemas.analytics import AnalyticsStats

router = APIRouter(
    prefix="/analytics",
    tags=["analytics"],
    dependencies=[Depends(auth.get_current_user)],
)


def calculate_streak(checkins: List[models.HabitCheckin]) -> int:
    if not checkins:
        return 0

    sorted_checkins = sorted(checkins, key=lambda c: c.checkin_date, reverse=True)
    
    today = date.today()
    streak = 0
    
    if not sorted_checkins:
        return 0

    # If the last check-in is not today or yesterday, streak is 0
    if sorted_checkins[0].checkin_date not in [today, today - timedelta(days=1)]:
        return 0
    
    streak = 1
    # Loop from the second-to-last check-in backwards
    for i in range(len(sorted_checkins) - 1):
        if sorted_checkins[i].checkin_date - timedelta(days=1) == sorted_checkins[i+1].checkin_date:
            streak += 1
        else:
            # A gap was found, so the streak ends
            break
            
    return streak


@router.get("/stats", response_model=AnalyticsStats)
def get_user_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
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
        streaks[str(habit.id)] = current_habit_streak
        
        if current_habit_streak > longest_streak:
            longest_streak = current_habit_streak

    return {
        "total_habits": total_habits,
        "total_checkins": total_checkins,
        "longest_streak": longest_streak,
        "streaks": streaks,
    }