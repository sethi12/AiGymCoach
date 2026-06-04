import json
import streamlit as st
from groq import Groq


def generate_diet(form_data):

    client = Groq(
        api_key=st.secrets["GROQ_API_KEY"]
    )
    schema = """
        {
    "planName": "",
    "goal": "",

    "summary": {
        "dailyCalories": 0,
        "protein": 0,
        "carbs": 0,
        "fats": 0,
        "fiber": 0,
        "waterLiters": 0
    },

    "shoppingList": [],

    "meals": [
        {
            "mealName": "",
            "time": "",

            "foods": [],

            "recipe": {
                "title": "",
                "prepTime": "",
                "difficulty": "",
                "ingredients": [],
                "steps": []
            },

            "protein": 0,
            "carbs": 0,
            "fats": 0,
            "calories": 0
        }
    ],

    "supplements": [],
    "tips": []
}
"""
    prompt = f"""
    You are an expert sports nutritionist.

    Create a professional gym diet plan.

    Return ONLY valid JSON.

    Schema:

    {schema}

    IMPORTANT:

    1. Every meal must include a recipe.
    2. Recipe steps should be simple and beginner friendly.
    3. Include realistic meal times based on wake up time, sleep time and workout time.
    4. Include a complete shoppingList containing all ingredients needed.
    5. Return ONLY valid JSON.
    6. Do not wrap JSON in markdown.

    Goal: {form_data['goal']}

    Age: {form_data['age']}
    Gender: {form_data['gender']}

    Height: {form_data['height']}
    Weight: {form_data['weight']}

    Activity Level:
    {form_data['activity_level']}

    Food Preference:
    {form_data['food_preference']}

    Meals Per Day:
    {form_data['meals_per_day']}

    Water Intake:
    {form_data['water_intake_target']}

    Workout Days:
    {form_data['schedule']['workout_days_per_week']}

    Workout Time:
    {form_data['schedule']['workout_time']}

    Wake Up Time:
    {form_data['schedule']['wakeup_time']}

    Sleep Time:
    {form_data['schedule']['sleep_time']}

    Sleep Duration:
    {form_data['schedule']['total_sleep_duration']}

    Allergies:
    {form_data['health_flags']['allergies']}

    Medical Conditions:
    {form_data['health_flags']['medical_conditions']}
        """

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2
    )

    raw = response.choices[0].message.content

    raw = (
        raw.replace("```json", "")
        .replace("```", "")
        .strip()
    )

    try:
        return json.loads(raw)

    except Exception as e:
        print(raw)
        raise Exception(
        f"Invalid JSON returned by model: {str(e)}"
        )