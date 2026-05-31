from services.firebase.firebase_service import db

gym_data = {
    "gymname": "kabsfitness",
    "password": "1234567890"
}

# CREATE DOCUMENT WITH AUTO GENERATED FIREBASE UID
gym_ref = db.collection("gyms").document()

# GET GENERATED UID
gym_id = gym_ref.id

# ADD UID INTO DOCUMENT
gym_data["gymid"] = gym_id

# SAVE DOCUMENT
gym_ref.set(gym_data)

print("Gym Created Successfully")
print("Gym ID:", gym_id)