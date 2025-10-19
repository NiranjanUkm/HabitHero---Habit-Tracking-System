from sqlalchemy import Column, String, Integer, ForeignKey, Date, Enum
from sqlalchemy.orm import relationship
from backend.models.base import BaseModel

class Habit(BaseModel):
    __tablename__ = "habits"
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    frequency = Column(Enum("daily", "weekly", "monthly", name="frequency_types"))
    target = Column(Integer, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="habits")
    checkins = relationship("HabitCheckin", back_populates="habit", cascade="all, delete-orphan")

class HabitCheckin(BaseModel):
    __tablename__ = "habit_checkins"
    checkin_date = Column(Date, index=True)
    status = Column(String, default="completed")
    notes = Column(String, nullable=True)
    habit_id = Column(Integer, ForeignKey("habits.id"))

    habit = relationship("Habit", back_populates="checkins")