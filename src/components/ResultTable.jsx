import React from 'react';
import { Table, CheckCircle2, AlertCircle, Clock, Database, Download } from 'lucide-react';

export function ResultTable({ result, title = "Console Output" }) {
  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-500 bg-purple-50/30 rounded-2xl border border-purple-100 space-y-2">
        <Table className="w-10 h-10 text-purple-300 animate-pulse" />
        <p className="text-sm font-bold text-violet-950">No Query Executed Yet</p>
        <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
          Type your SQL statement in the editor and click <span className="text-violet-700 font-mono font-bold">Run Query</span> or press <kbd className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-mono text-[10px]">Ctrl + Enter</kbd>.
        </p>
      </div>
    );
  }

  if (!result.success) {
    return (
      <div className="p-5 bg-rose-50 rounded-2xl border border-rose-200 text-rose-800 space-y-3 shadow-sm">
        <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 animate-bounce-subtle" />
          <span>SQL Syntax & Runtime Diagnostic Error</span>
        </div>
        <div className="font-mono text-xs p-4 rounded-xl bg-white border border-rose-200 text-rose-900 whitespace-pre-wrap leading-relaxed shadow-sm">
          {result.error}
        </div>
      </div>
    );
  }

  const { columns = [], values = [], rowCount = 0, executionTimeMs = 0, message } = result;

  const downloadCsv = () => {
    if (columns.length === 0 || values.length === 0) return;
    const csvRows = [
      columns.join(','),
      ...values.map(row => row.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `query_result_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-purple-100 overflow-hidden shadow-sm">
      {/* Table Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-purple-50/80 border-b border-purple-100 text-xs font-mono">
        <div className="flex items-center gap-2 text-violet-950 font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{title}</span>
        </div>

        <div className="flex items-center gap-4 text-slate-500">
          <div className="flex items-center gap-1 text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{executionTimeMs} ms</span>
          </div>
          
          <div className="flex items-center gap-1 font-bold text-violet-700">
            <Database className="w-3.5 h-3.5 text-violet-600" />
            <span>{rowCount} row(s)</span>
          </div>

          {values.length > 0 && (
            <button
              onClick={downloadCsv}
              className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-purple-100 text-purple-800 hover:bg-purple-200 border border-purple-200 transition-colors font-bold"
              title="Download results as CSV"
            >
              <Download className="w-3 h-3" /> CSV
            </button>
          )}
        </div>
      </div>

      {/* Message if 0 rows */}
      {message && values.length === 0 && (
        <div className="p-6 text-center text-xs text-slate-500 font-mono">
          {message}
        </div>
      )}

      {/* Interactive Data Table */}
      {columns.length > 0 && (
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead className="sticky top-0 bg-purple-100/70 text-violet-950 uppercase text-[11px] tracking-wider border-b border-purple-200 z-10">
              <tr>
                <th className="py-2.5 px-3 border-r border-purple-200/80 text-slate-500 w-12 text-center">#</th>
                {columns.map((col, idx) => (
                  <th key={idx} className="py-2.5 px-4 font-bold border-r border-purple-200/80 text-violet-900">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100/60">
              {values.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-purple-50/60 transition-colors odd:bg-white even:bg-purple-50/20">
                  <td className="py-2.5 px-3 border-r border-purple-100 text-slate-400 text-center select-none font-mono">
                    {rIdx + 1}
                  </td>
                  {row.map((val, cIdx) => (
                    <td key={cIdx} className="py-2.5 px-4 border-r border-purple-100 text-slate-800 whitespace-nowrap">
                      {val === null || val === undefined ? (
                        <span className="italic text-slate-400">NULL</span>
                      ) : typeof val === 'number' ? (
                        <span className="text-violet-700 font-semibold">{val}</span>
                      ) : (
                        String(val)
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
