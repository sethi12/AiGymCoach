"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Dumbbell, Activity, Cpu, LogOut, ChevronRight, UserPlus, PlusCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import AddUser from "../components/AddUser";
import MembersList from "../components/MembersList";
import AddExercise from "../components/Addexercise";
import AllExercise from "../components/AllExercise";

export default function GymDashboardPage() {
  const [selectedMenu, setSelectedMenu] = useState("add-user");
  const [gymName, setGymName] = useState("");

  useEffect(() => {
    const gymData = localStorage.getItem("gym");
    if (gymData) {
      const gym = JSON.parse(gymData);
      setGymName(gym.gymname);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("gym");
    toast.success("Terminal Session Terminated");
    // window.location.href = "/login"; // Uncomment to redirect
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "add-user":
        return (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4 ">
              <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight uppercase">Add New Client</h2>
                <p className="text-xs text-zinc-500 font-mono mt-0.5">REGISTER BIOMETRIC MATRIX & SYSTEM PROFILE</p>
              </div>
            </div>
            <AddUser/>
            <MembersList/>
            {/* Aesthetic Form Shell Placeholder */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-900/40 border border-zinc-800/60 p-6 rounded-2xl backdrop-blur-xl">
              <p className="text-zinc-500 text-sm font-mono col-span-2 italic">
                // System awaiting deployment payload parameters...
              </p>
            </div> */}
          </motion.div>
        );

      case "add-exercise":
        return (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight uppercase">Add Exercise Routine</h2>
                <p className="text-xs text-zinc-500 font-mono mt-0.5">MAP NEW KINETIC SCHEMATIC TO AI COMPUTER VISION</p>
              </div>
            </div>
            <AddExercise/>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-900/40 border border-zinc-800/60 p-6 rounded-2xl backdrop-blur-xl">
              <p className="text-zinc-500 text-sm font-mono col-span-2 italic">
                // Form routine compilation vector pipeline...
              </p>
            </div>
          </motion.div>
        );
        case "All-Exercise":
        return (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight uppercase">Add Exercise Routine</h2>
                <p className="text-xs text-zinc-500 font-mono mt-0.5">MAP NEW KINETIC SCHEMATIC TO AI COMPUTER VISION</p>
              </div>
            </div>
            <AllExercise/>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-900/40 border border-zinc-800/60 p-6 rounded-2xl backdrop-blur-xl">
              <p className="text-zinc-500 text-sm font-mono col-span-2 italic">
                // Form routine compilation vector pipeline...
              </p>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-white font-sans selection:bg-cyan-500 selection:text-zinc-900 overflow-hidden">
      <Toaster position="top-right" />

      {/* Cyber Ambient Accent Illumination */}
      <div className="absolute top-[-40%] right-[-10%] w-[800px] h-[800px] rounded-full bg-cyan-500/5 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-40%] left-[20%] w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[140px] pointer-events-none" />

      {/* =========================================================================
          SIDEBAR PORTAL 
          ========================================================================= */}
      <div className="w-80 bg-zinc-900/60 backdrop-blur-2xl border-r border-zinc-900 flex flex-col relative z-20">
        
        {/* Dynamic Hologram Line */}
        <div className="absolute top-0 bottom-0 right-0 w-[1px] bg-gradient-to-b from-cyan-500/20 via-zinc-800 to-transparent" />

        {/* Corporate / Node Header */}
        <div className="p-6 border-b border-zinc-900 flex items-center gap-3 bg-zinc-950/20">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-800 flex items-center justify-center text-cyan-400 shrink-0 relative group shadow-inner">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div className="overflow-hidden">
            <h1 className="text-md font-black tracking-wide uppercase truncate text-zinc-100 italic">
              {gymName || "CORE_NODE"}
            </h1>
            <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SYSTEM PORTAL ACTIVE
            </p>
          </div>
        </div>

        {/* Navigation Options Section */}
        <div className="p-4 flex-1 space-y-1.5 mt-4">
          <p className="text-[10px] text-zinc-600 font-mono tracking-widest uppercase px-3 mb-2">OPERATIONS INDEX</p>
          
          {/* Add User Control Button */}
          <button
            onClick={() => setSelectedMenu("add-user")}
            className={`w-full group flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 font-medium text-sm tracking-wide ${
              selectedMenu === "add-user"
                ? "bg-gradient-to-r from-cyan-500/10 to-transparent border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.05)]"
                : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <Users className={`w-5 h-5 ${selectedMenu === "add-user" ? "text-cyan-400" : "text-zinc-500 group-hover:text-zinc-400"}`} />
              <span>Add Facility User</span>
            </div>
            <ChevronRight className={`w-4 h-4 transition-transform duration-200 opacity-0 group-hover:opacity-100 ${selectedMenu === "add-user" ? "opacity-100 text-cyan-400 translate-x-0.5" : "text-zinc-600"}`} />
          </button>

          {/* Add Exercise Control Button */}
          <button
            onClick={() => setSelectedMenu("add-exercise")}
            className={`w-full group flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 font-medium text-sm tracking-wide ${
              selectedMenu === "add-exercise"
                ? "bg-gradient-to-r from-emerald-500/10 to-transparent border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.05)]"
                : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
            }`}
          >

            <div className="flex items-center gap-3.5">
              <Dumbbell className={`w-5 h-5 ${selectedMenu === "add-exercise" ? "text-emerald-400 rotate-45" : "text-zinc-500 group-hover:text-zinc-400"}`} />
              <span>Add Vision Routine</span>
            </div>
            <ChevronRight className={`w-4 h-4 transition-transform duration-200 opacity-0 group-hover:opacity-100 ${selectedMenu === "add-exercise" ? "opacity-100 text-emerald-400 translate-x-0.5" : "text-zinc-600"}`} />
          </button>


                  <button
            onClick={() => setSelectedMenu("All-Exercise")}
            className={`w-full group flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 font-medium text-sm tracking-wide ${
              selectedMenu === "All-Exercise"
                ? "bg-gradient-to-r from-emerald-500/10 to-transparent border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.05)]"
                : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
            }`}
          >
            
            <div className="flex items-center gap-3.5">
              <Dumbbell className={`w-5 h-5 ${selectedMenu === "All-Exercise" ? "text-emerald-400 rotate-45" : "text-zinc-500 group-hover:text-zinc-400"}`} />
              <span>All Exercises</span>
            </div>
            <ChevronRight className={`w-4 h-4 transition-transform duration-200 opacity-0 group-hover:opacity-100 ${selectedMenu === "All-Exercise" ? "opacity-100 text-emerald-400 translate-x-0.5" : "text-zinc-600"}`} />
          </button>
        </div>

        {/* Lower Terminal Node / Logout */}
        <div className="p-4 border-t border-zinc-900 bg-zinc-950/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-3 text-xs font-bold uppercase tracking-widest bg-zinc-950 hover:bg-red-950/20 text-zinc-500 hover:text-red-400 border border-zinc-800/60 hover:border-red-900/40 rounded-xl transition duration-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Terminate Shell</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          WORKFLOW PLATFORM MAIN DISPLAY
          ========================================================================= */}
      <div className="flex-1 flex flex-col relative z-10 overflow-y-auto">
        
        {/* Dynamic Running Backdrop Sensor Mesh */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

        {/* Workspace Padding Box */}
        <div className="p-10 max-w-5xl w-full mx-auto flex-1 flex flex-col justify-start relative">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}