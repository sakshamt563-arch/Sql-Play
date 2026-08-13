import React from 'react';
import { CheckCircle2, ArrowRight, Sparkles, Award, Tag } from 'lucide-react';

export function ProblemCard({ problem, isSolved, onSelect }) {
  const getDifficultyStyles = (diff) => {
    switch (diff) {
      case 'easy':
        return {
          badge: <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Easy</span>,
          hoverBorder: 'hover:border-emerald-300 hover:shadow-emerald-500/10',
          accentColor: 'text-emerald-600'
        };
      case 'medium':
        return {
          badge: <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200">Medium</span>,
          hoverBorder: 'hover:border-amber-300 hover:shadow-amber-500/10',
          accentColor: 'text-amber-600'
        };
      case 'hard':
        return {
          badge: <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">Hard</span>,
          hoverBorder: 'hover:border-rose-300 hover:shadow-rose-500/10',
          accentColor: 'text-rose-600'
        };
      default:
        return {};
    }
  };

  const diffStyle = getDifficultyStyles(problem.difficulty);

  return (
    <div 
      onClick={() => onSelect(problem.id)}
      className={`group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between ${
        isSolved 
          ? 'bg-emerald-50/60 border-emerald-200/80 hover:border-emerald-400 hover:bg-emerald-50/90 shadow-sm' 
          : `glass-panel glass-panel-hover ${diffStyle.hoverBorder}`
      }`}
    >
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            {isSolved ? (
              <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0 shadow-sm">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-purple-100/70 border border-purple-200 flex items-center justify-center text-purple-600 group-hover:text-violet-700 group-hover:bg-purple-200/80 transition-colors shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
            )}
            <div>
              <h3 className="font-extrabold text-base text-violet-950 group-hover:text-violet-700 transition-colors line-clamp-1">
                {problem.title}
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">{problem.category}</span>
            </div>
          </div>
          
          {diffStyle.badge}
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed font-sans">
          {(problem.description_md || '').replace(/###|`|\*{2}/g, '').substring(0, 115)}...
        </p>
      </div>

      {/* Footer Details */}
      <div className="flex items-center justify-between pt-3 border-t border-purple-100/80">
        <div className="flex items-center gap-1.5 flex-wrap">
          {(Array.isArray(problem.tags) ? problem.tags : (Array.isArray(problem.tag) ? problem.tag : [])).slice(0, 2).map((tag, idx) => (
            <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 font-mono">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-violet-700 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-violet-600" />
            +{problem.points} XP
          </span>
          <div className="w-7 h-7 rounded-lg bg-purple-100 border border-purple-200 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-colors">
            <ArrowRight className="w-3.5 h-3.5 text-purple-700 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}
