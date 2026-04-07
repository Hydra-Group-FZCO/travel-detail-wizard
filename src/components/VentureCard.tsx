import { ExternalLink } from "lucide-react";

interface VentureCardProps {
  name: string;
  url: string;
  category: string;
  color: string;
  desc: string;
  metrics: string;
}

const VentureCard = ({ name, url, category, color, desc, metrics }: VentureCardProps) => {
  return (
    <div
      className="glass-card rounded-2xl p-6 group hover:scale-[1.02] transition-all duration-300 h-full flex flex-col"
      style={{ boxShadow: `0 0 0 0 ${color}00` }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 0 40px -10px ${color}40`)}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = `0 0 0 0 ${color}00`)}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-sm" style={{ backgroundColor: `${color}20`, color }}>
          {name.charAt(0)}
        </div>
        <div>
          <h3 className="text-base font-bold">{name}</h3>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${color}15`, color }}>{category}</span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{desc}</p>
      <p className="text-xs text-muted-foreground mb-4 font-mono">{metrics}</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:opacity-80"
        style={{ color }}
      >
        Visit <ExternalLink size={14} />
      </a>
    </div>
  );
};

export default VentureCard;
