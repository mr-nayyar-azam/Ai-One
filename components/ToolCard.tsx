
import React from 'react';
import { Recommendation } from '../types';

interface ToolCardProps {
  tool: Recommendation;
  onSaveToggle?: (id: string) => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onSaveToggle }) => {
  const typeStyles = {
    "AI": "bg-blue-500/10 border-blue-500/20 text-blue-400",
    "Utility": "bg-purple-500/10 border-purple-500/20 text-purple-400",
    "Software": "bg-amber-500/10 border-amber-500/20 text-amber-400",
    "Mobile": "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
  };

  const platformIcons = {
    "Web": <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" strokeWidth={2}/></svg>,
    "Android": <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414ZM17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414ZM17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414ZM17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414ZM17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414ZM17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414ZM17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414ZM17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414ZM17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414ZM17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414ZM17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414ZM17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414ZM17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414ZM17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414ZM17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414ZM17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414ZM17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414ZM17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414ZM17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414ZM17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414ZM17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414ZM17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414ZM17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414ZM17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414ZM17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414ZM17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414Z"/></svg>,
    "iOS": <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.1 2.48-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>,
    "Desktop": <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth={2}/></svg>,
    "Open Source": <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
  };

  const { score_breakdown: sb } = tool;

  return (
    <div className="group relative rounded-2xl p-6 bg-slate-900/40 border border-white/5 backdrop-blur-lg hover:border-white/10 hover:bg-slate-900/60 transition-all duration-500 shadow-xl">
      {/* Status Badges */}
      <div className="absolute -top-3 left-6 flex gap-2">
        {tool.is_editors_pick && (
          <span className="px-2 py-1 rounded-md bg-blue-600 text-[8px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-600/20">Editor's Pick</span>
        )}
        {tool.is_trending && (
          <span className="px-2 py-1 rounded-md bg-amber-500 text-[8px] font-black uppercase tracking-widest text-white shadow-lg shadow-amber-500/20">Trending</span>
        )}
        {tool.is_top_rated && (
          <span className="px-2 py-1 rounded-md bg-emerald-500 text-[8px] font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-500/20">Top Rated</span>
        )}
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-3">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onSaveToggle?.(tool.id);
          }}
          className={`p-2 rounded-xl border transition-all duration-300 active:scale-90 ${
            tool.is_saved 
              ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/30' 
              : 'bg-white/5 border-white/10 text-slate-500 hover:text-white hover:border-white/30 hover:scale-110'
          }`}
          aria-label={tool.is_saved ? "Unsave Tool" : "Save Tool"}
        >
          <svg className={`w-4 h-4 transition-transform ${tool.is_saved ? 'scale-110' : ''}`} fill={tool.is_saved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      <div className="relative flex flex-col gap-4">
        <div className="flex flex-wrap gap-2 pr-12">
          <span className={`px-2 py-1 rounded-md border text-[9px] font-black uppercase tracking-[0.15em] ${typeStyles[tool.tool_type] || typeStyles.Utility}`}>
            {tool.tool_type}
          </span>
          <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
            {tool.category}
          </span>
        </div>

        <div>
          <h3 className="text-lg font-black text-white mb-1 group-hover:text-blue-400 transition-colors leading-tight">{tool.name}</h3>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex gap-1.5">
              {tool.platform.map(p => (
                <div key={p} className="text-slate-500 hover:text-blue-400 transition-colors" title={p}>
                  {platformIcons[p as keyof typeof platformIcons]}
                </div>
              ))}
            </div>
            {tool.installs && (
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1">
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth={3}/></svg>
                {tool.installs}
              </span>
            )}
          </div>
          <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 font-medium mb-2">{tool.description}</p>
          
          {tool.why_recommended && (
            <div className="bg-blue-500/5 border-l-2 border-blue-500/30 pl-3 py-1 mb-3">
               <p className="text-[10px] italic text-blue-300/80">"{tool.why_recommended}"</p>
            </div>
          )}
        </div>

        {/* Scoring Breakdown */}
        <div className="bg-black/20 rounded-xl p-4 border border-white/5">
          <div className="flex items-end justify-between mb-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Relevance Score</span>
              <span className="text-3xl font-black text-white leading-none">{tool.intelligence_score}<span className="text-sm text-slate-600 font-normal">/100</span></span>
            </div>
            <div className="text-right">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pricing</span>
               <div className={`text-xs font-black uppercase ${tool.pricing === "Free" ? "text-green-400" : "text-amber-400"}`}>{tool.pricing}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {[
              { label: 'Match', val: sb.relevance, max: 25 },
              { label: 'Features', val: sb.features, max: 15 },
              { label: 'Preferences', val: sb.preference_fit, max: 20 },
              { label: 'Platform', val: sb.platform, max: 10 },
              { label: 'Reviews', val: sb.reviews, max: 10 },
              { label: 'Popularity', val: sb.popularity, max: 10 },
              { label: 'Free Access', val: sb.free_access, max: 5 },
              { label: 'Trust', val: sb.trust, max: 5 },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center border-b border-white/5 pb-1">
                <span className="text-[9px] text-slate-500 uppercase font-bold">{item.label}</span>
                <span className="text-[10px] font-mono text-slate-300">{item.val}<span className="text-slate-600">/{item.max}</span></span>
              </div>
            ))}
          </div>
        </div>

        {tool.supported_formats && (
          <div className="flex flex-wrap gap-1">
            {tool.supported_formats.slice(0, 4).map(f => (
              <span key={f} className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-slate-500 font-mono uppercase">{f}</span>
            ))}
            {tool.supported_formats.length > 4 && <span className="text-[8px] text-slate-700 font-mono">+{tool.supported_formats.length - 4}</span>}
          </div>
        )}

        <div className="flex flex-col gap-2 mt-2">
            <a 
              href={tool.website_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full text-center py-3 rounded-xl bg-white text-slate-950 font-black text-[10px] uppercase tracking-widest hover:bg-blue-400 transition-all active:scale-95 shadow-lg shadow-white/5"
            >
              Access Tool
            </a>
            {tool.store_url && (
              <a 
                href={tool.store_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full text-center py-2.5 rounded-xl border border-white/10 text-slate-400 font-black text-[9px] uppercase tracking-widest hover:text-white hover:border-white/30 transition-all"
              >
                View in Store
              </a>
            )}
        </div>
        
        {tool.limitations && (
          <p className="text-[9px] text-slate-600 italic mt-1 leading-tight">
            * {tool.limitations}
          </p>
        )}
      </div>
    </div>
  );
};

export default ToolCard;
