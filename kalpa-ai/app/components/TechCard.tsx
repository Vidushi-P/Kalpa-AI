import { LucideIcon } from "lucide-react";

interface TechCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  description: string; // Explains "Why" this angle/light is used
}

export default function TechCard({ title, value, icon: Icon, description }: TechCardProps) {
  return (
    <div className="bg-zinc-900/50 border border-white/10 p-5 rounded-2xl backdrop-blur-sm hover:bg-zinc-900 transition-colors group">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400 group-hover:text-pink-300 group-hover:bg-pink-500/20 transition-all">
          <Icon size={18} />
        </div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500">{title}</h4>
      </div>
      
      <div className="space-y-1">
        <p className="text-lg font-bold text-white font-mono">{value || "Analyzing..."}</p>
        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">{description}</p>
      </div>
    </div>
  );
}