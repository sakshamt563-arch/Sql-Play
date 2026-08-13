import React from 'react';
import { X, Globe, Terminal, Check, Copy, ExternalLink, ShieldCheck } from 'lucide-react';

export function DeploymentGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const copyCommand = (cmd) => {
    navigator.clipboard.writeText(cmd);
    alert(`Copied command to clipboard: ${cmd}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl p-6 bg-white border border-purple-100 rounded-3xl shadow-2xl overflow-hidden space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-violet-950">Publish Your SQL Play Website</h2>
              <p className="text-xs text-slate-500">Step-by-step guide to hosting this app online for public access</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-purple-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Deploy Options */}
        <div className="space-y-4 text-sm">
          
          {/* Option 1: Vercel (Recommended) */}
          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-violet-950 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-xs font-bold">1</span>
                Option A: Instant Deploy via Vercel (Recommended)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-bold">Free & Fast</span>
            </div>

            <p className="text-xs text-slate-600">
              Vercel builds and hosts your entire application with a free public URL in under 60 seconds!
            </p>

            <div className="font-mono text-xs p-3 rounded-xl bg-white border border-purple-200 flex items-center justify-between text-slate-800 shadow-xs">
              <span>npx vercel</span>
              <button 
                onClick={() => copyCommand('npx vercel')}
                className="p-1 text-slate-400 hover:text-violet-700"
                title="Copy command"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Option 2: Netlify / GitHub Pages */}
          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-violet-950 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-xs font-bold">2</span>
                Option B: Static Production Build
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200 font-mono font-bold">Any Host</span>
            </div>

            <p className="text-xs text-slate-600">
              Generate static client-side bundle in <code className="text-violet-700 font-mono">dist/</code> directory ready for Netlify, Render, or GitHub Pages.
            </p>

            <div className="font-mono text-xs p-3 rounded-xl bg-white border border-purple-200 flex items-center justify-between text-slate-800 shadow-xs">
              <span>npm run build</span>
              <button 
                onClick={() => copyCommand('npm run build')}
                className="p-1 text-slate-400 hover:text-violet-700"
                title="Copy command"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Done Footer */}
        <div className="flex justify-end pt-2 border-t border-purple-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-violet-600 text-white hover:bg-violet-500 transition-colors shadow-md shadow-purple-500/20"
          >
            Got it, close
          </button>
        </div>

      </div>
    </div>
  );
}
