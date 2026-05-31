# from abc import ABC,abstractmethod
# import math
# class BaseExercise(ABC):
#     def __init__(self):
#         # super().__init__()
#         self.reps =0
#         self.stage = None

#     def calculate_angle(self,a,b,c):
#         ax,ay = a[0] - b[0],a[1]-b[1]
#         cx,cy = c[0] -b[0], c[1]-b[1]

#         dot = ax*cx+ay*cy

#         mag_a = math.sqrt(ax**2+ay**2)
#         mag_c = math.sqrt(cx**2+cy**2)
#         if mag_a * mag_c == 0:
#             return 0.0
#         cos_angle = max(-1.0,min(1.0,dot / (mag_a*mag_c)))
#         return math.degrees(math.acos(cos_angle))

#     def get_point(self,landmarks,idx):
#         p= landmarks[idx]
#         return (p.x,p.y)
#     @abstractmethod
#     def process(self,landmarks):
#         pass

#     @abstractmethod
#     def reset(self):
#         pass



from abc import ABC, abstractmethod
import math
from collections import deque
from typing import Optional


class BaseExercise(ABC):
    """
    Abstract base class for all exercise detectors.

    Every detector subclass gets:
      - Angle calculation (2D and 3D)
      - Visibility checking
      - Best-side selection
      - Rep counting state machine helpers
      - Smoothing for noisy angle values
      - Form score infrastructure
      - Distance / midpoint utilities
      - All MediaPipe landmark indices as class constants

    To add a new exercise detector:
        1. Subclass BaseExercise
        2. Implement process(landmarks) -> dict
        3. Implement reset()
        4. Call super().__init__() in your __init__
    """

    # ── Visibility ────────────────────────────────────────────────────────
    # Lowered to 0.5 — at 2-3m distance valid landmarks drop below 0.7
    # but are still positionally accurate.
    DEFAULT_VISIBILITY = 0.5

    # ── Smoothing window ──────────────────────────────────────────────────
    # Number of frames to average for each smoothed angle.
    # Increase for more stability, decrease for more responsiveness.
    SMOOTH_WINDOW = 5

    # ════════════════════════════════════════════════════════════════════
    #  MediaPipe Pose Landmark Indices
    #  Full reference: https://developers.google.com/mediapipe/solutions/vision/pose_landmarker
    # ════════════════════════════════════════════════════════════════════

    # Face
    NOSE            = 0
    LEFT_EYE_INNER  = 1
    LEFT_EYE        = 2
    LEFT_EYE_OUTER  = 3
    RIGHT_EYE_INNER = 4
    RIGHT_EYE       = 5
    RIGHT_EYE_OUTER = 6
    LEFT_EAR        = 7
    RIGHT_EAR       = 8
    MOUTH_LEFT      = 9
    MOUTH_RIGHT     = 10

    # Shoulders / arms
    LEFT_SHOULDER   = 11
    RIGHT_SHOULDER  = 12
    LEFT_ELBOW      = 13
    RIGHT_ELBOW     = 14
    LEFT_WRIST      = 15
    RIGHT_WRIST     = 16
    LEFT_PINKY      = 17
    RIGHT_PINKY     = 18
    LEFT_INDEX      = 19
    RIGHT_INDEX     = 20
    LEFT_THUMB      = 21
    RIGHT_THUMB     = 22

    # Hips / legs
    LEFT_HIP        = 23
    RIGHT_HIP       = 24
    LEFT_KNEE       = 25
    RIGHT_KNEE      = 26
    LEFT_ANKLE      = 27
    RIGHT_ANKLE     = 28
    LEFT_HEEL       = 29
    RIGHT_HEEL      = 30
    LEFT_FOOT_INDEX = 31
    RIGHT_FOOT_INDEX= 32

    # ── Handy grouped tuples (useful for visibility checks) ──────────────
    LEFT_ARM    = (LEFT_SHOULDER,  LEFT_ELBOW,  LEFT_WRIST)
    RIGHT_ARM   = (RIGHT_SHOULDER, RIGHT_ELBOW, RIGHT_WRIST)
    LEFT_LEG    = (LEFT_HIP,       LEFT_KNEE,   LEFT_ANKLE)
    RIGHT_LEG   = (RIGHT_HIP,      RIGHT_KNEE,  RIGHT_ANKLE)
    LEFT_BODY   = LEFT_ARM  + LEFT_LEG
    RIGHT_BODY  = RIGHT_ARM + RIGHT_LEG
    CORE        = (LEFT_SHOULDER, RIGHT_SHOULDER, LEFT_HIP, RIGHT_HIP)

    # ════════════════════════════════════════════════════════════════════
    #  Initialisation
    # ════════════════════════════════════════════════════════════════════

    def __init__(self):
        self.reps   = 0
        self.stage  = None
        # Per-angle smoothing buffers — keyed by an arbitrary string label.
        # e.g. self._smooth_buf["knee_angle"]
        self._smooth_bufs: dict[str, deque] = {}

    # ════════════════════════════════════════════════════════════════════
    #  Landmark accessors
    # ════════════════════════════════════════════════════════════════════

    def get_point(self, landmarks, idx: int) -> tuple:
        """Returns (x, y) normalised coords for a landmark."""
        p = landmarks[idx]
        return (p.x, p.y)

    def get_point_3d(self, landmarks, idx: int) -> tuple:
        """Returns (x, y, z) for a landmark. z is depth (less accurate)."""
        p = landmarks[idx]
        return (p.x, p.y, p.z)

    def visibility(self, landmarks, idx: int) -> float:
        """Returns the visibility score [0.0, 1.0] for a single landmark."""
        return landmarks[idx].visibility

    # ════════════════════════════════════════════════════════════════════
    #  Visibility helpers
    # ════════════════════════════════════════════════════════════════════

    def is_visible(self, landmarks, *indices: int,
                   threshold: float = DEFAULT_VISIBILITY) -> bool:
        """
        Returns True only if ALL given landmark indices meet the threshold.
        Use for gating angle calculations and rep counting.

        Example:
            if self.is_visible(landmarks, self.LEFT_HIP, self.LEFT_KNEE, self.LEFT_ANKLE):
                ...
        """
        return all(landmarks[i].visibility >= threshold for i in indices)

    def any_visible(self, landmarks, *indices: int,
                    threshold: float = DEFAULT_VISIBILITY) -> bool:
        """
        Returns True if AT LEAST ONE of the given landmarks meets the threshold.
        Useful for deciding whether to render an overlay at all.
        """
        return any(landmarks[i].visibility >= threshold for i in indices)

    def best_side(self, landmarks, left_idx: int, right_idx: int) -> str:
        """
        Returns 'left' or 'right' — whichever key joint has higher visibility.
        Used by bilateral exercises (squats, lunges, curls, press) to
        automatically pick the side facing the camera.

        Example:
            side = self.best_side(landmarks, self.LEFT_KNEE, self.RIGHT_KNEE)
            hip  = self.LEFT_HIP if side == 'left' else self.RIGHT_HIP
        """
        lv = landmarks[left_idx].visibility
        rv = landmarks[right_idx].visibility
        return "left" if lv >= rv else "right"

    def side_indices(self, side: str,
                     left_indices: tuple,
                     right_indices: tuple) -> tuple:
        """
        Convenience: returns left_indices or right_indices based on side string.

        Example:
            hip, knee, ankle = self.side_indices(
                side,
                (self.LEFT_HIP,  self.LEFT_KNEE,  self.LEFT_ANKLE),
                (self.RIGHT_HIP, self.RIGHT_KNEE, self.RIGHT_ANKLE),
            )
        """
        return left_indices if side == "left" else right_indices

    # ════════════════════════════════════════════════════════════════════
    #  Angle calculation
    # ════════════════════════════════════════════════════════════════════

    def calculate_angle(self, a: tuple, b: tuple, c: tuple) -> float:
        """
        2D angle at joint B, formed by the A–B–C triplet.
        Returns degrees in [0, 180].

        a, b, c are (x, y) tuples from get_point().
        """
        ax, ay = a[0] - b[0], a[1] - b[1]
        cx, cy = c[0] - b[0], c[1] - b[1]

        dot   = ax * cx + ay * cy
        mag_a = math.sqrt(ax ** 2 + ay ** 2)
        mag_c = math.sqrt(cx ** 2 + cy ** 2)

        if mag_a * mag_c < 1e-6:      # degenerate — landmark on top of joint
            return 0.0

        cos_angle = max(-1.0, min(1.0, dot / (mag_a * mag_c)))
        return math.degrees(math.acos(cos_angle))

    def calculate_angle_3d(self, a: tuple, b: tuple, c: tuple) -> float:
        """
        3D angle at joint B using (x, y, z) triplets from get_point_3d().
        More accurate for exercises where the body rotates in depth
        (e.g. shoulder press viewed from the side).
        """
        ax = a[0]-b[0]; ay = a[1]-b[1]; az = a[2]-b[2]
        cx = c[0]-b[0]; cy = c[1]-b[1]; cz = c[2]-b[2]

        dot   = ax*cx + ay*cy + az*cz
        mag_a = math.sqrt(ax**2 + ay**2 + az**2)
        mag_c = math.sqrt(cx**2 + cy**2 + cz**2)

        if mag_a * mag_c < 1e-6:
            return 0.0

        cos_angle = max(-1.0, min(1.0, dot / (mag_a * mag_c)))
        return math.degrees(math.acos(cos_angle))

    def vertical_angle(self, a: tuple, b: tuple) -> float:
        """
        Angle of the segment A→B relative to vertical (y-axis).
        0° = perfectly vertical, 90° = horizontal.
        Useful for torso lean, shin angle, etc.

        a, b are (x, y) tuples.
        """
        dx = b[0] - a[0]
        dy = b[1] - a[1]
        if abs(dy) < 1e-6:
            return 90.0
        return math.degrees(math.atan2(abs(dx), abs(dy)))

    # ════════════════════════════════════════════════════════════════════
    #  Angle smoothing
    # ════════════════════════════════════════════════════════════════════

    def smooth(self, label: str, value: float,
               window: int = SMOOTH_WINDOW) -> float:
        """
        Exponential moving average smoother for noisy per-frame angle values.
        Call with the same label string each frame to maintain state.

        Example:
            smooth_knee = self.smooth("knee", raw_knee_angle)

        Each label gets its own independent buffer, so you can smooth
        as many angles as needed without interference.
        """
        if label not in self._smooth_bufs:
            self._smooth_bufs[label] = deque(maxlen=window)
        buf = self._smooth_bufs[label]
        buf.append(value)
        return sum(buf) / len(buf)

    def reset_smooth(self, label: Optional[str] = None):
        """
        Clears smoothing buffers.
        Pass a label to clear one buffer, or None to clear all.
        Call this from reset() in your subclass.
        """
        if label:
            self._smooth_bufs.pop(label, None)
        else:
            self._smooth_bufs.clear()

    # ════════════════════════════════════════════════════════════════════
    #  Rep counting helpers
    # ════════════════════════════════════════════════════════════════════

    def count_rep(self,
                  angle: float,
                  down_threshold: float,
                  up_threshold: float,
                  down_label: str = "down",
                  up_label:   str = "up") -> bool:
        """
        Standard two-stage rep counter (down → up = 1 rep).
        Updates self.stage and self.reps automatically.
        Returns True the exact frame a rep is completed.

        Works for ANY angle-based exercise:
          - Squats:    angle = knee angle,   down < 100, up > 160
          - Push-ups:  angle = elbow angle,  down < 90,  up > 160
          - Curls:     angle = elbow angle,  down < 50,  up > 150
          - Press:     angle = elbow angle,  down < 90,  up > 160

        Example:
            rep_done = self.count_rep(elbow_angle, down_threshold=90, up_threshold=160)
        """
        rep_counted = False
        if angle < down_threshold:
            self.stage = down_label
        elif angle >= up_threshold and self.stage == down_label:
            self.stage     = up_label
            self.reps     += 1
            rep_counted    = True
        return rep_counted

    def count_rep_inverse(self,
                          angle: float,
                          up_threshold:   float,
                          down_threshold: float,
                          up_label:   str = "up",
                          down_label: str = "down") -> bool:
        """
        Inverse rep counter — starts UP, goes DOWN = 1 rep.
        Use for exercises that begin extended and contract downward:
          - Lat pulldown, pull-ups, dips, leg press

        Example:
            rep_done = self.count_rep_inverse(elbow_angle, up_threshold=160, down_threshold=90)
        """
        rep_counted = False
        if angle >= up_threshold:
            self.stage = up_label
        elif angle < down_threshold and self.stage == up_label:
            self.stage   = down_label
            self.reps   += 1
            rep_counted  = True
        return rep_counted

    # ════════════════════════════════════════════════════════════════════
    #  Geometry utilities
    # ════════════════════════════════════════════════════════════════════

    def midpoint(self, a: tuple, b: tuple) -> tuple:
        """
        Returns the (x, y) midpoint between two landmarks.
        Useful for: spine midpoint, hip centre, shoulder centre.

        Example:
            hip_centre = self.midpoint(
                self.get_point(landmarks, self.LEFT_HIP),
                self.get_point(landmarks, self.RIGHT_HIP),
            )
        """
        return ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)

    def distance(self, a: tuple, b: tuple) -> float:
        """
        Euclidean distance between two (x, y) points.
        Normalised [0, 1] since MediaPipe coords are normalised.
        Useful for: shoulder width, stance width checks.
        """
        return math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)

    def normalised_distance(self, landmarks,
                            idx_a: int, idx_b: int,
                            ref_idx_a: int, ref_idx_b: int) -> float:
        """
        Distance between idx_a and idx_b, normalised by the distance
        between two reference landmarks (e.g. shoulder width).

        Removes body-size / camera-distance bias.
        Useful for: stance width relative to hip width, reach checks.

        Example:
            rel_stance = self.normalised_distance(
                landmarks,
                self.LEFT_ANKLE, self.RIGHT_ANKLE,   # what to measure
                self.LEFT_HIP,   self.RIGHT_HIP,      # normalise by hip width
            )
        """
        d     = self.distance(self.get_point(landmarks, idx_a),
                               self.get_point(landmarks, idx_b))
        ref_d = self.distance(self.get_point(landmarks, ref_idx_a),
                               self.get_point(landmarks, ref_idx_b))
        if ref_d < 1e-6:
            return 0.0
        return d / ref_d

    # ════════════════════════════════════════════════════════════════════
    #  Form score helper
    # ════════════════════════════════════════════════════════════════════

    def score_from_range(self, value: float,
                         perfect_min: float, perfect_max: float,
                         acceptable_min: float, acceptable_max: float) -> int:
        """
        Maps a measured value to a form score: 100 / 70 / 40.

        perfect_min..perfect_max    → 100  (ideal range)
        acceptable_min..acceptable_max → 70  (okay but not great)
        outside acceptable range    → 40   (needs correction)

        Compose multiple calls with min() to get the weakest-link score:
            form = min(
                self.score_from_range(back_angle,  160, 180, 145, 180),
                self.score_from_range(knee_angle,   60, 100,  50, 110),
            )
        """
        if perfect_min <= value <= perfect_max:
            return 100
        if acceptable_min <= value <= acceptable_max:
            return 70
        return 40

    # ════════════════════════════════════════════════════════════════════
    #  Abstract interface — every detector must implement these
    # ════════════════════════════════════════════════════════════════════

    @abstractmethod
    def process(self, landmarks) -> dict:
        """
        Called every frame with MediaPipe pose landmarks.
        Must return a dict that always includes at minimum:
            {
                "reps":       int,
                "form_score": int,   # 0-100, used by metrics.py rolling average
            }
        Add any exercise-specific keys your UI needs on top of those.
        """
        pass

    @abstractmethod
    def reset(self):
        """
        Reset all state for a new session.
        Must call self.reps = 0; self.stage = None; self.reset_smooth()
        """
        pass