"use client";

import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Dumbbell,
  Upload,
  FolderPlus,
  ChevronRight,
  Activity,
  Cpu,
  Target,
  PlayCircle,
  X,
  Check,
  Flame,
  Zap,
} from "lucide-react";

export default function AddExercise() {
  const [loading, setLoading] = useState(false);
  const [bodyParts, setBodyParts] = useState([]);
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState(null);
  const [exerciseName, setExerciseName] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const [newBodyPart, setNewBodyPart] = useState("");
  const [newMuscleGroup, setNewMuscleGroup] = useState("");
  const [isAddingPart, setIsAddingPart] = useState(false);
  const [isAddingMuscle, setIsAddingMuscle] = useState(false);
  const [movementPattern, setMovementPattern] = useState("");

  const fileInputRef = useRef(null);
const API_URL =
  process.env.NEXT_PUBLIC_BASE_URL;
  useEffect(() => {
    fetchBodyParts();
  }, []);

  const fetchBodyParts = async () => {
    try {
      const gym = JSON.parse(localStorage.getItem("gym"));
      if (!gym?.docId) return;
      const res = await fetch(`${API_URL}/api/exercise/bodyparts/${gym.docId}`);
      const data = await res.json();
      if (data.success) setBodyParts(data.bodyParts);
    } catch (error) {
      console.error("Fetch bodyparts issue:", error);
    }
  };

  const fetchMuscles = async (bodyPartId) => {
    try {
      const gym = JSON.parse(localStorage.getItem("gym"));
      if (!gym?.docId) return;
      const res = await fetch(`${API_URL}/api/exercise/musclegroups/${gym.docId}/${bodyPartId}`);
      const data = await res.json();
      if (data.success) setMuscleGroups(data.muscles);
    } catch (error) {
      console.error("Fetch muscles issue:", error);
    }
  };

  const addBodyPart = async () => {
    const trimmed = newBodyPart.trim();
    if (!trimmed) return toast.error("Enter body part");
    try {
      const gym = JSON.parse(localStorage.getItem("gym"));
      const res = await fetch(`${API_URL}/api/exercise/add-bodypart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gymDocId: gym.docId, name: trimmed }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Body Part Added");
        setNewBodyPart("");
        setIsAddingPart(false);
        fetchBodyParts();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addMuscleGroup = async () => {
    if (!selectedBodyPart) return toast.error("Select body part");
    const trimmed = newMuscleGroup.trim();
    if (!trimmed) return toast.error("Enter muscle group");
    try {
      const gym = JSON.parse(localStorage.getItem("gym"));
      const res = await fetch(`${API_URL}/api/exercise/add-musclegroup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gymDocId: gym.docId,
          bodyPartId: selectedBodyPart.bodypartid,
          name: trimmed,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Muscle Added");
        setNewMuscleGroup("");
        setIsAddingMuscle(false);
        fetchMuscles(selectedBodyPart.bodypartid);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const processVideoFile = (file) => {
    if (!file.type.startsWith("video/")) {
      toast.error("Invalid node format. Upload video content only.");
      return;
    }
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
    toast.success("Kinetic Stream Cached");
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processVideoFile(file);
  };

  const saveExercise = async () => {
    if (!selectedBodyPart) return toast.error("Select Body Part");
    if (!selectedMuscleGroup) return toast.error("Select Muscle Group");
    if (!exerciseName.trim()) return toast.error("Enter Exercise Name");
    if (!videoFile) return toast.error("Upload Video");
    try {
      setLoading(true);
      const gym = JSON.parse(localStorage.getItem("gym"));
      const formData = new FormData();
      formData.append("gymDocId", gym.docId);
      formData.append("bodyPartId", selectedBodyPart.bodypartid);
      formData.append("muscleGroupId", selectedMuscleGroup.musclegroupid);
      formData.append("exerciseName", exerciseName.trim());
      formData.append(
  "movementPattern",
  movementPattern
);
      formData.append("video", videoFile);
      const res = await fetch(`${API_URL}/api/exercise/add-exercise`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Exercise Added");
        setExerciseName("");
        setVideoFile(null);
        setVideoPreview("");
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto my-6 rounded-2xl overflow-hidden relative"
      style={{ background: "#080808", border: "1px solid #1c1c1c", boxShadow: "0 32px 80px rgba(0,0,0,0.8)" }}
    >
      {/* Diagonal crosshatch texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg,rgba(255,77,0,0.012) 0,rgba(255,77,0,0.012) 1px,transparent 0,transparent 50%),repeating-linear-gradient(-45deg,rgba(255,77,0,0.012) 0,rgba(255,77,0,0.012) 1px,transparent 0,transparent 50%)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* Top flame accent bar */}
      <div
        className="h-[3px] w-full relative z-10 flex-shrink-0"
        style={{ background: "linear-gradient(90deg,#ff4d00 0%,#ff7730 45%,#f5c842 100%)" }}
      />

      {/* ── GLOBAL HEADER ── */}
      <div
        className="flex items-center justify-between px-6 py-4 relative z-10 flex-shrink-0"
        style={{ background: "linear-gradient(180deg,#0e0e0e 0%,#080808 100%)", borderBottom: "1px solid #161616" }}
      >
        <div className="flex items-center gap-4">
          {/* Logo badge */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#ff4d00,#ff7730)", boxShadow: "0 0 20px rgba(255,77,0,0.35)" }}
          >
            💪
          </div>
          <div>
            <h1
              className="text-white font-black uppercase tracking-[3px] text-xl leading-none"
              style={{ fontFamily: "'Barlow Condensed', 'Bebas Neue', sans-serif" }}
            >
              Routine Schematic Engine
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[3px] mt-1" style={{ color: "#333" }}>
              Compile routine parameters &amp; data assets
            </p>
          </div>
        </div>

        {/* Status pill */}
        <div
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full flex-shrink-0"
          style={{ background: "#111", border: "1px solid #1f1f1f" }}
        >
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{
              background: loading ? "#f5c842" : "#a8e63d",
              boxShadow: loading ? "0 0 8px #f5c842" : "0 0 8px rgba(168,230,61,0.7)",
              animation: "pulse 2s infinite",
            }}
          />
          <span className="font-bold text-[11px] uppercase tracking-[2px]" style={{ color: "#444" }}>
            {loading ? "Syncing" : "Ready"}
          </span>
        </div>
      </div>

      {/* ── THREE-COLUMN LAYOUT ── */}
      <div className="flex flex-col lg:flex-row relative z-10" style={{ minHeight: "680px" }}>

        {/* ═══════════════════════════════════════════
            LEFT PANEL — BODY PARTS
        ═══════════════════════════════════════════ */}
        <div
          className="w-full lg:w-[220px] flex flex-col flex-shrink-0"
          style={{ borderRight: "1px solid #161616", borderBottom: "1px solid #161616" }}
        >
          {/* Panel header */}
          <div
            className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
            style={{ borderBottom: "1px solid #161616", background: "rgba(0,0,0,0.3)" }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,77,0,0.12)", border: "1px solid rgba(255,77,0,0.15)" }}
            >
              <Activity className="w-3.5 h-3.5" style={{ color: "#ff4d00" }} />
            </div>
            <span className="font-black text-[10px] uppercase tracking-[3px]" style={{ color: "#383838" }}>
              Body Part
            </span>
          </div>

          {/* Scrollable list */}
          <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-1.5" style={{ scrollbarWidth: "none" }}>
            {bodyParts.length === 0 && (
              <p className="text-center text-[11px] font-bold uppercase tracking-widest py-10" style={{ color: "#252525" }}>
                No parts yet
              </p>
            )}
            {bodyParts.map((part) => {
              const isActive = selectedBodyPart?.bodypartid === part.bodypartid;
              return (
                <button
                  key={part.bodypartid}
                  onClick={() => {
                    setSelectedBodyPart(part);
                    setSelectedMuscleGroup(null);
                    setIsAddingMuscle(false);
                    fetchMuscles(part.bodypartid);
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-sm uppercase tracking-wide transition-all duration-200 text-left"
                  style={
                    isActive
                      ? {
                          background: "linear-gradient(90deg,rgba(255,77,0,0.13) 0%,transparent 100%)",
                          border: "1px solid rgba(255,77,0,0.22)",
                          color: "#ff4d00",
                        }
                      : {
                          background: "transparent",
                          border: "1px solid transparent",
                          color: "#3a3a3a",
                        }
                  }
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#888";
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#3a3a3a";
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-200"
                      style={{
                        background: isActive ? "#ff4d00" : "transparent",
                        boxShadow: isActive ? "0 0 6px #ff4d00" : "none",
                        border: isActive ? "none" : "1px solid #2a2a2a",
                      }}
                    />
                    <span style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.5px" }}>
                      {part.name}
                    </span>
                  </div>
                  <ChevronRight
                    size={13}
                    style={{ color: isActive ? "#ff4d00" : "#252525", flexShrink: 0 }}
                  />
                </button>
              );
            })}
          </div>

          {/* Add body part footer */}
          <div className="p-3 flex-shrink-0" style={{ borderTop: "1px solid #161616" }}>
            <AnimatePresence mode="wait">
              {!isAddingPart ? (
                <motion.button
                  key="add-btn"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  onClick={() => setIsAddingPart(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[2px] transition-all duration-200"
                  style={{ border: "1.5px dashed #222", background: "transparent", color: "#2e2e2e" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,77,0,0.4)";
                    e.currentTarget.style.color = "#ff4d00";
                    e.currentTarget.style.background = "rgba(255,77,0,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#222";
                    e.currentTarget.style.color = "#2e2e2e";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Body Part</span>
                </motion.button>
              ) : (
                <motion.div
                  key="add-input"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="flex items-center gap-1.5 p-2 rounded-xl"
                  style={{ background: "#0f0f0f", border: "1px solid rgba(255,77,0,0.2)" }}
                >
                  <input
                    type="text"
                    autoFocus
                    placeholder="e.g., Back"
                    value={newBodyPart}
                    onChange={(e) => setNewBodyPart(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addBodyPart()}
                    className="flex-1 min-w-0 text-xs font-medium text-white outline-none px-2.5 py-1.5 rounded-lg"
                    style={{
                      background: "#161616",
                      border: "1px solid #222",
                      color: "#fff",
                      fontFamily: "inherit",
                    }}
                  />
                  <button
                    onClick={() => { setIsAddingPart(false); setNewBodyPart(""); }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{ background: "#161616", border: "1px solid #222", color: "#444" }}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={addBodyPart}
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
                    style={{ background: "#ff4d00", color: "#fff" }}
                  >
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            MIDDLE PANEL — MUSCLE GROUPS
        ═══════════════════════════════════════════ */}
        <div
          className="w-full lg:w-[240px] flex flex-col flex-shrink-0"
          style={{ borderRight: "1px solid #161616", borderBottom: "1px solid #161616" }}
        >
          {/* Panel header */}
          <div
            className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{ borderBottom: "1px solid #161616", background: "rgba(0,0,0,0.3)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.12)" }}
              >
                <Target className="w-3.5 h-3.5" style={{ color: "#00d4ff" }} />
              </div>
              <span className="font-black text-[10px] uppercase tracking-[3px]" style={{ color: "#383838" }}>
                Muscle Group
              </span>
            </div>
            {selectedBodyPart && (
              <span
                className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded"
                style={{ background: "#111", border: "1px solid #1f1f1f", color: "#ff4d00" }}
              >
                {selectedBodyPart.name}
              </span>
            )}
          </div>

          {/* Scrollable muscle list */}
          <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-1.5" style={{ scrollbarWidth: "none" }}>
            {!selectedBodyPart ? (
              <p className="text-center text-[11px] font-bold uppercase tracking-widest py-12 px-4 leading-relaxed" style={{ color: "#252525" }}>
                Select a body part first
              </p>
            ) : muscleGroups.length === 0 ? (
              <p className="text-center text-[11px] font-bold uppercase tracking-widest py-10" style={{ color: "#252525" }}>
                No muscles yet
              </p>
            ) : (
              muscleGroups.map((muscle) => {
                const isSelected = selectedMuscleGroup?.musclegroupid === muscle.musclegroupid;
                return (
                  <button
                    key={muscle.musclegroupid}
                    onClick={() => setSelectedMuscleGroup(muscle)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-sm uppercase tracking-wide transition-all duration-200 text-left"
                    style={
                      isSelected
                        ? {
                            background: "linear-gradient(90deg,rgba(0,212,255,0.1) 0%,transparent 100%)",
                            border: "1px solid rgba(0,212,255,0.18)",
                            color: "#00d4ff",
                          }
                        : {
                            background: "transparent",
                            border: "1px solid transparent",
                            color: "#3a3a3a",
                          }
                    }
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.color = "#888";
                        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.color = "#3a3a3a";
                        e.currentTarget.style.background = "transparent";
                      }
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{
                          background: isSelected ? "#00d4ff" : "transparent",
                          boxShadow: isSelected ? "0 0 6px #00d4ff" : "none",
                          border: isSelected ? "none" : "1px solid #2a2a2a",
                        }}
                      />
                      <span style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.5px" }}>
                        {muscle.name}
                      </span>
                    </div>
                    <ChevronRight size={13} style={{ color: isSelected ? "#00d4ff" : "#252525", flexShrink: 0 }} />
                  </button>
                );
              })
            )}
          </div>

          {/* Add muscle footer */}
          {selectedBodyPart && (
            <div className="p-3 flex-shrink-0" style={{ borderTop: "1px solid #161616" }}>
              <AnimatePresence mode="wait">
                {!isAddingMuscle ? (
                  <motion.button
                    key="muscle-add-btn"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    onClick={() => setIsAddingMuscle(true)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[2px] transition-all duration-200"
                    style={{ border: "1.5px dashed #222", background: "transparent", color: "#2e2e2e" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(0,212,255,0.3)";
                      e.currentTarget.style.color = "#00d4ff";
                      e.currentTarget.style.background = "rgba(0,212,255,0.04)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#222";
                      e.currentTarget.style.color = "#2e2e2e";
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    <span>Add Muscle</span>
                  </motion.button>
                ) : (
                  <motion.div
                    key="muscle-add-input"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="flex items-center gap-1.5 p-2 rounded-xl"
                    style={{ background: "#0f0f0f", border: "1px solid rgba(0,212,255,0.15)" }}
                  >
                    <input
                      type="text"
                      autoFocus
                      placeholder="e.g., Upper Lats"
                      value={newMuscleGroup}
                      onChange={(e) => setNewMuscleGroup(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addMuscleGroup()}
                      className="flex-1 min-w-0 text-xs font-medium text-white outline-none px-2.5 py-1.5 rounded-lg"
                      style={{ background: "#161616", border: "1px solid #222", fontFamily: "inherit" }}
                    />
                    <button
                      onClick={() => { setIsAddingMuscle(false); setNewMuscleGroup(""); }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "#161616", border: "1px solid #222", color: "#444" }}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={addMuscleGroup}
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "#00d4ff", color: "#000" }}
                    >
                      <Check className="w-3.5 h-3.5" strokeWidth={3} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════
            RIGHT PANEL — MAIN FORM
        ═══════════════════════════════════════════ */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Right panel scrollable content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-7" style={{ scrollbarWidth: "none" }}>

            {/* Breadcrumb track */}
            <div
              className="flex flex-wrap items-center gap-2 px-4 py-3 rounded-xl"
              style={{ background: "#0d0d0d", border: "1px solid #1a1a1a" }}
            >
              <span
                className="px-2.5 py-1 rounded-lg font-black text-[9px] uppercase tracking-[2px]"
                style={{ background: "#111", border: "1px solid #1f1f1f", color: "#2e2e2e" }}
              >
                Track
              </span>
              <span
                className="font-black text-[11px] uppercase tracking-wider"
                style={{ color: selectedBodyPart ? "#ff4d00" : "#282828" }}
              >
                {selectedBodyPart ? selectedBodyPart.name : "— Select Part"}
              </span>
              <ChevronRight size={11} style={{ color: "#222" }} />
              <span
                className="font-black text-[11px] uppercase tracking-wider"
                style={{ color: selectedMuscleGroup ? "#00d4ff" : "#282828" }}
              >
                {selectedMuscleGroup ? selectedMuscleGroup.name : "— Select Muscle"}
              </span>
            </div>

            {/* Exercise name input */}
            <div>
              <label
                className="flex items-center gap-3 mb-3 font-black text-[10px] uppercase tracking-[3px]"
                style={{ color: "#333" }}
              >
                Exercise Name
                <span className="flex-1 h-px" style={{ background: "linear-gradient(90deg,#1f1f1f,transparent)" }} />
              </label>
              <div className="relative group">
                <Dumbbell
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200"
                  style={{ color: "#2a2a2a" }}
                />
                <input
                  type="text"
                  value={exerciseName}
                  onChange={(e) => setExerciseName(e.target.value)}
                  placeholder="e.g., Incline Dumbbell Press"
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-white font-semibold text-sm tracking-wide transition-all duration-200 outline-none"
                  style={{
                    background: "#0d0d0d",
                    border: "1px solid #1a1a1a",
                    color: "#fff",
                    fontFamily: "inherit",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(0,212,255,0.3)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,212,255,0.05)";
                    e.currentTarget.previousSibling.style.color = "#00d4ff";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#1a1a1a";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.previousSibling.style.color = "#2a2a2a";
                  }}
                />
              </div>
            </div>
                  <div>
  <label
    className="flex items-center gap-3 mb-3 font-black text-[10px] uppercase tracking-[3px]"
    style={{ color: "#333" }}
  >
    Movement Pattern
    <span
      className="flex-1 h-px"
      style={{
        background:
          "linear-gradient(90deg,#1f1f1f,transparent)",
      }}
    />
  </label>

  <select
    value={movementPattern}
    onChange={(e) =>
      setMovementPattern(e.target.value)
    }
    className="w-full px-4 py-4 rounded-xl text-white font-semibold text-sm tracking-wide outline-none"
    style={{
      background: "#0d0d0d",
      border: "1px solid #1a1a1a",
      color: "#fff",
    }}
  >
    <option value="">
      Select Movement Pattern
    </option>

    <option value="Press Horizontal">Press Horizontal</option>
    <option value="Press Vertical">Press Vertical</option>
    <option value="Pull Horizontal">Pull Horizontal</option>
    <option value="Pull Vertical">Pull Vertical</option>
    <option value="Curl">Curl</option>
    <option value="Tricep">Tricep</option>
    <option value="Squat">Squat</option>
    <option value="Lunge">Lunge</option>
     <option value="Hinge">Hinge</option>
      <option value="Core">Lunge</option>
       
  </select>
</div>
            {/* Video section */}
            <div>
              <label
                className="flex items-center gap-3 mb-3 font-black text-[10px] uppercase tracking-[3px]"
                style={{ color: "#333" }}
              >
                Kinetic Mapping Video
                <span className="flex-1 h-px" style={{ background: "linear-gradient(90deg,#1f1f1f,transparent)" }} />
              </label>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {/* Drop zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="h-52 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300 relative overflow-hidden group"
                  style={{
                    background: isDragging ? "rgba(255,77,0,0.06)" : "#0d0d0d",
                    border: isDragging ? "2px dashed #ff4d00" : "2px dashed #1f1f1f",
                    transform: isDragging ? "scale(0.99)" : "scale(1)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isDragging) {
                      e.currentTarget.style.borderColor = "rgba(255,77,0,0.35)";
                      e.currentTarget.style.background = "rgba(255,77,0,0.03)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isDragging) {
                      e.currentTarget.style.borderColor = "#1f1f1f";
                      e.currentTarget.style.background = "#0d0d0d";
                    }
                  }}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) processVideoFile(file);
                    }}
                    className="hidden"
                  />
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-200 group-hover:-translate-y-1"
                    style={{ background: "rgba(255,77,0,0.1)", border: "1px solid rgba(255,77,0,0.15)" }}
                  >
                    <Upload className="w-5 h-5" style={{ color: "#ff4d00" }} />
                  </div>
                  <div className="text-center">
                    <p className="font-black text-sm uppercase tracking-wider" style={{ color: "#ccc" }}>
                      Drop Kinetic Payload
                    </p>
                    <p className="font-bold text-[10px] uppercase tracking-[2px] mt-1" style={{ color: "#2e2e2e" }}>
                      Video formats only
                    </p>
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-[2px] transition-all duration-200 group-hover:text-white"
                    style={{ background: "transparent", border: "1px solid #222", color: "#333" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#ff4d00";
                      e.currentTarget.style.borderColor = "#ff4d00";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = "#222";
                    }}
                  >
                    Select File
                  </button>
                </div>

                {/* Video preview */}
                <div
                  className="h-52 rounded-2xl overflow-hidden flex items-center justify-center relative"
                  style={{ background: "#0a0a0a", border: "1px solid #1a1a1a" }}
                >
                  {videoPreview ? (
                    <video
                      src={videoPreview}
                      className="w-full h-full object-cover"
                      controls
                      muted
                      playsInline
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3" style={{ color: "#1f1f1f" }}>
                      <PlayCircle className="w-12 h-12" style={{ color: "#1a1a1a" }} />
                      <span className="font-black text-[10px] uppercase tracking-[2px]" style={{ color: "#242424" }}>
                        Awaiting Video Feed
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── SUBMIT BUTTON ── */}
          <div
            className="p-5 flex-shrink-0"
            style={{ borderTop: "1px solid #161616", background: "rgba(0,0,0,0.4)" }}
          >
            <motion.button
              whileHover={!loading ? { scale: 1.01, boxShadow: "0 8px 40px rgba(255,77,0,0.3)" } : {}}
              whileTap={!loading ? { scale: 0.99 } : {}}
              onClick={saveExercise}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-black uppercase transition-all duration-300 relative overflow-hidden"
              style={{
                background: loading
                  ? "#1a1a1a"
                  : "linear-gradient(90deg, #ff4d00 0%, #ff7730 50%, #f5c842 100%)",
                color: loading ? "#333" : "#fff",
                letterSpacing: "4px",
                fontSize: "16px",
                fontFamily: "'Barlow Condensed', sans-serif",
                cursor: loading ? "not-allowed" : "pointer",
                border: loading ? "1px solid #222" : "none",
              }}
            >
              {/* Shimmer overlay */}
              {!loading && (
                <span
                  className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: "linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.12) 50%,transparent 100%)",
                    transform: "skewX(-20deg)",
                  }}
                />
              )}
              {loading ? (
                <>
                  <Cpu className="w-5 h-5 animate-spin" />
                  <span>Streaming Payload Matrix...</span>
                </>
              ) : (
                <>
                  <span>Deploy Routine To Core Cluster</span>
                  <Flame className="w-5 h-5 fill-white" />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Pulse animation keyframe via style tag */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        input::placeholder { color: #282828; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}