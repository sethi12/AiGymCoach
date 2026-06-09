from core.base_exercise import BaseExercise


class TricepDetector(BaseExercise):
    """
    Covers: Tricep Pushdown, Overhead Extension, Skullcrusher, Dips, Kickback.
    Camera: side-on preferred; front-facing also works for pushdown.

    Rep cycle:
        DOWN → elbow bent / arm loaded   (elbow < DOWN_THRESHOLD)
        UP   → arm fully extended        (elbow > UP_THRESHOLD)   ← rep counted
    """
    DOWN_THRESHOLD = 80
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

        visible = self.is_visible(landmarks, sh, el, wr)

        elbow_angle = self.smooth("elbow", self.calculate_angle(
            self.get_point(landmarks, sh),
            self.get_point(landmarks, el),
            self.get_point(landmarks, wr),
        ))

        if visible:
            self.count_rep(elbow_angle, self.DOWN_THRESHOLD, self.UP_THRESHOLD)

        tricep_status = (
            "✅ Extended"   if self.stage == "up"   else
            "⬆ Extend arm" if self.stage == "down"  else
            "⬇ Bend elbow"
        )

        form_score = (
            self.score_from_range(elbow_angle, 155, 180, 145, 180)
            if self.stage == "up" else 100
        )

        return {
            "reps":          self.reps,
            "elbow_angle":   round(elbow_angle, 1),
            "tricep_status": tricep_status,
            "form_score":    form_score,
        }