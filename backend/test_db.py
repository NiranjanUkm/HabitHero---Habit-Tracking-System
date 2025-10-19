# test_clean.py
import psycopg2
from sqlalchemy import create_engine, text

print("Testing clean setup...")

# Test direct connection
try:
    conn = psycopg2.connect(
        host="localhost",
        database="habit_hero",
        user="postgres",
        password="password123", 
        port="5432"
    )
    print("✅ Direct connection SUCCESS!")
    conn.close()
except Exception as e:
    print(f"❌ Direct connection failed: {e}")

# Test SQLAlchemy connection
try:
    engine = create_engine("postgresql://postgres:password123@localhost:5432/habit_hero")
    with engine.connect() as conn:
        result = conn.execute(text("SELECT version();"))
        print("✅ SQLAlchemy connection SUCCESS!")
        print(f"Database: {result.scalar()}")
except Exception as e:
    print(f"❌ SQLAlchemy connection failed: {e}")