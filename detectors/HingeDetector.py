from core.base_exercise import BaseExercise


class HingeDetector(BaseExercise):
    """
    Covers: Deadlift, Romanian Deadlift (RDL), Hip Thrust, Good Morning, Kettlebell Swing.
    Camera: side-on for best accuracy.

    Rep cycle:
        DOWN → hip hinge forward, torso parallel  (hip angle < DOWN_THRESHOLD)
        UP   → standing upright, hips extended    (hip angle > UP_THRESHOLD)  ← rep counted
    """
    DOWN_THRESHOLD = 70    # deeply hinged (shoulder-hip-knee angle)
    UP_THRESHOLD   = 160   # standing / hips fully extended

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

        # Hip angle: shoulder-hip-knee
        hip_angle = self.smooth("hip", self.calculate_angle(
            self.get_point(landmarks, sh),
            self.get_point(landmarks, hi),
            self.get_point(landmarks, kn),
        ))

        # Back flatness: vertical angle of hip→shoulder
        # 0° = perfectly vertical (standing), 90° = horizontal (parallel to floor)
        back_angle = self.smooth("back", self.vertical_angle(
            self.get_point(landmarks, hi),
            self.get_point(landmarks, sh),
        ))

        if visible:
            self.count_rep(hip_angle, self.DOWN_THRESHOLD, self.UP_THRESHOLD)

        hinge_status = (
            "✅ Hinged"         if self.stage == "down" and hip_angle < self.DOWN_THRESHOLD else
            "⬇ Hinge more"     if self.stage == "down" else
            "🔝 Standing"       if self.stage == "up"   else
            "⬇ Hinge forward"
        )

        # Good deadlift: back roughly horizontal (back_angle ~70–90°)
        back_flat = 50 < back_angle < 95
        form_score = min(
            self.score_from_range(hip_angle, 50, 75, 40, 85) if self.stage == "down" else 100,
            100 if back_flat else 60,
        )

        return {
            "reps":         self.reps,
            "hip_angle":    round(hip_angle, 1),
            "back_angle":   round(back_angle, 1),
            "hinge_status": hinge_status,
            "form_score":   form_score,
        }