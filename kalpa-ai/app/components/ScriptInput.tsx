"use client";
import { useState } from "react";
import { Upload, FileText, Clipboard, Play } from "lucide-react";

interface ScriptInputProps {
  onScenesParsed: (scenes: any[]) => void;
}

export default function ScriptInput({ onScenesParsed }: ScriptInputProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'text'>('upload');
  const [textInput, setTextInput] = useState("");
  const [loading, setLoading] = useState(false);

  // --- OPTION 1: HANDLE FILE UPLOAD (Existing Logic) ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      onScenesParsed(data.scenes);
    } catch (error) {
      console.error("PDF Parse Error:", error);
      alert("Failed to parse PDF. Please try pasting the text instead.");
    } finally {
      setLoading(false);
    }
  };

  // --- OPTION 2: HANDLE TEXT INPUT (New Logic) ---
  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    setLoading(true);

    // SIMPLE CLIENT-SIDE PARSER
    // 1. Split by "INT." or "EXT." to find scenes
    // 2. This regex finds "INT." or "EXT." at the start of a line
    const rawScenes = textInput.split(/(?=INT\.|EXT\.)/g);

    const parsedScenes = rawScenes
      .map((content, index) => {
        const lines = content.trim().split("\n");
        const title = lines[0] || `Scene ${index + 1}`; // First line is usually the heading
        
        // Filter out empty scenes
        if (content.trim().length < 10) return null;

        return {
          id: `scene-${index}`,
          title: title.trim(),
          content: content.trim()
        };
      })
      .filter(Boolean); // Remove nulls

    // If regex failed (user pasted unstructured text), treat it as one big scene
    if (parsedScenes.length === 0 && textInput.length > 0) {
        parsedScenes.push({
            id: 'scene-0',
            title: 'Full Script / Scene 1',
            content: textInput
        });
    }

    // Simulate a small delay for "AI effect" then load
    setTimeout(() => {
        onScenesParsed(parsedScenes);
        setLoading(false);
    }, 800);
  };

  return (
    <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-2 backdrop-blur-xl">
      
      {/* TABS */}
      <div className="flex gap-2 mb-4 p-1 bg-black/20 rounded-2xl">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
            activeTab === 'upload' ? 'bg-pink-500 text-white shadow-lg' : 'text-zinc-500 hover:text-white'
          }`}
        >
          <Upload size={14} /> Upload PDF
        </button>
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
            activeTab === 'text' ? 'bg-pink-500 text-white shadow-lg' : 'text-zinc-500 hover:text-white'
          }`}
        >
          <Clipboard size={14} /> Paste Text
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="p-4">
        {activeTab === 'upload' ? (
          // --- UPLOAD MODE ---
          <div className="border-2 border-dashed border-white/10 rounded-2xl p-10 text-center hover:border-pink-500/50 hover:bg-pink-500/5 transition-all group relative">
            <input 
              type="file" 
              accept="application/pdf"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={loading}
            />
            <div className="flex flex-col items-center gap-3 text-zinc-400 group-hover:text-pink-200 transition-colors">
              <div className="p-4 bg-white/5 rounded-full group-hover:bg-pink-500/20 transition-all">
                 {loading ? <div className="animate-spin w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full" /> : <FileText size={24} />}
              </div>
              <p className="text-xs font-bold uppercase tracking-widest">
                {loading ? "Parsing Script..." : "Drop PDF Here"}
              </p>
            </div>
          </div>
        ) : (
          // --- TEXT MODE ---
          <div className="space-y-4">
            <textarea
              placeholder="Paste your script here... (Start scenes with INT. or EXT. for auto-splitting)"
              className="w-full h-40 bg-black/30 border border-white/10 rounded-xl p-4 text-sm text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:border-pink-500/50 resize-none font-mono"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
            <button 
              onClick={handleTextSubmit}
              disabled={loading || !textInput}
              className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all ${
                !textInput ? 'bg-white/5 text-zinc-600 cursor-not-allowed' : 'bg-white text-black hover:bg-pink-500 hover:text-white shadow-lg shadow-pink-500/20'
              }`}
            >
              {loading ? (
                 <span className="animate-pulse">Processing Text...</span>
              ) : (
                 <> <Play size={14} /> Analyze Script </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}