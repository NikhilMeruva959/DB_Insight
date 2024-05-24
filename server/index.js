const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
const port = 3002;

app.use(cors());

const pool = new Pool({
  user: "nikmeruva",
  host: "localhost",
  database: "db_insight",
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

app.get("/get-config-db-info/:dbName", async (req, res) => {
  const dbName = req.params.dbName;

  const pool = new Pool({
    user: "nikmeruva",
    host: "localhost",
    database: dbName, // Use the database name from the request parameter
    password: process.env.password,
    port: process.env.port,
  });

  try {
    const queryResult = await pool.query("SELECT * FROM config_db_info");
    console.log("Config DB Info:", queryResult.rows);
    const configDbInfoArray = queryResult.rows;
    res.json({ configDbInfoArray });
  } catch (error) {
    console.error("Error fetching config_db_info", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    pool.end(); // Close the pool after the query
  }
});

app.post("/add-config-db-info", async (req, res) => {
  console.log("JJJJ2");
  const {
    db_name,
    db_type,
    enviornment,
    db_user_id,
    db_password,
    host_id,
    port_id,
    connection_str,
    team_name,
    team_poc,
  } = req.body;
  console.log(req.body);

  const query = `
    INSERT INTO public.config_db_info (
      db_name, db_type, enviornment, db_user_id, db_password, 
      host_id, port_id, connection_str, team_name, team_poc
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;

  try {
    await pool.query(query, [
      db_name,
      db_type,
      enviornment,
      db_user_id,
      db_password,
      host_id,
      port_id,
      connection_str,
      team_name,
      team_poc,
    ]);
    res
      .status(201)
      .json({ message: "Database configuration added successfully" });
  } catch (error) {
    console.error("Error adding config_db_info", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
