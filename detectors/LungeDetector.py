from core.base_exercise import BaseExercise


class LungeDetector(BaseExercise):
    """
    Covers: Forward Lunge, Reverse Lunge, Walking Lunge, Split Squat, Bulgarian Split Squat.
    Camera: front-facing or slight side angle.

    Rep cycle:
        DOWN → front knee bends deeply  (knee < DOWN_THRESHOLD)
        UP   → returns to standing      (knee > UP_THRESHOLD)   ← rep counted
    """
    DOWN_THRESHOLD = 100
    UP_THRESHOLD   = 160

    def __init__(self):
        super().__init__()

    def reset(self):
        self.reps = 0
        self.stage = None
        self.reset_smooth()

    def process(self, landmarks) -> dict:
        side = self.best_side(landmarks, self.LEFT_KNEE, self.RIGHT_KNEE)
        hi, kn, an = self.side_indices(
            side,
            (self.LEFT_HIP,  self.LEFT_KNEE,  self.LEFT_ANKLE),
            (self.RIGHT_HIP, self.RIGHT_KNEE, self.RIGHT_ANKLE),
        )
        sh = self.LEFT_SHOULDER if side == "left" else self.RIGHT_SHOULDER

        visible = self.is_visible(landmarks, hi, kn, an)

        front_knee_angle = self.smooth("front_knee", self.calculate_angle(
            self.get_point(landmarks, hi),
            self.get_point(landmarks, kn),
            self.get_point(landmarks, an),
        ))

        # Torso upright: vertical angle of hip→shoulder segment
        torso_angle = 5.0
        if self.is_visible(landmarks, sh):
            hip_mid = self.midpoint(
                self.get_point(landmarks, self.LEFT_HIP),
                self.get_point(landmarks, self.RIGHT_HIP),
            )
            torso_angle = self.smooth("torso", self.vertical_angle(
                hip_mid,
                self.get_point(landmarks, sh),
            ))

        if visible:
            self.count_rep(front_knee_angle, self.DOWN_THRESHOLD, self.UP_THRESHOLD)

        balance_status = "✅ Balanced" if torso_angle < 15 else "⚠️ Leaning"

        form_score = min(
            self.score_from_range(front_knee_angle, 80, 100, 70, 110) if self.stage == "down" else 100,
            100 if torso_angle < 15 else 70,
        )

        return {
            "reps":             self.reps,
            "front_knee_angle": round(front_knee_angle, 1),
            "torso_angle":      round(torso_angle, 1),
            "balance_status":   balance_status,
            "form_score":       form_score,
        }