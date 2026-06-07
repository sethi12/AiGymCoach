from datetime import datetime, timedelta
import streamlit as st
from services.coaching.diet_generator import generate_diet
from services.persistance.diet_repository import (
            save_diet_for_member
            )

def render_diet_page():
    # ---------------------------------------------------------
    # Premium Global CSS Injector
    # ---------------------------------------------------------
    st.markdown(
        """
        <style>
        /* Card wrapper styling */
        .premium-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 20px;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(5px);
        }
        /* Mini Profile Tags */
        .profile-badge {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 6px 12px;
            border-radius: 8px;
            font-size: 0.9rem;
            display: inline-block;
            margin: 4px;
        }
        /* Custom Glowing Section Headers */
        .section-header {
            color: #2ECC71;
            font-size: 1.25rem;
            font-weight: 700;
            margin-top: 1.8rem;
            margin-bottom: 1rem;
            letter-spacing: 0.5px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        /* Time validation subtext */
        .time-badge {
            background-color: rgba(46, 204, 113, 0.15);
            color: #2ECC71;
            padding: 2px 8px;
            border-radius: 6px;
            font-size: 0.8rem;
            font-weight: bold;
            display: inline-block;
            margin-top: 4px;
        }
        /* Meal Container Title styling */
        .meal-header {
            background: linear-gradient(90deg, rgba(46,204,113,0.15) 0%, rgba(255,255,255,0.02) 100%);
            border-left: 4px solid #2ECC71;
            padding: 12px 16px;
            border-radius: 0 12px 12px 0;
            font-weight: 600;
            margin-bottom: 12px;
        }
        </style>
    """,
        unsafe_allow_html=True,
    )

    # ---------------------------------------------------------
    # Header Action Bar
    # ---------------------------------------------------------
    col_back, _ = st.columns([1, 5])
    with col_back:
        if st.button("⬅ Back", use_container_width=True):
            st.session_state.current_page = "ask_coach"
            st.rerun()

    st.markdown(
        "<h1 style='text-align: center; margin-top:-10px;'>🥗 AI Diet Generator</h1>",
        unsafe_allow_html=True,
    )
    st.markdown(
        "<p style='text-align: center; color: #888; font-size: 1.1rem;'>Let's craft your personalized, goal-driven nutrition blueprint.</p>",
        unsafe_allow_html=True,
    )
    st.divider()

    # ---------------------------------------------------------
    # Primary Goal Selection
    # ---------------------------------------------------------
    st.markdown("### 🎯 What is your primary focus?")
    goal = st.radio(
        "Select Goal",
        ["Muscle Build", "Fat Loss", "Other"],
        horizontal=True,
        label_visibility="collapsed",
    )

    custom_goal = ""
    if goal == "Other":
        custom_goal = st.text_input(
            "Specify your fitness goal:", placeholder="e.g., Marathon training, Endurance development..."
        )

    st.markdown("<br>", unsafe_allow_html=True)

    # ---------------------------------------------------------
    # Main Form Inputs
    # ---------------------------------------------------------
    with st.form("diet_form", clear_on_submit=False):

        # --- Section 1: Personal Profile ---
        st.markdown("<div class='section-header'>👤 Personal Profile</div>", unsafe_allow_html=True)
        c1, c2, c3 = st.columns(3)
        with c1:
            gender = st.selectbox("Gender", ["Male", "Female", "Non-binary"])
            age = st.number_input("Age (years)", min_value=10, max_value=100, value=25)
        with c2:
            height = st.number_input("Height (cm)", min_value=100, max_value=250, value=170)
            weight = st.number_input("Weight (kg)", min_value=30, max_value=250, value=70)
        with c3:
            activity_level = st.selectbox(
                "Activity Level",
                [
                    "Sedentary (Desk Job)",
                    "Lightly Active (1-3 days/wk)",
                    "Moderately Active (3-5 days/wk)",
                    "Very Active (6-7 days/wk)",
                    "Athlete (Heavy/Twice a day)",
                ],
            )

        # --- Section 2: Dietary Preferences ---
        st.markdown("<div class='section-header'>🥑 Dietary Preferences</div>", unsafe_allow_html=True)
        c4, c5, c6 = st.columns(3)
        with c4:
            food_preference = st.selectbox(
                "Diet Type", ["Vegetarian", "Non Vegetarian", "Vegan", "Keto", "Pescatarian"]
            )
        with c5:
            meals_per_day = st.slider("Meals Per Day", min_value=2, max_value=6, value=4)
        with c6:
            water_intake = st.number_input(
                "Target Water Intake (Liters)", min_value=1.0, max_value=10.0, value=3.0, step=0.5
            )

        # --- Section 3: Lifestyle & Routine ---
        st.markdown("<div class='section-header'>⏰ Lifestyle & Routine</div>", unsafe_allow_html=True)
        c7, c8 = st.columns(2)
        with c7:
            st.markdown("**💤 Sleep Schedule**")
            sleep_time = st.time_input("Typical Sleep Time", value=datetime.strptime("22:30", "%H:%M").time())
            st.markdown(f"<span class='time-badge'>Selected: {sleep_time.strftime('%I:%M %p')}</span>", unsafe_allow_html=True)
            
            st.markdown("<div style='margin-top:10px;'></div>", unsafe_allow_html=True)
            
            wakeup_time = st.time_input("Typical Wakeup Time", value=datetime.strptime("06:30", "%H:%M").time())
            st.markdown(f"<span class='time-badge'>Selected: {wakeup_time.strftime('%I:%M %p')}</span>", unsafe_allow_html=True)
        with c8:
            st.markdown("**🏋️ Fitness Schedule**")
            workout_days = st.number_input("Workout Days Per Week", min_value=0, max_value=7, value=5)
            
            st.markdown("<div style='margin-top:10px;'></div>", unsafe_allow_html=True)
            
            workout_time = st.time_input("Preferred Workout Time", value=datetime.strptime("18:00", "%H:%M").time())
            st.markdown(f"<span class='time-badge'>Selected: {workout_time.strftime('%I:%M %p')}</span>", unsafe_allow_html=True)

        # --- Section 4: Health Metrics ---
        st.markdown("<div class='section-header'>🏥 Health & Medical</div>", unsafe_allow_html=True)
        c9, c10 = st.columns(2)
        with c9:
            allergies = st.text_area(
                "Allergies / Intolerances",
                placeholder="e.g., Peanuts, Dairy, Gluten (Leave blank if none)",
                height=90,
            )
        with c10:
            medical_conditions = st.text_area(
                "Medical Conditions / Medications",
                placeholder="e.g., Diabetes, Hypertension, Thyroid (Leave blank if none)",
                height=90,
            )

        st.markdown("<br>", unsafe_allow_html=True)
        submit = st.form_submit_button("🚀 Generate My Custom Diet Plan", use_container_width=True)

    # ---------------------------------------------------------
    # Submission & Payload Calculations
    # ---------------------------------------------------------
    if submit:
        dummy_today = datetime.today()
        datetime_sleep = datetime.combine(dummy_today, sleep_time)
        datetime_wakeup = datetime.combine(dummy_today, wakeup_time)
        
        if datetime_wakeup <= datetime_sleep:
            datetime_wakeup += timedelta(days=1)
        
        calculated_sleep_hours = round((datetime_wakeup - datetime_sleep).total_seconds() / 3600, 1)

        st.session_state.diet_form_data = {
            "goal": custom_goal if goal == "Other" else goal,
            "age": age,
            "gender": gender,
            "height": f"{height} cm",
            "weight": f"{weight} kg",
            "activity_level": activity_level,
            "food_preference": food_preference,
            "meals_per_day": meals_per_day,
            "water_intake_target": f"{water_intake} L",
            "schedule": {
                "sleep_time": sleep_time.strftime("%I:%M %p"),
                "wakeup_time": wakeup_time.strftime("%I:%M %p"),
                "total_sleep_duration": f"{calculated_sleep_hours} hrs",
                "workout_days_per_week": workout_days,
                "workout_time": workout_time.strftime("%I:%M %p"),
            },
            "health_flags": {
                "allergies": allergies if allergies.strip() else "None reported",
                "medical_conditions": medical_conditions if medical_conditions.strip() else "None reported",
            },
        }

        with st.spinner("🧠 Analyzing profile & calculating macro ratios..."):
            try:
                diet = generate_diet(st.session_state.diet_form_data)
                st.session_state.generated_diet = diet
                st.success("Diet Plan Generated Successfully")
                st.rerun()
            except Exception as e:
                st.error(f"Failed to generate diet strategy: {str(e)}")

    # ---------------------------------------------------------
    # Visual Output Rendering
    # ---------------------------------------------------------
    if "generated_diet" in st.session_state:
        diet = st.session_state.generated_diet
        user_profile = st.session_state.get("diet_form_data", {})

        st.divider()
        st.markdown("<h2 style='text-align:center; color:#2ECC71;'>🥗 Your Personalized Diet Plan</h2>", unsafe_allow_html=True)

        # --- Dynamic Client Input Summary Card ---
        if user_profile:
            with st.expander("👤 Verified Analytics Metrics Profile", expanded=False):
                p_col1, p_col2 = st.columns(2)
                with p_col1:
                    st.markdown(f"<div class='profile-badge'><b>Gender:</b> {user_profile.get('gender')}</div>", unsafe_allow_html=True)
                    st.markdown(f"<div class='profile-badge'><b>Age:</b> {user_profile.get('age')} yrs</div>", unsafe_allow_html=True)
                    st.markdown(f"<div class='profile-badge'><b>Height/Weight:</b> {user_profile.get('height')} / {user_profile.get('weight')}</div>", unsafe_allow_html=True)
                    st.markdown(f"<div class='profile-badge'><b>Preference:</b> {user_profile.get('food_preference')}</div>", unsafe_allow_html=True)
                with p_col2:
                    st.markdown(f"<div class='profile-badge'><b>Activity:</b> {user_profile.get('activity_level')}</div>", unsafe_allow_html=True)
                    st.markdown(f"<div class='profile-badge'><b>Sleep window:</b> {user_profile.get('schedule', {}).get('total_sleep_duration')}</div>", unsafe_allow_html=True)
                    st.markdown(f"<div class='profile-badge'><b>Allergies:</b> {user_profile.get('health_flags', {}).get('allergies')}</div>", unsafe_allow_html=True)
                    st.markdown(f"<div class='profile-badge'><b>Medical conditions:</b> {user_profile.get('health_flags', {}).get('medical_conditions')}</div>", unsafe_allow_html=True)

        if diet.get("planName"):
            st.markdown(
                f"""
                <div style="
                    padding: 20px;
                    border-radius: 14px;
                    background: linear-gradient(135deg, rgba(46,204,113,0.15) 0%, rgba(26,188,156,0.05) 100%);
                    border: 1px solid rgba(46,204,113,0.3);
                    margin-bottom: 25px;
                ">
                    <h3 style='margin:0 0 8px 0; color:#2ECC71;'>🏆 {diet['planName']}</h3>
                    <p style='margin:0; opacity:0.85;'><b>Target Objective:</b> {diet['goal']}</p>
                </div>
                """,
                unsafe_allow_html=True
            )

        # --- Daily Macro Dashboard ---
        st.markdown("<div class='premium-card'>", unsafe_allow_html=True)
        st.subheader("📊 Daily Nutrition Budget")
        summary = diet["summary"]

        mc1, mc2, mc3 = st.columns(3)
        mc1.metric("🔥 Total Calories", summary["dailyCalories"])
        mc2.metric("🍗 Protein Target", f"{summary['protein']} g")
        mc3.metric("🌾 Carbohydrates", f"{summary['carbs']} g")

        st.markdown("<div style='margin-top:15px;'></div>", unsafe_allow_html=True)

        mc4, mc5, mc6 = st.columns(3)
        mc4.metric("🥑 Healthy Fats", f"{summary['fats']} g")
        mc5.metric("🥦 Dietary Fiber", f"{summary['fiber']} g")
        mc6.metric("💧 Water Intake", f"{summary['waterLiters']} L")
        st.markdown("</div>", unsafe_allow_html=True)

        # --- Meal Schedule Timeline ---
        st.subheader("🍽 Scheduled Meal Blueprint")
        for meal in diet["meals"]:
            st.markdown(f"""
                <div class="meal-header">
                    <span style="font-size:1.15rem;">⚡ {meal['mealName']}</span> 
                    <span style="float:right; opacity:0.75; font-size:0.95rem;">⏰ {meal['time']}</span>
                </div>
            """, unsafe_allow_html=True)

            recipe = meal.get("recipe")
            if recipe:
                st.markdown(
                    f"""
                    <div style="
                        background:rgba(46,204,113,0.08);
                        border:1px solid rgba(46,204,113,0.2);
                        padding:15px;
                        border-radius:12px;
                        margin-top:10px;
                        margin-bottom:10px;
                    ">
                        <h4 style="margin:0;">👨‍🍳 {recipe.get('title', 'Recipe')}</h4>
                        <p style="margin-top:5px; margin-bottom:0; opacity: 0.8; font-size: 0.9rem;">
                            ⏱ Prep: {recipe.get('prepTime','N/A')} &nbsp;&nbsp;&nbsp; ⭐ Difficulty: {recipe.get('difficulty','N/A')}
                        </p>
                    </div>
                    """,
                    unsafe_allow_html=True
                )

                col_ing, col_steps = st.columns([1, 2])
                with col_ing:
                    st.markdown("##### 🥘 Ingredients")
                    for ingredient in recipe.get("ingredients", []):
                        st.write(f"• {ingredient}")

                with col_steps:
                    st.markdown("##### 📋 Steps")
                    for idx, step in enumerate(recipe.get("steps", []), start=1):
                        st.write(f"{idx}. {step}")
                
                st.markdown("<br>", unsafe_allow_html=True)

            # --- Meal Macro Information Box ---
            col_foods, col_macros = st.columns([3, 2])
            with col_foods:
                st.markdown("<div style='padding-left:10px;'>", unsafe_allow_html=True)
                for food in meal.get("foods", []):
                    st.markdown(f"🔹 **{food}**")
                st.markdown("</div>", unsafe_allow_html=True)

            with col_macros:
                sm1, sm2 = st.columns(2)
                sm1.metric("Protein", f"{meal.get('protein', 0)}g")
                sm2.metric("Carbs", f"{meal.get('carbs', 0)}g")
                
                sm3, sm4 = st.columns(2)
                sm3.metric("Fats", f"{meal.get('fats', 0)}g")
                sm4.metric("Energy", f"{meal.get('calories', 0)} kcal")
            
            st.markdown("<hr style='opacity:0.1; margin:25px 0;'>", unsafe_allow_html=True)

        # --- Supplements Block ---
        if diet.get("supplements"):
            st.markdown("<br>", unsafe_allow_html=True)
            st.subheader("💊 Recommended Supplements")
            sup_cols = st.columns(len(diet["supplements"]))
            for idx, supplement in enumerate(diet["supplements"]):
                with sup_cols[idx]:
                    st.info(f"👉 **{supplement}**")

        # --- Tips Block ---
        if diet.get("tips"):
            st.markdown("<br>", unsafe_allow_html=True)
            st.subheader("💡 Behavioral Coach Recommendations")
            for tip in diet["tips"]:
                st.success(f"⚡ {tip}")
        st.divider()
        st.subheader("☁️ Save Diet To Member")

        with st.expander(
        "Save This Diet",
        expanded=True
            ):

            save_userid = st.text_input(
            "User ID",
            key="save_diet_userid"
            )

            save_password = st.text_input(
            "Password",
            type="password",
            key="save_diet_password"
            )

            if st.button(
            "💾 Save Diet",
            use_container_width=True
            ):

                if not save_userid:
                    st.error("Enter User ID")

                elif not save_password:
                    st.error("Enter Password")

                else:

                    success, message = save_diet_for_member(
                    gym_id=st.session_state["gym_id"],
                    userid=save_userid,
                    password=save_password,
                    diet_json=diet
                    )

                    if success:
                        st.success(message)

                    else:
                        st.error(message)