# import os
# import json
# import firebase_admin

# from dotenv import load_dotenv
# from firebase_admin import credentials, firestore

# load_dotenv()

# firebase_credentials = json.loads(
#     os.getenv("FIREBASE_CREDENTIALS")
# )

# if not firebase_admin._apps:

#     cred = credentials.Certificate(
#         firebase_credentials
#     )

#     firebase_admin.initialize_app(cred)

# db = firestore.client()



import streamlit as st
import firebase_admin

from firebase_admin import credentials, firestore

firebase_credentials = dict(
    st.secrets["firebase"]
)

if not firebase_admin._apps:
    cred = credentials.Certificate(
        firebase_credentials
    )
    firebase_admin.initialize_app(cred)

db = firestore.client()