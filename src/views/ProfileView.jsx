import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { BADGES } from '../data/badges.js';
import { allProblems } from '../data/problems/index.js';
import { User, Trophy, Award, Flame, ShieldCheck, Sparkles, CheckCircle2, RotateCcw, Edit2, Check } from 'lucide-react';

export function ProfileView() {
  const { user, levelInfo, updateProfile, resetAllProgress } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(user.username);
  const [avatarInput, setAvatarInput] = useState(user.avatar);

  const avatars = ['👨‍💻', '👩‍💻', '🧙‍♂️', '🥷', '👑', '🚀', '⚡', '🧠', '🐘', '💻', '📊'];

  const handleSaveProfile = () => {
    updateProfile(nameInput, avatarInput);
    setIsEditing(false);
  };

  const solvedList = user?.solvedProblems || [];
  const unlockedList = user?.unlockedBadges || [];

  const solvedEasy = solvedList.filter(p => p.difficulty === 'easy').length;
  const solvedMedium = solvedList.filter(p => p.difficulty === 'medium').length;
  const solvedHard = solvedList.filter(p => p.difficulty === 'hard').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Profile Header */}
      <div className="glass-panel p-8 rounded-3xl relative overflow-hidden space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-5">
            {/* Avatar Selector */}
            <div className="relative group">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-violet-600 to-purple-600 p-0.5 shadow-md flex items-center justify-center text-4xl">
                <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center">
                  {user.avatar}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-extrabold text-violet-950">
                  {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username}
                </h1>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-1.5 rounded-lg bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors"
                  title="Edit profile"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-violet-700 font-mono mt-0.5">
                @{user.username} {user.age ? `• Age ${user.age}` : ''} {user.role ? `• ${user.role}` : ''} • Level {levelInfo.level} ({user?.totalXp || 0} XP)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 font-mono text-xs">
            <div className="p-3 rounded-2xl bg-orange-50 border border-orange-200 text-center shadow-xs">
              <span className="text-xl font-extrabold text-orange-600 block">{user?.currentStreak || 0}d</span>
              <span className="text-[10px] text-slate-500">Current Streak</span>
            </div>
            <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 text-center shadow-xs">
              <span className="text-xl font-extrabold text-violet-900 block">{solvedList.length}</span>
              <span className="text-[10px] text-slate-500">Solved</span>
            </div>
          </div>

        </div>

        {/* Profile Edit Panel */}
        {isEditing && (
          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-4 pt-4 border-t">
            <h4 className="text-xs font-bold text-violet-950 uppercase tracking-wider">Customize Profile</h4>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="px-4 py-2 rounded-xl bg-white border border-purple-200 text-xs text-slate-800 font-mono focus:outline-none focus:border-violet-500"
              />
              <div className="flex items-center gap-2 flex-wrap">
                {avatars.map((av, idx) => (
                  <button
                    key={idx}
                    onClick={() => setAvatarInput(av)}
                    className={`p-2 rounded-lg text-lg ${avatarInput === av ? 'bg-purple-200 border border-purple-300' : 'bg-white border border-purple-100'}`}
                  >
                    {av}
                  </button>
                ))}
              </div>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-purple-500/20"
              >
                <Check className="w-4 h-4" /> Save
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Grid: Difficulty Stats Breakdown & Badge Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Difficulty Stats */}
        <div className="glass-panel p-6 rounded-3xl space-y-6">
          <h3 className="font-bold text-base text-violet-950">Difficulty Breakdown</h3>

          <div className="space-y-4 font-mono text-xs">
            
            {/* Easy */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-700">
                <span className="text-emerald-600 font-bold">Easy Solved</span>
                <span>{solvedEasy} / 100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-emerald-100 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(solvedEasy / 100) * 100}%` }} />
              </div>
            </div>

            {/* Medium */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-700">
                <span className="text-amber-600 font-bold">Medium Solved</span>
                <span>{solvedMedium} / 100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-amber-100 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(solvedMedium / 100) * 100}%` }} />
              </div>
            </div>

            {/* Hard */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-700">
                <span className="text-rose-600 font-bold">Hard Solved</span>
                <span>{solvedHard} / 100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-rose-100 overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: `${(solvedHard / 100) * 100}%` }} />
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-purple-100">
            <button
              onClick={resetAllProgress}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Reset Progress
            </button>
          </div>
        </div>

        {/* Right Column (2 cols): Badges Showcase */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-violet-950 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Achievement Badges ({unlockedList.length} / {BADGES.length})</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BADGES.map((badge) => {
              const isUnlocked = unlockedList.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                    isUnlocked
                      ? 'bg-white border-purple-200 shadow-sm'
                      : 'bg-purple-50/30 border-purple-100 opacity-50 grayscale'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${badge.color} p-0.5 shrink-0 flex items-center justify-center text-white text-xl shadow-md`}>
                    <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                      🏆
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-violet-950 flex items-center gap-2">
                      {badge.title}
                      {isUnlocked && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{badge.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
