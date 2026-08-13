import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { SQL_LESSONS } from '../data/tutorials.js';
import { BookOpen, CheckCircle2, ArrowRight, Play, Sparkles, Lightbulb, Clock } from 'lucide-react';

export function LearnView() {
  const { openProblem } = useApp();
  const [selectedLesson, setSelectedLesson] = useState(SQL_LESSONS[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="border-b border-purple-100/80 pb-6">
        <h1 className="text-3xl font-extrabold text-violet-950 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-emerald-600" />
          <span>SQL Learning Paths</span>
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Bite-sized SQL interactive tutorials designed for quick mastery before tackling practice problems.
        </p>
      </div>

      {/* Grid: Lesson Navigation sidebar & Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (4 cols): Lessons List */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 px-1">
            Curriculum Lessons
          </h3>

          <div className="space-y-3">
            {SQL_LESSONS.map((lesson) => {
              const isSelected = selectedLesson.id === lesson.id;
              return (
                <div
                  key={lesson.id}
                  onClick={() => setSelectedLesson(lesson)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-purple-100/80 border-purple-300 shadow-sm'
                      : 'glass-panel glass-panel-hover'
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold text-violet-700 uppercase">{lesson.moduleTitle}</span>
                  <h4 className="font-bold text-sm text-violet-950">{lesson.title}</h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {lesson.estimatedMinutes} mins</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      Start <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (8 cols): Lesson Content */}
        <div className="lg:col-span-8 glass-panel p-8 rounded-3xl space-y-6">
          <div className="border-b border-purple-100 pb-4">
            <span className="text-xs font-mono font-bold text-violet-700 uppercase">{selectedLesson.moduleTitle}</span>
            <h2 className="text-2xl font-extrabold text-violet-950 mt-1">{selectedLesson.title}</h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">{selectedLesson.summary}</p>
          </div>

          <div className="prose prose-sm max-w-none text-xs text-slate-700 space-y-4 whitespace-pre-line leading-relaxed">
            {selectedLesson.content_md}
          </div>

          <div className="p-5 rounded-2xl bg-purple-50/80 border border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <div>
              <h4 className="font-bold text-sm text-violet-950 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-600" /> Ready to test your knowledge?
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">Solve the guided practice problem for this topic.</p>
            </div>

            <button
              onClick={() => openProblem(selectedLesson.practiceProblemId)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:brightness-110 text-white font-bold text-xs flex items-center gap-2 shrink-0 shadow-md shadow-purple-500/20"
            >
              <span>Practice Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
