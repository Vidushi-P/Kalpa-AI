"use client";
import { useState, useRef, useEffect } from "react";
import { Film, Sparkles, FileText, Camera, Lightbulb, Lock } from "lucide-react";
import InsightCard from "./components/InsightCard";
import ScriptInput from "./components/ScriptInput";
import StoryboardImage from "./components/StoryboardImage";
import TechCard from "./components/TechCard"; 

export default function Page() {
  // --- REAL STATE VARIABLES ---
  const [scenes, setScenes] = useState<any[]>([]); 
  const [selectedScene, setSelectedScene] = useState<any>(null); 
  
  const [analysis, setAnalysis] = useState({ 
    emotion: "", 
    tone: "", 
    mood: "", 
    visual_prompt: "", 
    analysis_text: "", 
    camera_style: "", 
    lighting_style: ""
  });
  
  const [image, setImage] = useState<string | undefined>(undefined); 
  const [processing, setProcessing] = useState(false); 

  // Ref to scroll to top
  const topRef = useRef<HTMLDivElement>(null);

  // 1. HANDLER: When PDF is uploaded
  const handleScenesLoaded = (parsedScenes: any[]) => {
    setScenes(parsedScenes);
    if (parsedScenes.length > 0) {
      handleSceneClick(parsedScenes[0]);
    }
  };

  // 2. HANDLER: When a user clicks a Scene
  const handleSceneClick = async (scene: any) => {
    // --- PROTECTION: Prevent clicking if already working ---
    if (processing) return; 
    
    // UI Updates
    setSelectedScene(scene);
    setProcessing(true);
    setImage(undefined);
    
    // Auto-scroll to top of dashboard
    if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: "smooth" });
    }
    
    // Reset Analysis
    setAnalysis({ 
        emotion: "", tone: "", mood: "", visual_prompt: "", analysis_text: "", 
        camera_style: "", lighting_style: "" 
    });

    let aiData: any = {}; 

    try {
      // --- STEP A: CALL MEMBER 2 (AI ANALYST) ---
      try {
        // Add a timeout signal to prevent hanging forever
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

        const chatRes = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: scene.content }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (chatRes.ok) {
            aiData = await chatRes.json();
        } else {
            throw new Error("AI API Failed");
        }
      } catch (err) {
        console.warn("Using Backup Logic (API timeout or error)");
        aiData = {
          emotion: "Suspenseful",
          tone: "Noir / Thriller",
          mood: "High Tension",
          analysis_text: "The scene implies a moment of instability and high stakes.",
          visual_prompt: `Cinematic film still, ${scene.title}, dramatic lighting, 8k, south indian cinema`,
          camera_style: "Handheld / Shaky Cam",
          lighting_style: "Low Key / Silhouettes"
        };
      }

      // --- UPDATE UI WITH TEXT ANALYSIS ---
      setAnalysis({
        emotion: aiData.emotion || "Intense",
        tone: aiData.tone || "Dramatic",
        mood: aiData.mood || "Cinematic",
        analysis_text: aiData.analysis_text || "Scene analysis complete.",
        visual_prompt: aiData.visual_prompt || aiData.mood,
        camera_style: aiData.camera_style || "Cinematic Wide",
        lighting_style: aiData.lighting_style || "Natural Lighting"
      });

      // --- STEP B: CALL MEMBER 3 (IMAGE GENERATOR) ---
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
      setProcessing(false); // ALWAYS UNLOCK BUTTONS AT THE END
    }
  };

  const hasProcessed = scenes.length > 0;

  return (
    <div className="flex h-screen w-full bg-[#03050b] text-white overflow-hidden font-sans relative">
      <div className="absolute top-[-5%] right-[-5%] w-150 h-150 bg-pink-500/3 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[600px] h-[600px] bg-cyan-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      {/* SIDEBAR */}
      {hasProcessed && (
        <aside className="w-80 h-full border-r border-white/5 flex flex-col bg-white/[0.01] backdrop-blur-3xl z-20 animate-in slide-in-from-left duration-700">
          
          {/* LOGO (TEXT ONLY) */}
          <div className="p-8">
            <span className="font-black text-xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-200/40">KALPA.AI</span>
          </div>

          <nav className="p-6 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
                <p className="px-2 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em]">Script Scenes</p>
                {processing && <span className="text-[10px] text-pink-500 font-mono animate-pulse">PROCESSING...</span>}
            </div>
            
            <div className="space-y-2">
              {scenes.map((scene) => (
                <button 
                  key={scene.id}
                  onClick={() => handleSceneClick(scene)}
                  disabled={processing} // <--- DISABLES CLICK WHILE PROCESSING
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold border transition-all duration-300 ${
                    selectedScene?.id === scene.id 
                    ? "bg-pink-500/10 border-pink-500/40 text-pink-200 shadow-[0_0_15px_rgba(236,72,153,0.1)]" 
                    : processing 
                        ? "bg-white/5 border-transparent text-zinc-600 opacity-50 cursor-not-allowed" // Dimmed when busy
                        : "bg-white/5 border-transparent text-zinc-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="truncate w-full">{scene.title}</div>
                    {processing && selectedScene?.id === scene.id && <Lock size={10} className="text-pink-500" />}
                  </div>
                </button>
              ))}
            </div>
          </nav>
        </aside>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto relative z-10" ref={topRef}>
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
           <div className={hasProcessed ? "w-full max-w-md" : "w-full max-w-xl"}>
              <ScriptInput onScenesParsed={handleScenesLoaded} />
           </div>
        </header>

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
               <StoryboardImage imageUrl={image} isLoading={processing && !image} />
            </div>

            {/* 3. TECHNICAL ADVISOR GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TechCard 
                title="Camera Style" 
                value={analysis.camera_style} 
                icon={Camera} 
                description="Suggested angle to capture the scene's emotion."
              />
              <TechCard 
                title="Lighting Setup" 
                value={analysis.lighting_style} 
                icon={Lightbulb} 
                description="Recommended lighting scheme for tone."
              />
            </div>

            {/* 4. SCENE CONTEXT TEXT */}
            <div className="bg-linear-to-r from-pink-500/5 to-transparent border-l-2 border-pink-500/20 p-8 rounded-r-3xl">
              <div className="flex items-center gap-3 mb-4 text-pink-400/60">
                <FileText size={16} />
                <span className="text-xs font-bold tracking-widest uppercase">Scene Context</span>
              </div>
              <p className="text-zinc-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                 {processing ? "/// NEURAL NETWORKS ANALYZING SCENE DATA..." : (analysis.analysis_text || selectedScene.content)}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}