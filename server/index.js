const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
const port = 3002;

app.use(cors());

const pool = new Pool({
  user: "nikmeruva",
  host: "localhost",
  database: process.env.database,
  password: process.env.password,
  port: process.env.port,
});

app.get("/get-db-names", async (req, res) => {
  try {
    const queryResult = await pool.query(
      "SELECT datname FROM pg_database WHERE datistemplate = false;"
    );
    // Wrap each database name in an object with 'db_name' key
    const dbNames = queryResult.rows.map((row) => ({ db_name: row.datname }));
    res.json(dbNames); // Sends an array of objects
  } catch (error) {
    console.error("Error fetching database names", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/get-schema-number", async (req, res) => {
  try {
    const queryResult = await pool.query(
      "SELECT schema_name FROM information_schema.schemata"
    );
    console.log("Schema names:", queryResult.rowCount);
    const schemaRowCount = queryResult.rowCount;
    res.json({ schemaRowCount });
  } catch (error) {
    console.error("Error fetching database name", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/get-schema-names", async (req, res) => {
  try {
    const queryResult = await pool.query(
      "SELECT schema_name FROM information_schema.schemata"
    );
    console.log("Schema names:", queryResult.rows);
    const schemaNameArray = queryResult.rows;
    res.json({ schemaNameArray });
  } catch (error) {
    console.error("Error fetching database name", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
