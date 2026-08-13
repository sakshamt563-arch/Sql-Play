import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { allProblems, filterProblems, getAllCategories } from '../data/problems/index.js';
import { ProblemCard } from '../components/ProblemCard.jsx';
import { Search, Filter, CheckCircle2, Sparkles, SlidersHorizontal, Trophy, Code2, Flame } from 'lucide-react';

export function ProblemsView() {
  const { solvedSet, openProblem } = useApp();

  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = useMemo(() => getAllCategories(), []);

  const filteredProblems = useMemo(() => {
    return filterProblems({
      difficulty: difficultyFilter,
      category: categoryFilter,
      status: statusFilter,
      searchQuery,
      solvedProblemIds: solvedSet
    });
  }, [difficultyFilter, categoryFilter, statusFilter, searchQuery, solvedSet]);

  const easyCount = allProblems.filter(p => p.difficulty === 'easy').length;
  const mediumCount = allProblems.filter(p => p.difficulty === 'medium').length;
  const hardCount = allProblems.filter(p => p.difficulty === 'hard').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Page Title & Difficulty Pills */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-purple-100/80 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-violet-950 flex items-center gap-3">
            <Code2 className="w-8 h-8 text-violet-600" />
            <span>SQL Practice Repository</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Master 300 real SQL coding problems client-side with sandboxed SQLite WASM execution.
          </p>
        </div>

        {/* Difficulty Tab Controls */}
        <div className="flex items-center gap-1.5 p-1.5 bg-purple-50/80 border border-purple-200/80 rounded-2xl font-mono text-xs shadow-sm flex-wrap">
          <button
            onClick={() => setDifficultyFilter('all')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
              difficultyFilter === 'all' 
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md' 
                : 'text-slate-600 hover:text-violet-900'
            }`}
          >
            All (300)
          </button>
          
          <button
            onClick={() => setDifficultyFilter('easy')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              difficultyFilter === 'easy' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm' 
                : 'text-emerald-700/80 hover:bg-emerald-50'
            }`}
          >
            <span>Easy</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">{easyCount}</span>
          </button>

          <button
            onClick={() => setDifficultyFilter('medium')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              difficultyFilter === 'medium' 
                ? 'bg-amber-50 text-amber-700 border border-amber-200 shadow-sm' 
                : 'text-amber-700/80 hover:bg-amber-50'
            }`}
          >
            <span>Medium</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">{mediumCount}</span>
          </button>

          <button
            onClick={() => setDifficultyFilter('hard')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              difficultyFilter === 'hard' 
                ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-sm' 
                : 'text-rose-700/80 hover:bg-rose-50'
            }`}
          >
            <span>Hard</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-800">{hardCount}</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-5 rounded-3xl flex flex-col md:flex-row items-center gap-4 border-purple-100/80">
        
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search problems by title, tag (#JOIN, #CTE), or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-purple-200 text-xs text-slate-800 focus:outline-none focus:border-violet-500 font-mono placeholder:text-slate-400 shadow-sm"
          />
        </div>

        {/* Topic & Status Dropdowns */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap sm:flex-nowrap">
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-white border border-purple-200 text-xs text-slate-700 font-mono focus:outline-none focus:border-violet-500 shadow-sm"
          >
            <option value="all">All Topics</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-white border border-purple-200 text-xs text-slate-700 font-mono focus:outline-none focus:border-violet-500 shadow-sm"
          >
            <option value="all">All Statuses</option>
            <option value="solved">Solved</option>
            <option value="unsolved">Unsolved</option>
          </select>

        </div>
      </div>

      {/* Result Status Bar */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-600 px-2">
        <span>Showing <strong className="text-violet-700">{filteredProblems.length}</strong> of {allProblems.length} practice problems</span>
        <span>Solved: <strong className="text-emerald-600">{solvedSet.size}</strong></span>
      </div>

      {/* Problem Grid */}
      {filteredProblems.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center text-slate-500 space-y-4 border-purple-100/80">
          <Filter className="w-12 h-12 mx-auto text-purple-300 animate-pulse" />
          <h3 className="font-extrabold text-base text-violet-950">No matching SQL problems found</h3>
          <p className="text-xs max-w-sm mx-auto leading-relaxed">Try clearing your search query or selecting a different difficulty filter.</p>
          <button
            onClick={() => {
              setDifficultyFilter('all');
              setCategoryFilter('all');
              setStatusFilter('all');
              setSearchQuery('');
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-violet-600 text-white hover:bg-violet-500 transition-colors shadow-md shadow-purple-500/20"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProblems.map((prob) => (
            <ProblemCard
              key={prob.id}
              problem={prob}
              isSolved={solvedSet.has(prob.id)}
              onSelect={openProblem}
            />
          ))}
        </div>
      )}

    </div>
  );
}
