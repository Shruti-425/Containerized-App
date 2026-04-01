const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || "db",
  user: process.env.POSTGRES_USER || "admin",
  password: process.env.POSTGRES_PASSWORD || "admin123",
  database: process.env.POSTGRES_DB || "mydb",
  port: 5432
});

//  Retry DB connection
async function connectWithRetry() {
  let retries = 5;

  while (retries) {
    try {
      await pool.query("SELECT 1");
      console.log(" Connected to DB");
      return;
    } catch (err) {
      console.log(" DB not ready, retrying...");
      retries--;
      await new Promise(res => setTimeout(res, 3000));
    }
  }
  throw new Error(" Could not connect to DB");
}

//  Initialize DB safely
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT
      )
    `);
    console.log(" Table ready");
  } catch (err) {
    console.error("DB Init Error:", err);
  }
}

// Run startup sequence
(async () => {
  await connectWithRetry();
  await initDB();
})();

// API Routes
app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;

    const result = await pool.query(
      "INSERT INTO users(name,email) VALUES($1,$2) RETURNING *",
      [name, email]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Start server
app.listen(3000, () => {
  console.log(" Server running on port 3000");
});