import initSqlJs from 'sql.js';
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url';

const getWasmUrls = () => {
  const baseUrl = import.meta.env.BASE_URL || './';
  const localWasm = baseUrl.endsWith('/') ? `${baseUrl}sql-wasm.wasm` : `${baseUrl}/sql-wasm.wasm`;
  return [
    sqlWasmUrl,
    localWasm,
    './sql-wasm.wasm',
    'https://cdn.jsdelivr.net/npm/sql.js@1.12.0/dist/sql-wasm.wasm',
    'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/sql-wasm.wasm',
    'https://unpkg.com/sql.js@1.12.0/dist/sql-wasm.wasm'
  ];
};

let SQL = null;
let sqlLoadingPromise = null;

/**
 * Initializes the SQL.js WASM engine asynchronously.
 */
export async function getSqlEngine() {
  if (SQL) return SQL;
  if (sqlLoadingPromise) return sqlLoadingPromise;

  const initFunction = typeof initSqlJs === 'function' 
    ? initSqlJs 
    : (initSqlJs && initSqlJs.default ? initSqlJs.default : window.initSqlJs);

  sqlLoadingPromise = (async () => {
    const urls = getWasmUrls();
    for (const url of urls) {
      try {
        // Try fetching ArrayBuffer directly first for zero-path-ambiguity loading
        const response = await fetch(url);
        if (response.ok) {
          const wasmBinary = await response.arrayBuffer();
          const sqlInstance = await initFunction({ wasmBinary });
          SQL = sqlInstance;
          return SQL;
        }
      } catch (err) {
        console.warn(`ArrayBuffer fetch failed for ${url}:`, err);
      }

      try {
        // Fallback to standard locateFile
        const sqlInstance = await initFunction({ locateFile: () => url });
        SQL = sqlInstance;
        return SQL;
      } catch (err) {
        console.warn(`locateFile WASM load failed for ${url}:`, err);
      }
    }

    // Reset loading promise so subsequent user actions retry instead of returning cached rejection
    sqlLoadingPromise = null;
    throw new Error("Unable to load SQLite WebAssembly engine. Please check your internet connection or reload the page.");
  })();

  return sqlLoadingPromise;
}

/**
 * Executes a user SQL query against a sandboxed DB preloaded with schema and seed data.
 */
export async function executeQueryInSandbox(schemaSql, seedSql, userQuery) {
  const startTime = performance.now();
  try {
    const SqlEngine = await getSqlEngine();
    const db = new SqlEngine.Database();

    // Execute Schema
    if (schemaSql && schemaSql.trim().length > 0) {
      db.run(schemaSql);
    }

    // Execute Seed Data
    if (seedSql && seedSql.trim().length > 0) {
      db.run(seedSql);
    }

    // Execute User Query
    const cleanedQuery = userQuery.trim();
    if (!cleanedQuery) {
      throw new Error("Query is empty. Please enter a valid SQL statement.");
    }

    const res = db.exec(cleanedQuery);
    const endTime = performance.now();
    const executionTimeMs = Math.round(endTime - startTime);

    db.close();

    if (!res || res.length === 0) {
      return {
        success: true,
        columns: [],
        values: [],
        rowCount: 0,
        executionTimeMs,
        message: "Query executed successfully. (0 rows returned or command completed)"
      };
    }

    const result = res[res.length - 1];
    return {
      success: true,
      columns: result.columns || [],
      values: result.values || [],
      rowCount: result.values ? result.values.length : 0,
      executionTimeMs
    };
  } catch (err) {
    const endTime = performance.now();
    return {
      success: false,
      columns: [],
      values: [],
      rowCount: 0,
      executionTimeMs: Math.round(endTime - startTime),
      error: formatFriendlySqlError(err.message || String(err))
    };
  }
}

function formatFriendlySqlError(rawError) {
  if (rawError.includes("no such table")) {
    const tableName = rawError.split("no such table:")[1]?.trim();
    return `Table Not Found: '${tableName || 'table'}'. Double-check the table name in the schema viewer!`;
  }
  if (rawError.includes("no such column")) {
    const colName = rawError.split("no such column:")[1]?.trim();
    return `Column Not Found: '${colName || 'column'}'. Check column spelling and table aliases.`;
  }
  if (rawError.includes("syntax error")) {
    return `SQL Syntax Error: ${rawError}. Check for missing commas, parentheses, or unclosed quotes.`;
  }
  if (rawError.includes("ambiguous column name")) {
    return `Ambiguous Column: Multiple tables share this column name. Qualify it with a table prefix (e.g., e.id).`;
  }
  return rawError;
}

export async function getTableSampleData(schemaSql, seedSql, tableName) {
  try {
    const res = await executeQueryInSandbox(schemaSql, seedSql, `SELECT * FROM ${tableName} LIMIT 10;`);
    return res;
  } catch (e) {
    return { success: false, columns: [], values: [], error: e.message };
  }
}
