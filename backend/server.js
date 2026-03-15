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

async function initDB(){
 await pool.query(`
  CREATE TABLE IF NOT EXISTS users(
   id SERIAL PRIMARY KEY,
   name TEXT,
   email TEXT
  )
 `);
}

initDB();

app.post("/users", async (req,res)=>{
 const {name,email} = req.body;

 const result = await pool.query(
  "INSERT INTO users(name,email) VALUES($1,$2) RETURNING *",
  [name,email]
 );

 res.json(result.rows[0]);
});

app.get("/users", async (req,res)=>{
 const result = await pool.query("SELECT * FROM users");
 res.json(result.rows);
});

app.get("/health",(req,res)=>{
 res.json({status:"ok"});
});

app.listen(3000,()=>{
 console.log("Server running on port 3000");
});