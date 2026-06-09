from core.base_exercise import BaseExercise


class PressVerticalDetector(BaseExercise):
    """
    Covers: Shoulder Press, Arnold Press, Pike Push-up, Z-Press.
    Camera: front-facing or slight side angle.

    Rep cycle:
        DOWN → dumbbells at shoulder height  (elbow < DOWN_THRESHOLD)
        UP   → arms fully extended overhead  (elbow > UP_THRESHOLD)  ← rep counted
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
        hip_idx  = self.LEFT_HIP  if side == "left" else self.RIGHT_HIP
        knee_idx = self.LEFT_KNEE if side == "left" else self.RIGHT_KNEE

        visible = self.is_visible(landmarks, sh, el, wr)

        elbow_angle = self.smooth("elbow", self.calculate_angle(
            self.get_point(landmarks, sh),
            self.get_point(landmarks, el),
            self.get_point(landmarks, wr),
        ))

        # Back arch: shoulder-hip-knee angle
        back_angle = 170.0
        if self.is_visible(landmarks, hip_idx, knee_idx):
            back_angle = self.smooth("back", self.calculate_angle(
                self.get_point(landmarks, sh),
                self.get_point(landmarks, hip_idx),
                self.get_point(landmarks, knee_idx),
            ))

        if visible:
            self.count_rep(elbow_angle, self.DOWN_THRESHOLD, self.UP_THRESHOLD)

        extension_status = (
            "🔝 Extended"    if elbow_angle > self.UP_THRESHOLD else
            "⬆ Press up"     if self.stage == "down" else
            "⬇ Lower"
        )
        back_arch_status = (
            "✅ Neutral"        if back_angle > 160 else
            "⚠️ Slight Arch"   if back_angle > 145 else
            "❌ Excessive Arch"
        )

        form_score = min(
            self.score_from_range(elbow_angle, 155, 180, 145, 180) if self.stage == "up" else 100,
            self.score_from_range(back_angle,  160, 180, 145, 180),
        )

        return {
            "reps":             self.reps,
            "elbow_angle":      round(elbow_angle, 1),
            "extension_status": extension_status,
            "back_arch_status": back_arch_status,
            "form_score":       form_score,
        }