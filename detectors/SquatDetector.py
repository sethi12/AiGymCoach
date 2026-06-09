from core.base_exercise import BaseExercise


class SquatDetector(BaseExercise):
    """
    Covers: Back Squat, Front Squat, Goblet Squat, Box Squat, Leg Press.
    Camera: side-on for best accuracy; front-facing also works.

    Rep cycle:
        DOWN → knee angle decreases into squat  (knee < DOWN_THRESHOLD)
        UP   → returns to standing              (knee > UP_THRESHOLD)  ← rep counted
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
        hi, kn, an, sh = self.side_indices(
            side,
            (self.LEFT_HIP,  self.LEFT_KNEE,  self.LEFT_ANKLE,  self.LEFT_SHOULDER),
            (self.RIGHT_HIP, self.RIGHT_KNEE, self.RIGHT_ANKLE, self.RIGHT_SHOULDER),
        )

        visible = self.is_visible(landmarks, hi, kn, an)

        knee_angle = self.smooth("knee", self.calculate_angle(
            self.get_point(landmarks, hi),
            self.get_point(landmarks, kn),
            self.get_point(landmarks, an),
        ))

        back_angle = 170.0
        if self.is_visible(landmarks, sh):
            back_angle = self.smooth("back", self.calculate_angle(
                self.get_point(landmarks, sh),
                self.get_point(landmarks, hi),
                self.get_point(landmarks, kn),
            ))

        if visible:
            self.count_rep(knee_angle, self.DOWN_THRESHOLD, self.UP_THRESHOLD)

        depth_status = (
            "✅ Good Depth" if self.stage == "down" and knee_angle <= self.DOWN_THRESHOLD else
            "⬇ Going Down" if self.stage == "down" else
            "🔝 Standing"  if self.stage == "up"   else
            "⬇ Squat Down"
        )

        form_score = min(
            self.score_from_range(back_angle,  160, 180, 140, 180),
            self.score_from_range(knee_angle,   60, 100,  50, 110) if self.stage == "down" else 100,
        )

        return {
            "reps":         self.reps,
            "knee_angle":   round(knee_angle, 1),
            "back_angle":   round(back_angle, 1),
            "depth_status": depth_status,
            "form_score":   form_score,
        }