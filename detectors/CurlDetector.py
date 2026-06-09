from core.base_exercise import BaseExercise


class CurlDetector(BaseExercise):
    """
    Covers: Biceps Curl, Hammer Curl, Preacher Curl, Cable Curl, Concentration Curl.
    Camera: front-facing or slight side angle.

    Rep cycle:
        UP   → arm extended, dumbbell down  (elbow > UP_THRESHOLD)
        DOWN → arm fully curled             (elbow < DOWN_THRESHOLD) ← rep counted
    """
    UP_THRESHOLD    = 150   # arm extended
    DOWN_THRESHOLD  = 50    # fully curled
    SWING_THRESHOLD = 18    # shoulder Y-pixel movement (normalised * 1000)

    def __init__(self):
        super().__init__()
        self._prev_shoulder_y = None

    def reset(self):
        self.reps = 0
        self.stage = None
        self.reset_smooth()
        self._prev_shoulder_y = None

    def process(self, landmarks) -> dict:
        side = self.best_side(landmarks, self.LEFT_ELBOW, self.RIGHT_ELBOW)
        sh, el, wr = self.side_indices(
            side,
            (self.LEFT_SHOULDER,  self.LEFT_ELBOW,  self.LEFT_WRIST),
            (self.RIGHT_SHOULDER, self.RIGHT_ELBOW, self.RIGHT_WRIST),
        )

        visible = self.is_visible(landmarks, sh, el, wr)

        elbow_angle = self.smooth("elbow", self.calculate_angle(
            self.get_point(landmarks, sh),
            self.get_point(landmarks, el),
            self.get_point(landmarks, wr),
        ))

        # Body swing: shoulder vertical movement between frames
        sh_y = self.get_point(landmarks, sh)[1]
        swing_delta = (
            abs(sh_y - self._prev_shoulder_y) * 1000
            if self._prev_shoulder_y is not None else 0
        )
        self._prev_shoulder_y = sh_y

        if visible:
            self.count_rep_inverse(elbow_angle, self.UP_THRESHOLD, self.DOWN_THRESHOLD)

        swing_status    = "⚠️ Swinging" if swing_delta > self.SWING_THRESHOLD else "✅ Stable"
        shoulder_status = "⚠️ Moving"   if swing_delta > self.SWING_THRESHOLD else "✅ Locked"

        form_score = min(
            self.score_from_range(elbow_angle, 35, 55, 25, 65) if self.stage == "down" else 100,
            100 if swing_delta <= self.SWING_THRESHOLD else 40,
        )

        return {
            "reps":             self.reps,
            "elbow_angle":      round(elbow_angle, 1),
            "swing_status":     swing_status,
            "shoulder_status":  shoulder_status,
            "form_score":       form_score,
        }