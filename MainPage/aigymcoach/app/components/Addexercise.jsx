"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, ChevronRight, Upload, PlayCircle, Target, Activity, Cpu, Flame, Plus, Check, X } from "lucide-react";
import toast from "react-hot-toast";

export default function AddExercise() {
  const [selectedPart, setSelectedPart] = useState("Chest");
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [exerciseName, setExerciseName] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  
  // Custom states for custom muscle group entry fields
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customMuscleName, setCustomMuscleName] = useState("");

  // Custom states for adding custom structural body parts
  const [isAddingCustomPart, setIsAddingCustomPart] = useState(false);
  const [customPartName, setCustomPartName] = useState("");

  const fileInputRef = useRef(null);

  // Core state matrix tracking structural layout keys
  const [bodyParts, setBodyParts] = useState({
    Chest: ["Upper Chest", "Middle Chest", "Lower Chest"],
    Back: ["Lats", "Upper Back", "Lower Back", "Traps"],
    Shoulders: ["Front Delts", "Side Delts", "Rear Delts"],
    Biceps: ["Long Head", "Short Head", "Brachialis"],
    Triceps: ["Long Head", "Lateral Head", "Medial Head"],
    Forearms: ["Flexors", "Extensors", "Brachioradialis"],
    Legs: ["Quadriceps", "Hamstrings", "Glutes", "Calves", "Adductors"],
    Abs: ["Upper Abs", "Lower Abs", "Obliques", "Serratus"],
  });

  // --- Inject Custom Structural Body Part Node ---
  const handleAddCustomPart = () => {
    const trimmed = customPartName.trim();
    if (!trimmed) return toast.error("Body part string parameter missing");

    // Format string to standard uppercase label formatting
    const formattedPart = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);

    if (bodyParts[formattedPart]) {
      return toast.error("Structural track key already declared");
    }

    setBodyParts(prev => ({
      ...prev,
      [formattedPart]: [] // Initialize with a fresh clean tracking target array
    }));

    setSelectedPart(formattedPart);
    setSelectedMuscle("");
    setCustomPartName("");
    setIsAddingCustomPart(false);
    toast.success(`${formattedPart} Cluster Initialized`);
  };

  // --- Inject Custom Muscle Node ---
  const handleAddCustomMuscle = () => {
    const trimmed = customMuscleName.trim();
    if (!trimmed) return toast.error("Moniker value string empty");
    
    if (bodyParts[selectedPart].some(m => m.toLowerCase() === trimmed.toLowerCase())) {
      return toast.error("Muscle footprint already present in this track");
    }

    setBodyParts(prev => ({
      ...prev,
      [selectedPart]: [...prev[selectedPart], trimmed]
    }));

    setSelectedMuscle(trimmed);
    setCustomMuscleName("");
    setIsAddingCustom(false);
    toast.success("New Matrix Muscle Target Bound");
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processVideoFile(file);
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

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processVideoFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!exerciseName.trim()) return toast.error("Provide routine schematic moniker");
    if (!videoFile) return toast.error("Initialize kinetic mapping video asset");
    
    toast.success("Routine Profile Bound & Saved!");
  };

  return (
    <div className="w-full max-w-5xl bg-zinc-900/40 border border-zinc-800/80 rounded-2xl overflow-hidden backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />

      {/* =========================================================================
          LEFT NAVIGATION PANEL: BIOMETRIC BODY TARGETS
          ========================================================================= */}
      <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-zinc-800/80 bg-zinc-950/40 relative z-10 flex flex-col shrink-0 h-auto md:h-[690px]">
        <div className="p-5 border-b border-zinc-800/60 flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <h2 className="text-zinc-400 font-mono text-xs font-black uppercase tracking-widest">Kinetic Part Vector</h2>
        </div>

        {/* Dynamic Nav Core Stack Container */}
        <div className="p-3 overflow-y-auto no-scrollbar flex-1 flex flex-col justify-between gap-4">
          <div className="space-y-1.5">
            {Object.keys(bodyParts).map((part) => {
              const isActive = selectedPart === part;
              return (
                <button
                  key={part}
                  onClick={() => {
                    setSelectedPart(part);
                    setSelectedMuscle("");
                    setIsAddingCustom(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl font-medium text-sm tracking-wide transition-all duration-200 group ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500/10 via-cyan-500/5 to-transparent border border-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.05)]"
                      : "border border-transparent text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/30"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-1 h-1 rounded-full bg-cyan-400 transition-transform ${isActive ? "scale-100" : "scale-0 group-hover:scale-100"}`} />
                    <span>{part}</span>
                  </div>
                  <ChevronRight size={14} className={`transition-transform duration-200 ${isActive ? "text-cyan-400 translate-x-0.5" : "text-zinc-700 group-hover:text-zinc-400"}`} />
                </button>
              );
            })}
          </div>

          {/* INLINE BODY PART ADDITION ACTION BUTTON NODE */}
          <div className="pt-2 border-t border-zinc-900/60">
            <AnimatePresence mode="wait">
              {!isAddingCustomPart ? (
                <motion.button
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  onClick={() => setIsAddingCustomPart(true)}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-zinc-800/80 hover:border-cyan-500/30 bg-zinc-950/20 hover:bg-cyan-500/5 text-zinc-500 hover:text-cyan-400 font-mono text-[10px] font-bold uppercase tracking-widest transition-all duration-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Body Part</span>
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="p-2 rounded-xl border border-cyan-500/20 bg-zinc-950 flex items-center gap-1.5"
                >
                  <input
                    type="text"
                    autoFocus
                    placeholder="e.g., Cardio"
                    value={customPartName}
                    onChange={(e) => setCustomPartName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddCustomPart()}
                    className="w-full bg-zinc-900 border border-zinc-800/80 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-700 outline-none focus:border-cyan-500/40 font-medium"
                  />
                  <button
                    onClick={() => { setIsAddingCustomPart(false); setCustomPartName(""); }}
                    className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800/80 text-zinc-500 hover:text-zinc-300 transition-colors shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleAddCustomPart}
                    className="p-1.5 rounded-md bg-cyan-500 text-zinc-950 hover:bg-cyan-400 transition-colors flex items-center justify-center shrink-0"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* =========================================================================
          RIGHT MAIN PANEL: SCHEMATIC MATRIX FORM
          ========================================================================= */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto no-scrollbar h-auto md:h-[690px] relative z-10 flex flex-col justify-between">
        <div>
          {/* Header Track Indicator */}
          <div className="flex items-center justify-between border-b border-zinc-800/60 pb-5 mb-6">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 bg-gradient-to-br from-zinc-800 to-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-center text-cyan-400 font-bold uppercase tracking-tighter">
                {selectedPart.substring(0, 2)}
              </div>
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">
                  <span>{selectedPart} Engine</span>
                </h2>
                <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase mt-0.5">Isolate secondary kinetic targets</p>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center gap-1.5 bg-zinc-950/60 border border-zinc-800/80 px-3 py-1.5 rounded-lg font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
              <Cpu className="w-3 h-3 text-emerald-400" /> Array: Ready
            </div>
          </div>

          {/* MUSCLE GROUPS GRID SELECTION ARRAY */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {bodyParts[selectedPart]?.map((muscle, index) => {
              const isSelected = selectedMuscle === muscle;
              return (
                <button
                  key={index}
                  onClick={() => setSelectedMuscle(muscle)}
                  className={`text-left p-3.5 rounded-xl border relative transition-all duration-300 overflow-hidden group ${
                    isSelected
                      ? "border-cyan-500 bg-gradient-to-b from-cyan-950/20 to-zinc-950 text-cyan-400"
                      : "border-zinc-800/80 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700/80"
                  }`}
                >
                  <Target className={`w-4 h-4 mb-3 transition-transform ${isSelected ? "text-cyan-400 scale-110" : "text-zinc-600 group-hover:text-cyan-400"}`} />
                  <p className={`font-bold tracking-wide text-xs sm:text-sm ${isSelected ? "text-white" : "text-zinc-400 transition-colors group-hover:text-zinc-200"}`}>
                    {muscle}
                  </p>
                  {isSelected && <div className="absolute top-0 right-0 w-8 h-8 bg-cyan-500/5 blur-md rounded-full pointer-events-none" />}
                </button>
              );
            })}

            {/* DYNAMIC ACTION ENTRY ELEMENT MATRIX */}
            <AnimatePresence mode="wait">
              {!isAddingCustom ? (
                <motion.button
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => setIsAddingCustom(true)}
                  className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-dashed border-zinc-800 hover:border-emerald-500/40 bg-zinc-950/10 hover:bg-emerald-500/5 text-zinc-600 hover:text-emerald-400 transition-all duration-200 min-h-[98px]"
                >
                  <Plus className="w-5 h-5 mb-1.5" />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest">Add Muscle Group</span>
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-2.5 rounded-xl border border-emerald-500/30 bg-zinc-950/80 flex flex-col justify-between min-h-[98px]"
                >
                  <input
                    type="text"
                    autoFocus
                    placeholder="e.g., Lower Lats"
                    value={customMuscleName}
                    onChange={(e) => setCustomMuscleName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddCustomMuscle()}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-700 outline-none focus:border-emerald-500/50"
                  />
                  <div className="flex items-center gap-1.5 mt-2 justify-end">
                    <button
                      onClick={() => { setIsAddingCustom(false); setCustomMuscleName(""); }}
                      className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleAddCustomMuscle}
                      className="p-1.5 rounded-md bg-emerald-500 text-zinc-950 hover:bg-emerald-400 transition-colors flex items-center justify-center"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* EXERCISE SPECIFICATIONS TRACKING SUITE */}
          <AnimatePresence mode="wait">
            {selectedMuscle && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="mt-6 border-t border-zinc-800/60 pt-6 space-y-5"
              >
                <div className="flex flex-wrap items-center gap-2 bg-zinc-950/40 p-2 border border-zinc-800/50 rounded-xl max-w-max font-mono text-[10px] uppercase tracking-wider">
                  <div className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-md text-zinc-400">Target Node</div>
                  <span className="text-zinc-500">{selectedPart}</span>
                  <ChevronRight size={10} className="text-zinc-700" />
                  <span className="text-cyan-400 font-bold">{selectedMuscle}</span>
                </div>

                <div>
                  <label className="block mb-2 text-xs font-mono tracking-widest text-zinc-500 uppercase">Exercise Moniker / Title</label>
                  <div className="relative group">
                    <Dumbbell className="absolute left-3.5 top-[14px] h-4 w-4 text-zinc-600 group-focus-within:text-cyan-400 transition-colors" />
                    <input
                      type="text"
                      value={exerciseName}
                      onChange={(e) => setExerciseName(e.target.value)}
                      placeholder="e.g., Hack Squat Drop Set"
                      className="w-full pl-11 pr-4 py-3.5 bg-zinc-950/60 border border-zinc-800/80 rounded-xl text-white placeholder-zinc-700 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 transition text-sm font-medium tracking-wide"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-1">
                  <div>
                    <label className="block mb-2 text-xs font-mono tracking-widest text-zinc-500 uppercase">Kinetic Mapping Capture Video</label>
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col justify-center items-center h-52 group relative ${
                        isDragging ? "border-cyan-500 bg-cyan-500/5 scale-[0.99]" : "border-zinc-800 bg-zinc-950/30 hover:border-zinc-700 hover:bg-zinc-950/60"
                      }`}
                    >
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="video/*" className="hidden" />
                      <Upload className={`w-8 h-8 text-zinc-600 mb-3 group-hover:text-cyan-400 transition-colors ${isDragging && "text-cyan-400 animate-bounce"}`} />
                      <p className="text-zinc-200 text-xs font-bold uppercase tracking-wider">Drop Kinetic Payload</p>
                      <p className="text-[10px] text-zinc-500 font-mono mt-1">MP4, MOV OR AVI (MAX 50MB)</p>
                      <button type="button" className="mt-4 px-3.5 py-1.5 bg-zinc-900 group-hover:bg-cyan-500 text-zinc-400 group-hover:text-zinc-950 border border-zinc-800 group-hover:border-transparent rounded-lg font-mono text-[10px] uppercase font-bold tracking-wider transition-all">Select Stream File</button>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-xs font-mono tracking-widest text-zinc-500 uppercase">Telemetry Playback Monitor</label>
                    <div className="h-52 rounded-xl bg-zinc-950/80 border border-zinc-800/80 overflow-hidden relative flex items-center justify-center group">
                      {videoPreview ? (
                        <video src={videoPreview} className="w-full h-full object-cover" controls muted playsInline />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-zinc-700 text-center font-mono p-4">
                          <PlayCircle className="w-10 h-10 text-zinc-800 group-hover:text-zinc-700 transition-colors" />
                          <span className="text-[10px] uppercase tracking-widest">Awaiting Video Input Feed...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {selectedMuscle && (
          <div className="mt-8 pt-4 border-t border-zinc-800/40">
            <motion.button
              whileHover={{ scale: 1.01, boxShadow: "0 0 30px rgba(34,211,238,0.15)" }}
              whileTap={{ scale: 0.99 }}
              onClick={handleSubmit}
              className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-zinc-950 py-4 rounded-xl font-mono font-black uppercase tracking-widest text-sm transition-all duration-300"
            >
              <span>Deploy Routine To Core Cluster</span>
              <Flame className="w-4 h-4 fill-zinc-950" />
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}