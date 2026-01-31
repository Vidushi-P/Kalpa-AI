"use client";
import { useState } from "react";
import { Film, LayoutDashboard, Sparkles } from "lucide-react";
import InsightCard from "./components/InsightCard";
import StoryboardImage from "./components/StoryboardImage";
import ScriptInput from "./components/ScriptInput";

const MOCK_DATA = {
  sceneTitle: "Scene 1: The Confrontation",
  emotion: "Anxiety, Determination",
  mood: "Tense, Gritty",
  tone: "Neo-Noir, Suspenseful",
  image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=2070",
  analysis: "Director's Intelligence: The high-contrast lighting underscores the internal conflict, utilizing pink hues to soften the harsh cybernetic environment."
};

export default function Page() {
  const [hasProcessed, setHasProcessed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const handleProcess = (input: string) => {
    setHasProcessed(true); // Reveals the dashboard panels
    setLoading(true);
    setData(null); // Clear old data

    // Simulate AI synthesis
    setTimeout(() => {
      setLoading(false);
      setData(MOCK_DATA);
    }, 2500);
  };

  return (
    <div className="flex h-screen w-full bg-[#02040a] text-white overflow-hidden font-sans relative">
      {/* Background Atmosphere */}
      <div className="absolute top-[-5%] right-[-5%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Side Navigation (Reveals on Process) */}
      {hasProcessed && (
        <aside className="w-72 h-full border-r border-white/5 flex flex-col bg-white/[0.01] backdrop-blur-3xl z-20 animate-in slide-in-from-left duration-700">
          <div className="p-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Film className="text-black" size={20} />
            </div>
            <span className="font-black text-xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-200/40">KALPA.AI</span>
          </div>
          <nav className="p-6">
            <p className="px-2 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em] mb-4">Scene Explorer</p>
            <button className="w-full text-left px-4 py-3 rounded-xl text-xs font-bold border bg-pink-500/5 border-pink-500/20 text-pink-200 shadow-[0_0_15px_rgba(236,72,153,0.05)]">
              {data ? data.sceneTitle : "ANALYZING..."}
            </button>
          </nav>
        </aside>
      )}

      <main className="flex-1 overflow-y-auto relative z-10">
        <header className={`p-10 flex flex-col items-center transition-all duration-1000 ${hasProcessed ? 'pt-8' : 'h-full justify-center'}`}>
           {!hasProcessed && (
             <div className="mb-12 text-center">
               <div className="w-24 h-24 bg-white/5 border border-pink-500/10 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-center shadow-2xl mx-auto mb-6">
                 <Sparkles className="text-pink-400" size={40} />
               </div>
               <h1 className="text-7xl font-black tracking-tighter mb-2">KALPA.AI</h1>
               <p className="text-pink-500/40 tracking-[0.6em] text-[10px] font-bold uppercase">Neural Storyboard Engine</p>
             </div>
           )}
           <ScriptInput onProcess={handleProcess} />
        </header>

        {hasProcessed && (
          <div className="p-10 max-w-6xl mx-auto w-full space-y-10 animate-in fade-in slide-in-from-bottom duration-1000">
            {/* INSIGHT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InsightCard title="MOOD" value={data?.mood || "SCANNING..."} type="mood" />
              <InsightCard title="EMOTION" value={data?.emotion || "ANALYZING..."} type="emotion" />
              <InsightCard title="TONE" value={data?.tone || "DETECTING..."} type="tone" />
            </div>

            {/* STORYBOARD */}
            <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/5 rounded-[3rem] p-10 shadow-2xl relative">
               <h3 className="text-white/20 text-[10px] font-bold uppercase tracking-[0.4em] mb-8">Visual Storyboard</h3>
               <StoryboardImage isLoading={loading} imageUrl={data?.image} />
            </div>

            {/* ANALYSIS */}
            <div className="bg-gradient-to-r from-pink-500/5 to-transparent border-l-2 border-pink-500/20 p-8 rounded-r-3xl">
              <p className="text-zinc-400 font-mono text-sm italic">
                {data ? `> ${data.analysis}` : "/// SYNTHESIZING DATA..."}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}