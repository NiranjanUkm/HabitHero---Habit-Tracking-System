# backend/routers/report.py

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List
from io import BytesIO
# FIX: Import date from datetime
from datetime import date 

from database import get_db
from auth import get_current_user
from pdf_service import create_progress_pdf 
from routers.analytics import get_user_stats 
from routers.habits import read_habits 
import models

router = APIRouter(
    prefix="/report",
    tags=["report"],
    dependencies=[Depends(get_current_user)],
)

@router.get("/pdf", summary="Export User Progress as PDF Report")
async def export_pdf_report(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    Generates a PDF report summarizing all habit progress for the authenticated user.
    """
    
    # 1. Fetch data required for the report
    habits = read_habits(db=db, current_user=current_user)
    stats = get_user_stats(db=db, current_user=current_user)
    
    # 2. Prepare data structure for PDF utility
    report_data = []
    total_checkins = 0
    
    for habit in habits:
        habit_dict = {
            'name': habit.name,
            'category': habit.category,
            'frequency': habit.frequency,
            'checkins': [{"checkin_date": str(c.checkin_date)} for c in habit.checkins],
            'streak': stats['streaks'].get(habit.id, 0)
        }
        report_data.append(habit_dict)
        total_checkins += len(habit.checkins)
        
    # 3. Generate the PDF
    pdf_buffer = create_progress_pdf(
        username=current_user.username,
        habits_data=report_data,
        total_checkins=total_checkins
    )
    
    # 4. Return as Streaming Response
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=habit_hero_report_{current_user.username}_{date.today().isoformat()}.pdf"
        }
    )