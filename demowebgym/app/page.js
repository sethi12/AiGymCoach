"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dumbbell,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Flame,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const router = useRouter();

  const [gymname, setGymname] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ gymname, password }),
        }
      );

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("gym", JSON.stringify(data.gym));
        toast.success("Welcome Back, Athlete! 🔥");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Server down. Keep grinding, we'll be back!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 relative overflow-hidden">
      <Toaster position="top-center" />

      {/* Extreme Hardcore Background Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-[0.08] mix-blend-luminosity pointer-events-none"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop')` 
        }}
      />
      
      {/* Intense Gym Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(16,185,129,0.12),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.08),transparent_25%)]" />

      {/* Main Glassmorphism Form Card */}
      <div className="w-full max-w-md bg-zinc-900/80 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative z-10 before:absolute before:top-0 before:left-0 before:w-full before:h-[2px] before:bg-gradient-to-r before:from-emerald-500 before:to-lime-400">
        
        {/* Header section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-lime-400 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(16,185,129,0.4)] rotate-3 hover:rotate-0 transition-transform duration-300">
            <Dumbbell
              size={32}
              className="text-black stroke-[2.5]"
            />
          </div>

          <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic flex items-center gap-1">
            AI GYM <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-300">COACH</span>
          </h1>

          <p className="text-zinc-500 mt-1 text-xs font-semibold tracking-widest uppercase flex items-center gap-1">
            <Flame size={12} className="text-emerald-500 animate-pulse" /> 
            Unleash Your Beast Mode
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Gym ID / Name
            </label>
            <input
              type="text"
              value={gymname}
              onChange={(e) => setGymname(e.target.value)}
              placeholder="e.g. IRON_EMPIRE"
              className="w-full bg-zinc-950/90 border border-zinc-800 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all font-mono tracking-wide"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Passkey
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-950/90 border border-zinc-800 rounded-xl px-4 py-3.5 pr-12 text-white placeholder-zinc-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all font-mono tracking-widest"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-zinc-500 hover:text-emerald-400 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* High Energy Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full relative group overflow-hidden bg-gradient-to-r from-emerald-500 to-lime-400 text-black font-black uppercase tracking-wider py-4 rounded-xl hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Validating Power...
              </>
            ) : (
              <>
                <Lock size={18} className="stroke-[2.5]" />
                Enter Arena
              </>
            )}
          </button>
        </form>

        {/* Motivational Footer Note */}
        <p className="text-center text-[10px] text-zinc-600 uppercase tracking-widest mt-6 font-medium">
          No Excuses • Consistency Wins
        </p>
      </div>
    </div>
  );
}