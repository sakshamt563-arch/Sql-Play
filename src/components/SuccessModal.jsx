import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, Flame, CheckCircle2, ArrowRight, X, Sparkles, Star } from 'lucide-react';
import { getRandomVictoryMessage } from '../services/gamification.js';

export function SuccessModal({ data, onClose, onNextProblem }) {
  useEffect(() => {
    if (!data) return;

    // Trigger Confetti explosion
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899']
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, [data]);

  if (!data) return null;

  const { problem, xpEarned, isFirstTry, noHintUsed, newStreak, newlyUnlockedBadges, isAlreadySolved } = data;
  const victoryMessage = getRandomVictoryMessage(isFirstTry, problem.difficulty);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg p-6 bg-white border border-purple-100 rounded-3xl shadow-2xl overflow-hidden text-center space-y-6">
        
        {/* Glow backdrop */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-200/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-200/40 rounded-full blur-3xl" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-purple-50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Trophy Icon Header */}
        <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-violet-600 p-0.5 shadow-md shadow-purple-500/15 animate-bounce-subtle">
          <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center">
            <Trophy className="w-10 h-10 text-emerald-600" />
          </div>
        </div>

        {/* Victory Message */}
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {isAlreadySolved ? 'Problem Solved Again' : 'Challenge Solved!'}
          </span>
          <h2 className="text-2xl font-extrabold text-violet-950 mt-2">
            {problem.title}
          </h2>
          <p className="text-sm font-medium text-violet-700 mt-1">
            {victoryMessage}
          </p>
        </div>

        {/* Rewards Breakdown Cards */}
        <div className="grid grid-cols-2 gap-3 font-mono">
          
          {/* XP Card */}
          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex flex-col items-center shadow-xs">
            <Award className="w-6 h-6 text-violet-600 mb-1" />
            <span className="text-2xl font-extrabold text-violet-900">+{xpEarned} XP</span>
            <span className="text-[10px] text-slate-500 mt-0.5">Points Earned</span>
          </div>

          {/* Streak Card */}
          <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 flex flex-col items-center shadow-xs">
            <Flame className="w-6 h-6 text-orange-500 mb-1 animate-streak-fire" />
            <span className="text-2xl font-extrabold text-orange-600">{newStreak} Days</span>
            <span className="text-[10px] text-slate-500 mt-0.5">Active Streak</span>
          </div>
        </div>

        {/* Bonuses & Unlocked Badges */}
        <div className="space-y-2 text-left bg-purple-50/50 p-4 rounded-2xl border border-purple-100 text-xs">
          <div className="flex items-center justify-between text-slate-700">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Base XP:</span>
            <span className="font-mono text-violet-700 font-bold">+{problem.points} XP</span>
          </div>
          {isFirstTry && (
            <div className="flex items-center justify-between text-slate-700">
              <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-amber-600" /> First Attempt Bonus:</span>
              <span className="font-mono text-amber-700 font-bold">+5 XP</span>
            </div>
          )}
          {noHintUsed && (
            <div className="flex items-center justify-between text-slate-700">
              <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-purple-600" /> No Hints Used Bonus:</span>
              <span className="font-mono text-violet-700 font-bold">+5 XP</span>
            </div>
          )}

          {/* Newly Unlocked Badges */}
          {newlyUnlockedBadges && newlyUnlockedBadges.length > 0 && (
            <div className="pt-2 border-t border-purple-200">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                🏆 Badge Unlocked: {newlyUnlockedBadges[0].title}!
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-purple-500/20 hover:brightness-110 flex items-center justify-center gap-2 transition-all"
          >
            <span>Back to Question Bank</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
