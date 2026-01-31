"use client";
import { useState, useRef } from "react";
import { Plus, FileText, Send, X } from "lucide-react";

export default function ScriptInput({ onProcess }: { onProcess: (text: string) => void }) {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-black/40 border border-cyan-500/30 rounded-[2rem] p-8 shadow-[0_0_30px_rgba(6,182,212,0.1)] backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-cyan-400 text-[10px] font-bold uppercase tracking-[0.4em]">Input Gateway</h3>
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
          placeholder="PASTE SCREENPLAY OR UPLOAD PDF..."
          className="w-full h-44 bg-zinc-950 border border-zinc-800 rounded-xl p-6 text-cyan-50 placeholder:text-zinc-700 focus:outline-none focus:border-cyan-500/50 transition-all font-mono text-sm leading-relaxed"
        />
        
        <div className="absolute bottom-4 right-4 flex items-center gap-3">
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf,.txt" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 bg-zinc-900 text-cyan-400 rounded-lg hover:bg-zinc-800 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
          >
            <Plus size={20} />
          </button>
          
          <button
            onClick={() => (text.trim() || fileName) && onProcess(text)}
            className="flex items-center gap-2 bg-cyan-500 text-black px-6 py-3 rounded-lg font-black text-xs uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            Process Script <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}