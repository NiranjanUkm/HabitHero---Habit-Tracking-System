import os
import json
from typing import List, Dict
from groq import Groq, GroqError
from pydantic import BaseModel, Field
import time 
import random 
import asyncio
from datetime import datetime

# FIX: Explicitly get the API key from the environment
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

# 1. Initialize the Groq Client
# FIX: Pass the key explicitly to ensure the client is initialized correctly 
# in Uvicorn's subprocess environment.
try:
    client = Groq(api_key=GROQ_API_KEY)
except GroqError:
    # Provide a graceful fallback if the key is still missing
    client = None
    print("WARNING: Groq client failed to initialize at startup. Check GROQ_API_KEY in .env")

MODEL = "mixtral-8x7b-32768" 

# 2. Define the Structured Output Schema (Pydantic)
class SuggestedHabit(BaseModel):
    name: str = Field(..., description="A concise name for the suggested habit.")
    description: str = Field(..., description="A short, encouraging description of the habit.")
    category: str = Field(..., description="The category, e.g., health, work, learning, or other.")
    frequency: str = Field(..., description="The suggested frequency, e.g., daily or weekly.")

class HabitSuggestions(BaseModel):
    suggestions: List[SuggestedHabit]

# 3. Core AI Generation Function (Async for FastAPI compatibility)
async def get_habit_suggestions(current_habits_summary: List[Dict]) -> List[SuggestedHabit]:
    """
    Generates new habit suggestions based on the user's existing habits using Groq.
    """
    
    # Check if client initialized successfully
    if not client:
        return [
            SuggestedHabit(name="API Key Error", description="The Groq client failed to initialize. Check GROQ_API_KEY.", category="other", frequency="daily")
        ]
    
    # 1. Context generation
    if current_habits_summary:
        habits_list = "\n".join(
            [f"- {h['name']} ({h['category']}, {h['frequency']})" for h in current_habits_summary]
        )
        user_context = f"The user currently tracks the following {len(current_habits_summary)} habits:\n{habits_list}"
    else:
        user_context = "The user has not added any habits yet. Provide diverse suggestions across categories to help them start their routine."

    # 2. Cache Buster
    cache_buster_seed = random.randint(100000, 999999) 

    system_prompt = (
        f"You are an expert Habit Suggestion AI. Your task is to recommend 3 new, simple, and unique habits. "
        "The response MUST be a JSON object that strictly adheres to the provided schema. "
        "The categories must only be 'health', 'work', 'learning', or 'other'. "
        "The frequency must only be 'daily' or 'weekly'. "
        f"CRITICAL: Always provide different suggestions for each unique request. (Seed: {cache_buster_seed})"
    )
    
    user_prompt = (
        f"{user_context}\n\n"
        f"Based on this context, suggest 3 new habits that complement their routine. "
        f"Ensure the suggestions are not duplicates of the user's current habits. "
        f"Request Seed: {cache_buster_seed}" 
    )

    try:
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(None, lambda: client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            model=MODEL,
            temperature=0.9, 
            response_format={"type": "json_object", "schema": HabitSuggestions.model_json_schema()} 
        ))
        
        suggestions_pool = response.suggestions
        sample_count = min(3, len(suggestions_pool))
        return random.sample(suggestions_pool, sample_count)

    except Exception as e:
        print(f"Groq API Error: {e}")
        return [
            SuggestedHabit(name="Mindful Minute", description="Take a 60-second break to breathe.", category="health", frequency="daily"),
            SuggestedHabit(name="Clear Inbox", description="Process emails to reach zero daily.", category="work", frequency="daily")
        ]

# --- Helper for getting habit summary (used by endpoint) ---
def get_habits_summary(habits: List[Dict]) -> List[Dict]:
    return [
        {"name": h.name, "category": h.category, "frequency": h.frequency}
        for h in habits
    ]