# AI Suggestions Setup

The AI suggestions feature uses the Groq API to generate personalized habit recommendations. Here's how to set it up:

## Option 1: Use Fallback Suggestions (No Setup Required)
The app will work without any API key and provide helpful fallback suggestions based on your existing habits.

## Option 2: Enable Full AI Suggestions

### 1. Get a Groq API Key
1. Visit [Groq Console](https://console.groq.com/keys)
2. Sign up for a free account
3. Create a new API key
4. Copy the API key

### 2. Set the Environment Variable

#### Windows (PowerShell):
```powershell
$env:GROQ_API_KEY="your_api_key_here"
```

#### Windows (Command Prompt):
```cmd
set GROQ_API_KEY=your_api_key_here
```

#### Linux/Mac:
```bash
export GROQ_API_KEY="your_api_key_here"
```

### 3. Restart the Backend
After setting the environment variable, restart the backend server:
```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Features
- **With API Key**: Get personalized AI-generated habit suggestions based on your existing habits
- **Without API Key**: Get smart fallback suggestions that complement your current habits

## Troubleshooting
- If you see "API Key Error", the fallback suggestions will be used instead
- Check that the environment variable is set correctly
- Ensure the API key is valid and has sufficient credits
