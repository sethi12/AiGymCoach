from datetime import datetime
import streamlit as st
from services.coaching.workout_generator import generate_workout_plan
from services.persistance.workout_repository import (
    save_workout_for_member
)

def render_workout_plan_page():
    # ---------------------------------------------------------
    # Premium UI Core CSS Styles Injector
    # ---------------------------------------------------------
    # ---------------------------------------------------------
    # Premium UI Core CSS Styles Injector (ANTI-GLITCH EDITION)
    # ---------------------------------------------------------
    st.markdown(
        """
        <style>
        /* CRITICAL FIX: Vaporizes the bleeding internal raw text strings from expander chevrons */
        [data-testid="stIconMaterial"] {
            font-size: 0px !important;
            color: transparent !important;
            display: none !important;
        }

        /* Re-enforce clean margins for your custom title text */
        .stExpander details summary p {
            overflow: visible !important;
            white-space: nowrap !important;
            margin-left: 5px !important;
        }
        
        /* Premium card container adjustments */
        .premium-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 20px;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(5px);
        }
        
        /* Custom Section Headers */
        .section-header {
            color: #2ECC71;
            font-size: 1.25rem;
            font-weight: 700;
            margin-top: 1.5rem;
            margin-bottom: 1rem;
            letter-spacing: 0.5px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        /* Metric Badges for User Profiles */
        .profile-badge {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 6px 12px;
            border-radius: 8px;
            font-size: 0.9rem;
            display: inline-block;
            margin: 4px;
        }
        
        /* Dynamic Exercise Block Layout */
        .exercise-box {
            background: rgba(46, 204, 113, 0.04);
            border: 1px solid rgba(46, 204, 113, 0.15);
            border-left: 4px solid #2ECC71;
            padding: 16px;
            border-radius: 0 12px 12px 0;
            margin-bottom: 12px;
        }
        .exercise-title {
            color: #FFF;
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 6px;
        }
        </style>
    """,
        unsafe_allow_html=True,
    )

    # ---------------------------------------------------------
    # Navigation Action Bar
    # ---------------------------------------------------------
    col_back, _ = st.columns([1, 5])
    with col_back:
        if st.button("⬅ Back", use_container_width=True):
            st.session_state.current_page = "ask_coach"
            st.rerun()

    st.markdown(
        "<h1 style='text-align: center; margin-top:-10px;'>🏋️ AI Workout Generator</h1>",
        unsafe_allow_html=True,
    )
    st.markdown(
        "<p style='text-align: center; color: #888; font-size: 1.1rem;'>Architect your custom, precision-split physical conditioning template.</p>",
        unsafe_allow_html=True,
    )
    st.divider()

    # ---------------------------------------------------------
    # Core Goal Setup Selectors
    # ---------------------------------------------------------
    st.markdown("### 🎯 What is your primary objective?")
    goal = st.radio(
        "Select Your Goal",
        ["Muscle Gain", "Fat Loss", "Strength", "General Fitness", "Other"],
        horizontal=True,
        label_visibility="collapsed"
    )

    custom_goal = ""
    if goal == "Other":
        custom_goal = st.text_input(
            "Enter your custom goal:", placeholder="e.g., Tactical fitness, Hybrid endurance..."
        )

    st.markdown("<br>", unsafe_allow_html=True)

    # ---------------------------------------------------------
    # Configuration Entry Form Block
    # ---------------------------------------------------------
    with st.form("workout_form", clear_on_submit=False):

        # --- Section 1: Demographics ---
        st.markdown("<div class='section-header'>👤 Personal Information</div>", unsafe_allow_html=True)
        c1, c2, c3, c4 = st.columns(4)
        with c1:
            gender = st.selectbox("Gender", ["Male", "Female", "Other"])
        with c2:
            age = st.number_input("Age", min_value=10, max_value=100, value=25)
        with c3:
            height = st.number_input("Height (cm)", min_value=100, max_value=250, value=170)
        with c4:
            weight = st.number_input("Weight (kg)", min_value=30, max_value=250, value=70)

        # --- Section 2: Experience & System Constraints ---
        st.markdown("<div class='section-header'>⚡ Experience & Equipment</div>", unsafe_allow_html=True)
        c5, c6 = st.columns(2)
        with c5:
            experience = st.selectbox("Current Experience Level", ["Beginner", "Intermediate", "Advanced"])
        with c6:
            equipment = st.selectbox("Available Equipment Tier", ["Full Gym", "Dumbbells Only", "Resistance Bands", "Bodyweight Only"])

        # --- Section 3: Scheduling Rules ---
        st.markdown("<div class='section-header'>📅 Workout Schedule</div>", unsafe_allow_html=True)
        c7, c8, c9 = st.columns(3)
        with c7:
            days_per_week = st.slider("Workout Days Per Week", 1, 7, 5)
        with c8:
            workout_duration = st.slider("Workout Duration (minutes)", 30, 180, 60, step=5)
        with c9:
            workout_time = st.time_input("Preferred Workout Time", value=datetime.strptime("18:00", "%H:%M").time())

        # --- Section 4: Focus & Safety Adjustments ---
        st.markdown("<div class='section-header'>🎯 Focus & Safety Adaptations</div>", unsafe_allow_html=True)
        priority_muscles = st.multiselect(
            "Select Target Priority Muscle Groups",
            ["Chest", "Back", "Shoulders", "Biceps", "Triceps", "Legs", "Core"]
        )
        injuries = st.text_area(
            "Injuries or Physical Limitations",
            placeholder="e.g., Rotator cuff weakness, minor lower back fatigue (Leave blank if none)...",
            height=80
        )

        st.markdown("<br>", unsafe_allow_html=True)
        submit = st.form_submit_button("🚀 Generate Workout Plan", use_container_width=True)

    # ---------------------------------------------------------
    # Core Pipeline API Submissions
    # ---------------------------------------------------------
    if submit:
        st.session_state.workout_form_data = {
            "goal": custom_goal if goal == "Other" else goal,
            "age": age,
            "height": f"{height} cm",
            "weight": f"{weight} kg",
            "gender": gender,
            "experience": experience,
            "days_per_week": days_per_week,
            "workout_duration": f"{workout_duration} mins",
            "workout_time": workout_time.strftime("%I:%M %p"),
            "equipment": equipment,
            "priority_muscles": priority_muscles if priority_muscles else ["Balanced Split"],
            "injuries": injuries if injuries.strip() else "None reported"
        }

        with st.spinner("🏋️‍♂️ Generating custom program design matrices..."):
            try:
                workout_plan = generate_workout_plan(st.session_state.workout_form_data)
                st.session_state.generated_workout_plan = workout_plan
                st.success("Workout Blueprint Synthesized Successfully!")
                st.rerun()
            except Exception as e:
                st.error(f"Failed to generate custom protocol: {str(e)}")

    # ---------------------------------------------------------
    # Dynamic Visual Program Output Display
    # ---------------------------------------------------------
    if "generated_workout_plan" in st.session_state:
        plan = st.session_state.generated_workout_plan
        user_meta = st.session_state.get("workout_form_data", {})

        st.divider()
        st.markdown("<h2 style='text-align:center; color:#2ECC71;'>📋 Your Personalized Routine Matrix</h2>", unsafe_allow_html=True)

        # --- User Profile Verification Snapshot ---
        if user_meta:
            with st.expander("👤 Verified Training Analytics Profile", expanded=False):
                meta_c1, meta_c2 = st.columns(2)
                with meta_c1:
                    st.markdown(f"<div class='profile-badge'><b>Metrics:</b> {user_meta.get('gender')}, {user_meta.get('age')}y</div>", unsafe_allow_html=True)
                    st.markdown(f"<div class='profile-badge'><b>Biometrics:</b> {user_meta.get('height')} / {user_meta.get('weight')}</div>", unsafe_allow_html=True)
                    st.markdown(f"<div class='profile-badge'><b>Level:</b> {user_meta.get('experience')}</div>", unsafe_allow_html=True)
                with meta_c2:
                    st.markdown(f"<div class='profile-badge'><b>Equipment:</b> {user_meta.get('equipment')}</div>", unsafe_allow_html=True)
                    st.markdown(f"<div class='profile-badge'><b>Targets:</b> {', '.join(user_meta.get('priority_muscles', []))}</div>", unsafe_allow_html=True)
                    st.markdown(f"<div class='profile-badge'><b>Limitations:</b> {user_meta.get('injuries')}</div>", unsafe_allow_html=True)

        # --- Strategy Title Display Header ---
        if plan:
            st.markdown(
                f"""
                <div style="
                    padding: 20px;
                    border-radius: 14px;
                    background: linear-gradient(135deg, rgba(46,204,113,0.15) 0%, rgba(26,188,156,0.05) 100%);
                    border: 1px solid rgba(46,204,113,0.3);
                    margin-bottom: 25px;
                ">
                    <h3 style='margin:0 0 6px 0; color:#2ECC71;'>🏆 {plan.get('planName', 'Custom Protocol')}</h3>
                    <p style='margin:0; opacity:0.85;'><b>Primary Target Vector:</b> {plan.get('goal', 'General Conditioning')}</p>
                </div>
                """,
                unsafe_allow_html=True
            )

            # --- Dynamic Weekly Split Accordions ---
            st.subheader("📅 Weekly Microcycle Schedule")
            
            # Extract and display the scheduled days securely
            weekly_schedule = plan.get("weeklySchedule", [])
            
            for day in weekly_schedule:
                day_name = day.get("day", "Scheduled Day")
                day_focus = day.get("focus", "Rest & Recovery")
                exercises = day.get("exercises", [])
                
                # Render Day Title with its focus area
                with st.expander(f"🗓️ {day_name} — {day_focus}", expanded=True):
                    if not exercises:
                        st.markdown("<p style='color:#888; font-style:italic;'>Rest Day. Focus on active mobility, hydration, and recovery metrics.</p>", unsafe_allow_html=True)
                    else:
                        # Render clean list of individual exercises
                        for exercise in exercises:
                            st.markdown(
                                f"""
                                <div class="exercise-box">
                                    <div class="exercise-title">⚡ {exercise.get('exercise', 'Unknown Exercise')}</div>
                                    <span style='color:#888; font-size:0.9rem;'>Target Group:</span> <b>{exercise.get('muscleGroup', 'General')}</b>
                                </div>
                                """,
                                unsafe_allow_html=True
                            )
                            
                            # Columns to cleanly lay out set/rep/rest performance metrics
                            m1, m2, m3 = st.columns(3)
                            m1.metric("Sets", f"{exercise.get('sets', 0)} sets")
                            m2.metric("Target Rep Range", f"{exercise.get('reps', 'N/A')}")
                            m3.metric("Rest Protocol", f"{exercise.get('restSeconds', 0)} sec")
                            st.markdown("<div style='margin-bottom:15px;'></div>", unsafe_allow_html=True)

            # --- System Cardio Component Block ---
            if plan.get("cardio"):
                st.markdown("<br>", unsafe_allow_html=True)
                st.subheader("🏃 System Cardio Protocol")
                cardio_type = plan["cardio"].get("type", "N/A")
                cardio_duration = plan["cardio"].get("duration", "N/A")
                st.info(f"👉 **Type:** {cardio_type} &nbsp;&nbsp;|&nbsp;&nbsp; ⏱ **Prescribed Duration:** {cardio_duration}")
                
            # --- Behavioral Coaching Tips Block ---
            if plan.get("tips"):
                st.markdown("<br>", unsafe_allow_html=True)
                st.subheader("💡 Behavioral Coaching Recommendations")
                for tip in plan["tips"]:
                    st.success(f"💪 {tip}")
        st.divider()

        st.subheader("☁️ Save Workout Plan To Member")

        with st.expander(
            "Save This Workout Plan",
            expanded=True
            ):

            save_userid = st.text_input(
                "User ID",
                key="save_workout_userid"
            )

            save_password = st.text_input(
                "Password",
                type="password",
                key="save_workout_password"
                )

        if st.button(
            "💾 Save Workout Plan",
            use_container_width=True
        ):

            if not save_userid:
                st.error("Enter User ID")

            elif not save_password:
                st.error("Enter Password")

            else:

                success, message = save_workout_for_member(
                gym_id=st.session_state["gym_id"],
                userid=save_userid,
                password=save_password,
                workout_json=plan
                )

                if success:
                    st.success(message)

                else:
                    st.error(message)