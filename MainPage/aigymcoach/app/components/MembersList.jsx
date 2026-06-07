"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Trash2, Loader2, ShieldAlert, Search, Fingerprint, Activity } from "lucide-react";

export default function MembersList() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingMember, setDeletingMember] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const API_URL =
  process.env.NEXT_PUBLIC_BASE_URL;
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const gymData = localStorage.getItem("gym");
      if (!gymData) return;
      const gym = JSON.parse(gymData);

      const response = await fetch(
        `${API_URL}/api/member/members/${gym.docId}`
      );
      const data = await response.json();

      if (data.success) {
        setMembers(data.members || []);
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to load member arrays");
    } finally {
      setLoading(false);
    }
  };

  const deleteMember = async (memberid) => {
    if (!confirm("Confirm complete profile node termination?")) return;

    try {
      setDeletingMember(memberid);
      const gymData = localStorage.getItem("gym");
      if (!gymData) return;
      const gym = JSON.parse(gymData);

      const response = await fetch(
        `${API_URL}/api/member/member/${gym.docId}/${memberid}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();

      if (data.success) {
        toast.success("Profile Node Purged");
        setMembers((prev) => prev.filter((m) => m.memberid !== memberid));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Profile purge sequence interrupted");
    } finally {
      setDeletingMember("");
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // --- Search Filtering Track ---
  const filteredMembers = members.filter(
    (m) =>
      m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.userid?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-3xl bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative overflow-hidden">
      
      {/* Structural Cyber Mesh Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

      {/* Roster Header and Search Matrix */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/60 pb-5 mb-5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
            <Users className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight uppercase text-white">
              Active Roster Index
            </h2>
            <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase mt-0.5 flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-emerald-400" />
              Live Linked Profiles: {members.length}
            </p>
          </div>
        </div>

        {/* Dynamic Telemetry Search Filter */}
        <div className="relative max-w-xs w-full group">
          <Search className="absolute left-3.5 top-[13px] h-3.5 w-3.5 text-zinc-600 group-focus-within:text-cyan-400 transition-colors" />
          <input
            type="text"
            placeholder="Search name or core ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-950/80 border border-zinc-800/80 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400/50 transition font-medium tracking-wide"
          />
        </div>
      </div>

      {/* Main Roster Display Container */}
      <div className="relative z-10">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-zinc-500 gap-3 font-mono text-xs">
            <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
            <span className="tracking-widest uppercase">Syncing Node Database Matrix...</span>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-zinc-600 gap-2.5 border border-dashed border-zinc-800/50 rounded-xl bg-zinc-950/20">
            <ShieldAlert className="w-6 h-6 text-zinc-700" />
            <span className="font-mono text-xs uppercase tracking-widest">No Active Nodes Indexed</span>
          </div>
        ) : (
          <div className="space-y-2.5">
            <AnimatePresence initial={false}>
              {filteredMembers.map((member) => (
                <motion.div
                  key={member.memberid}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30, scale: 0.97, transition: { duration: 0.2 } }}
                  className="flex items-center justify-between p-4 bg-zinc-950/40 border border-zinc-800/50 hover:border-zinc-800/80 rounded-xl transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="flex items-center gap-4">
                    
                    {/* User Profile Character Block Avatar */}
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-mono font-black text-sm text-cyan-400 uppercase tracking-tighter shadow-inner shrink-0">
                      {member.name?.substring(0, 2) || "NN"}
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-zinc-200 capitalize tracking-wide text-sm sm:text-base">
                        {member.name}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 font-mono text-[10px] tracking-wider uppercase">
                        <span className="text-cyan-400 font-bold bg-cyan-500/5 border border-cyan-500/10 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                          <Fingerprint className="w-2.5 h-2.5" />
                          {member.userid}
                        </span>
                        <span className="text-zinc-600 break-all">
                          NODE_REF: {member.memberid}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tactical Isolation Purge Button */}
                  <button
                    onClick={() => deleteMember(member.memberid)}
                    disabled={deletingMember === member.memberid}
                    className="p-3 rounded-xl bg-zinc-900/60 hover:bg-red-500/10 text-zinc-600 hover:text-red-400 border border-zinc-800/80 hover:border-red-500/30 transition-all duration-200 disabled:opacity-40 shrink-0"
                    title="Terminate Profile Connection"
                  >
                    {deletingMember === member.memberid ? (
                      <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}


//  const [bodyParts, setBodyParts] = useState({
//     Chest: ["Upper Chest", "Middle Chest", "Lower Chest"],
//     Back: ["Lats", "Upper Back", "Lower Back", "Traps"],
//     Shoulders: ["Front Delts", "Side Delts", "Rear Delts"],
//     Biceps: ["Long Head", "Short Head", "Brachialis"],
//     Triceps: ["Long Head", "Lateral Head", "Medial Head"],
//     Forearms: ["Flexors", "Extensors", "Brachioradialis"],
//     Legs: ["Quadriceps", "Hamstrings", "Glutes", "Calves", "Adductors"],
//     Abs: ["Upper Abs", "Lower Abs", "Obliques", "Serratus"],
//   });
