# import streamlit as st
# from services.persistance.exercise_repository import get_or_create_user


# def render_login_wall():
#     if st.session_state.get("user_id") is not None:
#         return True
    
#     st.title("🏋️‍♂️ AI Real-time GYM Trainer")
#     st.markdown("### Welcome! Please enter a username to start.")

#     with st.form("login_form", clear_on_submit=False):
#         username = st.text_input("Name (unique)", placeholder="unique name e.g. princekhunt")
#         submit_button = st.form_submit_button("Start Session", width="stretch")

#     if submit_button:
#         if not username:
#             st.error("Name cannot be empty.")
#             return False
        
#         user = get_or_create_user(username)
    
#         st.session_state["user_id"] = user["id"]
#         st.session_state["username"] = user["username"]

#         st.rerun()

#     return False


import streamlit as st
from services.persistance.exercise_repository import get_or_create_user


def render_login_wall():
    if st.session_state.get("user_id") is not None:
        return True

    st.title("🏋️‍♂️ AI Real-time GYM Trainer")
    st.markdown("### Welcome! Please enter a username to start.")

    with st.form("login_form", clear_on_submit=False):
        username = st.text_input(
            "Name (unique)",
            placeholder="unique name e.g. princekhunt"
        )

        submit_button = st.form_submit_button(
            "Start Session",
            width="stretch"
        )

    if submit_button:
        username = username.strip()

        if not username:
            st.error("Name cannot be empty.")
            return False

        user = get_or_create_user(username)

        st.session_state["user_id"] = user["id"]
        st.session_state["username"] = user["username"]

        st.rerun()

    return False

# import streamlit as st
# import requests
# from streamlit_lottie import st_lottie
# from services.firebase.firebase_service import db
# from services.persistance.exercise_repository import get_or_create_user
# # =========================================================
# # PAGE CONFIG
# # =========================================================
# st.set_page_config(
#     page_title="AI Gym Trainer",
#     page_icon="🏋️",
#     layout="wide",
#     initial_sidebar_state="collapsed"
# )

# # =========================================================
# # PREMIUM CSS (Always Runs First)
# # =========================================================
# st.markdown("""
# <style>
#     .stApp {
#         background: linear-gradient(180deg, #050505 0%, #0a0a0a 100%);
#         color: white;
#     }

#     header, footer, #MainMenu { 
#         display: none !important; 
#     }

#     .block-container {
#         padding-top: 2.5rem;
#         padding-bottom: 3rem;
#         max-width: 1450px;
#     }

#     h1, h2 {
#         font-weight: 900;
#         letter-spacing: -3px;
#         line-height: 1.05;
#     }

#     .main-heading {
#         font-size: 7rem;
#         background: linear-gradient(90deg, #ffffff, #ff8a00);
#         -webkit-background-clip: text;
#         -webkit-text-fill-color: transparent;
#     }

#     .stTextInput input {
#         background: #111827 !important;
#         color: white !important;
#         border: 1px solid #444 !important;
#         border-radius: 16px !important;
#         padding: 18px 22px !important;
#         font-size: 1.1rem;
#         transition: all 0.3s ease;
#     }

#     .stTextInput input:focus {
#         border-color: #ff5a00 !important;
#         box-shadow: 0 0 0 3px rgba(255, 90, 0, 0.15);
#     }

#     .stButton button, .stFormSubmitButton button {
#         background: linear-gradient(135deg, #ff5a00, #ff8a00) !important;
#         color: black !important;
#         border: none !important;
#         border-radius: 16px !important;
#         padding: 18px 28px !important;
#         font-size: 1.15rem;
#         font-weight: 800;
#         letter-spacing: 1.5px;
#         transition: all 0.4s ease;
#         text-transform: uppercase;
#     }

#     .stButton button:hover, .stFormSubmitButton button:hover {
#         transform: translateY(-4px);
#         box-shadow: 0 10px 25px rgba(255, 90, 0, 0.3);
#         color: white !important;
#     }

#     [data-testid="metric-container"] {
#         background: rgba(255, 90, 0, 0.1) !important;
#         border: 1px solid rgba(255, 90, 0, 0.3) !important;
#         border-radius: 16px;
#         padding: 14px 18px;
#     }

#     .form-container {
#         background: #0c0c0c;
#         border: 1px solid #222;
#         border-radius: 32px;
#         padding: 3.2rem 2.8rem;
#         box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
#     }

#     .gym-badge {
#         display: inline-block;
#         border: 1px solid #ff5a00;
#         color: #ff5a00;
#         padding: 10px 22px;
#         border-radius: 50px;
#         font-weight: 700;
#         letter-spacing: 3px;
#         font-size: 0.85rem;
#         background: rgba(255, 90, 0, 0.05);
#     }

#     @media (max-width: 768px) {
#         .block-container {
#             padding-top: 1.2rem;
#             padding-left: 1rem;
#             padding-right: 1rem;
#         }
#         .main-heading { font-size: 4.2rem !important; }
#         .form-container { padding: 2.2rem 1.6rem; border-radius: 24px; }
#     }

#     @media (max-width: 480px) {
#         .main-heading { font-size: 3.6rem !important; }
#     }
# </style>
# """, unsafe_allow_html=True)

# # =========================================================
# # LOTTIE LOADER
# # =========================================================
# def load_lottie(url):
#     try:
#         r = requests.get(url)
#         if r.status_code == 200:
#             return r.json()
#     except:
#         return None
#     return None

# lottie_gym = load_lottie("https://assets5.lottiefiles.com/packages/lf20_5n8y9scb.json")

# # =========================================================
# # LOGIN FUNCTION
# # =========================================================
# def render_login_wall():
#     if st.session_state.get("user_id"):
#         return True

#     col1, col2 = st.columns([1.05, 0.95], gap="large")

#     with col1:
#         st.markdown("<br>", unsafe_allow_html=True)
        
#         st.markdown("""
#         <div style="width:75px; height:7px; background:linear-gradient(90deg, #ff5a00, #ffaa00); 
#                     border-radius:10px; margin-bottom:20px;"></div>
#         """, unsafe_allow_html=True)

#         st.markdown('<h1 class="main-heading">AI<br>GYM<br>TRAINER</h1>', unsafe_allow_html=True)

#         st.markdown("""
#         <p style="color:#bbbbbb; font-size:1.3rem; max-width:520px; margin-top:20px; line-height:1.6;">
#             Elite AI coaching for those who train like their life depends on it.
#         </p>
#         """, unsafe_allow_html=True)

#         c1, c2, c3 = st.columns(3, gap="medium")
#         with c1: st.metric("LIVE COACHING", "24/7")
#         with c2: st.metric("EXERCISES", "120+")
#         with c3: st.metric("PRO ATHLETES", "850+")

#         if lottie_gym:
#             st_lottie(lottie_gym, height=380, key="gym_lottie")

#     with col2:
#         st.markdown("<br><br><br><br>", unsafe_allow_html=True)
        
#         st.markdown('<div class="form-container">', unsafe_allow_html=True)

#         st.markdown('<div class="gym-badge">PREMIUM ACCESS</div>', unsafe_allow_html=True)

#         st.markdown("<h2 style='margin:28px 0 12px 0; font-size:2.8rem;'>Start Training</h2>", unsafe_allow_html=True)

#         st.markdown("""
#         <p style="color:#888; font-size:1.15rem; margin-bottom:40px;">
#             Enter your gym credentials to unlock AI coaching
#         </p>
#         """, unsafe_allow_html=True)

#         with st.form("login_form"):
#             gym_name = st.text_input("GYM NAME", placeholder="e.g. ironforgefitness")
#             password = st.text_input("PASSWORD", type="password", placeholder="Enter your password")

#             st.markdown("<br>", unsafe_allow_html=True)

#             submit = st.form_submit_button("BEGIN SESSION →", use_container_width=True)

#             if submit:
#                 if not gym_name or not password:
#                     st.error("All fields are required.")
#                     return False

#                 try:
#                     with st.spinner("Verifying gym access..."):
#                         gym_query = db.collection("gyms").where("gymname", "==", gym_name).limit(1).stream()
#                         gym_docs = list(gym_query)

#                     if not gym_docs:
#                         st.error("Gym not found.")
#                         return False

#                     gym_data = gym_docs[0].to_dict()

#                     if gym_data.get("password") != password:
#                         st.error("Invalid password.")
#                         return False

#                     st.session_state["username"] = gym_data.get("gymname")
#                     st.session_state["user_id"] = gym_data.get("gymid")
#                     st.session_state["gym_id"] = gym_data.get("gymid")

#                     st.success("Welcome back, Warrior! 🔥")
#                     st.rerun()

#                 except Exception as e:
#                     st.error(f"Error: {e}")

#         st.markdown("""
#         <p style="text-align:center; color:#555; margin-top:35px; font-size:0.95rem;">
#             Secured by Firebase • Contact your gym admin
#         </p>
#         """, unsafe_allow_html=True)

#         st.markdown('</div>', unsafe_allow_html=True)

#     return False