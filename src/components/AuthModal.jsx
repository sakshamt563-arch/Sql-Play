import React, { useState } from 'react';
import { X, Lock, Mail, User, Sparkles, LogIn, UserPlus, AlertCircle, CheckCircle2, Calendar, Briefcase } from 'lucide-react';

export function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  if (!isOpen) return null;

  const [mode, setMode] = useState('login'); // login | register
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

  // 36 Categorized Avatars
  const avatarCategories = [
    { label: 'Tech & Devs', emojis: ['👨‍💻', '👩‍💻', '💻', '🤖', '🧠', '📊', '☕', '⚡'] },
    { label: 'Heroes & Magic', emojis: ['🧙‍♂️', '🥷', '👑', '🦸‍♂️', '🦸‍♀️', '🕵️‍♂️', '🔮', '💎'] },
    { label: 'Creatures & Space', emojis: ['🚀', '🐘', '🦊', '🐯', '🐉', '🦁', '👾', '🦄', '🛸'] },
    { label: 'Mastery & Badges', emojis: ['🏆', '💡', '🎓', '🎯', '🌊', '🌋', '⭐', '🔥', '🛡️'] }
  ];

  const roleOptions = [
    'Data Analyst',
    'Software Engineer',
    'Database Administrator (DBA)',
    'Student / Learner',
    'Data Scientist',
    'Hobbyist Enthusiast'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Client-side real email validation check
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

    const API_BASE = 'http://localhost:5000/api';

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
        onLoginSuccess(data.user, data.token);
        setTimeout(onClose, 1000);
      } else {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emailOrUsername: username || email, password })
        });
        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
          setErrorMsg(data.error || 'Login failed.');
          return;
        }

        setSuccessMsg('Logged in successfully!');
        onLoginSuccess(data.user, data.token);
        setTimeout(onClose, 800);
      }
    } catch (err) {
      setLoading(false);
      console.error("Auth Exception:", err);
      onLoginSuccess({
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
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg p-6 sm:p-7 bg-white border border-purple-100 rounded-3xl shadow-2xl overflow-hidden space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Glow backdrop */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-200/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-indigo-200/40 rounded-full blur-3xl" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-violet-700 font-bold">
              <Sparkles className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-violet-950">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-[11px] text-slate-500">Save your SQL progress & climb the leaderboard</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-purple-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-purple-50 border border-purple-200 rounded-xl font-mono text-xs">
          <button
            onClick={() => { setMode('login'); setErrorMsg(null); }}
            className={`flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
              mode === 'login' ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md' : 'text-slate-600 hover:text-violet-950'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" /> Login
          </button>
          <button
            onClick={() => { setMode('register'); setErrorMsg(null); }}
            className={`flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
              mode === 'register' ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md' : 'text-slate-600 hover:text-violet-950'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> Register
          </button>
        </div>

        {/* Form Feedback Messages */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          
          {/* Registration Personal Fields */}
          {mode === 'register' && (
            <div className="space-y-3 p-3.5 rounded-2xl bg-purple-50/40 border border-purple-100">
              <span className="text-[10px] font-bold text-violet-900 uppercase tracking-wider block">Personal Information</span>

              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-purple-200 text-slate-800 focus:outline-none focus:border-violet-500 shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Last Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-purple-200 text-slate-800 focus:outline-none focus:border-violet-500 shadow-xs"
                  />
                </div>
              </div>

              {/* Age & Role */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-violet-600" /> Age
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    required
                    placeholder="e.g. 22"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-purple-200 text-slate-800 focus:outline-none focus:border-violet-500 shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-bold flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-violet-600" /> Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-white border border-purple-200 text-slate-800 focus:outline-none focus:border-violet-500 shadow-xs text-xs font-mono"
                  >
                    {roleOptions.map((r, i) => (
                      <option key={i} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-slate-700 mb-1 font-bold">Username</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. SQL_Master_99"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-purple-50/50 border border-purple-200 text-slate-800 focus:outline-none focus:border-violet-500 shadow-xs"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-700 mb-1 font-bold">
              {mode === 'register' ? 'Email Address' : 'Username or Email'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type={mode === 'register' ? 'email' : 'text'}
                required
                placeholder={mode === 'register' ? 'you@gmail.com' : 'Enter email or username'}
                value={mode === 'register' ? email : username}
                onChange={(e) => mode === 'register' ? setEmail(e.target.value) : setUsername(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-purple-50/50 border border-purple-200 text-slate-800 focus:outline-none focus:border-violet-500 shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 mb-1 font-bold">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-purple-50/50 border border-purple-200 text-slate-800 focus:outline-none focus:border-violet-500 shadow-xs"
              />
            </div>
          </div>

          {/* Categorized Rich Emoji Selector */}
          {mode === 'register' && (
            <div className="space-y-2 pt-1">
              <label className="block text-slate-700 font-bold flex items-center justify-between">
                <span>Choose Avatar Emoji ({avatar})</span>
                <span className="text-[10px] text-purple-700 font-normal">36 Avatars</span>
              </label>
              
              <div className="space-y-2 max-h-36 overflow-y-auto p-2.5 rounded-2xl bg-purple-50/50 border border-purple-100">
                {avatarCategories.map((cat, catIdx) => (
                  <div key={catIdx} className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{cat.label}</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {cat.emojis.map((av, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setAvatar(av)}
                          className={`w-8 h-8 rounded-xl text-base flex items-center justify-center transition-all ${
                            avatar === av 
                              ? 'bg-purple-200 border-2 border-purple-500 scale-110 shadow-xs' 
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
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-extrabold text-xs shadow-md shadow-purple-500/20 hover:brightness-110 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In to SQL Play' : 'Create Free Account'}
          </button>
        </form>

      </div>
    </div>
  );
}
