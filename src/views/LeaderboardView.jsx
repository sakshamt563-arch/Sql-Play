import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { INITIAL_LEADERBOARD } from '../data/leaderboardData.js';
import { Trophy, Award, Flame, Search, Medal, Crown, Star, ShieldCheck, Sparkles, UserPlus, Users } from 'lucide-react';

export function LeaderboardView() {
  const { user, setAuthModalOpen } = useApp();
  const [timeframe, setTimeframe] = useState('all-time');
  const [searchFilter, setSearchFilter] = useState('');
  const [liveLeaderboard, setLiveLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        setLiveLeaderboard(data.leaderboard || []);
        setLoading(false);
      })
      .catch(err => {
        console.log("Using initial leaderboard fallback");
        setLiveLeaderboard(INITIAL_LEADERBOARD);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const baseList = liveLeaderboard;

  // Include current active user if registered
  const combinedLeaderboard = [...baseList];
  if (user.username && user.username !== 'Guest Explorer') {
    const exists = combinedLeaderboard.some(u => u.username.toLowerCase() === user.username.toLowerCase());
    if (!exists) {
      combinedLeaderboard.push({
        rank: combinedLeaderboard.length + 1,
        username: `${user.username} (You)`,
        avatar: user.avatar,
        points: user.totalXp,
        solved: (user?.solvedProblems || []).length,
        streak: user.currentStreak,
        level: Math.floor(Math.sqrt(user.totalXp / 20)) + 1,
        country: '🌐',
        isCurrentUser: true
      });
    }
  }

  const filteredLeaderboard = combinedLeaderboard.filter(item => 
    item.username.toLowerCase().includes(searchFilter.toLowerCase().trim())
  );

  const top3 = combinedLeaderboard.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-100/80 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-violet-950 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-500" />
            <span>Global SQL Leaderboard</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Real live rankings. Register an account, solve SQL problems, and claim #1!
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-1 p-1.5 bg-purple-50/80 border border-purple-200 rounded-2xl font-mono text-xs shadow-sm">
          {['all-time', 'monthly', 'weekly'].map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-2 rounded-xl capitalize font-bold transition-all ${
                timeframe === tf 
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md' 
                  : 'text-slate-600 hover:text-violet-950'
              }`}
            >
              {tf.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State / Top 3 Podium */}
      {top3.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4 border-purple-100/80">
          <Users className="w-12 h-12 mx-auto text-violet-600 animate-bounce-subtle" />
          <h2 className="text-2xl font-extrabold text-violet-950">No Registered Solvers Yet!</h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Be the very first developer to register an account and claim the #1 spot on the global SQL Play leaderboard!
          </p>
          <button
            onClick={() => setAuthModalOpen(true)}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:brightness-110 text-white font-extrabold text-xs shadow-xl shadow-purple-500/25 flex items-center gap-2 mx-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register First Account</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 items-end">
          
          {/* 2nd Place */}
          {top3[1] ? (
            <div className="glass-panel p-6 rounded-3xl text-center space-y-3 relative border-purple-200/80 order-2 md:order-1">
              <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-700 font-extrabold text-xl flex items-center justify-center mx-auto border border-slate-300 shadow-sm">
                🥈 2nd
              </div>
              <div className="text-5xl">{top3[1].avatar}</div>
              <div>
                <h3 className="font-extrabold text-lg text-violet-950">{top3[1].username}</h3>
                <span className="text-xs text-slate-500 font-mono">{top3[1].country} • Lvl {top3[1].level}</span>
              </div>
              <div className="pt-3 border-t border-purple-100 font-mono text-violet-700 font-extrabold text-xl">
                {top3[1].points} XP
              </div>
            </div>
          ) : <div className="hidden md:block" />}

          {/* 1st Place */}
          {top3[0] && (
            <div className="glass-panel p-8 rounded-3xl text-center space-y-4 relative border-amber-300 bg-gradient-to-b from-amber-50/80 via-white to-purple-50/40 shadow-xl shadow-amber-500/10 order-1 md:order-2 transform md:-translate-y-4">
              <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 font-extrabold text-2xl flex items-center justify-center mx-auto border border-amber-300 shadow-md animate-float">
                <Crown className="w-8 h-8 text-amber-500 fill-amber-500" />
              </div>
              <div className="text-6xl">{top3[0].avatar}</div>
              <div>
                <h3 className="font-extrabold text-2xl text-violet-950">{top3[0].username}</h3>
                <span className="text-xs text-amber-700 font-mono font-bold">{top3[0].country} • Leader Lvl {top3[0].level}</span>
              </div>
              <div className="pt-3 border-t border-amber-200 font-mono text-amber-700 font-extrabold text-2xl">
                {top3[0].points} XP
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {top3[2] ? (
            <div className="glass-panel p-6 rounded-3xl text-center space-y-3 relative border-purple-200/80 order-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 font-extrabold text-xl flex items-center justify-center mx-auto border border-amber-200 shadow-sm">
                🥉 3rd
              </div>
              <div className="text-5xl">{top3[2].avatar}</div>
              <div>
                <h3 className="font-extrabold text-lg text-violet-950">{top3[2].username}</h3>
                <span className="text-xs text-slate-500 font-mono">{top3[2].country} • Lvl {top3[2].level}</span>
              </div>
              <div className="pt-3 border-t border-purple-100 font-mono text-violet-700 font-extrabold text-xl">
                {top3[2].points} XP
              </div>
            </div>
          ) : <div className="hidden md:block" />}

        </div>
      )}

      {/* Leaderboard Table */}
      {filteredLeaderboard.length > 0 && (
        <div className="glass-panel rounded-3xl overflow-hidden border-purple-100/80">
          
          {/* Search Input Bar */}
          <div className="p-4 bg-purple-50/60 border-b border-purple-100 flex items-center gap-3">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search learner username in global rankings..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-800 font-mono focus:outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-purple-100/70 text-violet-950 uppercase text-[10px] tracking-wider border-b border-purple-200">
                <tr>
                  <th className="py-3.5 px-4 text-center">Rank</th>
                  <th className="py-3.5 px-4">Learner Profile</th>
                  <th className="py-3.5 px-4 text-center">Level</th>
                  <th className="py-3.5 px-4 text-center">Solved</th>
                  <th className="py-3.5 px-4 text-center">Streak</th>
                  <th className="py-3.5 px-4 text-right">XP Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100/60">
                {filteredLeaderboard.map((row, idx) => (
                  <tr 
                    key={idx}
                    className={`hover:bg-purple-50/60 transition-colors ${
                      row.isCurrentUser ? 'bg-purple-100/60 border-l-4 border-violet-600 font-bold' : ''
                    }`}
                  >
                    <td className="py-4 px-4 text-center font-bold text-slate-700">
                      {row.rank <= 3 ? (
                        <span className={`w-8 h-8 rounded-xl inline-flex items-center justify-center font-bold text-xs ${
                          row.rank === 1 ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                          row.rank === 2 ? 'bg-slate-200 text-slate-700 border border-slate-300' :
                          'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          #{row.rank}
                        </span>
                      ) : (
                        `#${row.rank}`
                      )}
                    </td>
                    <td className="py-4 px-4 font-bold text-violet-950 flex items-center gap-2">
                      <span className="text-xl">{row.avatar}</span>
                      <span>{row.username}</span>
                      <span className="text-xs">{row.country}</span>
                    </td>
                    <td className="py-4 px-4 text-center text-slate-700 font-bold">Lvl {row.level}</td>
                    <td className="py-4 px-4 text-center text-emerald-600 font-bold">{row.solved}</td>
                    <td className="py-4 px-4 text-center text-orange-600 font-bold">{row.streak}d 🔥</td>
                    <td className="py-4 px-4 text-right font-bold text-violet-700 text-sm">{row.points} XP</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
}
