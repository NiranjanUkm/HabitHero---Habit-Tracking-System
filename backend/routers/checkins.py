from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import auth, models
from ..database import get_db
from ..schemas.checkin import CheckIn, CheckInCreate

router = APIRouter(
    prefix="/habits/{habit_id}/checkins",
    tags=["checkins"],
    dependencies=[Depends(auth.get_current_user)],
)


@router.post("/", response_model=CheckIn)
def create_checkin_for_habit(
    habit_id: int,
    checkin: CheckInCreate,
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
    db_checkin = models.HabitCheckin(**checkin.dict(), habit_id=habit_id)
    db.add(db_checkin)
    db.commit()
    db.refresh(db_checkin)
    return db_checkin


@router.get("/", response_model=List[CheckIn])
def read_checkins_for_habit(
    habit_id: int,
    skip: int = 0,
    limit: int = 100,
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
    checkins = (
        db.query(models.HabitCheckin)
        .filter(models.HabitCheckin.habit_id == habit_id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return checkins


@router.delete("/{checkin_id}", response_model=CheckIn)
def delete_checkin(
    habit_id: int,
    checkin_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    db_checkin = (
        db.query(models.HabitCheckin)
        .join(models.Habit)
        .filter(
            models.Habit.user_id == current_user.id,
            models.HabitCheckin.habit_id == habit_id,
            models.HabitCheckin.id == checkin_id,
        )
        .first()
    )
    if db_checkin is None:
        raise HTTPException(status_code=404, detail="Check-in not found")

    db.delete(db_checkin)
    db.commit()
    return db_checkin