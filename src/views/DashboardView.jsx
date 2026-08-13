import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { allProblems } from '../data/problems/index.js';
import { Trophy, Flame, Zap, Award, Sparkles, CheckCircle2, ArrowRight, BookOpen, ShieldCheck, Target, BarChart2, Crown, Compass } from 'lucide-react';

export function DashboardView() {
  const { user, levelInfo, solvedSet, openProblem, setActiveTab, buyStreakFreeze } = useApp();

  const totalProblemsCount = allProblems.length;
  const solvedCount = solvedSet.size;
  const progressPercent = Math.round((solvedCount / totalProblemsCount) * 100);

  // Suggested next problem
  const nextProblem = allProblems.find(p => !solvedSet.has(p.id)) || allProblems[0];
  const recentSolved = (user?.solvedProblems || []).slice(-5).reverse();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Mesh Hero Quest Banner */}
      <div className="relative p-8 md:p-10 rounded-3xl mesh-gradient-bg border border-purple-200/80 overflow-hidden shadow-xl shadow-purple-500/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-tr from-purple-300/30 to-indigo-200/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-violet-700 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
                ⚡ Daily SQL Quest
              </span>
              <span className="text-xs font-mono text-orange-600 font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 animate-flame" /> {user?.currentStreak || 0}-Day Streak Active
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-violet-950 tracking-tight leading-tight">
              Ready to level up your SQL skills, <span className="bg-gradient-to-r from-violet-700 to-purple-600 bg-clip-text text-transparent">{user?.username || 'Explorer'}</span>?
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
              Solve real database challenges directly in your browser. Master JOINs, Aggregations, CTEs, and Window Functions with instant feedback!
            </p>
          </div>

          {/* Quick Start Quest Button */}
          <div className="flex flex-col sm:flex-row md:flex-col items-stretch gap-3 shrink-0">
            <button
              onClick={() => openProblem(nextProblem.id)}
              className="px-6 py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:brightness-110 text-white font-extrabold text-sm shadow-xl shadow-purple-500/25 flex items-center justify-center gap-3 transition-all transform hover:scale-105"
            >
              <Zap className="w-5 h-5 fill-white" />
              <div className="text-left">
                <span className="block text-xs uppercase font-mono text-purple-200">Start Next Problem</span>
                <span className="block font-bold">{nextProblem.title} ({nextProblem.difficulty})</span>
              </div>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

        </div>
      </div>

      {/* 4 Core Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Learner Level Card */}
        <div className="glass-panel p-5 rounded-2xl space-y-3 relative overflow-hidden group hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
            <span>LEARNER LEVEL</span>
            <Award className="w-4 h-4 text-violet-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-violet-950">Lvl {levelInfo.level}</span>
            <span className="text-xs font-mono font-bold text-violet-600">({user?.totalXp || 0} XP)</span>
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="w-full h-2 rounded-full bg-purple-100 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-violet-600 to-purple-500 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>{levelInfo.xpInCurrentLevel} XP</span>
              <span>{levelInfo.xpToNextLevel} XP to Lvl {levelInfo.level + 1}</span>
            </div>
          </div>
        </div>

        {/* Streak Counter Card */}
        <div className="glass-panel p-5 rounded-2xl space-y-3 relative overflow-hidden group hover:border-orange-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
            <span>DAILY STREAK</span>
            <Flame className="w-4 h-4 text-orange-500 animate-flame" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-orange-600">{user?.currentStreak || 0} Days</span>
            <span className="text-xs text-slate-500 font-mono">Best: {user?.longestStreak || 0}d</span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-500">Freezes: <strong className="text-slate-800">{user?.streakFreezeCount || 0}</strong></span>
            <button
              onClick={buyStreakFreeze}
              className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100 transition-colors"
            >
              + Freeze (100 XP)
            </button>
          </div>
        </div>

        {/* Solved Progress Card */}
        <div className="glass-panel p-5 rounded-2xl space-y-3 relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
            <span>PROBLEMS SOLVED</span>
            <Target className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600">{solvedCount}</span>
            <span className="text-xs text-slate-500 font-mono">/ {totalProblemsCount}</span>
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="w-full h-2 rounded-full bg-emerald-100 overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Overall Completion</span>
              <span>{progressPercent}%</span>
            </div>
          </div>
        </div>

        {/* Badges Earned Card */}
        <div className="glass-panel p-5 rounded-2xl space-y-3 relative overflow-hidden group hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
            <span>ACHIEVEMENTS</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600">{(user?.unlockedBadges || []).length}</span>
            <span className="text-xs text-slate-500 font-mono">Badges Unlocked</span>
          </div>
          <button
            onClick={() => setActiveTab('profile')}
            className="text-[11px] font-bold text-violet-700 hover:text-violet-900 flex items-center gap-1 pt-1"
          >
            <span>View Badge Showcase</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left (2 cols): Up Next & Quick Explore */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Featured Problem Box */}
          <div className="glass-panel p-6 sm:p-7 rounded-3xl space-y-4 relative border-purple-200/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-violet-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" /> Up Next For You
              </span>
              <span className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase ${
                nextProblem.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                nextProblem.difficulty === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {nextProblem.difficulty}
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-violet-950">{nextProblem.title}</h3>
              <p className="text-xs text-violet-600 font-mono mt-0.5">{nextProblem.category}</p>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-purple-50/50 p-4 rounded-2xl border border-purple-100/80 font-sans">
              {nextProblem.description_md.replace(/###|`|\*{2}/g, '').substring(0, 190)}...
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
              <div className="flex gap-2 flex-wrap">
                {(Array.isArray(nextProblem.tags) ? nextProblem.tags : (Array.isArray(nextProblem.tag) ? nextProblem.tag : [])).map((t, idx) => (
                  <span key={idx} className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                    #{t}
                  </span>
                ))}
              </div>

              <button
                onClick={() => openProblem(nextProblem.id)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:brightness-110 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-500/20 transition-all hover:scale-105"
              >
                <span>Solve Workspace (+{nextProblem.points} XP)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Action Navigation Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div 
              onClick={() => setActiveTab('problems')}
              className="glass-panel glass-panel-hover p-6 rounded-3xl cursor-pointer space-y-3 group border-purple-100/80"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-violet-700 group-hover:scale-110 transition-transform">
                <BarChart2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-violet-950 group-hover:text-violet-700 transition-colors">300 Problem Bank</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">Filter challenges by difficulty (Easy, Medium, Hard) and topics like JOINs or Window Functions.</p>
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('learn')}
              className="glass-panel glass-panel-hover p-6 rounded-3xl cursor-pointer space-y-3 group border-purple-100/80"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-violet-950 group-hover:text-emerald-700 transition-colors">SQL Tutorial Hub</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">Learn SQL core concepts step-by-step with interactive bite-sized lessons before practicing.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (1 col): Recent Activity */}
        <div className="glass-panel p-6 rounded-3xl space-y-5 flex flex-col border-purple-100/80">
          <h3 className="font-bold text-base text-violet-950 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Recent Activity History</span>
          </h3>

          {recentSolved.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 text-xs font-mono space-y-2">
              <Compass className="w-10 h-10 text-slate-400" />
              <p className="font-bold text-slate-600">No solved queries yet!</p>
              <p className="text-slate-500">Pick any problem from the practice bank to earn your first XP points.</p>
            </div>
          ) : (
            <div className="space-y-3 flex-1 overflow-y-auto">
              {recentSolved.map((item, idx) => {
                const prob = allProblems.find(p => p.id === item.problemId);
                return (
                  <div 
                    key={idx}
                    onClick={() => openProblem(item.problemId)}
                    className="p-3.5 rounded-2xl bg-white border border-purple-100/80 hover:border-purple-300 cursor-pointer transition-all flex items-center justify-between shadow-sm"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{prob?.title || item.problemId}</h4>
                      <span className="text-[10px] text-slate-500 font-mono">{new Date(item.solvedAt).toLocaleDateString()}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-600 shrink-0">+{item.pointsAwarded} XP</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
