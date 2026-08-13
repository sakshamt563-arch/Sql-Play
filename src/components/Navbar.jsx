import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { Database, Flame, Trophy, LayoutDashboard, Code2, BookOpen, User, Globe, Volume2, VolumeX, Sparkles, ChevronRight } from 'lucide-react';

export function Navbar() {
  const { 
    user, 
    levelInfo, 
    activeTab, 
    setActiveTab, 
    soundEnabled, 
    setSoundEnabled, 
    setDeploymentModalOpen,
    setAuthModalOpen,
    handleLogout
  } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'problems', label: 'Practice Bank', count: '300', icon: Code2 },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'learn', label: 'Learn Hub', icon: BookOpen },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-purple-100/80 bg-white/75 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4 min-w-0">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('dashboard')} 
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-purple-500 to-indigo-500 p-0.5 shadow-md shadow-purple-500/15 group-hover:scale-105 transition-transform shrink-0">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Database className="w-4.5 h-4.5 text-violet-600 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-none whitespace-nowrap">
                  SQL PLAY
                </span>
                <span className="text-[9px] font-mono font-extrabold tracking-wider px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200 uppercase leading-none whitespace-nowrap">
                  V1.0
                </span>
              </div>
              <p className="text-[9px] text-slate-500 font-mono leading-none mt-1 whitespace-nowrap hidden lg:block">Interactive Practice Platform</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 shrink-0">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium text-xs transition-all relative shrink-0 ${
                    isActive 
                      ? 'bg-purple-100/80 text-violet-950 font-bold border border-purple-300/70 shadow-sm' 
                      : 'text-slate-600 hover:text-violet-900 hover:bg-purple-50/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-violet-600' : 'text-slate-400'}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                  {item.count && (
                    <span className="ml-0.5 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-purple-200/60 text-purple-800 border border-purple-300/60">
                      {item.count}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-violet-600 to-purple-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Gamification Bar */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Share Online Button */}
            <button
              onClick={() => setDeploymentModalOpen(true)}
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-all hover:scale-105 shadow-sm shrink-0 whitespace-nowrap"
              title="Publish website online"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Share Online</span>
            </button>

            {/* Streak Counter */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 font-mono text-xs font-bold shadow-sm shrink-0 whitespace-nowrap">
              <Flame className="w-3.5 h-3.5 text-orange-500 animate-flame" />
              <span>{user?.currentStreak || 0}d Streak</span>
            </div>

            {/* XP Level Pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-50/80 border border-purple-200 text-xs font-mono shadow-sm shrink-0 whitespace-nowrap">
              <div className="w-2 h-2 rounded-full bg-violet-600 animate-ping" />
              <span className="text-slate-600 font-medium">Lvl {levelInfo.level}</span>
              <span className="text-violet-700 font-bold">{user?.totalXp || 0} XP</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-xl bg-white border border-purple-100 text-slate-500 hover:text-violet-700 hover:bg-purple-50 transition-colors shadow-sm shrink-0"
              title={soundEnabled ? 'Mute victory sounds' : 'Enable victory sounds'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Profile Avatar & Login/Logout Controls */}
            {user?.username && user.username !== 'Guest Explorer' ? (
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setActiveTab('profile')}
                  className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-base shadow-sm hover:border-violet-500 transition-colors transform hover:scale-105 shrink-0"
                  title="View profile"
                >
                  {user.avatar}
                </button>
                <button
                  onClick={handleLogout}
                  className="hidden sm:block text-[11px] font-mono px-2 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 hover:text-rose-600 hover:border-rose-300 transition-colors shrink-0 whitespace-nowrap"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-purple-500/20 hover:brightness-110 transition-all hover:scale-105 shrink-0 whitespace-nowrap"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navbar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-purple-100">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg text-[11px] ${
                  isActive ? 'text-violet-700 font-bold' : 'text-slate-500'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
