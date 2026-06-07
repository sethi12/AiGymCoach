"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, Cpu, Target, Orbit, Loader2, ChartNoAxesColumnIncreasingIcon } from "lucide-react";
import { useRouter } from "next/navigation";
export default function RobotCoreLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [gymname, setGymname] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const API_URL =
  process.env.NEXT_PUBLIC_BASE_URL;
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
  `${API_URL}/api/auth/login`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      gymname,
      password,
    }),
  }
);

      const data = await response.json();

      if (data.success) {
        localStorage.setItem(
          "gym",
          JSON.stringify(data.gym)
        );
        toast.success("Login Successful");
        router.push("/dashboard")
      } else {
        if (data.message === "Gym not found") {
          toast.error("No gym registered with this name");
        } else if (data.message === "Invalid password") {
          toast.error("Incorrect password");
        } else {
          toast.error(data.message || "Authentication failed");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-zinc-950 px-4 overflow-hidden selection:bg-cyan-400 selection:text-zinc-900">
      
      {/* Toast Notification Provider (Configured to match modern dark theme) */}
      <Toaster 
        position="top-center" 
        toastOptions={{
          className: 'border border-zinc-800 bg-zinc-900 text-white font-sans text-sm rounded-xl',
          duration: 4000,
          style: {
            background: '#18181b',
            color: '#fff',
            borderColor: '#27272a'
          }
        }} 
      />

      {/* High-Tech Bioluminescent Core Glows */}
      <div className="absolute top-[-30%] left-[-20%] w-[700px] h-[700px] rounded-full bg-cyan-500/10 blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-30%] right-[-20%] w-[700px] h-[700px] rounded-full bg-emerald-500/10 blur-[140px] pointer-events-none animate-pulse" />

      {/* Vector Sensor Mesh Backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] pointer-events-none" />

      {/* Main Terminal Shell */}
      <div className="w-full max-w-md bg-zinc-900/80 backdrop-blur-3xl border border-zinc-800/80 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.9)] p-8 relative z-10 overflow-hidden">
        
        {/* Holographic Interface Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

        {/* AI Assistant Core Matrix Header */}
        <div className="text-center mb-8 relative">
          <div className="inline-flex items-center justify-center bg-zinc-950/80 w-20 h-20 rounded-full border border-zinc-800 mb-4 relative group">
            
            {/* Spinning Neural Network Target Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-dashed border-cyan-500/30 m-1"
            />

            {/* Breathing Ambient Aura */}
            <div className="absolute inset-0 bg-cyan-500/5 opacity-100 blur-lg rounded-full" />
            
            {/* Pulsing Robotic Assistant Icon */}
            <motion.div
              animate={{ scale: [0.94, 1.06, 0.94] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="relative z-10 text-cyan-400"
            >
              <Orbit className="w-9 h-9" />
            </motion.div>
          </div>

          <h1 className="text-2xl font-bold tracking-widest text-white uppercase font-sans">
            AI COACH <span className="text-cyan-400 font-light">LogIn</span>
          </h1>
          <p className="text-[10px] text-zinc-500 mt-1.5 font-mono tracking-widest uppercase flex items-center justify-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            ROBOTIC NODE: LINK ONLINE
          </p>
        </div>

        {/* Credentials Form */}
        <form className="space-y-4" onSubmit={handleLogin}>
          
          {/* Gym Name / Operator ID Input */}
          <div className="relative group">
            <ChartNoAxesColumnIncreasingIcon className="absolute left-4 top-[15px] h-4 w-4 text-zinc-500 group-focus-within:text-cyan-400 transition-colors" />
            <input
              type="text"
              value={gymname}
              onChange={(e) => setGymname(e.target.value)}
              placeholder="Gym Name"
              className="w-full pl-12 pr-4 py-3.5 bg-zinc-950/60 border border-zinc-800/80 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition font-medium text-sm tracking-wide"
              required
              disabled={loading}
            />
          </div>

          {/* Secure Access Key Input */}
          <div className="relative group">
            <Lock className="absolute left-4 top-[15px] h-4 w-4 text-zinc-500 group-focus-within:text-cyan-400 transition-colors" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="System Access Key"
              className="w-full pl-12 pr-12 py-3.5 bg-zinc-950/60 border border-zinc-800/80 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition font-medium text-sm tracking-wide"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[15px] text-zinc-500 hover:text-zinc-300 transition"
              disabled={loading}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Terminal Key Link */}
          {/* <div className="text-right">
            <button type="button" className="text-[11px] font-medium text-zinc-500 hover:text-cyan-400 transition-colors duration-200 font-mono">
              Reset Security Token?
            </button>
          </div> */}

          {/* Core Boot Button */}
          <motion.button
            whileHover={!loading ? { scale: 1.01, boxShadow: "0 0 30px rgba(34,211,238,0.2)" } : {}}
            whileTap={!loading ? { scale: 0.99 } : {}}
            type="submit"
            disabled={loading}
            className="w-full group mt-2 flex items-center justify-center gap-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-zinc-950 py-4 rounded-xl font-bold uppercase tracking-widest hover:brightness-110 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span>CONNECTING CORE</span>
                <Loader2 className="w-4 h-4 text-zinc-950 animate-spin" />
              </>
            ) : (
              <>
                <span>INITIALIZE ASSISTANT</span>
                <Cpu className="w-4 h-4 text-zinc-950 animate-pulse" />
              </>
            )}
          </motion.button>
        </form>

        {/* Telemetry Hardware Diagnostics */}
        <div className="mt-8 pt-5 border-t border-zinc-800/40 grid grid-cols-2 gap-3 text-left font-mono">
          <div className="bg-zinc-950/40 border border-zinc-800/40 p-3 rounded-xl flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <p className="text-[9px] text-zinc-500 uppercase tracking-wider leading-none">Biometrics</p>
              <p className="text-xs font-bold text-zinc-300 mt-1">Encrypted</p>
            </div>
          </div>
          <div className="bg-zinc-950/40 border border-zinc-800/40 p-3 rounded-xl flex items-center gap-2.5">
            <Target className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <p className="text-[9px] text-zinc-500 uppercase tracking-wider leading-none">Vision Rig</p>
              <p className="text-xs font-bold text-zinc-300 mt-1">Calibrated</p>
            </div>
          </div>
        </div>

        {/* Minimalist Tech Footnote */}
        <div className="mt-6 text-center text-[9px] tracking-[0.2em] text-zinc-600 font-mono uppercase">
          Neural Engine Deployment Core
        </div>
      </div>
    </div>
  );
}