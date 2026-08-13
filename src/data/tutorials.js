export const SQL_LESSONS = [
  {
    id: 'lesson-1',
    moduleTitle: 'Module 1: SQL Foundations',
    title: '1. The Anatomy of a SELECT Query',
    estimatedMinutes: 5,
    summary: 'Learn how to retrieve columns and rows from a database table using SELECT, FROM, and WHERE.',
    content_md: `## What is SQL?

**SQL** (Structured Query Language) is the standard language for interacting with relational database management systems.

### Basic Syntax
\`\`\`sql
SELECT column1, column2
FROM table_name
WHERE condition;
\`\`\`

- \`SELECT\`: Specifies the columns you want to view.
- \`FROM\`: Specifies the table containing the data.
- \`WHERE\`: Filters rows based on a specific boolean condition.

### Example
To find all active users in the engineering department:
\`\`\`sql
SELECT name, email
FROM users
WHERE department = 'Engineering' AND status = 'Active';
\`\`\``,
    practiceProblemId: 'easy-1'
  },
  {
    id: 'lesson-2',
    moduleTitle: 'Module 2: Joins & Relations',
    title: '2. Combining Tables with INNER & LEFT JOIN',
    estimatedMinutes: 8,
    summary: 'Understand how relational databases link tables using foreign keys and JOIN clauses.',
    content_md: `## Types of SQL Joins

1. **INNER JOIN**: Returns records that have matching values in both tables.
2. **LEFT JOIN**: Returns all records from the left table, and matched records from the right table.
3. **RIGHT JOIN**: Returns all records from the right table.

### Syntax
\`\`\`sql
SELECT e.name, d.dept_name
FROM employees e
INNER JOIN departments d ON e.dept_id = d.id;
\`\`\``,
    practiceProblemId: 'medium-1'
  },
  {
    id: 'lesson-3',
    moduleTitle: 'Module 3: Aggregations & Analytics',
    title: '3. Grouping Data with GROUP BY & HAVING',
    estimatedMinutes: 10,
    summary: 'Master aggregate functions (COUNT, SUM, AVG) and filter grouped results with HAVING.',
    content_md: `## Aggregating Data

Aggregate functions operate on sets of rows to produce summary statistics:
- \`COUNT()\`: Counts rows
- \`SUM()\`: Calculates sum
- \`AVG()\`: Calculates mean average

### HAVING vs WHERE
- Use **WHERE** to filter raw individual rows *before* grouping.
- Use **HAVING** to filter aggregated group results *after* grouping.

\`\`\`sql
SELECT dept_id, AVG(salary) AS avg_salary
FROM employees
GROUP BY dept_id
HAVING AVG(salary) > 70000;
\`\`\``,
    practiceProblemId: 'medium-2'
  },
  {
    id: 'lesson-4',
    moduleTitle: 'Module 4: Advanced SQL Mastery',
    title: '4. Window Functions & Partitioning',
    estimatedMinutes: 12,
    summary: 'Perform advanced analytical calculations across a set of table rows using OVER() and PARTITION BY.',
    content_md: `## What are Window Functions?

Unlike standard aggregate functions that collapse rows into a single summary row, **Window Functions** calculate values across related rows while keeping individual row identities intact.

### Syntax
\`\`\`sql
FUNCTION_NAME() OVER (
  PARTITION BY column_name
  ORDER BY column_name DESC
)
\`\`\`

### Common Functions
- \`ROW_NUMBER()\`: Unique sequential row numbers
- \`RANK()\`: Rank with gaps for ties
- \`DENSE_RANK()\`: Rank without gaps for ties
- \`LAG() / LEAD()\`: Access prior or future row values`,
    practiceProblemId: 'hard-1'
  }
];
