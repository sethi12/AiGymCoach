from core.base_exercise import BaseExercise


class PullHorizontalDetector(BaseExercise):
    """
    Covers: Bent-over Row, Cable Row, T-bar Row, Face Pull, Seal Row.
    Camera: side-on preferred; front-facing also works.

    Rep cycle:
        UP   → arms extended toward floor/cable  (elbow > UP_THRESHOLD)
        DOWN → elbows pulled back, contracted     (elbow < DOWN_THRESHOLD) ← rep counted
    """
    UP_THRESHOLD   = 150   # arms extended
    DOWN_THRESHOLD = 70    # fully rowed

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
        hip_idx  = self.LEFT_HIP  if side == "left" else self.RIGHT_HIP
        knee_idx = self.LEFT_KNEE if side == "left" else self.RIGHT_KNEE

        visible = self.is_visible(landmarks, sh, el, wr)

        elbow_angle = self.smooth("elbow", self.calculate_angle(
            self.get_point(landmarks, sh),
            self.get_point(landmarks, el),
            self.get_point(landmarks, wr),
        ))

        # Torso hinge angle: expected 30–75° from vertical for a row
        back_angle = 45.0
        if self.is_visible(landmarks, hip_idx, knee_idx):
            back_angle = self.smooth("back", self.calculate_angle(
                self.get_point(landmarks, sh),
                self.get_point(landmarks, hip_idx),
                self.get_point(landmarks, knee_idx),
            ))

        if visible:
            self.count_rep_inverse(elbow_angle, self.UP_THRESHOLD, self.DOWN_THRESHOLD)

        pull_status = (
            "✅ Contracted" if elbow_angle < self.DOWN_THRESHOLD else
            "⬅ Pull back"  if self.stage == "up" else
            "➡ Extend"
        )
        back_status = "✅ Good hinge" if 25 < back_angle < 85 else "⚠️ Check torso angle"

        form_score = min(
            self.score_from_range(elbow_angle, 55, 75, 45, 85) if self.stage == "down" else 100,
            self.score_from_range(back_angle,  30, 75, 20, 85),
        )

        return {
            "reps":        self.reps,
            "elbow_angle": round(elbow_angle, 1),
            "pull_status": pull_status,
            "back_status": back_status,
            "form_score":  form_score,
        }