"use client";

import { useEffect, useState } from "react";
import { 
  Dumbbell, 
  Target, 
  PlayCircle, 
  Flame, 
  TrendingUp, 
  Sparkles,
  ExternalLink
} from "lucide-react";

export default function Page() {
  const [gym, setGym] = useState(null);
  const [bodyParts, setBodyParts] = useState([]);
  const [muscles, setMuscles] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  const [selectedMuscle, setSelectedMuscle] = useState(null);

  useEffect(() => {
    const gymData = localStorage.getItem("gym");
    if (!gymData) return;
    const parsed = JSON.parse(gymData);
    setGym(parsed);
    fetchBodyParts(parsed.docId);
  }, []);

  const fetchBodyParts = async (gymDocId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/exercise/bodyparts/${gymDocId}`,
      );
      const data = await res.json();
      if (data.success) {
        setBodyParts(data.bodyParts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMuscles = async (bodyPartId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/exercise/musclegroups/${gym.docId}/${bodyPartId}`,
      );
      const data = await res.json();
      if (data.success) {
        setMuscles(data.muscles);
        setExercises([]);
        setSelectedMuscle(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchExercises = async (bodyPartId, muscleGroupId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/exercise/exercises/${gym.docId}/${bodyPartId}/${muscleGroupId}`,
      );
      const data = await res.json();
      if (data.success) {
        setExercises(data.exercises);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 p-4 md:p-8 relative overflow-hidden selection:bg-emerald-500 selection:text-black">
      
      {/* Background Aesthetic Grids & Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-emerald-500/10 to-lime-500/0 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-gradient-to-br from-cyan-500/5 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-10">
        
        {/* PREMIUM HEADER */}
        <div className="relative border-b border-zinc-900 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-zinc-900 border border-zinc-800 text-emerald-400 flex items-center gap-1 shadow-sm">
                <Sparkles size={10} /> Live Franchise Arena
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic text-white">
              {gym?.gymname || "IRON"} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-lime-400">VAULT</span>
            </h1>
            <p className="text-zinc-500 mt-1 text-sm font-medium tracking-wide">
              Deploy elite visual movement configurations.
            </p>
          </div>
          
          <div className="flex items-center gap-6 bg-zinc-900/40 backdrop-blur border border-zinc-900 px-6 py-3 rounded-xl self-start md:self-auto">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Engine Build</p>
              <p className="text-sm font-mono font-bold text-zinc-300">v4.2 // AI.COACH</p>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <TrendingUp className="text-emerald-400 animate-bounce" size={20} />
          </div>
        </div>

        {/* STEP 1: BODY PARTS */}
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-xl">
          <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Dumbbell size={14} className="stroke-[2.5]" />
            </span>
            [01] Target Biological Region
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {bodyParts.map((part) => {
              const isSelected = selectedBodyPart?.bodypartid === part.bodypartid;
              return (
                <button
                  key={part.bodypartid}
                  onClick={() => {
                    setSelectedBodyPart(part);
                    fetchMuscles(part.bodypartid);
                  }}
                  className={`group relative px-4 py-4 rounded-xl font-bold uppercase text-xs tracking-wider transition-all duration-300 text-left overflow-hidden border ${
                    isSelected
                      ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-black border-transparent shadow-[0_4px_20px_rgba(16,185,129,0.3)] scale-[1.02]"
                      : "bg-zinc-900/60 text-zinc-400 border-zinc-800/80 hover:text-white hover:border-zinc-700 hover:bg-zinc-900"
                  }`}
                >
                  <span className="relative z-10">{part.name}</span>
                  {!isSelected && (
                    <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-emerald-400 group-hover:w-full transition-all duration-300" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 2: MUSCLE GROUPS */}
        {selectedBodyPart && (
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Target size={14} className="stroke-[2.5]" />
              </span>
              [02] Isolate Muscle Group
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {muscles.map((muscle) => {
                const isSelected = selectedMuscle?.musclegroupid === muscle.musclegroupid;
                return (
                  <button
                    key={muscle.musclegroupid}
                    onClick={() => {
                      setSelectedMuscle(muscle);
                      fetchExercises(selectedBodyPart.bodypartid, muscle.musclegroupid);
                    }}
                    className={`group relative px-4 py-4 rounded-xl font-bold uppercase text-xs tracking-wider transition-all duration-300 text-left overflow-hidden border ${
                      isSelected
                        ? "bg-gradient-to-br from-cyan-500 to-cyan-600 text-black border-transparent shadow-[0_4px_20px_rgba(6,182,212,0.3)] scale-[1.02]"
                        : "bg-zinc-900/60 text-zinc-400 border-zinc-800/80 hover:text-white hover:border-cyan-500/40"
                    }`}
                  >
                    <span className="relative z-10">{muscle.name}</span>
                    {!isSelected && (
                      <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-cyan-400 group-hover:w-full transition-all duration-300" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: EXERCISES GRID */}
        {selectedMuscle && (
          <div className="bg-zinc-950/20 border border-zinc-900 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-xl animate-in fade-in slide-in-from-bottom-6 duration-400">
            <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-8 flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-lime-500/10 text-lime-400 border border-lime-500/20">
                <PlayCircle size={14} className="stroke-[2.5]" />
              </span>
              [03] Executable Matrix Profiles ({exercises.length})
            </h2>

            {exercises.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-zinc-800 rounded-2xl">
                <Flame className="mx-auto text-zinc-700 mb-3 animate-pulse" size={28} />
                <p className="text-sm font-mono text-zinc-500 uppercase tracking-widest">No data profiles compiled for selection</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {exercises.map((exercise) => {
    // Unique ID handler to control play states independently per card
    const videoId = `video-${exercise.exerciseid}`;
    
    return (
      <div
        key={exercise.exerciseid}
        className="group bg-zinc-900/40 border border-zinc-800/60 hover:border-emerald-500/40 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg flex flex-col justify-between"
      >
        {/* Video Wrapper Box */}
        <div className="relative overflow-hidden aspect-video w-full bg-zinc-950 flex items-center justify-center">
          <video
            id={videoId}
            src={exercise.videoUrl}
            controls
            playsInline
            className="w-full h-full object-cover"
            onPlay={(e) => {
              // Hide custom overlay play button when native player starts
              const overlay = document.getElementById(`overlay-${exercise.exerciseid}`);
              if (overlay) overlay.style.opacity = '0';
            }}
            onPause={(e) => {
              // Show custom overlay play button back when paused
              const overlay = document.getElementById(`overlay-${exercise.exerciseid}`);
              if (overlay) overlay.style.opacity = '1';
            }}
          />
          
          {/* Custom Floating Big Play Button Layer */}
          <div 
            id={`overlay-${exercise.exerciseid}`}
            onClick={() => {
              const videoElement = document.getElementById(videoId);
              if (videoElement) videoElement.play();
            }}
            className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer transition-opacity duration-300 group-hover:bg-black/20"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] transform transition-transform duration-300 group-hover:scale-110 hover:bg-lime-400">
              {/* Offset right margin slightly to visually balance the triangle play symbol */}
              <PlayCircle size={28} className="fill-current ml-0.5 stroke-[1.5]" />
            </div>
          </div>
        </div>

        {/* Card Metadata & Link Action */}
        <div className="p-5 border-t border-zinc-900 bg-zinc-900/20 flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-black tracking-tight text-white uppercase line-clamp-1">
              {exercise.exerciseName}
            </h3>
            <p className="text-[10px] uppercase font-mono font-bold tracking-widest text-zinc-500 mt-1">
              Pattern: <span className="text-zinc-400">{exercise.movementPattern || "Standard"}</span>
            </p>
          </div>
          
          {/* Dedicated Action Button for the External Streamlit AI Platform */}
          <button
            onClick={() => {
              const gymData = JSON.parse(localStorage.getItem("gym"));
              const gymId = gymData?.gymid || "";
              window.location.href =
                `https://aigymcoach.streamlit.app/?gymid=${gymId}` +
                `&exercise=${encodeURIComponent(exercise.exerciseName)}` +
                `&pattern=${encodeURIComponent(exercise.movementPattern)}`;
            }}
            className="w-full bg-zinc-950 border border-zinc-800 hover:border-emerald-500 hover:text-emerald-400 font-bold uppercase tracking-wider text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300"
          >
            Analyze Movement Form
            <ExternalLink size={12} />
          </button>
        </div>
      </div>
    );
  })}
</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}