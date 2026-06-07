from services.firebase.firebase_service import db
from firebase_admin import firestore


def save_diet_for_member(
    gym_id,
    userid,
    password,
    diet_json
):

    gym_query = (
        db.collection("gyms")
        .where("gymid", "==", gym_id)
        .limit(1)
        .stream()
    )

    gym_docs = list(gym_query)

    if not gym_docs:
        return False, "Gym not found"

    gym_doc = gym_docs[0]

    member_query = (
        db.collection("gyms")
        .document(gym_doc.id)
        .collection("gymmembers")
        .where("userid", "==", userid)
        .limit(1)
        .stream()
    )

    member_docs = list(member_query)

    if not member_docs:
        return False, "User not found"

    member_doc = member_docs[0]

    member_data = member_doc.to_dict()

    if member_data.get("password") != password:
        return False, "Invalid password"

    member_ref = (
        db.collection("gyms")
        .document(gym_doc.id)
        .collection("gymmembers")
        .document(member_doc.id)
    )

    member_ref.collection("diets").add(
        {
            "diet": diet_json,
            "createdAt": firestore.SERVER_TIMESTAMP
        }
    )

    return True, "Diet saved successfully"