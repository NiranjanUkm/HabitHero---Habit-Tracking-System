from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from ai_service import get_habit_suggestions, SuggestedHabit, get_habits_summary
from auth import get_current_user
import models

router = APIRouter(
    prefix="/ai",
    tags=["ai"],
    dependencies=[Depends(get_current_user)],
)

@router.get("/suggest_habits", response_model=List[SuggestedHabit])
async def suggest_habits_endpoint(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    Generates AI-based habit suggestions by analyzing the user's existing habits.
    """
    # Fetch user's existing habits
    habits = db.query(models.Habit).filter(models.Habit.user_id == current_user.id).all()
    
    # Prepare data for the AI prompt
    habits_summary = get_habits_summary(habits)

    # Get suggestions from the AI service
    suggestions = await get_habit_suggestions(habits_summary)

    return suggestions