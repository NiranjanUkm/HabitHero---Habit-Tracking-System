from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

<<<<<<< HEAD
# FIX: Explicitly import dependency functions
from auth import get_current_user 
import models
from database import get_db
from schemas.habit import Habit, HabitCreate, HabitUpdate
from schemas.checkin import CheckIn

=======
import auth
import models
from database import get_db
from schemas.habit import Habit, HabitCreate, HabitUpdate
>>>>>>> d6c94829ff8b33636c52577432176be05845a4c2

router = APIRouter(
    prefix="/habits",
    tags=["habits"],
<<<<<<< HEAD
    dependencies=[Depends(get_current_user)],
=======
    dependencies=[Depends(auth.get_current_user)],
>>>>>>> d6c94829ff8b33636c52577432176be05845a4c2
)


@router.post("/", response_model=Habit)
def create_habit(
    habit: HabitCreate,
    db: Session = Depends(get_db),
<<<<<<< HEAD
    current_user: models.User = Depends(get_current_user),
=======
    current_user: models.User = Depends(auth.get_current_user),
>>>>>>> d6c94829ff8b33636c52577432176be05845a4c2
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
<<<<<<< HEAD
    current_user: models.User = Depends(get_current_user),
=======
    current_user: models.User = Depends(auth.get_current_user),
>>>>>>> d6c94829ff8b33636c52577432176be05845a4c2
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
<<<<<<< HEAD
    current_user: models.User = Depends(get_current_user),
=======
    current_user: models.User = Depends(auth.get_current_user),
>>>>>>> d6c94829ff8b33636c52577432176be05845a4c2
):
    db_habit = (
        db.query(models.Habit)
        .filter(models.Habit.id == habit_id, models.Habit.user_id == current_user.id)
        .first()
    )
    if db_habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")

<<<<<<< HEAD
    for var, value in vars(habit).items():
        setattr(db_habit, var, value) if value else None
=======
    for var, value in habit.dict(exclude_unset=True).items():
        setattr(db_habit, var, value)
>>>>>>> d6c94829ff8b33636c52577432176be05845a4c2

    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return db_habit


@router.delete("/{habit_id}", response_model=Habit)
def delete_habit(
    habit_id: int,
    db: Session = Depends(get_db),
<<<<<<< HEAD
    current_user: models.User = Depends(get_current_user),
=======
    current_user: models.User = Depends(auth.get_current_user),
>>>>>>> d6c94829ff8b33636c52577432176be05845a4c2
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
<<<<<<< HEAD
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
=======
    return db_habit
>>>>>>> d6c94829ff8b33636c52577432176be05845a4c2
