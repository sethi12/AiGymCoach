import streamlit as st
from groq import Groq


def ask_coach(question):

    client = Groq(
        api_key=st.secrets["GROQ_API_KEY"]
    )

    system_prompt = """
You are an elite fitness coach.

You ONLY answer questions related to:

- Gym workouts
- Exercise techniques
- Workout plans
- Strength training
- Muscle building
- Fat loss
- Nutrition
- Diet
- Supplements
- Recovery
- Mobility
- Sports performance

If the user asks anything outside these topics,
reply EXACTLY:

I am your AI Gym Coach and can only answer fitness related questions.

Do not answer coding questions.
Do not answer history questions.
Do not answer politics questions.
Do not answer general knowledge questions.
Do not answer movie questions.
Do not answer business questions.

Keep answers practical and easy to understand.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": question
            }
        ],
        temperature=0.3,
        max_tokens=500
    )

    return response.choices[0].message.content