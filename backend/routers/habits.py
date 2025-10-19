from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import auth, models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/habits",
    tags=["habits"],
    dependencies=[Depends(auth.get_current_user)],
)


@router.post("/", response_model=schemas.Habit)
def create_habit(
    habit: schemas.HabitCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    db_habit = models.Habit(**habit.dict(), user_id=current_user.id)
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return db_habit


@router.get("/", response_model=List[schemas.Habit])
def read_habits(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    habits = (
        db.query(models.Habit)
        .filter(models.Habit.user_id == current_user.id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return habits


@router.put("/{habit_id}", response_model=schemas.Habit)
def update_habit(
    habit_id: int,
    habit: schemas.HabitUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    db_habit = (
        db.query(models.Habit)
        .filter(models.Habit.id == habit_id, models.Habit.user_id == current_user.id)
        .first()
    )
    if db_habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")

    for var, value in vars(habit).items():
        setattr(db_habit, var, value) if value else None

    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return db_habit


@router.delete("/{habit_id}", response_model=schemas.Habit)
def delete_habit(
    habit_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
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