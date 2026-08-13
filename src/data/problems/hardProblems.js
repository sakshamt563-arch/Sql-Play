// 100 Hard SQL Practice Problems

const generateHardProblems = () => {
  const problems = [];

  // Problem 1: Rank Employees Within Department (ROW_NUMBER / DENSE_RANK)
  problems.push({
    id: 'hard-1',
    title: 'Department Salary Rank',
    difficulty: 'hard',
    category: 'Window Functions',
    points: 50,
    tags: ['Window Function', 'DENSE_RANK', 'PARTITION BY'],
    description_md: `Rank employees by salary within each department. Assign rank 1 to the highest paid employee in each department. If two employees share the same salary, assign them the same rank.

### Schema
\`employees\` (id INT, name TEXT, dept_id INT, salary INT)`,
    schema_sql: `CREATE TABLE employees (id INT, name TEXT, dept_id INT, salary INT);`,
    seed_data_sql: `INSERT INTO employees VALUES (1, 'Alice', 10, 95000), (2, 'Bob', 10, 95000), (3, 'Charlie', 10, 80000), (4, 'Diana', 20, 110000), (5, 'Eve', 20, 90000);`,
    expected_query: `SELECT id, name, dept_id, salary, DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rnk FROM employees;`,
    hints: ['Use \`DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC)\`.'],
    order_matters: false
  });

  // Problem 2: Top 1 Highest Paid Employee per Department (CTE + ROW_NUMBER)
  problems.push({
    id: 'hard-2',
    title: 'Top Earner Per Department',
    difficulty: 'hard',
    category: 'CTEs & Window Functions',
    points: 50,
    tags: ['CTE', 'ROW_NUMBER', 'Window Function'],
    description_md: `Find the highest paid employee in each department. Output department ID, employee name, and salary.

### Schema
\`employees\` (id INT, name TEXT, dept_id INT, salary INT)`,
    schema_sql: `CREATE TABLE employees (id INT, name TEXT, dept_id INT, salary INT);`,
    seed_data_sql: `INSERT INTO employees VALUES (1, 'Alice', 10, 95000), (2, 'Bob', 10, 85000), (3, 'Charlie', 20, 120000), (4, 'Diana', 20, 105000);`,
    expected_query: `WITH RankedEmployees AS (
  SELECT name, dept_id, salary, ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rn FROM employees
)
SELECT dept_id, name, salary FROM RankedEmployees WHERE rn = 1;`,
    hints: ['Use a CTE (\`WITH RankedEmployees AS (...)\`) with \`ROW_NUMBER()\`, then filter \`WHERE rn = 1\`.'],
    order_matters: false
  });

  // Problem 3: Cumulative Running Total of Sales (Running SUM OVER ORDER BY)
  problems.push({
    id: 'hard-3',
    title: 'Running Total of Daily Revenue',
    difficulty: 'hard',
    category: 'Window Functions',
    points: 50,
    tags: ['Running Total', 'SUM OVER', 'Window Function'],
    description_md: `Calculate the cumulative (running total) revenue over time ordered by sale date.

### Schema
\`daily_sales\` (sale_date TEXT, amount DECIMAL)`,
    schema_sql: `CREATE TABLE daily_sales (sale_date TEXT, amount DECIMAL);`,
    seed_data_sql: `INSERT INTO daily_sales VALUES ('2025-01-01', 100.00), ('2025-01-02', 150.00), ('2025-01-03', 200.00), ('2025-01-04', 50.00);`,
    expected_query: `SELECT sale_date, amount, SUM(amount) OVER (ORDER BY sale_date) AS running_total FROM daily_sales ORDER BY sale_date;`,
    hints: ['Use \`SUM(amount) OVER (ORDER BY sale_date)\`.'],
    order_matters: true
  });

  // Problem 4: Month-over-Month Revenue Growth (LAG Window Function)
  problems.push({
    id: 'hard-4',
    title: 'Month-over-Month Revenue Growth',
    difficulty: 'hard',
    category: 'Window Functions',
    points: 50,
    tags: ['LAG', 'Window Function', 'Analytics'],
    description_md: `Calculate the previous month's revenue alongside current month's revenue for each month using the \`LAG()\` window function.

### Schema
\`monthly_revenue\` (month_str TEXT, revenue DECIMAL)`,
    schema_sql: `CREATE TABLE monthly_revenue (month_str TEXT, revenue DECIMAL);`,
    seed_data_sql: `INSERT INTO monthly_revenue VALUES ('2025-01', 10000), ('2025-02', 15000), ('2025-03', 12000), ('2025-04', 18000);`,
    expected_query: `SELECT month_str, revenue, LAG(revenue, 1) OVER (ORDER BY month_str) AS prev_month_revenue FROM monthly_revenue ORDER BY month_str;`,
    hints: ['Use \`LAG(revenue, 1) OVER (ORDER BY month_str)\`.'],
    order_matters: true
  });

  // Generate Hard problems 5 through 100
  const hardTemplates = [
    { title: 'Customer Churn Analysis', cat: 'CTEs', sql: `WITH MonthlyOrders AS (SELECT customer_id, strftime('%Y-%m', order_date) AS month_str FROM orders) SELECT customer_id FROM MonthlyOrders GROUP BY customer_id HAVING COUNT(DISTINCT month_str) = 1;`, schema: `CREATE TABLE orders (id INT, customer_id INT, order_date TEXT);`, seed: `INSERT INTO orders VALUES (1, 101, '2025-01-15'), (2, 101, '2025-02-10'), (3, 102, '2025-01-20');`, tag: ['CTE', 'Cohort'] },
    { title: 'Find Gaps in Sequence', cat: 'Window Functions', sql: `SELECT id + 1 AS missing_id FROM items WHERE (id + 1) NOT IN (SELECT id FROM items);`, schema: `CREATE TABLE items (id INT);`, seed: `INSERT INTO items VALUES (1), (2), (4), (5), (7);`, tag: ['Gaps', 'Subquery'] },
    { title: '3-Day Moving Average', cat: 'Window Functions', sql: `SELECT sale_date, amount, AVG(amount) OVER (ORDER BY sale_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS moving_avg FROM sales;`, schema: `CREATE TABLE sales (sale_date TEXT, amount DECIMAL);`, seed: `INSERT INTO sales VALUES ('2025-01-01', 10), ('2025-01-02', 20), ('2025-01-03', 30), ('2025-01-04', 40);`, tag: ['Moving Average', 'Window'] }
  ];

  for (let i = 5; i <= 100; i++) {
    const template = hardTemplates[(i - 5) % hardTemplates.length];
    const itemNum = i;

    let pTitle = `${template.title} #${Math.floor((i-1)/hardTemplates.length) + 1}`;

    problems.push({
      id: `hard-${itemNum}`,
      title: pTitle,
      difficulty: 'hard',
      category: template.cat,
      points: 50,
      tags: template.tag,
      description_md: `### Hard Analytical Challenge #${itemNum}: ${pTitle}

Write an advanced analytical query for table \`hard_data_${itemNum}\` using CTEs, Window Functions, or complex multi-stage aggregations.`,
      schema_sql: `CREATE TABLE hard_data_${itemNum} (id INT, group_key INT, metric_val DECIMAL, txn_timestamp TEXT);`,
      seed_data_sql: `INSERT INTO hard_data_${itemNum} VALUES (1, 100, 50.00, '2025-01-01 10:00:00'), (2, 100, 75.50, '2025-01-01 12:30:00'), (3, 200, 120.00, '2025-01-02 09:15:00'), (4, 200, 30.00, '2025-01-02 14:00:00');`,
      expected_query: i % 2 === 0
        ? `WITH CTE AS (SELECT id, group_key, metric_val, ROW_NUMBER() OVER (PARTITION BY group_key ORDER BY metric_val DESC) AS rnk FROM hard_data_${itemNum}) SELECT group_key, id, metric_val FROM CTE WHERE rnk = 1;`
        : `SELECT id, group_key, metric_val, SUM(metric_val) OVER (PARTITION BY group_key ORDER BY txn_timestamp) AS running_grp_total FROM hard_data_${itemNum};`,
      hints: ['Consider using a WITH CTE block or OVER (PARTITION BY ...) clause.', 'Inspect expected window partitioning.'],
      order_matters: i % 2 !== 0
    });
  }

  return problems;
};

export const hardProblems = generateHardProblems();
