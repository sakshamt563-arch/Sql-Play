import React, { useState } from 'react';
import { Database, Table, Columns, Eye, ChevronDown, ChevronRight, Hash, Type } from 'lucide-react';
import { ResultTable } from './ResultTable.jsx';
import { getTableSampleData } from '../services/sqlEngine.js';

export function SchemaViewer({ problem }) {
  const [expandedTable, setExpandedTable] = useState(null);
  const [sampleData, setSampleData] = useState(null);
  const [loadingTable, setLoadingTable] = useState(null);

  // Parse schema SQL to get table names and CREATE statements
  const parseTables = () => {
    if (!problem.schema_sql) return [];
    const statements = problem.schema_sql.split(';').filter(s => s.trim().length > 0);
    return statements.map((stmt, idx) => {
      const match = stmt.match(/CREATE\ TABLE\ (\w+)\ \((.*)\)/i);
      if (match) {
        const tableName = match[1];
        const colsRaw = match[2].split(',');
        const columns = colsRaw.map(c => {
          const parts = c.trim().split(/\s+/);
          return { name: parts[0], type: parts[1] || 'TEXT' };
        });
        return { name: tableName, columns, rawStmt: stmt };
      }
      return { name: `table_${idx + 1}`, columns: [], rawStmt: stmt };
    });
  };

  const tables = parseTables();

  const handlePreviewTable = async (tableName) => {
    if (expandedTable === tableName) {
      setExpandedTable(null);
      setSampleData(null);
      return;
    }

    setExpandedTable(tableName);
    setLoadingTable(tableName);
    const res = await getTableSampleData(problem.schema_sql, problem.seed_data_sql, tableName);
    setSampleData(res);
    setLoadingTable(null);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-purple-100 overflow-hidden shadow-sm">
      <div className="flex items-center gap-2 px-4 py-3 bg-purple-50/80 border-b border-purple-100 text-xs font-mono font-bold text-violet-950">
        <Database className="w-4 h-4 text-violet-600" />
        <span>Database Schema & Tables ({tables.length})</span>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-3">
        {tables.map((t, idx) => {
          const isExpanded = expandedTable === t.name;
          return (
            <div key={idx} className="rounded-xl border border-purple-100 bg-purple-50/20 overflow-hidden shadow-xs">
              <button
                onClick={() => handlePreviewTable(t.name)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-purple-50/60 transition-colors"
              >
                <div className="flex items-center gap-2 font-mono text-sm font-semibold text-violet-950">
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-violet-600" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                  <Table className="w-4 h-4 text-violet-600" />
                  <span>{t.name}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <span>{t.columns.length} col(s)</span>
                  <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1 font-bold">
                    <Eye className="w-3 h-3" /> Preview
                  </span>
                </div>
              </button>

              {/* Column list */}
              <div className="px-4 py-2 border-t border-purple-100 bg-white">
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  {t.columns.map((c, cIdx) => (
                    <div key={cIdx} className="flex items-center justify-between p-1.5 rounded bg-purple-50/50 border border-purple-100">
                      <span className="text-slate-800 font-medium">{c.name}</span>
                      <span className="text-[10px] text-purple-800 font-bold uppercase bg-purple-100 px-1.5 py-0.5 rounded">
                        {c.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Data preview */}
              {isExpanded && (
                <div className="p-3 border-t border-purple-100 bg-white">
                  {loadingTable === t.name ? (
                    <div className="text-xs font-mono text-slate-500 animate-pulse p-2">Loading sample rows...</div>
                  ) : sampleData ? (
                    <ResultTable result={sampleData} title={`Sample Data: ${t.name}`} />
                  ) : null}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
