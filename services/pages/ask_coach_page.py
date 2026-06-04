import streamlit as st


def render_ask_coach_page():
    # ---------------------------------------------------------
    # Premium Style Injector for Hub Dashboard
    # ---------------------------------------------------------
    st.markdown(
        """
        <style>
        /* Main Heading Styling */
        .coach-title {
            text-align: center;
            font-size: 2.5rem;
            font-weight: 800;
            background: linear-gradient(135deg, #2ECC71 0%, #1ABC9C 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 5px;
        }
        .coach-subtitle {
            text-align: center;
            color: #888;
            font-size: 1.1rem;
            margin-bottom: 2rem;
        }
        
        /* Interactive Card Styling Hook */
        .hub-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            padding: 20px;
            text-align: center;
            transition: transform 0.3s ease, border-color 0.3s ease;
        }
        
        /* Feature Label Accents */
        .feature-title {
            font-size: 1.2rem;
            font-weight: 600;
            color: #FFF;
            margin-bottom: 8px;
            margin-top: 10px;
        }
        .feature-desc {
            font-size: 0.85rem;
            color: #888;
            margin-bottom: 15px;
            min-height: 40px;
        }
        </style>
    """,
        unsafe_allow_html=True,
    )

    # ---------------------------------------------------------
    # Navigation Action Bar
    # ---------------------------------------------------------
    col_back, _ = st.columns([1.2, 5])
    with col_back:
        if st.button("⬅ Back To Workout", use_container_width=True):
            st.session_state.current_page = "workout"
            st.rerun()

    # ---------------------------------------------------------
    # Main Header
    # ---------------------------------------------------------
    st.markdown("<h1 class='coach-title'>🤖 AI Fitness Coach</h1>", unsafe_allow_html=True)
    st.markdown("<p class='coach-subtitle'>Select a specialized core module to fast-track your training optimization</p>", unsafe_allow_html=True)
    st.divider()

    # ---------------------------------------------------------
    # Core Feature Grid Layout
    # ---------------------------------------------------------
    
    # --- Row 1: Primary Planning Engines ---
    st.markdown("### 🛠️ Personal Programming Tools")
    col1, col2 = st.columns(2)

    with col1:
        st.markdown(
            """
            <div class='hub-card'>
                <div style='font-size: 2.5rem;'>🥗</div>
                <div class='feature-title'>Custom Nutrition Engine</div>
                <div class='feature-desc'>Build custom macronutrient targets, complete meal schedules, and step-by-step recipes built entirely around your dietary needs.</div>
            </div>
            """, 
            unsafe_allow_html=True
        )
        if st.button("Open Diet Planner →", key="btn_diet", use_container_width=True, type="primary"):
            st.session_state.current_page = "diet"
            st.rerun()

    with col2:
        st.markdown(
            """
            <div class='hub-card'>
                <div style='font-size: 2.5rem;'>🏋️‍♂️</div>
                <div class='feature-title'>Dynamic Workout Protocols</div>
                <div class='feature-desc'>Generate tailored resistance structures, progressive overload schemes, and splitting splits optimized for your lifestyle schedule.</div>
            </div>
            """, 
            unsafe_allow_html=True
        )
        if st.button("Open Routine Planner →", key="btn_workout", use_container_width=True, type="primary"):
            st.session_state.current_page = "workout_plan"
            st.rerun()

    st.markdown("<br>", unsafe_allow_html=True)

    # --- Row 2: Analytics & Consultation ---
    st.markdown("### 📊 Performance Analytics & Consultation")
    col3, col4 = st.columns(2)

    with col3:
        st.markdown(
            """
            <div class='hub-card'>
                <div style='font-size: 2.5rem;'>📈</div>
                <div class='feature-title'>Workout Diagnostics Lab</div>
                <div class='feature-desc'>Upload or input technical training metrics, velocity parameters, and logs to identify bottlenecks or mechanical gaps.</div>
            </div>
            """, 
            unsafe_allow_html=True
        )
        if st.button("Analyze Metrics →", key="btn_analyze", use_container_width=True):
            st.session_state.current_page = "analyze_workout"
            st.rerun()

    with col4:
        st.markdown(
            """
            <div class='hub-card'>
                <div style='font-size: 2.5rem;'>💬</div>
                <div class='feature-title'>Real-Time Coach Chat</div>
                <div class='feature-desc'>Have questions regarding supplements, form adjustments, or tactical advice? Tap into chat logic right away.</div>
            </div>
            """, 
            unsafe_allow_html=True
        )
        if st.button("Launch Chat Room →", key="btn_chat", use_container_width=True):
            st.session_state.current_page = "chat_coach"
            st.rerun()