"use client";
import { Loader2 } from "lucide-react";

export default function StoryboardImage({ isLoading, imageUrl }: { isLoading: boolean, imageUrl?: string }) {
  return (
    <div className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden bg-black/40 border border-white/5 flex items-center justify-center">
      {isLoading ? (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="text-pink-500 animate-spin" size={32} />
          <p className="text-[10px] font-bold text-pink-500/40 uppercase tracking-widest">Generating Visuals...</p>
        </div>
      ) : (
        <img src={imageUrl} alt="Storyboard" className="w-full h-full object-cover" />
      )}
    </div>
  );
}