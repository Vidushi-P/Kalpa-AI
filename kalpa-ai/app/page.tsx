/*"use client";
import { useState } from "react";

export default function Home() {
  const [logs, setLogs] = useState("Waiting for upload...");

  async function handleUpload(e: any) {
    const file = e.target.files[0];
    if (!file) return;

    setLogs("Uploading and parsing...");

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/parse-pdf", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setLogs(JSON.stringify(data, null, 2));
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">PDF Parser Test</h1>
      <input type="file" onChange={handleUpload} className="border p-2 mb-4" />
      <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-auto h-96">
        {logs}
      </pre>
    </div>
  );
}*/
"use client";
import { useState } from "react";
import { Film, Sparkles, Brain, Clapperboard, Heart, FileText } from "lucide-react";
import InsightCard from "./components/InsightCard";
import ScriptInput from "./components/ScriptInput";
import StoryboardImage from "./components/StoryboardImage";

export default function Page() {
  // --- REAL STATE VARIABLES ---
  const [scenes, setScenes] = useState<any[]>([]); // List of scenes from PDF
  const [selectedScene, setSelectedScene] = useState<any>(null); // The scene user clicked
  
  // Analysis Data (from Member 2's AI)
  const [analysis, setAnalysis] = useState({ emotion: "", tone: "", mood: "", visual_prompt: "", analysis_text: "" });
  const [image, setImage] = useState<string | undefined>(undefined); // The generated image
  
  // Loading States
  const [processing, setProcessing] = useState(false); // General loading state

  // 1. HANDLER: When PDF is uploaded
  const handleScenesLoaded = (parsedScenes: any[]) => {
    setScenes(parsedScenes);
    // Automatically select the first scene to start
    if (parsedScenes.length > 0) {
      // Optional: Auto-analyze scene 1
      handleSceneClick(parsedScenes[0]);
    }
  };

  // 2. HANDLER: When a user clicks a Scene in the Sidebar
  const handleSceneClick = async (scene: any) => {
    setSelectedScene(scene);
    setProcessing(true);
    setAnalysis({ emotion: "", tone: "", mood: "", visual_prompt: "", analysis_text: "" });
    setImage(undefined);

    try {
      // --- STEP A: CALL MEMBER 2 (AI ANALYST) ---
      let aiData;
      try {
        const chatRes = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: scene.content }),
        });
        
        if (chatRes.ok) {
            aiData = await chatRes.json();
        } else {
            throw new Error("AI API Failed");
        }
      } catch (err) {
        console.warn("Using Backup Logic (Member 2 API not ready yet)");
        // FALLBACK: If AI isn't ready, we use a simple backup so the demo doesn't crash
        aiData = {
          emotion: "Suspenseful",
          tone: "High Contrast Noir",
          mood: "Cinematic Mystery",
          analysis_text: "The scene presents a high-stakes environment. Shadows play a crucial role in defining the isolation of the character.",
          visual_prompt: `Cinematic film still, ${scene.title}, dramatic lighting, high contrast, 8k`
        };
      }

      // Update UI with Text Analysis
      setAnalysis({
        emotion: aiData.emotion || "Intense",
        tone: aiData.tone || "Dramatic",
        mood: aiData.mood || "Cinematic",
        analysis_text: aiData.analysis_text || aiData.mood_visual_description || "Scene analysis complete.",
        visual_prompt: aiData.visual_prompt || aiData.mood
      });

      // --- STEP B: CALL MEMBER 3 (IMAGE GENERATOR) ---
      // We use the AI's visual prompt to generate the image
      const imagePrompt = aiData.visual_prompt || `Cinematic shot, ${aiData.mood}, ${scene.title}`;
      
      const imgRes = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: imagePrompt }),
      });

      if (imgRes.ok) {
        const imgData = await imgRes.json();
        setImage(imgData.image);
      }

    } catch (error) {
      console.error("Pipeline Error:", error);
    } finally {
      setProcessing(false);
    }
  };

  const hasProcessed = scenes.length > 0;

  return (
    <div className="flex h-screen w-full bg-[#03050b] text-white overflow-hidden font-sans relative">
      {/* Background Atmosphere */}
      <div className="absolute top-[-5%] right-[-5%] w-150 h-150 bg-pink-500/3 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[600px] h-[600px] bg-cyan-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      {/* SIDEBAR: SCENE SELECTOR */}
      {hasProcessed && (
        <aside className="w-80 h-full border-r border-white/5 flex flex-col bg-white/[0.01] backdrop-blur-3xl z-20 animate-in slide-in-from-left duration-700">
          <div className="p-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.3)]">
              <Film className="text-black" size={20} />
            </div>
            <span className="font-black text-xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-200/40">KALPA.AI</span>
          </div>
          
          <nav className="p-6 flex-1 overflow-y-auto">
            <p className="px-2 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em] mb-4">Script Scenes</p>
            <div className="space-y-2">
              {scenes.map((scene) => (
                <button 
                  key={scene.id}
                  onClick={() => handleSceneClick(scene)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold border transition-all duration-300 ${
                    selectedScene?.id === scene.id 
                    ? "bg-pink-500/10 border-pink-500/40 text-pink-200 shadow-[0_0_15px_rgba(236,72,153,0.1)]" 
                    : "bg-white/5 border-transparent text-zinc-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="truncate">{scene.title}</div>
                </button>
              ))}
            </div>
          </nav>
        </aside>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto relative z-10">
        <header className={`p-10 flex flex-col items-center transition-all duration-1000 ${hasProcessed ? 'pt-8 items-start' : 'h-full justify-center'}`}>
           {!hasProcessed && (
             <div className="mb-12 text-center animate-in fade-in zoom-in duration-700">
               <div className="w-24 h-24 bg-white/5 border border-pink-500/10 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-center shadow-2xl mx-auto mb-6">
                 <Sparkles className="text-pink-400" size={40} />
               </div>
               <h1 className="text-7xl font-black tracking-tighter mb-2">KALPA.AI</h1>
               <p className="text-pink-500/40 tracking-[0.6em] text-[10px] font-bold uppercase">Neural Storyboard Engine</p>
             </div>
           )}
           
           {/* FILE UPLOAD COMPONENT */}
           {/* Note: We use onScenesParsed to catch the array from your Parser API */}
           <div className={hasProcessed ? "w-full max-w-md" : "w-full max-w-xl"}>
              <ScriptInput onScenesParsed={handleScenesLoaded} />
           </div>
        </header>

        {/* DASHBOARD (REVEALS AFTER UPLOAD) */}
        {hasProcessed && selectedScene && (
          <div className="p-10 max-w-6xl mx-auto w-full space-y-10 animate-in fade-in slide-in-from-bottom duration-1000">
            
            {/* 1. INSIGHT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InsightCard title="MOOD" value={analysis.mood} type="mood" />
              <InsightCard title="EMOTION" value={analysis.emotion} type="emotion" />
              <InsightCard title="TONE" value={analysis.tone} type="tone" />
            </div>

            {/* 2. VISUAL STORYBOARD */}
            <div className="bg-white/3 backdrop-blur-2xl border border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 blur-[80px] -z-10 group-hover:bg-pink-500/10 transition-all" />
               <div className="flex justify-between items-end mb-8">
                 <h3 className="text-white/20 text-[10px] font-bold uppercase tracking-[0.4em]">Visual Storyboard</h3>
                 <span className="text-pink-400/50 text-xs font-mono">{selectedScene.title}</span>
               </div>
               
               {/* This connects to Member 3's API Result */}
               <StoryboardImage imageUrl={image} isLoading={processing && !image} />
            </div>

            {/* 3. AI ANALYSIS TEXT */}
            <div className="bg-linear-to-r from-pink-500/5 to-transparent border-l-2 border-pink-500/20 p-8 rounded-r-3xl">
              <div className="flex items-center gap-3 mb-4 text-pink-400/60">
                <FileText size={16} />
                <span className="text-xs font-bold tracking-widest uppercase">Scene Context</span>
              </div>
              <p className="text-zinc-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                 {/* Displaying the Scene Content or Analysis */}
                 {processing ? "/// NEURAL NETWORKS ANALYZING SCENE DATA..." : selectedScene.content}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}