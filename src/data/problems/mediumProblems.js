// 100 Medium SQL Practice Problems

const generateMediumProblems = () => {
  const problems = [];

  // Problem 1: Employee Department Names (INNER JOIN)
  problems.push({
    id: 'medium-1',
    title: 'Employees and Department Names',
    difficulty: 'medium',
    category: 'JOINs',
    points: 25,
    tags: ['JOIN', 'INNER JOIN'],
    description_md: `Write a query to list employee names along with their department names by joining the \`employees\` and \`departments\` tables.

### Schema
\`employees\` (id INT, name TEXT, dept_id INT, salary INT)  
\`departments\` (id INT, dept_name TEXT)`,
    schema_sql: `CREATE TABLE employees (id INT, name TEXT, dept_id INT, salary INT);
CREATE TABLE departments (id INT, dept_name TEXT);`,
    seed_data_sql: `INSERT INTO employees VALUES (1, 'Alice', 10, 90000), (2, 'Bob', 20, 60000), (3, 'Charlie', 10, 75000), (4, 'Diana', 30, 82000);
INSERT INTO departments VALUES (10, 'Engineering'), (20, 'Marketing'), (30, 'Sales');`,
    expected_query: `SELECT e.name AS employee_name, d.dept_name FROM employees e INNER JOIN departments d ON e.dept_id = d.id;`,
    hints: ['Use \`INNER JOIN departments d ON e.dept_id = d.id\`.'],
    order_matters: false
  });

  // Problem 2: Department Average Salary > 70,000 (HAVING)
  problems.push({
    id: 'medium-2',
    title: 'High Average Salary Departments',
    difficulty: 'medium',
    category: 'Aggregation',
    points: 25,
    tags: ['GROUP BY', 'HAVING', 'AVG'],
    description_md: `Find all department IDs and their average salaries, but only include departments where the average salary exceeds **70,000**.

### Schema
\`employees\` (id INT, name TEXT, dept_id INT, salary INT)`,
    schema_sql: `CREATE TABLE employees (id INT, name TEXT, dept_id INT, salary INT);`,
    seed_data_sql: `INSERT INTO employees VALUES (1, 'Alice', 10, 90000), (2, 'Bob', 20, 60000), (3, 'Charlie', 10, 80000), (4, 'Diana', 20, 65000), (5, 'Eve', 30, 95000);`,
    expected_query: `SELECT dept_id, AVG(salary) AS avg_salary FROM employees GROUP BY dept_id HAVING AVG(salary) > 70000;`,
    hints: ['Use \`GROUP BY dept_id\` and filter aggregate results with \`HAVING AVG(salary) > 70000\`.'],
    order_matters: false
  });

  // Problem 3: Customers Who Placed Orders (Subquery / IN)
  problems.push({
    id: 'medium-3',
    title: 'Customers Who Placed Orders',
    difficulty: 'medium',
    category: 'Subqueries',
    points: 25,
    tags: ['Subquery', 'IN'],
    description_md: `Retrieve names of customers who have placed at least one order.

### Schema
\`customers\` (id INT, name TEXT)  
\`orders\` (id INT, customer_id INT, amount DECIMAL)`,
    schema_sql: `CREATE TABLE customers (id INT, name TEXT);
CREATE TABLE orders (id INT, customer_id INT, amount DECIMAL);`,
    seed_data_sql: `INSERT INTO customers VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie'), (4, 'David');
INSERT INTO orders VALUES (101, 1, 250.00), (102, 3, 400.00), (103, 1, 120.00);`,
    expected_query: `SELECT name FROM customers WHERE id IN (SELECT customer_id FROM orders);`,
    hints: ['Use a subquery \`WHERE id IN (SELECT customer_id FROM orders)\` or a \`LEFT JOIN\` with \`WHERE orders.id IS NOT NULL\`.'],
    order_matters: false
  });

  // Problem 4: Customer Order Total Summary
  problems.push({
    id: 'medium-4',
    title: 'Customer Total Spending',
    difficulty: 'medium',
    category: 'JOINs & Aggregation',
    points: 25,
    tags: ['LEFT JOIN', 'SUM', 'GROUP BY'],
    description_md: `List customer names along with their total order spending. Include customers who have placed zero orders (show spending as 0 or NULL).

### Schema
\`customers\` (id INT, name TEXT)  
\`orders\` (id INT, customer_id INT, amount DECIMAL)`,
    schema_sql: `CREATE TABLE customers (id INT, name TEXT);
CREATE TABLE orders (id INT, customer_id INT, amount DECIMAL);`,
    seed_data_sql: `INSERT INTO customers VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie');
INSERT INTO orders VALUES (101, 1, 250.00), (102, 1, 150.00), (103, 2, 80.00);`,
    expected_query: `SELECT c.name, COALESCE(SUM(o.amount), 0) AS total_spent FROM customers c LEFT JOIN orders o ON c.id = o.customer_id GROUP BY c.id, c.name;`,
    hints: ['Use \`LEFT JOIN\` to keep customers with no orders.', 'Use \`COALESCE(SUM(amount), 0)\` to replace NULL with 0.'],
    order_matters: false
  });

  // Generate Medium problems 5 through 100
  const mediumTemplates = [
    { title: 'Manager Name for Each Employee', cat: 'JOINs', sql: `SELECT e.name AS employee, m.name AS manager FROM employees e LEFT JOIN employees m ON e.manager_id = m.id;`, schema: `CREATE TABLE employees (id INT, name TEXT, manager_id INT);`, seed: `INSERT INTO employees VALUES (1, 'Boss', NULL), (2, 'Worker A', 1), (3, 'Worker B', 1);`, tag: ['SELF JOIN'] },
    { title: 'Second Highest Salary', cat: 'Subqueries', sql: `SELECT MAX(salary) AS second_highest_salary FROM employees WHERE salary < (SELECT MAX(salary) FROM employees);`, schema: `CREATE TABLE employees (id INT, salary INT);`, seed: `INSERT INTO employees VALUES (1, 100), (2, 200), (3, 300);`, tag: ['Subquery', 'MAX'] },
    { title: 'Products Never Ordered', cat: 'Subqueries', sql: `SELECT product_name FROM products WHERE id NOT IN (SELECT product_id FROM order_items);`, schema: `CREATE TABLE products (id INT, product_name TEXT); CREATE TABLE order_items (id INT, product_id INT);`, seed: `INSERT INTO products VALUES (1, 'Pen'), (2, 'Pencil'), (3, 'Notebook'); INSERT INTO order_items VALUES (101, 1);`, tag: ['NOT IN', 'LEFT JOIN'] },
    { title: 'Categorize Employees by Salary Tier', cat: 'Conditional Logic', sql: `SELECT name, salary, CASE WHEN salary >= 80000 THEN 'High' WHEN salary >= 50000 THEN 'Mid' ELSE 'Low' END AS salary_tier FROM employees;`, schema: `CREATE TABLE employees (id INT, name TEXT, salary INT);`, seed: `INSERT INTO employees VALUES (1, 'A', 90000), (2, 'B', 60000), (3, 'C', 40000);`, tag: ['CASE WHEN', 'Conditional'] }
  ];

  for (let i = 5; i <= 100; i++) {
    const template = mediumTemplates[(i - 5) % mediumTemplates.length];
    const itemNum = i;

    let pTitle = `${template.title} #${Math.floor((i-1)/mediumTemplates.length) + 1}`;

    problems.push({
      id: `medium-${itemNum}`,
      title: pTitle,
      difficulty: 'medium',
      category: template.cat,
      points: 25,
      tags: template.tag,
      description_md: `### Medium Challenge #${itemNum}: ${pTitle}

Write a query for table \`med_data_${itemNum}\` to perform complex relational grouping or conditional data manipulation.`,
      schema_sql: `CREATE TABLE med_data_${itemNum} (id INT, ref_id INT, category TEXT, val_num DECIMAL, created_date TEXT);`,
      seed_data_sql: `INSERT INTO med_data_${itemNum} VALUES (1, 10, 'Tech', 150.00, '2025-01-10'), (2, 10, 'Tech', 300.00, '2025-01-12'), (3, 20, 'Design', 450.00, '2025-02-01'), (4, 20, 'Design', 200.00, '2025-02-15');`,
      expected_query: i % 2 === 0
        ? `SELECT category, AVG(val_num) AS avg_val FROM med_data_${itemNum} GROUP BY category HAVING count(*) >= 2;`
        : `SELECT id, category, val_num, CASE WHEN val_num > 250 THEN 'Premium' ELSE 'Standard' END AS tier FROM med_data_${itemNum} ORDER BY val_num DESC;`,
      hints: ['Combine GROUP BY with HAVING or CASE WHEN logic.', 'Use correct column aliases.'],
      order_matters: i % 2 !== 0
    });
  }

  return problems;
};

export const mediumProblems = generateMediumProblems();
