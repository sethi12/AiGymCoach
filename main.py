import streamlit as st
import os
import time
import pandas as pd
from services.auth.gym_login import render_login_gym_wall
from services.auth.login_wall import render_login_wall
from services.state.session_defaults import initial_session_defaults
from services.config.workout_config import EXERCISE_OPTIONS
from services.ui.style_loader import load_css, inject_local_font, inject_webrtc_styles
from services.persistance.exercise_repository import init_db
from streamlit_webrtc import webrtc_streamer, WebRtcMode
from services.vision.exercise_video_processor import VideoProcessorClass
from services.tracking.metrics import sync_metrics_update
from services.persistance.exercise_repository import get_users_exercises
from groq import Groq
from services.coaching.llm import LLMCoach
from services.coaching.tts import TextToSpeech
import streamlit.components.v1 as components
from services.coaching.voice_pipeline import VoicePipeline, autoplay_audio
from services.pages.ask_coach_page import render_ask_coach_page
from services.pages.diet_page import render_diet_page
from services.pages.workout_plan_page import (
    render_workout_plan_page
)
from services.pages.chat_with_coach_page import (
    render_chat_with_coach_page
)
def main():
    st.set_page_config(
        page_icon="🏋️‍♀️",
        page_title="AI Real-time GYM Coach",
        initial_sidebar_state="expanded",
        layout="centered",
        menu_items=None
    )
    st.markdown("""
<style>
/* Hide collapse button */
[data-testid="collapsedControl"] {
    display: none !important;
}

/* Keep sidebar visible */
section[data-testid="stSidebar"] {
    min-width: 21rem !important;
    max-width: 21rem !important;
}
</style>
""", unsafe_allow_html=True)
    st.html("""
<style>


[data-testid="stToolbar"] {
    display: none !important;
}

[data-testid="stHeader"] {
    display: none !important;
}
</style>
""")
    st.html("""
<style>


[data-testid="stToolbar"] {
    display: none !important;
}

[data-testid="stHeader"] {
    display: none !important;
}
</style>
""")

    load_css(os.path.join(os.getcwd(), "static", "style.css"))
    inject_local_font(os.path.join(os.getcwd(), "static", "AdobeClean.otf"), "AdobeClean")

    init_db()

    

    if not render_login_wall():
        return
    
    initial_session_defaults()
    current_page = st.session_state.get(
    "current_page",
    "workout"
         )

    if current_page == "ask_coach":
        render_ask_coach_page()
        return      
    
    elif current_page == "diet":
        render_diet_page()
        return
    
    elif current_page == "workout_plan":
        render_workout_plan_page()
        return
    
    elif current_page == "chat_with_coach":
        render_chat_with_coach_page()
        return
    
    if "voice_pipeline" not in st.session_state:
        try:
            api_key = os.environ.get("GROQ_API_KEY", "")

            if not api_key and hasattr(st, "secrets") and "GROQ_API_KEY" in st.secrets:
                api_key = st.secrets["GROQ_API_KEY"]
            
            groq_client = Groq(api_key=api_key)
            llm_coach = LLMCoach(groq_client)
            tts = TextToSpeech()
            st.session_state.voice_pipeline = VoicePipeline(llm_coach, tts)
        except Exception as e:
            st.session_state.voice_pipeline = None

    workout_started = st.session_state.get("workout_started", False)
    
    with st.sidebar:
        st.title("🏋️‍♂️ Apna AI Coach")
        st.link_button(
        "⬅ Back to Dashboard",
        "https://aigym-web-landing-gym.vercel.app/dashboard",
        use_container_width=True,
            )
        if st.session_state.username:
            st.caption(f"👤 Login as {st.session_state.username}")
            
        if st.button("🤖 Ask Coach", use_container_width=True):
             st.session_state.current_page = "ask_coach"
             st.rerun()

        st.divider()

        st.subheader("Workout Plan")

        if not workout_started:
            # plan_exercise = st.selectbox("Exercise", options=EXERCISE_OPTIONS, key="plan_exercise")
            plan_exercise = st.query_params.get("exercise")
            movement_pattern = st.query_params.get("pattern")
            st.write(plan_exercise)
            st.write(movement_pattern)
            plan_sets = st.number_input("Sets", min_value=0, max_value=50, key="plan_sets", step=1)

            plan_reps = st.number_input("Reps per Set", min_value=0, max_value=50, key="plan_reps", step=1)

            st.markdown("")

            start_session_button = st.button("Start Workout", width="stretch", key="start_session_button")

            if start_session_button:
                st.session_state.exercise_type = plan_exercise
                st.session_state.movement_pattern = movement_pattern
                st.session_state.target_sets = int(plan_sets)
                st.session_state.reps_per_set = int(plan_reps)
                st.session_state.reps = 0
                st.session_state.workout_started = True
                st.session_state.set_cycle_started_at = time.time()
                st.session_state.last_saved_sets_completed = 0

                if st.session_state.voice_pipeline:
                    result = st.session_state.voice_pipeline.process_event(
                        event="workout_started",
                        exercise=plan_exercise,
                        metrics={}
                    )
                    
                    if result:
                        st.session_state.audio_to_play, st.session_state.coach_feedback = result

                st.session_state.last_notified_sets_completed = 0
                st.session_state.last_notified_workout_complete = False
                st.rerun()
        else:
            exercise = st.session_state.get("exercise_type")
            sets = st.session_state.get("target_sets")
            reps = st.session_state.get("reps_per_set")

            st.info(f"**{exercise}** -- {sets} Sets / {reps} Reps")

            end_session_button = st.button("End Workout", key="end_session_button", width="stretch")

            if end_session_button:
                st.session_state.workout_started = False
                
                if st.session_state.voice_pipeline:
                    result = st.session_state.voice_pipeline.process_event(
                        event="workout_completed",
                        exercise=exercise,
                        metrics={}
                    )
                    if result:
                        st.session_state.audio_to_play, st.session_state.coach_feedback = result

                st.rerun()

        if workout_started:
            st.divider()

            exercise = st.session_state.get("exercise_type")
            total_reps = st.session_state.get("reps")
            current_set_reps = st.session_state.get("current_set_reps")
            reps_per_set = st.session_state.get("reps_per_set")
            sets_completed = st.session_state.get("sets_completed")
            target_sets = st.session_state.get("target_sets")

            st.subheader("Progress")

            st.metric("Total Reps", f"{total_reps}")
            st.metric("Current Set Reps", f"{current_set_reps} / {reps_per_set}")
            st.metric("Sets Completed", f"{sets_completed} / {target_sets}")

            st.divider()
            pattern = st.session_state.get("movement_pattern", "")
            exercise = st.session_state.get("exercise_type", "Exercise")

            st.subheader(f"{exercise} Metrics")

            if pattern == "Squat":
                st.metric("Knee Angle", f"{st.session_state.get('knee_angle', 0)}°")
                st.metric("Back Angle", f"{st.session_state.get('back_angle', 0)}°")
                st.metric("Depth Status", st.session_state.get("depth_status", "N/A"))

            elif pattern == "Press Horizontal":
                st.metric("Elbow Angle", f"{st.session_state.get('elbow_angle', 0)}°")
                st.metric("Body Alignment", st.session_state.get("body_alignment", "N/A"))
                st.metric("Press Status", st.session_state.get("press_status", "N/A"))

            elif pattern == "Press Vertical":
                st.metric("Elbow Angle", f"{st.session_state.get('elbow_angle', 0)}°")
                st.metric("Arm Extension", st.session_state.get("extension_status", "N/A"))
                st.metric("Back Arch", st.session_state.get("back_arch_status", "N/A"))

            elif pattern == "Pull Horizontal":
                st.metric("Elbow Angle", f"{st.session_state.get('elbow_angle', 0)}°")
                st.metric("Pull Status", st.session_state.get("pull_status", "N/A"))
                st.metric("Back Status", st.session_state.get("back_status", "N/A"))

            elif pattern == "Pull Vertical":
                st.metric("Elbow Angle", f"{st.session_state.get('elbow_angle', 0)}°")
                st.metric("Pull Status", st.session_state.get("pull_status", "N/A"))
                st.metric("Back Status", st.session_state.get("back_status", "N/A"))

            elif pattern == "Curl":
                st.metric("Elbow Angle", f"{st.session_state.get('elbow_angle', 0)}°")
                st.metric("Shoulder Stability", st.session_state.get("shoulder_status", "N/A"))
                st.metric("Swing Detection", st.session_state.get("swing_status", "N/A"))

            elif pattern == "Tricep":
                st.metric("Elbow Angle", f"{st.session_state.get('elbow_angle', 0)}°")
                st.metric("Tricep Status", st.session_state.get("tricep_status", "N/A"))

            elif pattern == "Hinge":
                st.metric("Hip Angle", f"{st.session_state.get('hip_angle', 0)}°")
                st.metric("Back Angle", f"{st.session_state.get('back_angle', 0)}°")
                st.metric("Hinge Status", st.session_state.get("hinge_status", "N/A"))

            elif pattern == "Core":
                st.metric("Body Angle", f"{st.session_state.get('body_angle', 0)}°")
                st.metric("Core Status", st.session_state.get("core_status", "N/A"))

            elif pattern == "Lunge":
                st.metric("Front Knee Angle", f"{st.session_state.get('front_knee_angle', 0)}°")
                st.metric("Torso Angle", f"{st.session_state.get('torso_angle', 0)}°")
                st.metric("Balance Status", st.session_state.get("balance_status", "N/A"))

    st.title("AI Real-time GYM Coach")
    st.markdown("#### Real-time pose detection with proactive AI voice coaching")
 
    if st.session_state.get("audio_to_play"):
        autoplay_audio(st.session_state.audio_to_play)

    if st.session_state.get("coach_feedback"):
        st.markdown("")
        st.success(f"🤖 **Coach:** {st.session_state.coach_feedback}")

    if not workout_started:
        st.markdown(
            """
            <div style="
                border: 10px dashed #444;
                border-radius: 0px;
                padding: 48px 32px;
                text-align: center;
                color: #888;
                margin-top: 32px;
                margin-bottom: 32px;
            ">
                <h2 style="color:#ccc; margin-bottom:8px;">👈 Set your workout plan</h2>
                <p style="font-size:1.05rem;">
                    Choose your exercise, sets and reps in the sidebar,<br>
                    then click <strong>Start Workout</strong> to activate the camera and AI coach.
                </p>
            </div>
            """,
            unsafe_allow_html=True,
        )
    else:
        context = webrtc_streamer(
            key="exercise-analysis",
            mode=WebRtcMode.SENDRECV,
            video_processor_factory=VideoProcessorClass,
            rtc_configuration={"iceServers": [{"urls": ["stun:stun.l.google.com:19302"]}]},
            media_stream_constraints={
                "video": True,
                "audio": False
            },
            async_processing=True
        )

        sync_metrics_update(context)

        if context.state.playing:
            time.sleep(0.25)
            st.rerun()

        inject_webrtc_styles()

    st.divider()

    st.markdown("#### Workout History")

    user_id = st.session_state.get("user_id", 0)

    if isinstance(user_id, str):
        gym_id = st.session_state.get("gym_id")
        history_rows = get_users_exercises(gym_id, user_id)
        # history_rows = get_users_exercises(user_id)

        arr = [
            {
                "Exercise": row['exercise_name'],
                "Reps": row['reps'],
                "Sets": row['sets'],
                "Time (sec)": row['time'],
                "Date": row['created_at']
            }
            for row in history_rows
        ]

        df = pd.DataFrame(arr)

        if not df.empty:
            df["Date"] = pd.to_datetime(df["Date"]).dt.date
            agg_df = df.groupby(["Exercise", "Date"]).agg({
                "Reps": 'sum',
                "Sets": "sum",
                "Time (sec)": "sum"
            }).reset_index()
            agg_df.index += 1
            st.table(agg_df, border="horizontal")
        else:
            st.info("No workout history found.")


if __name__ == "__main__":
    main()
    