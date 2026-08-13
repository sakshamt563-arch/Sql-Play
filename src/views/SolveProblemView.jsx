import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { getProblemById } from '../data/problems/index.js';
import { executeQueryInSandbox } from '../services/sqlEngine.js';
import { validateSubmission } from '../services/validator.js';
import { SqlEditor } from '../components/SqlEditor.jsx';
import { ResultTable } from '../components/ResultTable.jsx';
import { SchemaViewer } from '../components/SchemaViewer.jsx';
import { ProblemDiscussions } from '../components/ProblemDiscussions.jsx';
import { ArrowLeft, BookOpen, Database, HelpCircle, Lock, Lightbulb, Play, Send, Award, CheckCircle2, RotateCcw, AlertTriangle, Eye, Sparkles, Terminal, MessageSquare } from 'lucide-react';

export function SolveProblemView() {
  const { selectedProblemId, setActiveTab, handleSolveSuccess, solvedSet } = useApp();

  const problem = getProblemById(selectedProblemId);
  const isAlreadySolved = solvedSet.has(problem.id);

  const [activeSideTab, setActiveSideTab] = useState('problem'); // problem, schema, discussions
  const [userQuery, setUserQuery] = useState('');
  const [attemptCount, setAttemptCount] = useState(0);
  const [usedHint, setUsedHint] = useState(false);
  const [unlockedHintIndex, setUnlockedHintIndex] = useState(-1);
  const [showSolution, setShowSolution] = useState(false);

  const [runResult, setRunResult] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState(null);

  useEffect(() => {
    setUserQuery(`-- Problem: ${problem.title}\n-- Category: ${problem.category}\n\nSELECT * FROM `);
    setAttemptCount(0);
    setUsedHint(false);
    setUnlockedHintIndex(-1);
    setShowSolution(false);
    setRunResult(null);
    setSubmissionFeedback(null);
  }, [problem.id]);

  const handleRunQuery = async () => {
    setIsExecuting(true);
    setSubmissionFeedback(null);
    const res = await executeQueryInSandbox(problem.schema_sql, problem.seed_data_sql, userQuery);
    setRunResult(res);
    setIsExecuting(false);
  };

  const handleSubmitQuery = async () => {
    setIsSubmitting(true);
    setSubmissionFeedback(null);
    setAttemptCount(prev => prev + 1);

    const validation = await validateSubmission(problem, userQuery);
    setIsSubmitting(false);

    setRunResult(validation.userResult);

    if (validation.isCorrect) {
      setSubmissionFeedback({
        isSuccess: true,
        message: validation.feedback
      });
      handleSolveSuccess(problem.id, attemptCount + 1, usedHint);
    } else {
      setSubmissionFeedback({
        isSuccess: false,
        message: validation.feedback
      });
    }
  };

  const handleUnlockHint = () => {
    setUsedHint(true);
    setUnlockedHintIndex(prev => Math.min(prev + 1, (problem.hints?.length || 1) - 1));
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-[#faf8fe] overflow-hidden">
      
      {/* Workspace Top Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white/80 border-b border-purple-100/80 shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab('problems')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-violet-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Problem Bank</span>
          </button>
          
          <div className="h-4 w-[1px] bg-purple-200" />

          <div className="flex items-center gap-3">
            <h2 className="text-base font-extrabold text-violet-950">{problem.title}</h2>
            <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold uppercase ${
              problem.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
              problem.difficulty === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
              'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {problem.difficulty}
            </span>
            {isAlreadySolved && (
              <span className="flex items-center gap-1 text-xs font-mono text-emerald-700 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Solved
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 font-mono text-xs">
          <span className="text-violet-700 font-bold flex items-center gap-1">
            <Award className="w-4 h-4 text-violet-600" /> +{problem.points} XP
          </span>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        
        {/* Left Pane (5 cols): Description / Schema / Discussions */}
        <div className="lg:col-span-5 border-r border-purple-100 flex flex-col bg-white/70 overflow-hidden">
          
          {/* Side Tabs */}
          <div className="flex items-center gap-1.5 px-4 py-2.5 bg-purple-50/50 border-b border-purple-100 overflow-x-auto">
            <button
              onClick={() => setActiveSideTab('problem')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeSideTab === 'problem'
                  ? 'bg-purple-100 text-violet-950 border border-purple-300 shadow-xs'
                  : 'text-slate-600 hover:text-violet-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Statement</span>
            </button>

            <button
              onClick={() => setActiveSideTab('schema')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeSideTab === 'schema'
                  ? 'bg-purple-100 text-violet-950 border border-purple-300 shadow-xs'
                  : 'text-slate-600 hover:text-violet-900'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Schema</span>
            </button>

            <button
              onClick={() => setActiveSideTab('discussions')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeSideTab === 'discussions'
                  ? 'bg-purple-100 text-violet-950 border border-purple-300 shadow-xs'
                  : 'text-slate-600 hover:text-violet-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-violet-600" />
              <span>Discussions & Solutions</span>
            </button>
          </div>

          {/* Left Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeSideTab === 'problem' ? (
              <div className="space-y-6">
                
                {/* Description Markdown */}
                <div className="prose prose-xs max-w-none space-y-3">
                  <h3 className="text-base font-extrabold text-violet-950">Task Description</h3>
                  <div className="text-xs text-slate-700 leading-relaxed space-y-2 whitespace-pre-line font-sans">
                    {problem.description_md}
                  </div>
                </div>

                {/* Hints Drawer */}
                <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-600" /> Progressive Hints
                    </span>
                    {unlockedHintIndex < (problem.hints?.length || 0) - 1 && (
                      <button
                        onClick={handleUnlockHint}
                        className="text-[11px] font-mono px-3 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 transition-colors font-bold"
                      >
                        Unlock Hint #{unlockedHintIndex + 2}
                      </button>
                    )}
                  </div>

                  {unlockedHintIndex < 0 ? (
                    <p className="text-xs text-slate-600">Need guidance? Click unlock hint above to reveal step-by-step pointers.</p>
                  ) : (
                    <div className="space-y-2.5 pt-1">
                      {problem.hints?.slice(0, unlockedHintIndex + 1).map((h, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-white border border-amber-200 text-amber-900 text-xs font-mono leading-relaxed shadow-xs">
                          💡 <strong>Hint #{idx + 1}:</strong> {h}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Solution Reveal */}
                <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-violet-950 flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-violet-600" /> Canonical Solution
                    </span>
                    <button
                      onClick={() => setShowSolution(!showSolution)}
                      className="text-[11px] font-mono px-3 py-1 rounded-lg bg-purple-100 text-purple-900 border border-purple-200 hover:bg-purple-200 transition-colors font-bold"
                    >
                      {showSolution ? 'Hide Solution' : 'Reveal Solution'}
                    </button>
                  </div>

                  {showSolution && (
                    <pre className="p-3.5 rounded-xl bg-white border border-purple-200 text-violet-950 text-xs font-mono whitespace-pre-wrap leading-relaxed shadow-xs">
                      {problem.expected_query}
                    </pre>
                  )}
                </div>

              </div>
            ) : activeSideTab === 'schema' ? (
              <SchemaViewer problem={problem} />
            ) : (
              <ProblemDiscussions problemId={problem.id} />
            )}
          </div>
        </div>

        {/* Right Pane (7 cols): CodeMirror Editor + Result Console */}
        <div className="lg:col-span-7 flex flex-col h-full overflow-hidden p-4 space-y-4 bg-[#faf8fe]">
          
          {/* Top Half: CodeMirror Editor */}
          <div className="h-1/2 flex flex-col">
            <SqlEditor
              value={userQuery}
              onChange={setUserQuery}
              onRun={handleRunQuery}
              onSubmit={handleSubmitQuery}
              onReset={() => setUserQuery(`-- Problem: ${problem.title}\nSELECT * FROM `)}
              isExecuting={isExecuting}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Feedback Banner */}
          {submissionFeedback && (
            <div className={`p-3.5 rounded-xl border text-xs font-mono font-semibold flex items-center gap-2 shadow-sm ${
              submissionFeedback.isSuccess 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
              {submissionFeedback.isSuccess ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{submissionFeedback.message}</span>
            </div>
          )}

          {/* Bottom Half: Result Console */}
          <div className="flex-1 overflow-hidden">
            <ResultTable result={runResult} title="Console Execution Result" />
          </div>

        </div>

      </div>

    </div>
  );
}
