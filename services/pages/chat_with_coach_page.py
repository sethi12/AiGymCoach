import streamlit as st
from services.coaching.coach_chat import ask_coach


def render_chat_with_coach_page():

    st.markdown(
        """
        <style>

        .chat-header {
            text-align:center;
            padding:15px;
            margin-bottom:20px;
        }

        .chat-title {
            font-size:2rem;
            font-weight:700;
            color:#2ECC71;
        }

        .chat-subtitle {
            color:#888;
        }

        </style>
        """,
        unsafe_allow_html=True
    )

    # ----------------------------
    # Header
    # ----------------------------

    col1, col2 = st.columns([1, 6])

    with col1:
        if st.button("⬅ Back"):
            st.session_state.current_page = "ask_coach"
            st.rerun()

    with col2:
        st.markdown(
            """
            <div class="chat-header">
                <div class="chat-title">
                    🤖 AI Fitness Coach
                </div>

                
                    Workout • Nutrition • Recovery • Supplements
    
            </div>
            """,
            unsafe_allow_html=True
        )

    # ----------------------------
    # Session State
    # ----------------------------

    if "coach_messages" not in st.session_state:

        st.session_state.coach_messages = [
            {
                "role": "assistant",
                "content":
                """
Welcome! 💪

I can help you with:

• Workout Plans

• Fat Loss

• Muscle Gain

• Nutrition

• Supplements

• Exercise Form

• Recovery

Ask me anything.
"""
            }
        ]

    # ----------------------------
    # Suggested Questions
    # ----------------------------

    if len(st.session_state.coach_messages) == 1:

        st.markdown("### Quick Questions")

        q1, q2 = st.columns(2)

        with q1:

            if st.button(
                "💪 Build Muscle Faster",
                use_container_width=True
            ):
                st.session_state.coach_messages.append(
                    {
                        "role": "user",
                        "content":
                        "How can I build muscle faster?"
                    }
                )

                answer = ask_coach(
                    "How can I build muscle faster?"
                )

                st.session_state.coach_messages.append(
                    {
                        "role": "assistant",
                        "content": answer
                    }
                )

                st.rerun()

        with q2:

            if st.button(
                "🔥 Best Fat Loss Strategy",
                use_container_width=True
            ):
                st.session_state.coach_messages.append(
                    {
                        "role": "user",
                        "content":
                        "What is the best fat loss strategy?"
                    }
                )

                answer = ask_coach(
                    "What is the best fat loss strategy?"
                )

                st.session_state.coach_messages.append(
                    {
                        "role": "assistant",
                        "content": answer
                    }
                )

                st.rerun()

        q3, q4 = st.columns(2)

        with q3:

            if st.button(
                "🍗 Protein Intake",
                use_container_width=True
            ):
                st.session_state.coach_messages.append(
                    {
                        "role": "user",
                        "content":
                        "How much protein should I eat?"
                    }
                )

                answer = ask_coach(
                    "How much protein should I eat?"
                )

                st.session_state.coach_messages.append(
                    {
                        "role": "assistant",
                        "content": answer
                    }
                )

                st.rerun()

        with q4:

            if st.button(
                "🏋️ Best Chest Workout",
                use_container_width=True
            ):
                st.session_state.coach_messages.append(
                    {
                        "role": "user",
                        "content":
                        "Give me the best chest workout."
                    }
                )

                answer = ask_coach(
                    "Give me the best chest workout."
                )

                st.session_state.coach_messages.append(
                    {
                        "role": "assistant",
                        "content": answer
                    }
                )

                st.rerun()

    st.divider()

    # ----------------------------
    # Chat Messages
    # ----------------------------

    for message in st.session_state.coach_messages:

        avatar = "🤖"

        if message["role"] == "user":
            avatar = "👤"

        with st.chat_message(
            message["role"],
            avatar=avatar
        ):
            st.markdown(
                message["content"]
            )

    # ----------------------------
    # Chat Input
    # ----------------------------

    prompt = st.chat_input(
        "Ask your AI Coach..."
    )

    if prompt:

        st.session_state.coach_messages.append(
            {
                "role": "user",
                "content": prompt
            }
        )

        with st.spinner(
            "Coach is thinking..."
        ):

            try:

                answer = ask_coach(
                    prompt
                )

            except Exception as e:

                answer = (
                    f"⚠️ Error: {str(e)}"
                )

        st.session_state.coach_messages.append(
            {
                "role": "assistant",
                "content": answer
            }
        )

        st.rerun()