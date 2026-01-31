"use client";
import { useState, useRef } from "react";
import { Plus, FileText, Send, X, Loader2 } from "lucide-react";

// Update the prop to accept the list of scenes (array) instead of just a string
export default function ScriptInput({ onScenesParsed }: { onScenesParsed: (scenes: any[]) => void }) {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Added loading state
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- THE REAL UPLOAD LOGIC ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true); // Start loading spinner

    // create the payload for the API
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Call Member 3's PDF Parser API
      const res = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        // Send the parsed scenes back to page.tsx
        if (data.scenes) {
          onScenesParsed(data.scenes);
        }
      } else {
        console.error("Failed to upload");
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-black/40 border border-cyan-500/30 rounded-[2rem] p-8 shadow-[0_0_30px_rgba(6,182,212,0.1)] backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-cyan-400 text-[10px] font-bold uppercase tracking-[0.4em]">Input Gateway</h3>
        
        {/* FILE BADGE */}
        {fileName && (
          <div className="flex items-center gap-2 bg-purple-900/20 px-3 py-1 rounded-full border border-purple-500/40 animate-pulse">
            <FileText size={12} className="text-purple-400" />
            <span className="text-[10px] text-purple-100 uppercase font-bold">{fileName}</span>
            <button onClick={() => setFileName(null)}><X size={12} className="text-zinc-500 hover:text-white" /></button>
          </div>
        )}
      </div>

      <div className="relative group">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="UPLOAD PDF TO BEGIN..."
          readOnly // Disable typing for now to force PDF upload (easier for demo)
          className="w-full h-44 bg-zinc-950 border border-zinc-800 rounded-xl p-6 text-cyan-50 placeholder:text-zinc-700 focus:outline-none focus:border-cyan-500/50 transition-all font-mono text-sm leading-relaxed cursor-not-allowed opacity-50"
        />
        
        <div className="absolute bottom-4 right-4 flex items-center gap-3">
          {/* HIDDEN INPUT */}
          <input 
             type="file" 
             ref={fileInputRef} 
             onChange={handleFileUpload} 
             className="hidden" 
             accept=".pdf" 
          />

          {/* UPLOAD BUTTON */}
          <button
            disabled={loading}
            onClick={() => fileInputRef.current?.click()}
            className="p-3 bg-zinc-900 text-cyan-400 rounded-lg hover:bg-zinc-800 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)] disabled:opacity-50"
          >
            <Plus size={20} />
          </button>
          
          {/* PROCESS BUTTON (Shows Loading) */}
          <button
            disabled={true} // Disabled because upload happens automatically on file select
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] ${
              loading ? "bg-cyan-900 text-cyan-200 cursor-wait" : "bg-cyan-500 text-black hover:bg-cyan-400"
            }`}
          >
            {loading ? (
              <>Analyzing <Loader2 size={14} className="animate-spin" /></>
            ) : (
              <>Process Script <Send size={14} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}