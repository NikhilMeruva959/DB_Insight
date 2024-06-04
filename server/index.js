const express = require("express");
const { Pool: PostgresPool } = require("pg");
const cors = require("cors");
const mysql = require("mysql2");
const url = require("url");

const app = express();
const port = 3002;

app.use(express.json());
app.use(cors());

const postgresPool = new PostgresPool({
  user: "nikmeruva",
  host: "localhost",
  database: "db_insight",
  password: process.env.PASSWORD,
  port: process.env.PORT,
});

app.get("/get-db-names", async (req, res) => {
  try {
    const queryResult = await postgresPool.query(
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
    const queryResult = await postgresPool.query(
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
    const queryResult = await postgresPool.query(
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

  const pool = new PostgresPool({
    user: "nikmeruva",
    host: "localhost",
    database: dbName, // Use the database name from the request parameter
    password: process.env.PASSWORD,
    port: process.env.PORT,
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

app.get("/get-config-db-info-insight/:dbName", async (req, res) => {
  const dbName = req.params.dbName;

  const pool = new PostgresPool({
    user: "nikmeruva",
    host: "localhost",
    database: dbName, // Use the database name from the request parameter
    password: process.env.PASSWORD,
    port: process.env.PORT,
  });

  try {
    const queryResult = await pool.query("SELECT * FROM conf_db_query");
    console.log("Config Info DB Info:", queryResult.rows);
    const configInfoDbInfoArray = queryResult.rows;
    res.json({ configInfoDbInfoArray });
  } catch (error) {
    console.error("Error fetching conf_db_query", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    pool.end(); // Close the pool after the query
  }
});

app.get("/get-config-db-info-selector/:subDBName", async (req, res) => {
  const dbName = req.params.subDBName;

  const pool = new PostgresPool({
    user: "nikmeruva",
    host: "localhost",
    database: "db_insight", // Use the database name from the request parameter
    password: process.env.PASSWORD,
    port: process.env.PORT,
  });

  try {
    const queryResult = await pool.query("SELECT * FROM config_db_info");
    console.log("Config DB Info:", queryResult.rows);

    const configDbInfoArray = queryResult.rows;
    const dbInfo = configDbInfoArray.find((db) => db.db_name === dbName);

    if (dbInfo) {
      const { config_db_id, connection_str } = dbInfo;
      res.json({ config_db_id, connection_str });
    } else {
      res.status(404).json({ error: "Database not found" });
    }
  } catch (error) {
    console.error("Error fetching config_db_info", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    pool.end(); // Close the pool after the query
  }
});

app.post("/tables/:connectionString/run-query", async (req, res) => {
  const connectionString = decodeURIComponent(req.params.connectionString);
  const { sql_query } = req.body;

  console.log("Received SQL Query:", sql_query); // Debug log

  // Determine the database type from the connection string
  const parsedUrl = new url.URL(connectionString);
  const protocol = parsedUrl.protocol;

  if (protocol.startsWith("mysql")) {
    // MySQL connection
    const dbConfig = {
      host: parsedUrl.hostname,
      port: parsedUrl.port,
      user: parsedUrl.username,
      password: parsedUrl.password,
      database: parsedUrl.pathname.slice(1), // Remove leading slash
    };

    console.log(dbConfig);

    const pool = mysql.createPool(dbConfig);

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error connecting to the MySQL database:", err);
        return res.status(500).json({
          error: "Error connecting to the database",
          details: err.message,
        });
      } else {
        console.log("Connected to the MySQL database");
        connection.release();
      }
    });

    pool.query(sql_query, (error, results) => {
      if (error) {
        console.error("Error executing query", error);
        return res
          .status(500)
          .json({ error: "Internal Server Error", details: error.message });
      }
      res.json({ tableData: results });
    });
  } else if (protocol.startsWith("postgres")) {
    // PostgreSQL connection
    const pool = new PostgresPool({
      connectionString: connectionString,
    });

    try {
      const client = await pool.connect();
      try {
        const result = await client.query(sql_query);
        res.json({ tableData: result.rows });
      } catch (queryError) {
        console.error("Error executing query", queryError);
        res.status(500).json({
          error: "Internal Server Error",
          details: queryError.message,
        });
      } finally {
        client.release();
      }
    } catch (connectionError) {
      console.error(
        "Error connecting to the PostgreSQL database:",
        connectionError
      );
      res.status(500).json({
        error: "Error connecting to the database",
        details: connectionError.message,
      });
    } finally {
      pool.end(); // Close the pool after the query
    }
  } else {
    res.status(400).json({ error: "Unsupported database type" });
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
    await postgresPool.query(query, [
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

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
