"use client";

import { useEffect, useState } from "react";
import {
  Dumbbell,
  PlayCircle,
  Activity,
  Target,
  ChevronRight,
  Flame,
  Trash2,
  AlertTriangle,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AllExercise() {
  const [gymDocId, setGymDocId] = useState("");
  const [bodyParts, setBodyParts] = useState([]);
  const [muscles, setMuscles] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null); // { exerciseId, exerciseName }
  const [deleting, setDeleting] = useState(false);
const API_URL =
  process.env.NEXT_PUBLIC_BASE_URL;
  useEffect(() => {
    const gym = JSON.parse(localStorage.getItem("gym"));
    if (gym?.docId) {
      setGymDocId(gym.docId);
      loadBodyParts(gym.docId);
    }
  }, []);

  const loadBodyParts = async (gymId) => {
    try {
      const res = await fetch(`${API_URL}/api/exercise/bodyparts/${gymId}`);
      const data = await res.json();
      if (data.success) setBodyParts(data.bodyParts);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load body parts");
    }
  };

  const loadMuscles = async (bodyPartId) => {
    try {
      setSelectedBodyPart(bodyPartId);
      setSelectedMuscle(null);
      setExercises([]);
      const res = await fetch(`${API_URL}/api/exercise/musclegroups/${gymDocId}/${bodyPartId}`);
      const data = await res.json();
      if (data.success) setMuscles(data.muscles);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load muscle groups");
    }
  };

  const loadExercises = async (muscleGroupId) => {
    try {
      setSelectedMuscle(muscleGroupId);
      setLoading(true);
      const res = await fetch(`${API_URL}/api/exercise/exercises/${gymDocId}/${selectedBodyPart}/${muscleGroupId}`);
      const data = await res.json();
      if (data.success) setExercises(data.exercises);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load exercises");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE EXERCISE
  // =========================
  const deleteExercise = async () => {
    if (!deleteModal) return;
    try {
      setDeleting(true);
      const res = await fetch(
        `${API_URL}/api/exercise/delete-exercise/${gymDocId}/${selectedBodyPart}/${selectedMuscle}/${deleteModal.exerciseId}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Exercise Deleted");
        setExercises((prev) =>
          prev.filter((ex) => ex.exerciseid !== deleteModal.exerciseId)
        );
        setDeleteModal(null);
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete exercise");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className="w-full rounded-2xl overflow-hidden relative"
      style={{ background: "#080808", border: "1px solid #1c1c1c", boxShadow: "0 32px 80px rgba(0,0,0,0.8)" }}
    >
      {/* Crosshatch texture */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg,rgba(255,77,0,0.012) 0,rgba(255,77,0,0.012) 1px,transparent 0,transparent 50%),repeating-linear-gradient(-45deg,rgba(255,77,0,0.012) 0,rgba(255,77,0,0.012) 1px,transparent 0,transparent 50%)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* Flame accent bar */}
      <div
        className="h-[3px] w-full relative z-10"
        style={{ background: "linear-gradient(90deg,#ff4d00 0%,#ff7730 45%,#f5c842 100%)" }}
      />

      {/* ── PAGE HEADER ── */}
      <div
        className="flex items-center justify-between px-6 py-5 relative z-10"
        style={{ borderBottom: "1px solid #161616", background: "linear-gradient(180deg,#0e0e0e 0%,#080808 100%)" }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#ff4d00,#ff7730)", boxShadow: "0 0 22px rgba(255,77,0,0.35)" }}
          >
            💪
          </div>
          <div>
            <h1
              className="text-white font-black uppercase leading-none"
              style={{ fontSize: "22px", letterSpacing: "3px", fontFamily: "'Barlow Condensed',sans-serif" }}
            >
              Exercise Library
            </h1>
            <p className="font-bold uppercase mt-1" style={{ fontSize: "10px", letterSpacing: "3px", color: "#333" }}>
              Browse · Filter · Train
            </p>
          </div>
        </div>

        {exercises.length > 0 && (
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ background: "rgba(255,77,0,0.08)", border: "1px solid rgba(255,77,0,0.18)" }}
          >
            <Flame className="w-3.5 h-3.5" style={{ color: "#ff4d00" }} />
            <span className="font-black uppercase" style={{ fontSize: "11px", letterSpacing: "2px", color: "#ff4d00" }}>
              {exercises.length} Moves
            </span>
          </div>
        )}
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 p-6 md:p-8 space-y-8">

        {/* BODY PARTS */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,77,0,0.12)", border: "1px solid rgba(255,77,0,0.18)" }}
            >
              <Activity className="w-4 h-4" style={{ color: "#ff4d00" }} />
            </div>
            <span className="font-black uppercase" style={{ fontSize: "11px", letterSpacing: "4px", color: "#3a3a3a", fontFamily: "'Barlow Condensed',sans-serif" }}>
              Body Parts
            </span>
            <span className="flex-1 h-px" style={{ background: "linear-gradient(90deg,#1f1f1f,transparent)" }} />
          </div>

          <div className="flex flex-wrap gap-2.5">
            {bodyParts.length === 0 && (
              <p className="font-bold uppercase py-4" style={{ fontSize: "11px", letterSpacing: "3px", color: "#252525" }}>
                No body parts found
              </p>
            )}
            {bodyParts.map((part) => {
              const isActive = selectedBodyPart === part.bodypartid;
              return (
                <button
                  key={part.bodypartid}
                  onClick={() => loadMuscles(part.bodypartid)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-black uppercase transition-all duration-200"
                  style={
                    isActive
                      ? { background: "linear-gradient(90deg,#ff4d00,#ff7730)", border: "1px solid #ff4d00", color: "#fff", fontSize: "11px", letterSpacing: "2px", boxShadow: "0 4px 16px rgba(255,77,0,0.3)" }
                      : { background: "#0f0f0f", border: "1px solid #1f1f1f", color: "#3a3a3a", fontSize: "11px", letterSpacing: "2px" }
                  }
                  onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.borderColor = "rgba(255,77,0,0.3)"; e.currentTarget.style.color = "#ff4d00"; e.currentTarget.style.background = "rgba(255,77,0,0.04)"; } }}
                  onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.borderColor = "#1f1f1f"; e.currentTarget.style.color = "#3a3a3a"; e.currentTarget.style.background = "#0f0f0f"; } }}
                >
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: isActive ? "rgba(255,255,255,0.7)" : "#2a2a2a", boxShadow: isActive ? "0 0 6px rgba(255,255,255,0.5)" : "none" }} />
                  {part.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* MUSCLE GROUPS */}
        {selectedBodyPart && (
          <div className="rounded-2xl p-5" style={{ background: "#0a0a0a", border: "1px solid #161616" }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.12)" }}>
                <Target className="w-4 h-4" style={{ color: "#00d4ff" }} />
              </div>
              <span className="font-black uppercase" style={{ fontSize: "11px", letterSpacing: "4px", color: "#3a3a3a", fontFamily: "'Barlow Condensed',sans-serif" }}>
                Muscle Groups
              </span>
              <span className="flex-1 h-px" style={{ background: "linear-gradient(90deg,#1f1f1f,transparent)" }} />
            </div>
            <div className="flex flex-wrap gap-2.5">
              {muscles.map((muscle) => {
                const isActive = selectedMuscle === muscle.musclegroupid;
                return (
                  <button
                    key={muscle.musclegroupid}
                    onClick={() => loadExercises(muscle.musclegroupid)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-black uppercase transition-all duration-200"
                    style={
                      isActive
                        ? { background: "linear-gradient(90deg,#00d4ff,#00b8e0)", border: "1px solid #00d4ff", color: "#000", fontSize: "11px", letterSpacing: "2px", boxShadow: "0 4px 16px rgba(0,212,255,0.25)" }
                        : { background: "#111", border: "1px solid #1f1f1f", color: "#3a3a3a", fontSize: "11px", letterSpacing: "2px" }
                    }
                    onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.borderColor = "rgba(0,212,255,0.25)"; e.currentTarget.style.color = "#00d4ff"; e.currentTarget.style.background = "rgba(0,212,255,0.05)"; } }}
                    onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.borderColor = "#1f1f1f"; e.currentTarget.style.color = "#3a3a3a"; e.currentTarget.style.background = "#111"; } }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: isActive ? "rgba(0,0,0,0.5)" : "#2a2a2a" }} />
                    {muscle.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* EXERCISES GRID */}
        {selectedMuscle && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(245,200,66,0.1)", border: "1px solid rgba(245,200,66,0.15)" }}>
                <Dumbbell className="w-4 h-4" style={{ color: "#f5c842" }} />
              </div>
              <span className="font-black uppercase" style={{ fontSize: "11px", letterSpacing: "4px", color: "#3a3a3a", fontFamily: "'Barlow Condensed',sans-serif" }}>
                Exercises
              </span>
              <span className="flex-1 h-px" style={{ background: "linear-gradient(90deg,#1f1f1f,transparent)" }} />
            </div>

            {/* Loading skeleton */}
            {loading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-2xl overflow-hidden" style={{ background: "#0d0d0d", border: "1px solid #161616" }}>
                    <div className="w-full h-52 relative overflow-hidden" style={{ background: "#111" }}>
                      <div className="absolute inset-0" style={{ background: "linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.03) 50%,transparent 100%)", animation: "shimmer 1.5s infinite" }} />
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="h-4 rounded-lg" style={{ background: "#161616", width: "70%" }} />
                      <div className="h-3 rounded-lg" style={{ background: "#111", width: "45%" }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : exercises.length === 0 ? (
              <div className="rounded-2xl p-12 flex flex-col items-center justify-center gap-4" style={{ background: "#0a0a0a", border: "1.5px dashed #1a1a1a" }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255,77,0,0.07)", border: "1px solid rgba(255,77,0,0.12)" }}>
                  <Dumbbell className="w-6 h-6" style={{ color: "#ff4d00", opacity: 0.5 }} />
                </div>
                <div className="text-center">
                  <p className="font-black uppercase" style={{ fontSize: "13px", letterSpacing: "3px", color: "#2a2a2a" }}>No Exercises Found</p>
                  <p className="font-bold uppercase mt-1" style={{ fontSize: "10px", letterSpacing: "2px", color: "#1f1f1f" }}>Add exercises to this muscle group</p>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {exercises.map((exercise) => (
                  <div
                    key={exercise.exerciseid}
                    className="rounded-2xl overflow-hidden transition-all duration-300 group relative"
                    style={{ background: "#0d0d0d", border: "1px solid #1a1a1a" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,77,0,0.2)";
                      e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.5)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#1a1a1a";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    {/* Video */}
                    <div className="relative overflow-hidden" style={{ height: "220px" }}>
                      <video
                        src={exercise.videoUrl}
                        controls
                        className="w-full h-full object-cover"
                        style={{ background: "#000" }}
                      />
                      <div className="absolute inset-x-0 top-0 h-8 pointer-events-none" style={{ background: "linear-gradient(180deg,rgba(0,0,0,0.5) 0%,transparent 100%)" }} />

                      {/* Delete button — top-right on video */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteModal({ exerciseId: exercise.exerciseid, exerciseName: exercise.exerciseName });
                        }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                        style={{ background: "rgba(220,30,30,0.85)", border: "1px solid rgba(255,60,60,0.4)", backdropFilter: "blur(6px)" }}
                        title="Delete Exercise"
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#dc1e1e"; e.currentTarget.style.boxShadow = "0 0 14px rgba(220,30,30,0.5)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(220,30,30,0.85)"; e.currentTarget.style.boxShadow = "none"; }}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>

                    {/* Card body */}
                    <div className="p-4" style={{ borderTop: "1px solid #161616" }}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,77,0,0.1)", border: "1px solid rgba(255,77,0,0.14)" }}>
                            <PlayCircle className="w-3.5 h-3.5" style={{ color: "#ff4d00" }} />
                          </div>
                          <h3 className="font-black uppercase truncate" style={{ fontSize: "13px", letterSpacing: "1px", color: "#ddd", fontFamily: "'Barlow Condensed',sans-serif" }}>
                            {exercise.exerciseName}
                          </h3>
                        </div>
                        <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#2a2a2a" }} />
                      </div>

                      {/* Bottom row: ID tag + delete button */}
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg font-black uppercase" style={{ fontSize: "9px", letterSpacing: "2px", background: "#111", border: "1px solid #1f1f1f", color: "#2e2e2e" }}>
                            ID
                          </span>
                          <span className="font-bold" style={{ fontSize: "10px", letterSpacing: "1px", color: "#2a2a2a", fontFamily: "monospace" }}>
                            {exercise.exerciseid}
                          </span>
                        </div>

                        {/* Delete text button */}
                        <button
                          onClick={() => setDeleteModal({ exerciseId: exercise.exerciseid, exerciseName: exercise.exerciseName })}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-black uppercase transition-all duration-200"
                          style={{ background: "rgba(220,30,30,0.07)", border: "1px solid rgba(220,30,30,0.12)", color: "#5a1a1a", fontSize: "9px", letterSpacing: "2px" }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(220,30,30,0.15)"; e.currentTarget.style.borderColor = "rgba(220,30,30,0.3)"; e.currentTarget.style.color = "#ff4444"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(220,30,30,0.07)"; e.currentTarget.style.borderColor = "rgba(220,30,30,0.12)"; e.currentTarget.style.color = "#5a1a1a"; }}
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ════════════════════════════
          DELETE CONFIRM MODAL
      ════════════════════════════ */}
      {deleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}
          onClick={() => { if (!deleting) setDeleteModal(null); }}
        >
          <div
            className="w-full max-w-sm rounded-2xl overflow-hidden relative"
            style={{ background: "#0d0d0d", border: "1px solid #1f1f1f", boxShadow: "0 32px 80px rgba(0,0,0,0.9)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal accent bar — red */}
            <div className="h-[3px]" style={{ background: "linear-gradient(90deg,#dc1e1e,#ff4444,#ff7730)" }} />

            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #161616" }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(220,30,30,0.12)", border: "1px solid rgba(220,30,30,0.2)" }}>
                  <AlertTriangle className="w-4 h-4" style={{ color: "#ff4444" }} />
                </div>
                <span className="font-black uppercase" style={{ fontSize: "13px", letterSpacing: "2px", color: "#ccc", fontFamily: "'Barlow Condensed',sans-serif" }}>
                  Confirm Delete
                </span>
              </div>
              <button
                onClick={() => { if (!deleting) setDeleteModal(null); }}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: "#161616", border: "1px solid #222", color: "#444" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#888"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#444"; }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-5 py-6">
              <p className="font-bold uppercase text-center" style={{ fontSize: "11px", letterSpacing: "2px", color: "#3a3a3a" }}>
                You are about to permanently delete
              </p>
              <p
                className="font-black uppercase text-center mt-2"
                style={{ fontSize: "17px", letterSpacing: "2px", color: "#ff4444", fontFamily: "'Barlow Condensed',sans-serif" }}
              >
                {deleteModal.exerciseName}
              </p>
              <p className="font-bold text-center mt-3" style={{ fontSize: "11px", letterSpacing: "1px", color: "#282828" }}>
                This action cannot be undone. The exercise and its video asset will be permanently removed.
              </p>
            </div>

            {/* Modal actions */}
            <div className="flex gap-3 px-5 pb-5">
              <button
                onClick={() => setDeleteModal(null)}
                disabled={deleting}
                className="flex-1 py-3 rounded-xl font-black uppercase transition-all duration-200"
                style={{ background: "#111", border: "1px solid #1f1f1f", color: "#3a3a3a", fontSize: "11px", letterSpacing: "2px" }}
                onMouseEnter={(e) => { if (!deleting) { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.color = "#777"; } }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1f1f1f"; e.currentTarget.style.color = "#3a3a3a"; }}
              >
                Cancel
              </button>
              <button
                onClick={deleteExercise}
                disabled={deleting}
                className="flex-1 py-3 rounded-xl font-black uppercase transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  background: deleting ? "#1a0a0a" : "linear-gradient(90deg,#dc1e1e,#ff3c3c)",
                  border: deleting ? "1px solid #2a0a0a" : "1px solid rgba(220,30,30,0.5)",
                  color: deleting ? "#5a1a1a" : "#fff",
                  fontSize: "11px",
                  letterSpacing: "2px",
                  boxShadow: deleting ? "none" : "0 4px 16px rgba(220,30,30,0.25)",
                  cursor: deleting ? "not-allowed" : "pointer",
                }}
              >
                {deleting ? (
                  <>
                    <span
                      className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent animate-spin flex-shrink-0"
                      style={{ borderColor: "#5a1a1a", borderTopColor: "transparent" }}
                    />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}