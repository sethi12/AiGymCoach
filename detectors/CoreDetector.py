from core.base_exercise import BaseExercise


class CoreDetector(BaseExercise):
    """
    Covers: Crunch, Sit-up, Leg Raise, Hollow Hold, V-up, Cable Crunch.
    Camera: side-on for best accuracy.

    Rep cycle (crunch/sit-up):
        DOWN → torso contracted / crunched   (body angle < DOWN_THRESHOLD)
        UP   → torso extended / lying flat   (body angle > UP_THRESHOLD)  ← rep counted
    """
    DOWN_THRESHOLD = 130   # crunched / contracted
    UP_THRESHOLD   = 160   # extended / lying flat

    def __init__(self):
        super().__init__()

    def reset(self):
        self.reps = 0
        self.stage = None
        self.reset_smooth()

    def process(self, landmarks) -> dict:
        side = self.best_side(landmarks, self.LEFT_HIP, self.RIGHT_HIP)
        sh, hi, kn = self.side_indices(
            side,
            (self.LEFT_SHOULDER,  self.LEFT_HIP,  self.LEFT_KNEE),
            (self.RIGHT_SHOULDER, self.RIGHT_HIP, self.RIGHT_KNEE),
        )

        visible = self.is_visible(landmarks, sh, hi, kn)

        # Shoulder-hip-knee angle: decreases as torso crunches
        body_angle = self.smooth("body", self.calculate_angle(
            self.get_point(landmarks, sh),
            self.get_point(landmarks, hi),
            self.get_point(landmarks, kn),
        ))

        if visible:
            self.count_rep(body_angle, self.DOWN_THRESHOLD, self.UP_THRESHOLD)

        core_status = (
            "✅ Contracted"      if self.stage == "down" else
            "⬇ Contract core"   if self.stage == "up"   else
            "⬇ Begin contraction"
        )

        form_score = (
            self.score_from_range(body_angle, 115, 132, 105, 142)
            if self.stage == "down" else 100
        )

        return {
            "reps":        self.reps,
            "body_angle":  round(body_angle, 1),
            "core_status": core_status,
            "form_score":  form_score,
        }