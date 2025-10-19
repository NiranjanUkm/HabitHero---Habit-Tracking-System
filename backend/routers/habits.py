from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

# FIX: Use absolute imports for stability and dependency injection
from auth import get_current_user 
import models
from database import get_db
from schemas.habit import Habit, HabitCreate, HabitUpdate
from schemas.checkin import CheckIn 


router = APIRouter(
    prefix="/habits",
    tags=["habits"],
    # FIX: Use the dependency directly
    dependencies=[Depends(get_current_user)],
)


@router.post("/", response_model=Habit)
def create_habit(
    habit: HabitCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    db_habit = models.Habit(**habit.dict(), user_id=current_user.id)
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return db_habit


@router.get("/", response_model=List[Habit])
def read_habits(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    habits = (
        db.query(models.Habit)
        .filter(models.Habit.user_id == current_user.id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return habits


@router.put("/{habit_id}", response_model=Habit)
def update_habit(
    habit_id: int,
    habit: HabitUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    db_habit = (
        db.query(models.Habit)
        .filter(models.Habit.id == habit_id, models.Habit.user_id == current_user.id)
        .first()
    )
    if db_habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")

    # Only update fields that are provided
    for var, value in vars(habit).items():
        if value is not None:
            setattr(db_habit, var, value)

    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return db_habit


@router.delete("/{habit_id}", response_model=Habit)
def delete_habit(
    habit_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    db_habit = (
        db.query(models.Habit)
        .filter(models.Habit.id == habit_id, models.Habit.user_id == current_user.id)
        .first()
    )
    if db_habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")

    db.delete(db_habit)
    db.commit()
    return db_habit

@router.get("/checkins/all", response_model=List[CheckIn])
def read_all_user_checkins(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    checkins = (
        db.query(models.HabitCheckin)
        .join(models.Habit)
        .filter(models.Habit.user_id == current_user.id)
        .all()
    )
    return checkins