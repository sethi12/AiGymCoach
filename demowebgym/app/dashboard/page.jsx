"use client";

import { useEffect, useState } from "react";
import { Anton, Barlow_Condensed, Space_Mono } from "next/font/google";
import {
  Dumbbell,
  Crosshair,
  Activity,
  Radio,
  PlayCircle,
  Flame,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Users,
} from "lucide-react";

// Display face — blunt, condensed, equally at home on a sports broadcast lower-third
// or a vintage strongman poster. Carries every headline on the page.
const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton" });
// Body / UI face — the house font for this app, kept for continuity.
const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
});
// Utility face — terminal/readout type for the HUD telemetry.
const mono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-mono" });

// Two-color system, each tied to a function rather than decoration:
// GREEN = the system / AI / verified state. RED = a live, human-triggered action.
const GREEN = "#3CFF8E";
const RED = "#FF4454";

export default function Page() {
  const [gym, setGym] = useState(null);
  const [bodyParts, setBodyParts] = useState([]);
  const [muscles, setMuscles] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  const [selectedMuscle, setSelectedMuscle] = useState(null);

  // High-performance state tracking for kiosk execution
  const [genderFilter, setGenderFilter] = useState("All"); // "All" | "Male" | "Female"

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

  // Immediate reactive array stream for hardware responsive displays
  const filteredExercises = exercises.filter((exercise) => {
    if (genderFilter === "All") return true;
    return exercise.gender?.toLowerCase() === genderFilter.toLowerCase();
  });

  // Pipeline stage for the HUD tracker: 1 = region locked, 2 = muscle locked, 3 = form library ready.
  let stage = 0;
  if (selectedBodyPart) stage = 1;
  if (selectedMuscle) stage = 2;
  if (selectedMuscle && exercises.length > 0) stage = 3;

  return (
    <div
      className={`${anton.variable} ${barlow.variable} ${mono.variable} min-h-screen bg-[#07080B] text-[#EDEFEA] relative overflow-hidden selection:bg-[#3CFF8E] selection:text-black`}
      style={{ fontFamily: "var(--font-barlow)" }}
    >
      {/* ── Ambient system layer ───────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div
        className="absolute top-0 right-0 w-[420px] h-[420px] pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "7px 7px",
        }}
      />
      <div className="absolute top-[-12%] right-[8%] w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none" style={{ background: `${GREEN}14` }} />
      <div className="absolute bottom-[-10%] left-[2%] w-[460px] h-[460px] rounded-full blur-[130px] pointer-events-none" style={{ background: `${RED}0F` }} />
      <div className="absolute inset-x-0 top-0 h-px overflow-hidden pointer-events-none">
        <div className="scanline-sweep h-px w-1/4" style={{ background: `linear-gradient(90deg, transparent, ${GREEN}99, transparent)` }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 px-4 md:px-8 py-8 space-y-10">
        {/* ── HEADER ──────────────────────────────────────────────────── */}
        <header className="relative border-b border-white/[0.07] pb-8">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span
              className="px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-[0.18em] border flex items-center gap-1.5"
              style={{ color: GREEN, borderColor: `${GREEN}40`, background: `${GREEN}12`, fontFamily: "var(--font-mono)" }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-70" style={{ background: GREEN }} />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: GREEN }} />
              </span>
              Pose Engine Active
            </span>
            <span className="px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-[0.18em] bg-white/[0.04] border border-white/[0.1] text-white/55">
              India&apos;s First Robot Coach
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1
                className="text-6xl sm:text-7xl md:text-8xl leading-[0.82] uppercase text-white"
                style={{ fontFamily: "var(--font-anton)" }}
              >
                {gym?.gymname || "IRON"} <span style={{ color: GREEN }}>COACH</span>
              </h1>
              <p className="text-white/40 mt-3 text-sm md:text-base font-medium tracking-wide max-w-lg">
                Every rep scanned. Every angle checked. Real-time form analysis, kiosk-side.
              </p>
            </div>

            <div className="flex items-center gap-5 bg-white/[0.025] border border-white/[0.09] px-6 py-3.5 rounded-lg self-start lg:self-auto shrink-0">
              <div>
                <p className="text-[9px] uppercase font-bold tracking-[0.25em] text-white/35" style={{ fontFamily: "var(--font-mono)" }}>
                  System Status
                </p>
                <p className="text-sm font-bold text-white/85" style={{ fontFamily: "var(--font-mono)" }}>
                  POSE ENGINE · ONLINE
                </p>
              </div>
              <div className="w-px h-9 bg-white/[0.1]" />
              <Radio size={20} strokeWidth={2.5} style={{ color: GREEN }} />
            </div>
          </div>

          {/* Signature element: pose-pipeline tracker — three keypoints lock in sequence */}
          <div className="mt-9 flex items-center">
            {[
              { id: 1, label: "REGION" },
              { id: 2, label: "MUSCLE" },
              { id: 3, label: "FORM" },
            ].map((step, i, arr) => {
              const done = stage >= step.id;
              const live = stage === step.id;
              return (
                <div key={step.id} className={`flex items-center ${i < arr.length - 1 ? "flex-1" : ""}`}>
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <span
                      className={`w-3 h-3 rounded-full border-2 transition-all duration-500 ${live ? "node-pulse" : ""}`}
                      style={{
                        background: done ? GREEN : "transparent",
                        borderColor: done ? GREEN : "rgba(255,255,255,0.18)",
                      }}
                    />
                    <span
                      className="text-[9px] font-bold tracking-[0.22em] transition-colors duration-500"
                      style={{ color: done ? GREEN : "rgba(255,255,255,0.3)", fontFamily: "var(--font-mono)" }}
                    >
                      {step.label}
                    </span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="flex-1 h-px mx-3 bg-white/[0.08] -mt-4 relative overflow-hidden rounded-full">
                      <div
                        className="absolute inset-y-0 left-0 transition-all duration-700 ease-out"
                        style={{ width: stage > step.id ? "100%" : "0%", background: GREEN }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
            <span
              className="ml-4 hidden sm:inline-block text-[10px] font-bold tracking-[0.2em] text-white/30 whitespace-nowrap -mt-4"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              PIPELINE {stage}/3
            </span>
          </div>
        </header>

        {/* ── STEP 1: REGION ──────────────────────────────────────────── */}
        <ScanModule index={1} icon={<Dumbbell size={14} strokeWidth={2.5} />} label="Target Region" accent={GREEN} active={stage === 0}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {bodyParts.map((part) => (
              <SelectTile
                key={part.bodypartid}
                label={part.name}
                accent={GREEN}
                isSelected={selectedBodyPart?.bodypartid === part.bodypartid}
                onClick={() => {
                  setSelectedBodyPart(part);
                  fetchMuscles(part.bodypartid);
                }}
              />
            ))}
            {bodyParts.length === 0 && <EmptyRow text="No region data available" />}
          </div>
        </ScanModule>

        {/* ── STEP 2: MUSCLE ──────────────────────────────────────────── */}
        {selectedBodyPart && (
          <ScanModule index={2} icon={<Crosshair size={14} strokeWidth={2.5} />} label="Isolate Muscle" accent={GREEN} active={stage === 1}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {muscles.map((muscle) => (
                <SelectTile
                  key={muscle.musclegroupid}
                  label={muscle.name}
                  accent={GREEN}
                  isSelected={selectedMuscle?.musclegroupid === muscle.musclegroupid}
                  onClick={() => {
                    setSelectedMuscle(muscle);
                    fetchExercises(selectedBodyPart.bodypartid, muscle.musclegroupid);
                  }}
                />
              ))}
              {muscles.length === 0 && <EmptyRow text="No muscle data available" />}
            </div>
          </ScanModule>
        )}

        {/* ── STEP 3: FORM LIBRARY ────────────────────────────────────── */}
        {selectedMuscle && (
          <ScanModule
            index={3}
            icon={<Activity size={14} strokeWidth={2.5} />}
            label={`Verified Form Library (${filteredExercises.length})`}
            accent={RED}
            active
            headerRight={
              <div className="flex items-center gap-1 p-1 bg-black/40 border border-white/[0.09] rounded-lg w-full lg:w-auto">
                <div className="px-3 text-white/40 hidden sm:flex items-center gap-2 border-r border-white/[0.09] pr-3">
                  <Users size={13} />
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-mono)" }}>
                    Demo
                  </span>
                </div>
                {["All", "Male", "Female"].map((gender) => {
                  const isCurrent = genderFilter === gender;
                  return (
                    <button
                      key={gender}
                      onClick={() => setGenderFilter(gender)}
                      className="flex-1 lg:flex-none px-5 py-2.5 rounded-md font-bold text-xs uppercase tracking-widest transition-all duration-200 active:scale-[0.97]"
                      style={
                        isCurrent
                          ? { background: GREEN, color: "#000" }
                          : { color: "rgba(255,255,255,0.4)" }
                      }
                    >
                      {gender}
                    </button>
                  );
                })}
              </div>
            }
          >
            {filteredExercises.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-white/[0.1] rounded-xl bg-black/20">
                <Flame className="mx-auto text-white/15 mb-4" size={32} />
                <p className="text-2xl uppercase tracking-wide text-white/75" style={{ fontFamily: "var(--font-anton)" }}>
                  No Form Profiles Found
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mt-2" style={{ fontFamily: "var(--font-mono)" }}>
                  Adjust the demographic filter or pick another muscle group
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExercises.map((exercise) => {
                  const videoId = `video-${exercise.exerciseid}`;
                  return (
                    <div
                      key={exercise.exerciseid}
                      className="group relative bg-[#0D0E12] border border-white/[0.08] rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_20px_45px_rgba(0,0,0,0.55)]"
                    >
                      {/* Video / scan frame */}
                      <div className="relative aspect-video w-full bg-black overflow-hidden border-b border-white/[0.07]">
                        <CornerBrackets color="rgba(255,255,255,0.35)" size={16} thickness={2} inset={10} />

                        <video
                          id={videoId}
                          src={exercise.videoUrl}
                          controls
                          playsInline
                          className="w-full h-full object-cover"
                          onPlay={() => {
                            const overlay = document.getElementById(`overlay-${exercise.exerciseid}`);
                            if (overlay) overlay.style.opacity = "0";
                            const rec = document.getElementById(`rec-${exercise.exerciseid}`);
                            if (rec) rec.style.opacity = "1";
                          }}
                          onPause={() => {
                            const overlay = document.getElementById(`overlay-${exercise.exerciseid}`);
                            if (overlay) overlay.style.opacity = "1";
                            const rec = document.getElementById(`rec-${exercise.exerciseid}`);
                            if (rec) rec.style.opacity = "0";
                          }}
                        />

                        <div
                          id={`overlay-${exercise.exerciseid}`}
                          onClick={() => {
                            const videoElement = document.getElementById(videoId);
                            if (videoElement) videoElement.play();
                          }}
                          className="absolute inset-0 bg-black/55 backdrop-blur-[1px] flex items-center justify-center cursor-pointer transition-opacity duration-300 group-hover:bg-black/35"
                        >
                          <div
                            className="w-16 h-16 rounded-full text-black flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110"
                            style={{ background: GREEN, boxShadow: `0 8px 24px ${GREEN}55` }}
                          >
                            <PlayCircle size={30} className="fill-current ml-0.5" strokeWidth={1.5} />
                          </div>
                        </div>

                        <span
                          className="absolute top-3 left-3 px-2 py-1 rounded-sm font-bold text-[9px] uppercase tracking-[0.12em] border border-white/15 backdrop-blur-md bg-black/60 text-white/60"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          FORM_ID·{exercise.exerciseid}
                        </span>

                        <span
                          id={`rec-${exercise.exerciseid}`}
                          className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 transition-opacity duration-200 px-2 py-1 rounded-sm bg-black/60 border border-white/10"
                        >
                          <span className="w-1.5 h-1.5 rounded-full rec-dot" style={{ background: RED }} />
                          <span className="text-[9px] font-bold tracking-widest" style={{ color: RED, fontFamily: "var(--font-mono)" }}>
                            REC
                          </span>
                        </span>

                        {exercise.gender && (
                          <span className="absolute bottom-3 right-3 px-2 py-1 rounded-sm font-bold text-[9px] uppercase tracking-[0.12em] border border-white/15 backdrop-blur-md bg-black/60 text-white/55">
                            {exercise.gender}
                          </span>
                        )}

                        <CertifiedStamp color={GREEN} />
                      </div>

                      {/* Card body */}
                      <div className="p-5 flex flex-col gap-5">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="w-1.5 h-4 rounded-[1px]" style={{ background: GREEN }} />
                            <h3
                              className="text-2xl leading-none uppercase text-white line-clamp-1"
                              style={{ fontFamily: "var(--font-anton)" }}
                            >
                              {exercise.exerciseName}
                            </h3>
                          </div>
                          <div className="flex items-center justify-between mt-2 pl-3.5">
                            <p className="text-[10px] uppercase font-bold tracking-[0.14em] text-white/40" style={{ fontFamily: "var(--font-mono)" }}>
                              Pattern: <span className="text-white/70">{exercise.movementPattern || "Standard"}</span>
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            const gymData = JSON.parse(localStorage.getItem("gym"));
                            const gymId = gymData?.gymid || "";
                            window.location.href =
                              `http://localhost:8501/?gymid=${gymId}` +
                              `&exercise=${encodeURIComponent(exercise.exerciseName)}` +
                              `&pattern=${encodeURIComponent(exercise.movementPattern)}`;
                          }}
                          className="group/btn relative w-full bg-white/[0.03] border border-white/12 font-bold uppercase tracking-[0.15em] text-[11px] py-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] overflow-hidden"
                          style={{ "--btn-accent": RED }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = `${RED}80`;
                            e.currentTarget.style.color = RED;
                            e.currentTarget.style.background = `${RED}10`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                            e.currentTarget.style.color = "";
                            e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                          }}
                        >
                          Run Form Scan
                          <ExternalLink size={12} className="opacity-60" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScanModule>
        )}
      </div>

      <style jsx>{`
        @keyframes sweepDown {
          0% {
            left: -25%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            left: 100%;
            opacity: 0;
          }
        }
        .scanline-sweep {
          position: relative;
          animation: sweepDown 6s linear infinite;
        }
        @keyframes nodePulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(60, 255, 142, 0.55);
          }
          50% {
            box-shadow: 0 0 0 7px rgba(60, 255, 142, 0);
          }
        }
        .node-pulse {
          animation: nodePulse 1.7s ease-in-out infinite;
        }
        @keyframes recBlink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.25;
          }
        }
        .rec-dot {
          animation: recBlink 1.1s ease-in-out infinite;
        }
        @keyframes moduleSweep {
          0% {
            left: -30%;
          }
          100% {
            left: 100%;
          }
        }
        .module-sweep {
          position: absolute;
          top: 0;
          width: 30%;
          height: 1px;
          animation: moduleSweep 2.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

/* ───────────────────────── Helper components ───────────────────────── */

function ScanModule({ index, icon, label, accent, children, headerRight, active }) {
  return (
    <section className="relative bg-white/[0.018] border border-white/[0.07] rounded-xl p-6 md:p-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <CornerBrackets color="rgba(255,255,255,0.14)" size={14} thickness={2} inset={0} />
      {active && (
        <div className="absolute top-0 left-0 right-0 h-px overflow-hidden rounded-t-xl">
          <div className="module-sweep" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
        </div>
      )}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 mb-6 border-b border-white/[0.07]">
        <h2 className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-white/50">
          <span
            className="text-[9px] px-1.5 py-0.5 rounded-sm border"
            style={{ color: accent, borderColor: `${accent}40`, background: `${accent}12`, fontFamily: "var(--font-mono)" }}
          >
            0{index}
          </span>
          <span className="p-1.5 rounded-md border" style={{ color: accent, borderColor: `${accent}30`, background: `${accent}12` }}>
            {icon}
          </span>
          {label}
        </h2>
        {headerRight}
      </div>
      {children}
    </section>
  );
}

function SelectTile({ label, isSelected, onClick, accent }) {
  return (
    <button
      onClick={onClick}
      className={`group relative px-4 py-5 rounded-lg font-bold uppercase text-xs tracking-wider transition-all duration-200 text-left border min-h-[64px] active:scale-[0.96] overflow-hidden ${
        isSelected
          ? "text-black border-transparent -translate-y-0.5"
          : "text-white/55 bg-white/[0.02] border-white/[0.08] hover:text-white hover:border-white/25 hover:bg-white/[0.045]"
      }`}
      style={isSelected ? { background: accent, boxShadow: `0 10px 26px ${accent}40` } : undefined}
    >
      {isSelected && <CornerBrackets color="rgba(0,0,0,0.3)" size={9} thickness={1.5} inset={4} />}
      <span className="relative z-10">{label}</span>
      {isSelected ? (
        <ChevronRight size={14} strokeWidth={3} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70" />
      ) : (
        <span
          className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-300"
          style={{ background: accent }}
        />
      )}
    </button>
  );
}

function CornerBrackets({ color, size = 14, thickness = 2, inset = 8 }) {
  const corner = (pos) => ({
    position: "absolute",
    width: size,
    height: size,
    borderColor: color,
    borderStyle: "solid",
    borderWidth: 0,
    pointerEvents: "none",
    ...pos,
  });
  return (
    <>
      <span style={corner({ top: inset, left: inset, borderTopWidth: thickness, borderLeftWidth: thickness })} />
      <span style={corner({ top: inset, right: inset, borderTopWidth: thickness, borderRightWidth: thickness })} />
      <span style={corner({ bottom: inset, left: inset, borderBottomWidth: thickness, borderLeftWidth: thickness })} />
      <span style={corner({ bottom: inset, right: inset, borderBottomWidth: thickness, borderRightWidth: thickness })} />
    </>
  );
}

function CertifiedStamp({ color }) {
  return (
    <div className="absolute bottom-3 left-3 w-14 h-14" style={{ transform: "rotate(-9deg)" }}>
      <div className="absolute inset-0 rounded-full border border-dashed" style={{ borderColor: `${color}80` }} />
      <div
        className="absolute inset-[3px] rounded-full border-2 flex items-center justify-center"
        style={{ borderColor: color, background: "rgba(7,8,11,0.92)" }}
      >
        <div className="text-center leading-tight">
          <ShieldCheck size={13} style={{ color }} className="mx-auto mb-0.5" />
          <p className="text-[5.5px] font-bold uppercase tracking-[0.08em]" style={{ color, fontFamily: "var(--font-mono)" }}>
            Certified
            <br />
            Form
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyRow({ text }) {
  return (
    <div className="col-span-full text-center py-8 text-[10px] uppercase font-bold tracking-[0.2em] text-white/25" style={{ fontFamily: "var(--font-mono)" }}>
      {text}
    </div>
  );
}