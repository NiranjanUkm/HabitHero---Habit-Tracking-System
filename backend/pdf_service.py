# backend/pdf_service.py (CORRECTED)

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import Paragraph
from io import BytesIO
from datetime import date

def create_progress_pdf(username: str, habits_data: list, total_checkins: int) -> BytesIO:
    """
    Generates a PDF report of the user's habit progress.
    """
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    # --- Styles ---
    # FIX: Get Sample Styles and only add UNQIUE custom styles
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='MyHabitTitle', fontSize=12, leading=14, spaceAfter=6, fontName='Helvetica-Bold'))

    # --- Header ---
    p.setFont('Helvetica-Bold', 24)
    p.setFillColorRGB(0.1, 0.5, 0.2) # Dark Green
    p.drawString(30, height - 50, "Habit Hero Progress Report")

    p.setFont('Helvetica', 12)
    p.setFillColorRGB(0.4, 0.4, 0.4)
    p.drawString(30, height - 75, f"Report Date: {date.today().strftime('%B %d, %Y')}")
    p.drawString(30, height - 95, f"User: {username}")

    # --- Summary Section ---
    y_pos = height - 130
    
    # Total Habits
    p.setFont('Helvetica-Bold', 14)
    p.drawString(30, y_pos, "Overall Summary")
    y_pos -= 20
    p.setFont('Helvetica', 12)
    p.drawString(30, y_pos, f"Total Active Habits Tracked: {len(habits_data)}")
    y_pos -= 15
    p.drawString(30, y_pos, f"Total Check-ins Recorded: {total_checkins}")
    y_pos -= 30

    # --- Habits Detail ---
    p.setFont('Helvetica-Bold', 14)
    p.drawString(30, y_pos, "Habit Details")
    y_pos -= 20

    for habit in habits_data:
        if y_pos < 100:
            p.showPage()
            y_pos = height - 50

        p.setFillColorRGB(0.1, 0.1, 0.1) # Black
        p.setFont('Helvetica-Bold', 11)
        p.drawString(35, y_pos, f"{habit['name']} ({habit['category'].capitalize()})")
        y_pos -= 14
        
        p.setFont('Helvetica', 10)
        p.drawString(45, y_pos, f"Frequency: {habit['frequency'].capitalize()}")
        y_pos -= 14
        
        p.drawString(45, y_pos, f"Total Check-ins: {len(habit['checkins'])}")
        y_pos -= 14
        p.drawString(45, y_pos, f"Current Streak: {habit.get('streak', 0)} days")
        y_pos -= 20
        
    p.save()
    buffer.seek(0)
    return buffer