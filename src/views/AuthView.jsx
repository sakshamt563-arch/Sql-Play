import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { Database, Sparkles, LogIn, UserPlus, Flame, Trophy, Award, Lock, Mail, User, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Briefcase, Calendar } from 'lucide-react';

export function AuthView() {
  const { handleLoginSuccess } = useApp();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [role, setRole] = useState('Data Analyst');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('👨‍💻');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Expanded Rich Emoji Avatar Collection (36 Emojis)
  const avatarCategories = [
    { label: 'Developers & Tech', emojis: ['👨‍💻', '👩‍💻', '💻', '🤖', '🧠', '📊', '☕', '⚡'] },
    { label: 'Heroes & Magic', emojis: ['🧙‍♂️', '🥷', '👑', '🦸‍♂️', '🦸‍♀️', '🕵️‍♂️', '🔮', '💎'] },
    { label: 'Creatures & Space', emojis: ['🚀', '🐘', '🦊', '🐯', '🐉', '🦁', '👾', '🦄', '🛸'] },
    { label: 'Badges & Mastery', emojis: ['🏆', '💡', '🎓', '🎯', '🌊', '🌋', '⭐', '🔥', '🛡️'] }
  ];

  const roleOptions = [
    'Data Analyst',
    'Software Engineer',
    'Database Administrator (DBA)',
    'Student / Learner',
    'Data Scientist',
    'Hobbyist Enthusiast'
  ];

  const API_BASE = 'http://localhost:5000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Client-side real email check on registration
    if (mode === 'register') {
      const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const domain = email.split('@')[1]?.toLowerCase();
      const DISPOSABLE = ['fake.com', 'test.com', 'example.com', 'tempmail.com', 'mailinator.com', '10minutemail.com', 'yopmail.com', 'asdf.com'];
      
      if (!re.test(email)) {
        setErrorMsg('Please enter a valid, real email address (e.g. name@gmail.com).');
        return;
      }
      if (DISPOSABLE.includes(domain) || domain?.startsWith('fake') || domain?.startsWith('test')) {
        setErrorMsg(`Fake or disposable email domain "${domain}" is not allowed. Please enter a real email.`);
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'register') {
        const res = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            username, 
            email, 
            password, 
            firstName, 
            lastName, 
            age: age ? Number(age) : null, 
            role, 
            avatar 
          })
        });
        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
          setErrorMsg(data.error || 'Registration failed.');
          return;
        }

        setSuccessMsg(data.message || `Account created! Confirmation email sent to ${email}.`);
        setTimeout(() => {
          handleLoginSuccess(data.user, data.token);
        }, 1000);
      } else {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emailOrUsername: username || email, password })
        });
        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
          setErrorMsg(data.error || 'Login failed. Please check credentials.');
          return;
        }

        setSuccessMsg('Welcome back! Unlocking SQL Play...');
        setTimeout(() => {
          handleLoginSuccess(data.user, data.token);
        }, 600);
      }
    } catch (err) {
      setLoading(false);
      console.log("Backend offline or connection issue. Enabling sandbox account...");
      setSuccessMsg(`Welcome, ${firstName || username || 'Learner'}! Opening SQL Play Sandbox...`);
      setTimeout(() => {
        handleLoginSuccess({
          username: username || 'SQL_Learner',
          email,
          firstName,
          lastName,
          age: age ? Number(age) : null,
          role,
          avatar,
          totalXp: 0,
          currentStreak: 1,
          longestStreak: 1,
          solvedProblems: [],
          unlockedBadges: []
        }, 'offline-token');
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8fe] text-slate-900 flex flex-col justify-between relative overflow-hidden selection:bg-purple-500 selection:text-white">
      
      {/* Background Organic Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-300/30 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-3xl pointer-events-none translate-y-1/3" />

      {/* Top Header */}
      <header className="px-6 sm:px-12 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-purple-500 to-indigo-500 p-0.5 shadow-md shadow-purple-500/15">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <Database className="w-5 h-5 text-violet-600" />
            </div>
          </div>
          <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            SQL PLAY
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs font-bold text-violet-700 bg-purple-100/80 px-3 py-1.5 rounded-full border border-purple-200">
          <ShieldCheck className="w-4 h-4 text-violet-600" /> Authentication Required
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col justify-center relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column (5 cols): Value Proposition */}
          <div className="lg:col-span-5 space-y-8 text-left">
            
            <div className="space-y-4">
              <span className="text-xs uppercase font-mono font-extrabold tracking-widest text-violet-700 bg-purple-100 px-3.5 py-1.5 rounded-full border border-purple-200 inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-600" /> Interactive Learning Platform
              </span>

              <h1 className="text-4xl sm:text-5xl font-extrabold text-violet-950 tracking-tight leading-tight">
                Master Real SQL. <br />
                <span className="bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Solve 300+ Problems.
                </span>
              </h1>

              <p className="text-sm text-slate-600 leading-relaxed max-w-xl font-sans">
                Sign in or register your account with custom profile options, choose your favorite avatar emoji, earn XP, and climb the live global leaderboard!
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="glass-panel p-3.5 rounded-2xl border-purple-100 space-y-1 shadow-sm">
                <Database className="w-4.5 h-4.5 text-violet-600" />
                <h4 className="font-extrabold text-xs text-violet-950">300 WASM Problems</h4>
                <p className="text-[10px] text-slate-500 leading-snug">JOINs, CTEs & Window Functions</p>
              </div>

              <div className="glass-panel p-3.5 rounded-2xl border-purple-100 space-y-1 shadow-sm">
                <Flame className="w-4.5 h-4.5 text-orange-500" />
                <h4 className="font-extrabold text-xs text-violet-950">Daily Streaks</h4>
                <p className="text-[10px] text-slate-500 leading-snug">Build daily habits & freeze streaks</p>
              </div>

              <div className="glass-panel p-3.5 rounded-2xl border-purple-100 space-y-1 shadow-sm">
                <Trophy className="w-4.5 h-4.5 text-amber-500" />
                <h4 className="font-extrabold text-xs text-violet-950">Global Ranks</h4>
                <p className="text-[10px] text-slate-500 leading-snug">Unlock badges & climb leaderboard</p>
              </div>
            </div>

          </div>

          {/* Right Column (7 cols): Expanded Auth Card */}
          <div className="lg:col-span-7 w-full max-w-xl mx-auto">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border-purple-200/80 shadow-2xl space-y-5 relative overflow-hidden bg-white/95 max-h-[85vh] overflow-y-auto">
              
              {/* Card Header & Mode Switcher */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-extrabold text-violet-950">
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                  </h2>
                  <span className="text-xs font-mono text-slate-500">
                    {mode === 'login' ? 'New here?' : 'Has account?'}
                  </span>
                </div>

                <div className="flex items-center p-1 bg-purple-50 border border-purple-200 rounded-2xl font-mono text-xs shadow-sm">
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setErrorMsg(null); setSuccessMsg(null); }}
                    className={`flex-1 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
                      mode === 'login' 
                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md' 
                        : 'text-slate-600 hover:text-violet-950'
                    }`}
                  >
                    <LogIn className="w-3.5 h-3.5" /> Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMode('register'); setErrorMsg(null); setSuccessMsg(null); }}
                    className={`flex-1 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
                      mode === 'register' 
                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md' 
                        : 'text-slate-600 hover:text-violet-950'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Register
                  </button>
                </div>
              </div>

              {/* Feedback Alerts */}
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono flex items-center gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Auth Form */}
              <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                
                {/* Registration Extra Personal Fields */}
                {mode === 'register' && (
                  <div className="space-y-3 p-4 rounded-2xl bg-purple-50/40 border border-purple-100">
                    <span className="text-[11px] font-bold text-violet-900 uppercase tracking-wider block">Personal Information</span>

                    {/* First Name & Last Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 mb-1 font-bold">First Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Shaksham"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-purple-200 text-slate-800 focus:outline-none focus:border-violet-500 shadow-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 mb-1 font-bold">Last Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sharma"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-purple-200 text-slate-800 focus:outline-none focus:border-violet-500 shadow-xs"
                        />
                      </div>
                    </div>

                    {/* Age & Role */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 mb-1 font-bold flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-violet-600" /> Age
                        </label>
                        <input
                          type="number"
                          min="10"
                          max="100"
                          required
                          placeholder="e.g. 22"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-purple-200 text-slate-800 focus:outline-none focus:border-violet-500 shadow-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 mb-1 font-bold flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5 text-violet-600" /> Role / Title
                        </label>
                        <select
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-white border border-purple-200 text-slate-800 focus:outline-none focus:border-violet-500 shadow-xs text-xs font-mono"
                        >
                          {roleOptions.map((r, i) => (
                            <option key={i} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Account Credentials */}
                {mode === 'register' && (
                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">Username</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. SQL_Master_99"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-purple-50/50 border border-purple-200 text-slate-800 focus:outline-none focus:border-violet-500 shadow-xs"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">
                    {mode === 'register' ? 'Email Address (Real Verification)' : 'Username or Email'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type={mode === 'register' ? 'email' : 'text'}
                      required
                      placeholder={mode === 'register' ? 'you@gmail.com' : 'Enter email or username'}
                      value={mode === 'register' ? email : username}
                      onChange={(e) => mode === 'register' ? setEmail(e.target.value) : setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-purple-50/50 border border-purple-200 text-slate-800 focus:outline-none focus:border-violet-500 shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-purple-50/50 border border-purple-200 text-slate-800 focus:outline-none focus:border-violet-500 shadow-xs"
                    />
                  </div>
                </div>

                {/* Expanded Rich Emoji Avatar Selection */}
                {mode === 'register' && (
                  <div className="space-y-2 pt-1">
                    <label className="block text-slate-700 font-bold flex items-center justify-between">
                      <span>Choose Avatar Emoji ({avatar})</span>
                      <span className="text-[10px] text-purple-700 font-normal">36 Avatars</span>
                    </label>
                    
                    <div className="space-y-2 max-h-44 overflow-y-auto p-3 rounded-2xl bg-purple-50/50 border border-purple-100">
                      {avatarCategories.map((cat, catIdx) => (
                        <div key={catIdx} className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{cat.label}</span>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {cat.emojis.map((av, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setAvatar(av)}
                                className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                                  avatar === av 
                                    ? 'bg-purple-200 border-2 border-purple-500 scale-110 shadow-sm' 
                                    : 'bg-white border border-purple-200 hover:bg-purple-100'
                                }`}
                              >
                                {av}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white font-extrabold text-xs shadow-xl shadow-purple-500/25 hover:brightness-110 transition-all transform hover:scale-[1.01] disabled:opacity-50 flex items-center justify-center gap-2 mt-3"
                >
                  <span>{loading ? 'Authenticating...' : mode === 'login' ? 'Sign In & Access Platform' : 'Create Account & Start Learning'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center text-xs font-mono text-slate-500 relative z-10 border-t border-purple-100/60">
        SQL Play V1.0 • Client-side Interactive Database Playground
      </footer>

    </div>
  );
}
