# import cv2
# from streamlit_webrtc import VideoProcessorBase
# import threading
# import os
# import av
# import numpy as np
# import mediapipe as mp
# from mediapipe.tasks import python
# from mediapipe.tasks.python import vision
# from detectors.squat import SquatDetector
# from detectors.biceps_curl import BicepsCurlDetector
# from detectors.lunges import LungesDetector
# from detectors.pushup import PushUpDetector
# from detectors.shoulder_press import ShoulderPressDetector
# from services.config.workout_config import POSE_CONNECTIONS
# class VideoProcessorClass(VideoProcessorBase):
#     def __init__(self):
#         self._lock = threading.Lock()
#         self._latest_metrics = None
#         self._exercise_type = "Squats"

#         model_path = os.path.join(os.getcwd(), "ml_models","pose_landmarker_full.task")
#         base_option = python.BaseOptions(model_asset_path=model_path)

#         options = vision.PoseLandmarkerOptions(
#             base_options = base_option,
#             running_mode = vision.RunningMode.VIDEO,
#             min_pose_detection_confidence = 0.7,
#             min_pose_presence_confidence = 0.7,
#             min_tracking_confidence = 0.7,
#             output_segmentation_mask= False
#         )

#         self._landmarker = vision.PoseLandmarker.create_from_options(options)
#         self._detectors = {
#             "Squats":SquatDetector(),
#             "Push-ups":PushUpDetector(),
#             "Bicep Curls (Dumbbell) ":BicepsCurlDetector(),
#             "Shoulder Press": ShoulderPressDetector(),
#             "Lunges":LungesDetector()
#         }

#         self._frame_timestamps_ms = 0

#     def set_latest_metrics(self,metrics):
#         with self._lock:
#             self._latest_metrics = metrics.copy()

#     def get_latest_metrics(self):
#         with self._lock:
#             return None if self._latest_metrics is None else self._latest_metrics.copy()
    
#     def set_exercise_type(self,exercise_type):
#         with self._lock:
#             self._exercise_type = exercise_type
    
#     def get_exercise(self):
#         with self._lock:
#             return self._exercise_type
    
#     def _draw_skeleton(self,img,landmarks):
#         h,w = img.shape[:2]

#         for start_idx ,end_idx in POSE_CONNECTIONS:
#             p1 = landmarks[start_idx]
#             p2 = landmarks[end_idx]

#             if p1.visibility >0.7 and p2.visibility >0.7:
#                 cv2.line(
#                     img,
#                     (int(p1.x * w),int(p1.y *h)),
#                     (int(p2.x * w),int(p2.y *h)),
#                     (0,255,0),
#                     8
#                 )
#         for lm in landmarks:
#             if lm.visibility >0.7:
#                 cv2.circle(
#                     img,
#                     (int(lm.x * w), int(lm.y * h)),
#                     8,
#                     (255,0,0),
#                     -1
#                 )
#         return img
    
#     def _draw_no_pose_warnings(self, img):
#         cv2.putText(
#             img,
#             "NO POSE DETECTED",
#             (30, 50),
#             cv2.FONT_HERSHEY_SIMPLEX,
#             1,
#             (0, 255, 0),
#             2,
#             cv2.LINE_AA,
#         )

#         cv2.putText(
#             img,
#             "PLEASE FACE THE CAMERA",
#             (30, 100),
#             cv2.FONT_HERSHEY_SIMPLEX,
#             1,
#             (0, 255, 0),
#             2,
#             cv2.LINE_AA,
#         )
#     def _draw_overlays(self, img, metrics, ex_type):
#         if ex_type == "Squats":
#             self._draw_squats_overlays(img, metrics)
#         elif ex_type == "Push-ups":
#             self._draw_pushup_overlays(img, metrics)
#         elif ex_type == "Biceps Curls (Dumbbell)":
#             self._draw_curl_overlays(img, metrics)
#         elif ex_type == "Shoulder Press":
#             self._draw_press_overlays(img, metrics)
#         elif ex_type == "Lunges":
#             self._draw_lunge_overlays(img, metrics)


#     def _draw_squats_overlays(self, img, metrics):
#         h, _ = img.shape[:2]

#         cv2.putText(
#             img,
#             f"DEPTH: {metrics['depth_status']}",
#             (20, h - 20),
#             cv2.FONT_HERSHEY_SIMPLEX,
#             1,
#             (0, 255, 0),
#             2,
#         )
    
#     def _draw_pushup_overlays(self, img, metrics):
#         h, _ = img.shape[:2]

#         cv2.putText(
#             img,
#             f"BODY: {metrics['body_alignment']} | HIP: {metrics['hip_status']}",
#             (20, h - 20),
#             cv2.FONT_HERSHEY_SIMPLEX,
#             1,
#             (0, 255, 0),
#             2,
#         )

#     def _draw_curl_overlays(self, img, metrics):
#         h, _ = img.shape[:2]

#         cv2.putText(
#             img,
#             f"SWING: {metrics['swing_status']}",
#             (20, h - 20),
#             cv2.FONT_HERSHEY_SIMPLEX,
#             1,
#             (0, 255, 0),
#             2,
#         )

#     def _draw_press_overlays(self, img, metrics):
#         h, _ = img.shape[:2]

#         cv2.putText(
#             img,
#             f"EXT: {metrics['extension_status']} | BACK: {metrics['back_arch_status']}",
#             (20, h - 20),
#             cv2.FONT_HERSHEY_SIMPLEX,
#             1,
#             (0, 255, 0),
#             2,
#         )

#     def _draw_lunge_overlays(self, img, metrics):
#         h, _ = img.shape[:2]

#         cv2.putText(
#             img,
#             f"BALANCE: {metrics['balance_status']}",
#             (20, h - 20),
#             cv2.FONT_HERSHEY_SIMPLEX,
#             1,
#             (0, 255, 0),
#             2,
#         )

#     def recv(self, frame):
#         image = np.asarray(
#             cv2.flip(frame.to_ndarray(format="bgr24"), 1),
#             dtype=np.uint8
#         )

#         mp_image = mp.Image(
#             image_format=mp.ImageFormat.SRGB,
#             data=cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
#         )

#         self._frame_timestamps_ms += 30
#         result = self._landmarker.detect_for_video(mp_image, self._frame_timestamps_ms)

#         if result.pose_landmarks:
#             landmarks = result.pose_landmarks[0]

#             self._draw_skeleton(image, landmarks)

#             ex_type = self.get_exercise()

#             detector = self._detectors.get(ex_type)

#             if detector:
#                 metrics = detector.process(landmarks)

#                 metrics["pose_detected"] = True

#                 self._draw_overlays(image, metrics, ex_type)

#                 self.set_latest_metrics(metrics)
#         else:
#             self._draw_no_pose_warnings(image)
            
#             with self._lock:
#                 if self._latest_metrics is not None:
#                     self._latest_metrics["pose_detected"] = False
#                 else:
#                     self._latest_metrics = {"pose_detected": False}

#         return av.VideoFrame.from_ndarray(image, format="bgr24")



# import os
# import cv2
# import av
# import numpy as np
# import mediapipe as mp
# import threading
# from streamlit_webrtc import VideoProcessorBase
# from mediapipe.tasks import python
# from mediapipe.tasks.python import vision
# from detectors.squat import SquatDetector
# from detectors.pushup import PushUpDetector
# from detectors.biceps_curl import BicepsCurlDetector
# from detectors.shoulder_press import ShoulderPressDetector
# from detectors.lunges import LungesDetector
# from services.config.workout_config import POSE_CONNECTIONS


# class VideoProcessorClass(VideoProcessorBase):
#     def __init__(self):
#         self._lock = threading.Lock()
#         self._latest_metrics = None
#         self._exercise_type = "Squats"

#         model_path = os.path.join(os.getcwd(), "ml_models", "pose_landmarker_full.task")
#         base_option = python.BaseOptions(model_asset_path=model_path)

#         options = vision.PoseLandmarkerOptions(
#             base_options=base_option,
#             running_mode=vision.RunningMode.VIDEO,
#             min_pose_detection_confidence=0.7,
#             min_pose_presence_confidence=0.7,
#             min_tracking_confidence=0.7,
#             output_segmentation_masks=False
#         )

#         self._landmarker = vision.PoseLandmarker.create_from_options(options)

#         self._detectors = {
#             "Squats": SquatDetector(),
#             "Push-ups": PushUpDetector(),
#             "Biceps Curls (Dumbbell)": BicepsCurlDetector(),
#             "Shoulder Press": ShoulderPressDetector(),
#             "Lunges": LungesDetector(),
#         }

#         self._frame_timestamps_ms = 0
    
#     def set_latest_metrics(self, metrics):
#         with self._lock:
#             self._latest_metrics = metrics.copy()

#     def get_latest_metrics(self):
#         with self._lock:
#             return None if self._latest_metrics is None else self._latest_metrics.copy()
        
#     def set_exercise(self, exercise_type):
#         with self._lock:
#             self._exercise_type = exercise_type

#     def get_exercise(self):
#         with self._lock:
#             return self._exercise_type
        
#     def _draw_skeleton(self, img, landmarks):
#         h, w = img.shape[:2]

#         for start_idx, end_idx in POSE_CONNECTIONS:
#             p1 = landmarks[start_idx]
#             p2 = landmarks[end_idx]

#             if p1.visibility > 0.7 and p2.visibility > 0.7:
#                 cv2.line(
#                     img,
#                     (int(p1.x * w), int(p1.y * h)),
#                     (int(p2.x * w), int(p2.y * h)),
#                     (0, 255, 0),
#                     8
#                 )
        
#         for lm in landmarks:
#             if lm.visibility > 0.7:
#                 cv2.circle(
#                     img, 
#                     (int(lm.x * w), int(lm.y * h)),
#                     8,
#                     (255, 0, 0),
#                     -1
#                 )
            
#     def _draw_no_pose_warnings(self, img):
#         cv2.putText(
#             img,
#             "NO POSE DETECTED",
#             (30, 50),
#             cv2.FONT_HERSHEY_SIMPLEX,
#             1,
#             (0, 255, 0),
#             2,
#             cv2.LINE_AA,
#         )

#         cv2.putText(
#             img,
#             "PLEASE FACE THE CAMERA",
#             (30, 100),
#             cv2.FONT_HERSHEY_SIMPLEX,
#             1,
#             (0, 255, 0),
#             2,
#             cv2.LINE_AA,
#         )

#     def _draw_overlays(self, img, metrics, ex_type):
#         if ex_type == "Squats":
#             self._draw_squats_overlays(img, metrics)
#         elif ex_type == "Push-ups":
#             self._draw_pushup_overlays(img, metrics)
#         elif ex_type == "Biceps Curls (Dumbbell)":
#             self._draw_curl_overlays(img, metrics)
#         elif ex_type == "Shoulder Press":
#             self._draw_press_overlays(img, metrics)
#         elif ex_type == "Lunges":
#             self._draw_lunge_overlays(img, metrics)


#     def _draw_squats_overlays(self, img, metrics):
#         h, _ = img.shape[:2]

#         cv2.putText(
#             img,
#             f"DEPTH: {metrics['depth_status']}",
#             (20, h - 20),
#             cv2.FONT_HERSHEY_SIMPLEX,
#             1,
#             (0, 255, 0),
#             2,
#         )
    
#     def _draw_pushup_overlays(self, img, metrics):
#         h, _ = img.shape[:2]

#         cv2.putText(
#             img,
#             f"BODY: {metrics['body_alignment']} | HIP: {metrics['hip_status']}",
#             (20, h - 20),
#             cv2.FONT_HERSHEY_SIMPLEX,
#             1,
#             (0, 255, 0),
#             2,
#         )

#     def _draw_curl_overlays(self, img, metrics):
#         h, _ = img.shape[:2]

#         cv2.putText(
#             img,
#             f"SWING: {metrics['swing_status']}",
#             (20, h - 20),
#             cv2.FONT_HERSHEY_SIMPLEX,
#             1,
#             (0, 255, 0),
#             2,
#         )

#     def _draw_press_overlays(self, img, metrics):
#         h, _ = img.shape[:2]

#         cv2.putText(
#             img,
#             f"EXT: {metrics['extension_status']} | BACK: {metrics['back_arch_status']}",
#             (20, h - 20),
#             cv2.FONT_HERSHEY_SIMPLEX,
#             1,
#             (0, 255, 0),
#             2,
#         )

#     def _draw_lunge_overlays(self, img, metrics):
#         h, _ = img.shape[:2]

#         cv2.putText(
#             img,
#             f"BALANCE: {metrics['balance_status']}",
#             (20, h - 20),
#             cv2.FONT_HERSHEY_SIMPLEX,
#             1,
#             (0, 255, 0),
#             2,
#         )

#     def recv(self, frame):
#         image = np.asarray(
#             cv2.flip(frame.to_ndarray(format="bgr24"), 1),
#             dtype=np.uint8
#         )

#         mp_image = mp.Image(
#             image_format=mp.ImageFormat.SRGB,
#             data=cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
#         )

#         self._frame_timestamps_ms += 30
#         result = self._landmarker.detect_for_video(mp_image, self._frame_timestamps_ms)

#         if result.pose_landmarks:
#             landmarks = result.pose_landmarks[0]

#             self._draw_skeleton(image, landmarks)

#             ex_type = self.get_exercise()

#             detector = self._detectors.get(ex_type)

#             if detector:
#                 metrics = detector.process(landmarks)

#                 metrics["pose_detected"] = True

#                 self._draw_overlays(image, metrics, ex_type)

#                 self.set_latest_metrics(metrics)
#         else:
#             self._draw_no_pose_warnings(image)
            
#             with self._lock:
#                 if self._latest_metrics is not None:
#                     self._latest_metrics["pose_detected"] = False
#                 else:
#                     self._latest_metrics = {"pose_detected": False}

#         return av.VideoFrame.from_ndarray(image, format="bgr24")
    


"""
video_processor.py

Key production fixes:
- Reps are NEVER reset on pose loss (user walks out during rest → returns → count preserved)
- Detector reset only happens on explicit workout restart, not on missed frames
- MediaPipe confidence lowered to 0.4 for better far-distance detection
- Frame timestamp uses real PTS to prevent MediaPipe VIDEO mode stalls
- Always returns a valid frame — stream never hangs
"""
import os
import cv2
import av
import numpy as np
import mediapipe as mp
import threading
from streamlit_webrtc import VideoProcessorBase
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
from services.config.workout_config import POSE_CONNECTIONS
from detectors import (
    PressHorizontalDetector, PressVerticalDetector,
    PullHorizontalDetector,  PullVerticalDetector,
    CurlDetector, TricepDetector, SquatDetector,
    LungeDetector, HingeDetector, CoreDetector
)

class VideoProcessorClass(VideoProcessorBase):
    def __init__(self):
        self._lock = threading.Lock()
        self._latest_metrics    = None
        self._exercise_type     = "Squats"
        self._movement_pattern = "Press Horizontal"
        self._frame_ts_ms       = 0
        self._missed_frames     = 0

        # ── MediaPipe — lowered to 0.4 for far-distance detection ─────────
        model_path   = os.path.join(os.getcwd(), "ml_models", "pose_landmarker_full.task")
        base_options = python.BaseOptions(model_asset_path=model_path)
        options      = vision.PoseLandmarkerOptions(
            base_options=base_options,
            running_mode=vision.RunningMode.VIDEO,
            min_pose_detection_confidence=0.5,
            min_pose_presence_confidence=0.5,
            min_tracking_confidence=0.5,
            output_segmentation_masks=False,
        )
        self._landmarker = vision.PoseLandmarker.create_from_options(options)

        self._detectors = {
    "Press Horizontal": PressHorizontalDetector(),
    "Press Vertical":   PressVerticalDetector(),
    "Pull Horizontal":  PullHorizontalDetector(),
    "Pull Vertical":    PullVerticalDetector(),
    "Curl":             CurlDetector(),
    "Tricep":           TricepDetector(),
    "Squat":            SquatDetector(),
    "Lunge":            LungeDetector(),
    "Hinge":            HingeDetector(),
    "Core":             CoreDetector(),
}


    # ── Thread-safe accessors ─────────────────────────────────────────────

    def set_latest_metrics(self, metrics: dict):
        with self._lock:
            self._latest_metrics = metrics.copy()

    def get_latest_metrics(self) -> dict | None:
        with self._lock:
            return None if self._latest_metrics is None else self._latest_metrics.copy()

    def set_exercise(self, exercise_type: str):
        with self._lock:
            if self._exercise_type != exercise_type:
                self._exercise_type = exercise_type
                # Reset detector when exercise CHANGES (not on pose loss)
                # det = self._detectors.get(exercise_type)
                # if det and hasattr(det, "reset"):
                #     det.reset()

    def set_movement_pattern(self, pattern):
        with self._lock:
            if self._movement_pattern != pattern:
                self._movement_pattern = pattern

                det = self._detectors.get(pattern)

                if det and hasattr(det, "reset"):
                    det.reset()
    def get_exercise(self) -> str:
        with self._lock:
            return self._exercise_type
    

    def get_movement_pattern(self):
        with self._lock:
            return self._movement_pattern
        
    def reset_reps(self):
        pattern = self._movement_pattern

        det = self._detectors.get(pattern)

        if det and hasattr(det, "reset"):
            det.reset()

    # def reset_reps(self):
    #     """Called only on explicit workout restart from main.py."""
    #     with self._lock:
    #         ex = self._exercise_type
    #     det = self._detectors.get(ex)
    #     if det and hasattr(det, "reset"):
    #         det.reset()

    # ── Drawing ───────────────────────────────────────────────────────────

    def _draw_skeleton(self, img, landmarks):
        h, w  = img.shape[:2]
        THRESH = 0.4   # matches detection confidence

        for s, e in POSE_CONNECTIONS:
            if s >= len(landmarks) or e >= len(landmarks):
                continue
            p1, p2 = landmarks[s], landmarks[e]
            if p1.visibility > THRESH and p2.visibility > THRESH:
                cv2.line(img,
                         (int(p1.x * w), int(p1.y * h)),
                         (int(p2.x * w), int(p2.y * h)),
                         (0, 230, 0), 4)

        for lm in landmarks:
            if lm.visibility > THRESH:
                cv2.circle(img, (int(lm.x * w), int(lm.y * h)),
                           5, (255, 140, 0), -1)

    def _overlay_text(self, img, text: str):
        h, w    = img.shape[:2]
        overlay = img.copy()
        cv2.rectangle(overlay, (0, h - 44), (w, h), (0, 0, 0), -1)
        cv2.addWeighted(overlay, 0.55, img, 0.45, 0, img)
        cv2.putText(img, text, (16, h - 12),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.70, (0, 230, 0), 2, cv2.LINE_AA)

    def _draw_no_pose(self, img):
        h, w    = img.shape[:2]
        overlay = img.copy()
        cv2.rectangle(overlay, (0, 0), (w, 60), (0, 0, 0), -1)
        cv2.addWeighted(overlay, 0.65, img, 0.35, 0, img)
        cv2.putText(img, "NO POSE — MOVE CLOSER OR FACE CAMERA",
                    (16, 36), cv2.FONT_HERSHEY_SIMPLEX, 0.60,
                    (0, 200, 255), 2, cv2.LINE_AA)

    def _draw_overlays(self, img, metrics: dict, ex: str):
        # table = {
        #     "Squats":                  lambda m: f"DEPTH: {m.get('depth_status','—')}  KNEE: {m.get('knee_angle','—')}°",
        #     "Push-ups":                lambda m: f"BODY: {m.get('body_alignment','—')}  HIP: {m.get('hip_status','—')}",
        #     "Biceps Curls (Dumbbell)": lambda m: f"SWING: {m.get('swing_status','—')}",
        #     "Shoulder Press":          lambda m: f"EXT: {m.get('extension_status','—')}  BACK: {m.get('back_arch_status','—')}",
        #     "Lunges":                  lambda m: f"BALANCE: {m.get('balance_status','—')}",
        # }
        table = {
            "Press Horizontal":
                lambda m: (
                    f"PRESS: {m.get('press_status', '—')} | "
                    f"BODY: {m.get('body_alignment', '—')}"
                ),

            "Press Vertical":
                lambda m: (
                    f"EXT: {m.get('extension_status', '—')} | "
                    f"BACK: {m.get('back_arch_status', '—')}"
                ),

            "Pull Horizontal":
                lambda m: (
                    f"PULL: {m.get('pull_status', '—')} | "
                    f"BACK: {m.get('back_status', '—')}"
                ),

            "Pull Vertical":
                lambda m: (
                    f"PULL: {m.get('pull_status', '—')} | "
                    f"LEAN: {m.get('back_status', '—')}"
                ),

            "Curl":
                lambda m: (
                    f"SWING: {m.get('swing_status', '—')} | "
                    f"SHOULDER: {m.get('shoulder_status', '—')}"
                ),

            "Tricep":
                lambda m: (
                    f"TRICEP: {m.get('tricep_status', '—')}"
                ),

            "Squat":
                lambda m: (
                    f"DEPTH: {m.get('depth_status', '—')} | "
                    f"KNEE: {m.get('knee_angle', '—')}°"
                ),

            "Lunge":
                lambda m: (
                    f"BALANCE: {m.get('balance_status', '—')} | "
                    f"KNEE: {m.get('front_knee_angle', '—')}°"
                ),

            "Hinge":
                lambda m: (
                    f"HINGE: {m.get('hinge_status', '—')} | "
                    f"HIP: {m.get('hip_angle', '—')}°"
                ),

            "Core":
                lambda m: (
                    f"CORE: {m.get('core_status', '—')} | "
                    f"BODY: {m.get('body_angle', '—')}°"
                ),
            }
        pattern = self.get_movement_pattern()
        fn = table.get(pattern)
        # fn = table.get(ex)
        if fn:
            self._overlay_text(img, fn(metrics))

    # ── Main frame handler ────────────────────────────────────────────────

    def recv(self, frame: av.VideoFrame) -> av.VideoFrame:
        try:
            bgr = cv2.flip(frame.to_ndarray(format="bgr24"), 1).astype(np.uint8)
            rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)

            # Real PTS timestamp prevents MediaPipe VIDEO mode stalls
            if frame.pts and frame.time_base:
                pts_ms = int(frame.pts * frame.time_base * 1000)
                # Guard against non-monotonic timestamps from browser jitter
                pts_ms = max(pts_ms, self._frame_ts_ms + 1)
            else:
                pts_ms = self._frame_ts_ms + 33
            self._frame_ts_ms = pts_ms

            mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)

            try:
                result = self._landmarker.detect_for_video(mp_image, pts_ms)
            except Exception:
                # Timestamp error — return frame unchanged, never hang
                return av.VideoFrame.from_ndarray(bgr, format="bgr24")

            if result.pose_landmarks:
                self._missed_frames = 0
                landmarks           = result.pose_landmarks[0]

                self._draw_skeleton(bgr, landmarks)

                # ex_type  = self.get_exercise()
                # detector = self._detectors.get(ex_type)
                pattern = self.get_movement_pattern()

                detector = self._detectors.get(pattern)

                if detector:
                    try:
                        metrics = detector.process(landmarks)
                    except Exception:
                        metrics = {}

                    metrics["pose_detected"] = True
                    self._draw_overlays(bgr, metrics, pattern)
                    self.set_latest_metrics(metrics)

            else:
                self._missed_frames += 1
                self._draw_no_pose(bgr)

                # ── CRITICAL FIX: NEVER reset reps on pose loss ────────────
                # Old code reset detector after _MAX_MISSED frames.
                # That wiped the rep counter when user stepped out during rest.
                # Now we ONLY set pose_detected=False and preserve everything else.
                with self._lock:
                    if self._latest_metrics is not None:
                        self._latest_metrics["pose_detected"] = False
                    else:
                        self._latest_metrics = {"pose_detected": False}

        except Exception:
            # Catch-all — production must never hang
            pass

        return av.VideoFrame.from_ndarray(
            bgr if 'bgr' in dir() else np.zeros((480, 640, 3), np.uint8),
            format="bgr24"
        )