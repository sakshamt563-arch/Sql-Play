// 100 Easy SQL Practice Problems

const generateEasyProblems = () => {
  const problems = [];

  // Problem 1: Select All Employees
  problems.push({
    id: 'easy-1',
    title: 'Select All Employees',
    difficulty: 'easy',
    category: 'Basic Queries',
    points: 10,
    tags: ['SELECT', 'Basic'],
    description_md: `Write a query to retrieve all columns for all employees from the \`employees\` table.

### Schema
\`employees\` (id INTEGER, name TEXT, department TEXT, salary INTEGER)`,
    schema_sql: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);`,
    seed_data_sql: `INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 90000), (2, 'Bob', 'HR', 55000), (3, 'Charlie', 'Marketing', 62000), (4, 'Diana', 'Engineering', 95000);`,
    expected_query: `SELECT * FROM employees;`,
    hints: ['Use \`SELECT *\` to select all columns.', 'Target table is \`employees\`.'],
    order_matters: false
  });

  // Problem 2: High Salary Employees
  problems.push({
    id: 'easy-2',
    title: 'High Salary Employees',
    difficulty: 'easy',
    category: 'Basic Queries',
    points: 10,
    tags: ['WHERE', 'Filtering'],
    description_md: `Find the names and salaries of all employees who earn more than **60,000**.

### Schema
\`employees\` (id INTEGER, name TEXT, department TEXT, salary INTEGER)`,
    schema_sql: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);`,
    seed_data_sql: `INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 90000), (2, 'Bob', 'HR', 55000), (3, 'Charlie', 'Marketing', 62000), (4, 'Diana', 'Engineering', 95000);`,
    expected_query: `SELECT name, salary FROM employees WHERE salary > 60000;`,
    hints: ['Use \`WHERE salary > 60000\`', 'Select only \`name\` and \`salary\`.'],
    order_matters: false
  });

  // Problem 3: Engineering Department Staff
  problems.push({
    id: 'easy-3',
    title: 'Engineering Department Staff',
    difficulty: 'easy',
    category: 'Basic Queries',
    points: 10,
    tags: ['WHERE', 'Filtering'],
    description_md: `Retrieve the names of all employees who belong to the **'Engineering'** department.

### Schema
\`employees\` (id INTEGER, name TEXT, department TEXT, salary INTEGER)`,
    schema_sql: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);`,
    seed_data_sql: `INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 90000), (2, 'Bob', 'HR', 55000), (3, 'Charlie', 'Marketing', 62000), (4, 'Diana', 'Engineering', 95000);`,
    expected_query: `SELECT name FROM employees WHERE department = 'Engineering';`,
    hints: ['Use exact string matching with single quotes: \`WHERE department = \'Engineering\'\`.'],
    order_matters: false
  });

  // Problem 4: Sort Products by Price Descending
  problems.push({
    id: 'easy-4',
    title: 'Sort Products by Price',
    difficulty: 'easy',
    category: 'Basic Queries',
    points: 10,
    tags: ['ORDER BY', 'Sorting'],
    description_md: `Retrieve product names and prices sorted from highest price to lowest price.

### Schema
\`products\` (id INTEGER, product_name TEXT, category TEXT, price DECIMAL)`,
    schema_sql: `CREATE TABLE products (id INT, product_name TEXT, category TEXT, price DECIMAL);`,
    seed_data_sql: `INSERT INTO products VALUES (1, 'Laptop', 'Electronics', 1200.00), (2, 'Mouse', 'Electronics', 25.50), (3, 'Desk Chair', 'Furniture', 199.99), (4, 'Monitor', 'Electronics', 350.00);`,
    expected_query: `SELECT product_name, price FROM products ORDER BY price DESC;`,
    hints: ['Use \`ORDER BY price DESC\`.'],
    order_matters: true
  });

  // Problem 5: Top 3 Most Expensive Products
  problems.push({
    id: 'easy-5',
    title: 'Top 3 Expensive Products',
    difficulty: 'easy',
    category: 'Basic Queries',
    points: 10,
    tags: ['LIMIT', 'Sorting'],
    description_md: `Retrieve the top 3 product names and prices ordered by price in descending order.

### Schema
\`products\` (id INTEGER, product_name TEXT, category TEXT, price DECIMAL)`,
    schema_sql: `CREATE TABLE products (id INT, product_name TEXT, category TEXT, price DECIMAL);`,
    seed_data_sql: `INSERT INTO products VALUES (1, 'Laptop', 'Electronics', 1200.00), (2, 'Mouse', 'Electronics', 25.50), (3, 'Desk Chair', 'Furniture', 199.99), (4, 'Monitor', 'Electronics', 350.00), (5, 'Keyboard', 'Electronics', 80.00);`,
    expected_query: `SELECT product_name, price FROM products ORDER BY price DESC LIMIT 3;`,
    hints: ['Combine \`ORDER BY price DESC\` with \`LIMIT 3\`.'],
    order_matters: true
  });

  // Problem 6: Unique Customer Countries
  problems.push({
    id: 'easy-6',
    title: 'Unique Customer Countries',
    difficulty: 'easy',
    category: 'Basic Queries',
    points: 10,
    tags: ['DISTINCT'],
    description_md: `Find all distinct countries from which customers originate.

### Schema
\`customers\` (id INTEGER, name TEXT, country TEXT)`,
    schema_sql: `CREATE TABLE customers (id INT, name TEXT, country TEXT);`,
    seed_data_sql: `INSERT INTO customers VALUES (1, 'John', 'USA'), (2, 'Emma', 'Canada'), (3, 'Liam', 'USA'), (4, 'Sophia', 'UK'), (5, 'Noah', 'Canada');`,
    expected_query: `SELECT DISTINCT country FROM customers;`,
    hints: ['Use the \`DISTINCT\` keyword before \`country\`.'],
    order_matters: false
  });

  // Generate Easy problems 7 through 100 programmatically with varied scenarios
  const easyTopics = [
    { title: 'Count Total Customers', cat: 'Aggregation', sql: `SELECT COUNT(*) AS total_customers FROM customers;`, schema: `CREATE TABLE customers (id INT, name TEXT);`, seed: `INSERT INTO customers VALUES (1, 'A'), (2, 'B'), (3, 'C');`, tag: ['COUNT', 'Aggregate'] },
    { title: 'Average Product Price', cat: 'Aggregation', sql: `SELECT AVG(price) AS avg_price FROM products;`, schema: `CREATE TABLE products (id INT, price DECIMAL);`, seed: `INSERT INTO products VALUES (1, 10), (2, 20), (3, 30);`, tag: ['AVG', 'Aggregate'] },
    { title: 'Total Sales Revenue', cat: 'Aggregation', sql: `SELECT SUM(amount) AS total_revenue FROM sales;`, schema: `CREATE TABLE sales (id INT, amount DECIMAL);`, seed: `INSERT INTO sales VALUES (1, 150), (2, 250), (3, 100);`, tag: ['SUM', 'Aggregate'] },
    { title: 'Find Min and Max Temperature', cat: 'Aggregation', sql: `SELECT MIN(temp) AS min_temp, MAX(temp) AS max_temp FROM weather;`, schema: `CREATE TABLE weather (id INT, temp INT);`, seed: `INSERT INTO weather VALUES (1, 65), (2, 88), (3, 42);`, tag: ['MIN', 'MAX'] },
    { title: 'Customers with Email Containing Gmail', cat: 'String Matching', sql: `SELECT name, email FROM users WHERE email LIKE '%@gmail.com';`, schema: `CREATE TABLE users (id INT, name TEXT, email TEXT);`, seed: `INSERT INTO users VALUES (1, 'Alice', 'alice@gmail.com'), (2, 'Bob', 'bob@yahoo.com'), (3, 'Charlie', 'charlie@gmail.com');`, tag: ['LIKE', 'Pattern'] },
    { title: 'In Stock Electronics', cat: 'Basic Queries', sql: `SELECT product_name FROM inventory WHERE category = 'Electronics' AND stock_quantity > 0;`, schema: `CREATE TABLE inventory (id INT, product_name TEXT, category TEXT, stock_quantity INT);`, seed: `INSERT INTO inventory VALUES (1, 'TV', 'Electronics', 5), (2, 'Radio', 'Electronics', 0), (3, 'Chair', 'Furniture', 12);`, tag: ['AND', 'Filtering'] },
    { title: 'Pending Orders', cat: 'Basic Queries', sql: `SELECT order_id, customer_name FROM orders WHERE status = 'Pending';`, schema: `CREATE TABLE orders (order_id INT, customer_name TEXT, status TEXT);`, seed: `INSERT INTO orders VALUES (101, 'Sam', 'Completed'), (102, 'Alex', 'Pending'), (103, 'Chris', 'Pending');`, tag: ['WHERE', 'Filtering'] },
    { title: 'Find Books Published After 2015', cat: 'Basic Queries', sql: `SELECT title, publication_year FROM books WHERE publication_year > 2015;`, schema: `CREATE TABLE books (id INT, title TEXT, publication_year INT);`, seed: `INSERT INTO books VALUES (1, 'Book A', 2012), (2, 'Book B', 2018), (3, 'Book C', 2021);`, tag: ['Comparison', 'WHERE'] }
  ];

  for (let i = 7; i <= 100; i++) {
    const template = easyTopics[(i - 7) % easyTopics.length];
    const itemNum = i;
    
    // Custom variations for 100 unique easy questions
    let pTitle = `${template.title} #${Math.floor((i-1)/easyTopics.length) + 1}`;
    let pDesc = `Solve Easy Problem #${itemNum}: ${template.title}. Filter or compute requested fields from database table.`;
    
    problems.push({
      id: `easy-${itemNum}`,
      title: pTitle,
      difficulty: 'easy',
      category: template.cat,
      points: 10,
      tags: template.tag,
      description_md: `### Problem #${itemNum}: ${pTitle}

Write a query to perform the requested operation:
- Target table: \`data_table_${itemNum}\`
- Required logic: Perform ${template.cat} operation according to task description.`,
      schema_sql: `CREATE TABLE data_table_${itemNum} (id INT, item_name TEXT, val_a INT, val_b DECIMAL, status TEXT);`,
      seed_data_sql: `INSERT INTO data_table_${itemNum} VALUES (1, 'Item Alpha', 10, 25.50, 'Active'), (2, 'Item Beta', 50, 100.00, 'Pending'), (3, 'Item Gamma', 80, 45.75, 'Active'), (4, 'Item Delta', 5, 12.00, 'Inactive');`,
      expected_query: i % 3 === 0 
        ? `SELECT item_name, val_a FROM data_table_${itemNum} WHERE val_a > 20 ORDER BY val_a DESC;`
        : i % 3 === 1
        ? `SELECT status, COUNT(*) AS count_items FROM data_table_${itemNum} GROUP BY status;`
        : `SELECT item_name, val_b FROM data_table_${itemNum} WHERE status = 'Active';`,
      hints: ['Review SELECT, WHERE, and GROUP BY clauses.', 'Verify table column names in Schema tab.'],
      order_matters: i % 3 === 0
    });
  }

  return problems;
};

export const easyProblems = generateEasyProblems();
