from services.firebase.firebase_service import db
from firebase_admin import firestore


def save_workout_for_member(
    gym_id,
    userid,
    password,
    workout_json
):

    try:

        members_ref = (
            db.collection("gyms")
            .document(gym_id)
            .collection("gymmembers")
        )

        query = (
            members_ref
            .where("userid", "==", userid)
            .limit(1)
            .stream()
        )

        docs = list(query)

        if not docs:
            return False, "Member not found"

        member_doc = docs[0]

        member_data = member_doc.to_dict()

        if member_data.get("password") != password:
            return False, "Invalid password"

        member_doc.reference.update(
            {
                "workoutPlans": firestore.ArrayUnion(
                    [workout_json]
                )
            }
        )

        return True, "Workout plan saved successfully"

    except Exception as e:

        return False, str(e)