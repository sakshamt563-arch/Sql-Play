import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { Play, Send, RotateCcw, Sparkles } from 'lucide-react';

export function SqlEditor({ value, onChange, onRun, onSubmit, onReset, isExecuting, isSubmitting }) {
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-purple-100 overflow-hidden shadow-md">
      {/* Editor Header Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-purple-50/80 border-b border-purple-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-400" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
          <span className="ml-2 font-mono text-xs font-semibold text-slate-600">query.sql</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-violet-950 hover:bg-purple-100 transition-colors"
            title="Reset code template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={onRun}
            disabled={isExecuting || isSubmitting}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-purple-100 text-purple-900 border border-purple-200 hover:bg-purple-200 transition-all disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 text-violet-700 fill-violet-700" />
            <span>{isExecuting ? 'Running...' : 'Run Query'}</span>
          </button>

          <button
            onClick={onSubmit}
            disabled={isExecuting || isSubmitting}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-purple-500/20 hover:brightness-110 transition-all disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Validating...' : 'Submit Answer'}</span>
          </button>
        </div>
      </div>

      {/* CodeMirror Text Area */}
      <div className="flex-1 overflow-hidden relative">
        <CodeMirror
          value={value}
          height="100%"
          extensions={[sql()]}
          onChange={(val) => onChange(val)}
          theme="light"
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightSpecialChars: true,
            history: true,
            foldGutter: true,
            drawSelection: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            syntaxHighlighting: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            rectangularSelection: true,
            crosshairCursor: true,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            closeBracketsKeymap: true,
            defaultKeymap: true,
            searchKeymap: true,
            historyKeymap: true,
            foldKeymap: true,
            completionKeymap: true,
            lintKeymap: true,
          }}
        />
      </div>
    </div>
  );
}
