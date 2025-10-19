from sqlalchemy import Column, String, Integer, ForeignKey, Date, Enum
from sqlalchemy.orm import relationship
from .base import BaseModel

class Habit(BaseModel):
    __tablename__ = "habits"
    name = Column(String, index=True)
    description = Column(String, nullable=True) # Made description optional
    frequency = Column(Enum("daily", "weekly", "monthly", name="frequency_types"))
    category = Column(String, nullable=False)  # Add this line
    start_date = Column(Date, nullable=False)   # Add this line
    target = Column(Integer, nullable=True) # Made target optional
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