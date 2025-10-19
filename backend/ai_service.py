# backend/ai_service.py (CORRECTED)

import os
import json
from typing import List, Dict
from groq import Groq
from pydantic import BaseModel, Field
import time 
import random 
import asyncio
from datetime import datetime

client = Groq()
MODEL = "mixtral-8x7b-32768" 

class SuggestedHabit(BaseModel):
    name: str = Field(..., description="A concise name for the suggested habit.")
    description: str = Field(..., description="A short, encouraging description of the habit.")
    category: str = Field(..., description="The category, e.g., health, work, learning, or other.")
    frequency: str = Field(..., description="The suggested frequency, e.g., daily or weekly.")

class HabitSuggestions(BaseModel):
    suggestions: List[SuggestedHabit]

async def get_habit_suggestions(current_habits_summary: List[Dict]) -> List[SuggestedHabit]:
    
    if current_habits_summary:
        habits_list = "\n".join(
            [f"- {h['name']} ({h['category']}, {h['frequency']})" for h in current_habits_summary]
        )
        user_context = f"The user currently tracks the following {len(current_habits_summary)} habits:\n{habits_list}"
    else:
        user_context = "The user has not added any habits yet. Provide diverse suggestions across categories to help them start their routine."

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
        f"Based on this context, suggest 3 new, unique habits that complement their routine. "
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
            # FIX: Changed response_model to response_format
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

def get_habits_summary(habits: List[Dict]) -> List[Dict]:
    return [
        {"name": h.name, "category": h.category, "frequency": h.frequency}
        for h in habits
    ]