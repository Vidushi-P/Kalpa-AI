"use client";
import { Cloud, Heart, Zap } from "lucide-react";

export default function InsightCard({ title, value, type }: { title: string; value: string; type: string }) {
  const isPink = type === "emotion";
  return (
    <div className={`bg-white/[0.03] backdrop-blur-2xl border ${isPink ? 'border-pink-500/30 shadow-[0_0_20px_rgba(236,72,153,0.1)]' : 'border-white/5'} rounded-[2rem] p-8 transition-all hover:bg-white/10`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center ${isPink ? 'text-pink-400' : 'text-cyan-400'}`}>
          {type === "mood" ? <Cloud size={18} /> : type === "emotion" ? <Heart size={18} /> : <Zap size={18} />}
        </div>
        <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">{title}</span>
      </div>
      <h4 className="text-2xl font-black text-white/90">{value}</h4>
    </div>
  );
}