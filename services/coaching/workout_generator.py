import json
import streamlit as st
from groq import Groq


def generate_workout_plan(form_data):
    client = Groq(api_key=st.secrets["GROQ_API_KEY"])

    # Enforce strict assignment of concrete days in our schema blueprint
    schema = """
{
    "planName": "e.g., Push/Pull/Legs Hypertrophy Protocol",
    "goal": "Target goal text matches entry",
    "weeklySchedule": [
        {
            "day": "Monday", 
            "focus": "Chest & Triceps / Rest Day / Upper Body Power",
            "exercises": [
                {
                    "exercise": "Incline Dumbbell Press",
                    "muscleGroup": "Chest",
                    "sets": 4,
                    "reps": "8-12",
                    "restSeconds": 90
                }
            ]
        }
    ],
    "cardio": {
        "type": "HIIT / LISS / None",
        "duration": "20 mins"
    },
    "tips": ["Tip 1", "Tip 2"]
}
"""

    prompt = f"""
You are an elite, top-tier personal training fitness coach. 

Generate a comprehensive, scientifically optimized weekly workout plan based on the user criteria provided.

Return ONLY valid JSON matching the exact structure requested. Do not include any chat preamble or explanations.

CRITICAL INSTRUCTIONS:
1. Provide a complete week schedule. The "day" key in "weeklySchedule" MUST be an explicit name of a day of the week (e.g., "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday").
2. Do NOT use generic tags like "Day 1", "Day 2", etc. Map out the workouts precisely to realistic days based on the user's requested number of training days ({form_data['days_per_week']} days). Mark non-training days as "Rest Day" under the "focus" key with an empty exercises list if needed to fill the week.
3. Scale exercise selection, volume, and load density matching a user with an {form_data['experience']} background.
4. STRICT SAFETY: Completely modify or substitute selections to respect: {form_data['injuries']}.
5. Match equipment availability strictly to: {form_data['equipment']}.
6. Prioritize volume and targeting toward these target groups: {', '.join(form_data['priority_muscles'])}.

Schema Layout Reference:
{schema}

User Configuration Matrix:
- Goal: {form_data['goal']}
- Age/Gender: {form_data['age']} | {form_data['gender']}
- Biometrics: {form_data['height']} | {form_data['weight']}
- Experience Level: {form_data['experience']}
- Target Frequency: {form_data['days_per_week']} Days Per Week
- Session Duration Goal: {form_data['workout_duration']}
- Preferred Time: {form_data['workout_time']}
- Equipment Available: {form_data['equipment']}
- Priority Targets: {', '.join(form_data['priority_muscles'])}
- Physical Red Flags/Injuries: {form_data['injuries']}
"""

    # Utilizing Groq's explicit JSON output mode parameter constraint
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "You are a rigid structured data pipeline API engine. You output exclusively valid, parsable JSON objects matching the user's requested schema blueprints. Never include markdown prose wrapper notation."
            },
            {"role": "user", "content": prompt}
        ],
        response_format={"type": "json_object"},
        temperature=0.2
    )

    raw = response.choices[0].message.content

    # Clean out stray Markdown text blocks if present
    if raw.startswith("```"):
        raw = raw.replace("```json", "").replace("```", "").strip()

    try:
        return json.loads(raw)
    except Exception as e:
        print("Raw Error Body Execution Response:", raw)
        raise Exception(f"Failed to cleanly structure payload data metrics: {str(e)}")