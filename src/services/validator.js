import { executeQueryInSandbox } from './sqlEngine.js';

/**
 * Validates a user query against a problem's schema, seed data, and expected SQL solution.
 * 
 * @param {Object} problem - The problem definition object
 * @param {string} userQuery - The SQL string typed by the user
 * @returns {Promise<{ isCorrect: boolean, feedback: string, userResult: Object, expectedResult: Object }>}
 */
export async function validateSubmission(problem, userQuery) {
  // 1. Run User Query
  const userResult = await executeQueryInSandbox(
    problem.schema_sql,
    problem.seed_data_sql,
    userQuery
  );

  if (!userResult.success) {
    return {
      isCorrect: false,
      feedback: userResult.error || "Query execution failed with errors.",
      userResult,
      expectedResult: null
    };
  }

  // 2. Run Canonical Expected Query
  const expectedResult = await executeQueryInSandbox(
    problem.schema_sql,
    problem.seed_data_sql,
    problem.expected_query
  );

  if (!expectedResult.success) {
    console.error("Internal Error: Expected solution query failed!", expectedResult.error);
    return {
      isCorrect: false,
      feedback: "System error validating solution. Please report this problem.",
      userResult,
      expectedResult
    };
  }

  // 3. Compare Results
  const comparison = compareResultSets(
    userResult,
    expectedResult,
    problem.order_matters ?? false
  );

  return {
    isCorrect: comparison.isCorrect,
    feedback: comparison.feedback,
    userResult,
    expectedResult
  };
}

/**
 * Compares user output against canonical output.
 */
function compareResultSets(userRes, expectedRes, orderMatters = false) {
  // Check column count
  if (userRes.columns.length !== expectedRes.columns.length) {
    return {
      isCorrect: false,
      feedback: `Column count mismatch. Expected ${expectedRes.columns.length} column(s) [${expectedRes.columns.join(', ')}], but got ${userRes.columns.length} column(s) [${userRes.columns.join(', ')}].`
    };
  }

  // Check row count
  if (userRes.values.length !== expectedRes.values.length) {
    return {
      isCorrect: false,
      feedback: `Row count mismatch. Expected ${expectedRes.values.length} row(s), but your query returned ${userRes.values.length} row(s).`
    };
  }

  // Compare Column Names (Warning if names differ but values match)
  const userColsLower = userRes.columns.map(c => String(c).toLowerCase().trim());
  const expectedColsLower = expectedRes.columns.map(c => String(c).toLowerCase().trim());
  let colNamesDiffer = false;
  for (let i = 0; i < userColsLower.length; i++) {
    if (userColsLower[i] !== expectedColsLower[i]) {
      colNamesDiffer = true;
      break;
    }
  }

  // Compare Row Values
  const userRows = userRes.values.map(normalizeRow);
  const expectedRows = expectedRes.values.map(normalizeRow);

  if (orderMatters) {
    for (let r = 0; r < expectedRows.length; r++) {
      if (!areRowsEqual(userRows[r], expectedRows[r])) {
        return {
          isCorrect: false,
          feedback: `Mismatch at row #${r + 1}. Expected row values: (${expectedRows[r].join(', ')}), but got: (${userRows[r].join(', ')}). Check your ORDER BY or calculations!`
        };
      }
    }
  } else {
    // Order insensitive comparison
    const sortedUser = [...userRows].sort(sortRows);
    const sortedExpected = [...expectedRows].sort(sortRows);

    for (let r = 0; r < sortedExpected.length; r++) {
      if (!areRowsEqual(sortedUser[r], sortedExpected[r])) {
        return {
          isCorrect: false,
          feedback: `Output values do not match expected results. Expected data rows differ. Double-check your filtering, join conditions, or aggregate functions.`
        };
      }
    }
  }

  let feedbackMsg = "All test cases passed! Clean query execution.";
  if (colNamesDiffer) {
    feedbackMsg += " Note: Your column aliases differ slightly from expected names, but dataset values match perfectly!";
  }

  return {
    isCorrect: true,
    feedback: feedbackMsg
  };
}

function normalizeRow(row) {
  return row.map(val => {
    if (val === null || val === undefined) return 'NULL';
    if (typeof val === 'number') {
      // Round floating point numbers to 4 decimals for comparison safety
      return Number.isInteger(val) ? val : Math.round(val * 10000) / 10000;
    }
    return String(val).trim();
  });
}

function areRowsEqual(rowA, rowB) {
  if (rowA.length !== rowB.length) return false;
  for (let i = 0; i < rowA.length; i++) {
    if (rowA[i] !== rowB[i]) return false;
  }
  return true;
}

function sortRows(a, b) {
  const strA = a.join('|||');
  const strB = b.join('|||');
  return strA.localeCompare(strB);
}
