from core.base_exercise import BaseExercise


class PressHorizontalDetector(BaseExercise):
    """
    Covers: Bench Press, Push-up, Dumbbell Fly, Cable Chest Press.
    Camera: front-facing or slight side angle.

    Rep cycle:
        DOWN → elbows bent, weight at chest  (elbow < DOWN_THRESHOLD)
        UP   → arms extended                 (elbow > UP_THRESHOLD)  ← rep counted
    """
    DOWN_THRESHOLD = 90
    UP_THRESHOLD   = 155

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
        hip_idx = self.LEFT_HIP   if side == "left" else self.RIGHT_HIP
        ank_idx = self.LEFT_ANKLE if side == "left" else self.RIGHT_ANKLE

        visible = self.is_visible(landmarks, sh, el, wr)

        elbow_angle = self.smooth("elbow", self.calculate_angle(
            self.get_point(landmarks, sh),
            self.get_point(landmarks, el),
            self.get_point(landmarks, wr),
        ))

        # Body alignment (push-up: shoulder-hip-ankle should be ~180°)
        body_angle = 180.0
        if self.is_visible(landmarks, hip_idx, ank_idx):
            body_angle = self.smooth("body", self.calculate_angle(
                self.get_point(landmarks, sh),
                self.get_point(landmarks, hip_idx),
                self.get_point(landmarks, ank_idx),
            ))

        if visible:
            self.count_rep(elbow_angle, self.DOWN_THRESHOLD, self.UP_THRESHOLD)

        if self.stage == "down":
            press_status = "✅ Bottom" if elbow_angle <= self.DOWN_THRESHOLD else "⬇ Lower"
        elif self.stage == "up":
            press_status = "🔝 Extended"
        else:
            press_status = "⬇ Lower the weight"

        body_alignment = "✅ Good" if body_angle > 160 else "⚠️ Sagging"

        form_score = min(
            self.score_from_range(elbow_angle, 70, 95, 60, 105) if self.stage == "down" else 100,
            100 if body_angle > 160 else 40,
        )

        return {
            "reps":           self.reps,
            "elbow_angle":    round(elbow_angle, 1),
            "body_alignment": body_alignment,
            "press_status":   press_status,
            "form_score":     form_score,
        }