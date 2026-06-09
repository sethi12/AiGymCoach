import streamlit as st
from services.firebase.firebase_service import db


def render_login_wall() -> bool:
    """
    Step 2 login — Member login within the gym.
    Only shown after gym login succeeds (gym_id is in session_state).

    Queries: gyms/{gym_id}/gymmembers
    Matches: userid + password fields from the member document.

    Returns True if member is already logged in.
    """
    # Already logged in as member
    if st.session_state.get("user_id") is not None:
        return True

    # Gym must be logged in first
    gym_id = st.query_params.get("gymid")
    if not gym_id:
        st.error("No gym session found. Please login as gym first.")
        return False
    else:
        st.session_state["gym_id"]   = gym_id
        try:
            docs = list(db.collection("gyms")
                            .where("gymid", "==", gym_id)
                              .limit(1)
                              .stream()
                              )
            if not docs:
                        st.error("Gym not found.")
                        return False
            gym_data = docs[0].to_dict()
            st.session_state["gym_name"] = gym_data.get("gymname")
        except Exception as e:
                    st.error(f"Error: {e}")

    st.title("👤 Member Login")
    st.markdown(
        f"### Welcome to **{st.session_state.get('gym_name', 'your gym')}**! "
        "Please enter your member credentials."
    )

    with st.form("member_login_form", clear_on_submit=False):
        member_id = st.text_input(
            "Member ID",
            placeholder="Enter your member ID",
        )
        password = st.text_input(
            "Password",
            type="password",
            placeholder="Enter your password",
        )
        submit = st.form_submit_button(
            "Login →",
            use_container_width=True,
        )

    if submit:
        mid  = member_id.strip()
        pwd  = password.strip()

        if not mid or not pwd:
            st.error("Member ID and password are required.")
            return False

        try:
            # Query gyms/{gym_id}/gymmembers where userid == mid
            members_ref = (
                db.collection("gyms")
                  .document(gym_id)
                  .collection("gymmembers")
                  .where("userid", "==", mid)
                  .limit(1)
                  .stream()
            )
            docs = list(members_ref)

            if not docs:
                st.error("Member not found. Check your Member ID.")
                return False

            member_data = docs[0].to_dict()

            if member_data.get("password") != pwd:
                st.error("Invalid password. Please try again.")
                return False

            # ── Login success ──────────────────────────────────────────
            st.session_state["user_id"]     = member_data.get("userid")
            st.session_state["username"]    = member_data.get("name")
            st.session_state["member_id"]   = member_data.get("memberid")

            st.success(f"Welcome, {member_data.get('name')}! 💪")
            st.rerun()

        except Exception as e:
            st.error(f"Login error: {e}")

    return False