from core.base_exercise import BaseExercise


class PullVerticalDetector(BaseExercise):
    """
    Covers: Lat Pulldown, Pull-up, Chin-up, Cable Straight-arm Pulldown.
    Camera: front-facing.

    Rep cycle:
        UP   → arms extended overhead        (elbow > UP_THRESHOLD)
        DOWN → elbows pulled to sides/chest   (elbow < DOWN_THRESHOLD) ← rep counted
    """
    UP_THRESHOLD   = 155   # arms extended overhead
    DOWN_THRESHOLD = 70    # fully contracted / pulled down

    def __init__(self):
        super().__init__()

    def reset(self):
        self.reps = 0
        self.stage = None
        self.reset_smooth()

    def process(self, landmarks) -> dict:
        side = self.best_side(landmarks, self.LEFT_ELBOW, self.RIGHT_ELBOW)
        sh, el, wr = self.side_indices(
            side,
            (self.LEFT_SHOULDER,  self.LEFT_ELBOW,  self.LEFT_WRIST),
            (self.RIGHT_SHOULDER, self.RIGHT_ELBOW, self.RIGHT_WRIST),
        )
        hip_idx = self.LEFT_HIP if side == "left" else self.RIGHT_HIP

        visible = self.is_visible(landmarks, sh, el, wr)

        elbow_angle = self.smooth("elbow", self.calculate_angle(
            self.get_point(landmarks, sh),
            self.get_point(landmarks, el),
            self.get_point(landmarks, wr),
        ))

        # Slight lean-back is normal; > 30° is excessive
        torso_angle = 0.0
        if self.is_visible(landmarks, hip_idx):
            torso_angle = self.smooth("torso", self.vertical_angle(
                self.get_point(landmarks, hip_idx),
                self.get_point(landmarks, sh),
            ))

        if visible:
            self.count_rep_inverse(elbow_angle, self.UP_THRESHOLD, self.DOWN_THRESHOLD)

        pull_status = (
            "✅ Contracted" if elbow_angle < self.DOWN_THRESHOLD else
            "⬇ Pull down"  if self.stage == "up" else
            "⬆ Extend"
        )
        back_status = "✅ Good lean" if torso_angle < 28 else "⚠️ Too much lean"

        form_score = min(
            self.score_from_range(elbow_angle, 55, 75, 45, 85) if self.stage == "down" else 100,
            100 if torso_angle < 28 else 70,
        )

        return {
            "reps":        self.reps,
            "elbow_angle": round(elbow_angle, 1),
            "pull_status": pull_status,
            "back_status": back_status,
            "form_score":  form_score,
        }