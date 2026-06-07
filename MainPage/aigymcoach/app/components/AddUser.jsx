"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { User, ShieldCheck, Key, Copy, Check, Sparkles, Loader2, RefreshCw } from "lucide-react";

export default function AddUser() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [generatedId, setGeneratedId] = useState("");
  const [createdMemberId, setCreatedMemberId] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatingId, setGeneratingId] = useState(false);
  const [copied, setCopied] = useState(false);
const API_URL =
  process.env.NEXT_PUBLIC_BASE_URL;
  const handleNameChange = (e) => {
    setName(e.target.value);
    if (generatedId) {
      setGeneratedId("");
    }
  };

  const generateId = async () => {
    if (!name.trim()) {
      toast.error("Enter member name first");
      return;
    }

    try {
      setGeneratingId(true);
      const gym = JSON.parse(localStorage.getItem("gym"));

      const response = await fetch(
        `${API_URL}/api/member/generate-userid`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gymDocId: gym.docId,
            name,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setGeneratedId(data.userid);
        toast.success("User ID Compiled");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Telemetry failed to generate ID");
    } finally {
      setGeneratingId(false);
    }
  };

  const copyUserId = async () => {
    try {
      await navigator.clipboard.writeText(generatedId);
      setCopied(true);
      toast.success("User ID Cached");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Buffer copy failed");
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    if (!generatedId) {
      toast.error("Compile User ID track first");
      return;
    }

    try {
      setLoading(true);
      const gym = JSON.parse(localStorage.getItem("gym"));

      const response = await fetch(
        `${API_URL}/api/member/add-member`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gymDocId: gym.docId,
            userid: generatedId,
            name,
            password,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Profile Encrypted & Deployed");
        setCreatedMemberId(data.memberid);
        setName("");
        setPassword("");
        setGeneratedId("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Terminal deployment exception");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl w-full">
      {/* Structural Glass Form Wrapper */}
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
        
        {/* Subtle Cyber Grid Backing */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />

        <form onSubmit={handleAddUser} className="space-y-5 relative z-10">
          
          {/* Member Input Field */}
          <div className="relative group">
            <label className="block mb-2 text-xs font-mono tracking-widest text-zinc-500 uppercase">
              Member Name Vector
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-[15px] h-4 w-4 text-zinc-600 group-focus-within:text-cyan-400 transition-colors" />
              <input
                type="text"
                placeholder="Enter Full Name"
                value={name}
                onChange={handleNameChange}
                disabled={loading}
                className="w-full pl-11 pr-4 py-3.5 bg-zinc-950/60 border border-zinc-800/80 rounded-xl text-white placeholder-zinc-700 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 transition font-medium text-sm tracking-wide"
                required
              />
            </div>
          </div>

          {/* Core ID Matrix Generator Track */}
          <div className="space-y-3 pt-1">
            <motion.button
              whileHover={!(generatingId || !name) ? { scale: 1.01 } : {}}
              whileTap={!(generatingId || !name) ? { scale: 0.99 } : {}}
              type="button"
              onClick={generateId}
              disabled={generatingId || !name}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase border bg-zinc-950 text-zinc-400 border-zinc-800/80 hover:text-cyan-400 hover:border-cyan-500/30 disabled:opacity-30 disabled:hover:text-zinc-400 disabled:hover:border-zinc-800/80 transition duration-200"
            >
              {generatingId ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
              <span>
                {generatingId ? "Compiling ID..." : generatedId ? "Regenerate Core Token" : "Compile Access ID"}
              </span>
            </motion.button>

            {/* Simulated Digital Security Access Pass */}
            <AnimatePresence>
              {generatedId && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="rounded-xl border border-cyan-500/20 bg-gradient-to-r from-zinc-950 via-zinc-950 to-cyan-950/10 p-4 relative group"
                >
                  <div className="absolute top-0 right-0 w-24 h-full bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px)] bg-[size:6px_100%] opacity-20 pointer-events-none" />
                  
                  <p className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
                    System Core Security Token
                  </p>

                  <div className="flex items-center justify-between mt-2.5">
                    <span className="font-mono font-black text-cyan-400 text-lg tracking-wider">
                      {generatedId}
                    </span>

                    <button
                      type="button"
                      onClick={copyUserId}
                      className="flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-zinc-950 border border-cyan-500/20 hover:border-transparent font-bold uppercase tracking-wider transition-all duration-200"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? "Cached" : "Copy Token"}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Secure Credential Password Field */}
          <div className="relative group">
            <label className="block mb-2 text-xs font-mono tracking-widest text-zinc-500 uppercase">
              Access Credentials Key
            </label>
            <div className="relative">
              <Key className="absolute left-3.5 top-[15px] h-4 w-4 text-zinc-600 group-focus-within:text-cyan-400 transition-colors" />
              <input
                type="password"
                placeholder="Initialize Master Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full pl-11 pr-4 py-3.5 bg-zinc-950/60 border border-zinc-800/80 rounded-xl text-white placeholder-zinc-700 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 transition font-medium text-sm tracking-wide"
                required
              />
            </div>
          </div>

          {/* Master Submit Integration Controller */}
          <motion.button
            whileHover={!(loading || !generatedId || !name || !password) ? { scale: 1.01, boxShadow: "0 0 25px rgba(34,211,238,0.15)" } : {}}
            whileTap={!(loading || !generatedId || !name || !password) ? { scale: 0.99 } : {}}
            type="submit"
            disabled={loading || !generatedId || !name || !password}
            className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-zinc-950 py-4 rounded-xl font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed text-sm"
          >
            {loading ? (
              <>
                <span>Encrypting Profiles...</span>
                <Loader2 className="w-4 h-4 animate-spin" />
              </>
            ) : (
              <>
                <span>Commit Profile </span>
                <Sparkles className="w-4 h-4 text-zinc-950 fill-zinc-950" />
              </>
            )}
          </motion.button>
        </form>
      </div>

      {/* =========================================================================
          SUCCESS TERMINAL TELEMETRY LOG 
          ========================================================================= */}
      <AnimatePresence>
        {createdMemberId && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-5 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-zinc-950 via-zinc-950 to-emerald-950/10 p-5 relative overflow-hidden"
          >
            <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-emerald-500" />
            
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
                Data Stream Node Initialized
              </h3>
            </div>

            <div className="mt-4 space-y-2 font-mono">
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                  Target Document Node Address
                </p>
                <p className="text-xs font-bold text-zinc-300 break-all mt-1 bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/40">
                  {createdMemberId}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}