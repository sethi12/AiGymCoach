# import _sqlite3
# import streamlit as st
# from pathlib import Path


# _DB_PATH = str(Path(__file__).parent.parent.parent / "data.db")

# @st.cache_resource
# def _get_connection():
#     conn = _sqlite3.connect(_DB_PATH,check_same_thread=False)
#     conn.row_factory = _sqlite3.Row
#     return conn

# def init_db():
#     conn = _get_connection()
#     with conn:
#         conn.execute("""
#                 CREATE TABLE IF NOT EXISTS users(
#                   id INTEGER PRIMARY KEY AUTOINCREMENT,
#                   username TEXT UNIQUE NOT NULL,
#                   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP     
#             )
#         """)

#         conn.execute("""
#                 CREATE TABLE IF NOT EXISTS exercises(
#                      id INTEGER PRIMARY KEY AUTOINCREMENT,
#                      user_id INTEGER NOT NULL REFERENCES users(id),
#                      exercise_name TEXT NOT NULL,
#                      reps INTEGER NOT NULL DEFAULT 0,
#                      sets INTEGER NOT NULL DEFAULT 0,
#                      time INTEGER NOT NULL DEFAULT 0,
#                      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
#                      )
#             """)
        
# def get_user(username):
#     conn = _get_connection()

#     return conn.execute("""
#         SELECT * FROM users  WHERE username = ?
#         """,(username)).fetchone()

# def create_user(username):
#     conn = _get_connection()
#     with conn:
#         conn.execute("""
#              INSERT INTO users (username) VALUES (?)
#             """,(username))
#     return get_user(username)

# def get_or_create_user(username):
#     user = get_user(username)

#     if user is None:
#         user = create_user(username)
    
#     return user

# def add_exercise(user_id,exercise_name,reps,sets,time):
#     conn = _get_connection()

#     with conn:
#         existing = conn.execute("""
#             SELECT * FROM exercises
#             WHERE user_id = ? AND exercise_name = ? AND Date('created_at') = Date('now')
#         """,(user_id,exercise_name)).fetchone()
#         if existing:
#             conn.execute("""
#                 UPDATE exercises
#                 SET reps = reps + ?, sets = sets + ? , time = time + ? WHERE id = ?
#                 WHERE id = ?
#                 """,(reps,sets,time,existing['id']))
#         else:
#             conn.execute("""
#                 INSERT INTO exercises (user_id,exercise_name,sets,reps,time)
#                 VALUES (?,?,?,?,?)
#             """,(user_id,exercise_name,sets,reps,time))

# def get_users_exercises(user_id):
#     conn = _get_connection()

#     return conn.execute("""
#         SELECT * FROM exercises 
#         WHERE user_id = ?
#     """,(user_id)).fetchall()

from datetime import datetime
from firebase_admin import firestore
from services.firebase.firebase_service import db


def _member_ref(gym_id: str, user_id: str):
    """
    Returns the Firestore reference to the logged-in member's document.

    Path: gyms/{gym_id}/gymmembers/{memberDoc}
    We query by userid field to find the right document.
    """
    docs = list(
        db.collection("gyms")
          .document(gym_id)
          .collection("gymmembers")
          .where("userid", "==", user_id)
          .limit(1)
          .stream()
    )
    if not docs:
        raise ValueError(f"Member {user_id} not found in gym {gym_id}")
    return docs[0].reference


def add_exercise(gym_id: str, user_id: str, exercise_name: str,
                 reps: int, sets: int, time: float):
    """
    Upserts today's exercise record under the member's document.

    Path: gyms/{gym_id}/gymmembers/{memberDoc}/exercises/{exercise_name}_{date}

    Args:
        gym_id:        From st.session_state["gym_id"]
        user_id:       From st.session_state["user_id"]  (userid field)
        exercise_name: e.g. "Squats"
        reps:          Total reps completed in this save
        sets:          Total sets completed in this save
        time:          Time taken in seconds
    """
    today    = datetime.now().strftime("%Y-%m-%d")
    doc_id   = f"{exercise_name}_{today}"

    member_ref   = _member_ref(gym_id, user_id)
    exercise_ref = member_ref.collection("exercises").document(doc_id)
    existing     = exercise_ref.get()

    if existing.exists:
        data = existing.to_dict()
        exercise_ref.update({
            "reps": data.get("reps", 0) + reps,
            "sets": data.get("sets", 0) + sets,
            "time": data.get("time", 0) + time,
        })
    else:
        exercise_ref.set({
            "exercise_name": exercise_name,
            "reps":          reps,
            "sets":          sets,
            "time":          time,
            "created_at":    firestore.SERVER_TIMESTAMP,
        })


def get_users_exercises(gym_id: str, user_id: str) -> list[dict]:
    """
    Returns all exercise records for this member, ordered by date descending.

    Path: gyms/{gym_id}/gymmembers/{memberDoc}/exercises

    Returns list of dicts — each has:
        exercise_name, reps, sets, time, created_at
    """
    member_ref = _member_ref(gym_id, user_id)
    docs       = member_ref.collection("exercises").stream()
    return [doc.to_dict() for doc in docs]


def init_db():
    """Firestore creates collections automatically — nothing to initialise."""
    pass