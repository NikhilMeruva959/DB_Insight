const express = require("express");
const { Pool: PostgresPool } = require("pg");
const cors = require("cors");
const mysql = require("mysql2");
const sql = require("mssql");
const url = require("url");
const AWS = require("aws-sdk");
const {
  SecretsManagerClient,
  GetSecretValueCommand,
  CreateSecretCommand,
  DescribeSecretCommand,
} = require("@aws-sdk/client-secrets-manager");

const app = express();
const port = 3002;

app.use(express.json());
app.use(cors());

const secret_name = "base_cred";
let base_cred_pass;

const client = new SecretsManagerClient({
  region: "us-east-1",
});

async function getSecret(secretName) {
  let response;

  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: secretName,
        VersionStage: "AWSCURRENT",
      })
    );
  } catch (error) {
    console.error(`Error retrieving secret: ${error}`);
    throw error;
  }

  return JSON.parse(response.SecretString);
}

async function getConnectionString(secretName) {
  let response;

  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: secretName,
        VersionStage: "AWSCURRENT",
      })
    );
  } catch (error) {
    console.error(`Error retrieving secret: ${error}`);
    throw error;
  }

  const secret = JSON.parse(response.SecretString);
  return secret.connection_str;
}

async function createSecret(secretName, secretValue) {
  try {
    await client.send(
      new CreateSecretCommand({
        Name: secretName,
        SecretString: JSON.stringify(secretValue),
      })
    );
  } catch (error) {
    console.error(`Error creating secret: ${error}`);
    throw error;
  }
}

async function secretExists(secretName) {
  try {
    await client.send(
      new DescribeSecretCommand({
        SecretId: secretName,
      })
    );
    return true;
  } catch (error) {
    if (error.name === "ResourceNotFoundException") {
      return false;
    } else {
      console.error(`Error checking secret existence: ${error}`);
      throw error;
    }
  }
}

async function storeDbPasswords(configDbInfoArray) {
  for (const dbInfo of configDbInfoArray) {
    const secretName = `db_password_${dbInfo.db_name}`;
    const secretValue = {
      password: dbInfo.db_password,
      connection_str: dbInfo.connection_str,
    };

    // Ensure there aren't duplicate secrets
    if (!(await secretExists(secretName))) {
      await createSecret(secretName, secretValue);
    }
  }
}

getSecret(secret_name)
  .then((secret) => {
    console.log("Secret:", secret);
    base_cred_pass = secret.password;
  })
  .catch((error) => {
    console.error("Error retrieving secret:", error);
  });

const postgresPoolMain = new PostgresPool({
  user: "nikmeruva",
  host: "localhost",
  password: base_cred_pass,
  port: 5432,
});

app.get("/get-config-db-info", async (req, res) => {
  const dbName = req.params.dbName;

  const pool = new PostgresPool({
    user: "nikmeruva",
    host: "localhost",
    database: "db_insight",
    password: base_cred_pass,
    port: 5432,
  });

  try {
    const queryResult = await pool.query("SELECT * FROM config_db_info");
    const configDbInfoArray = queryResult.rows;

    // Store DB passwords dynamically in AWS Secrets Manager
    await storeDbPasswords(configDbInfoArray);

    res.json({ configDbInfoArray });
  } catch (error) {
    console.error("Error fetching config_db_info", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    pool.end();
  }
});

app.get("/get-config-db-info-insight/:dbName", async (req, res) => {
  const dbName = req.params.dbName;

  const pool = new PostgresPool({
    user: "nikmeruva",
    host: "localhost",
    database: dbName, // Use the database name from the request parameter
    password: base_cred_pass,
    port: process.env.PORT,
  });

  try {
    const queryResult = await pool.query("SELECT * FROM conf_db_query");
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
  console.log(dbName);

  const pool = new PostgresPool({
    user: "nikmeruva",
    host: "localhost",
    database: "db_insight", // Use the database name from the request parameter
    password: base_cred_pass,
    port: process.env.PORT,
  });

  try {
    const queryResult = await pool.query("SELECT * FROM config_db_info");
    const configDbInfoArray = queryResult.rows;
    const dbInfo = configDbInfoArray.find((db) => db.db_name === dbName);

    if (dbInfo) {
      const secretName = `db_password_${dbName}`;
      const connection_str = await getConnectionString(secretName);
      console.log(connection_str);
      const { config_db_id } = dbInfo;
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

    const pool = mysql.createPool(dbConfig);

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error connecting to the MySQL database:", err);
        return res.status(500).json({
          error: "Error connecting to the database",
          details: err.message,
        });
      } else {
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
  } else if (protocol.startsWith("sqlserver")) {
    // SQL Server connection
    const dbConfig = {
      user: parsedUrl.username,
      password: parsedUrl.password,
      server: parsedUrl.hostname,
      port: parseInt(parsedUrl.port, 10),
      database: parsedUrl.pathname.slice(1), // Remove leading slash
      options: {
        encrypt: true, // Use encryption
        trustServerCertificate: true, // Trust the self-signed certificate
      },
    };

    console.log(dbConfig);

    try {
      await sql.connect(dbConfig);
      const result = await sql.query(sql_query);
      res.json({ tableData: result.recordset });
    } catch (err) {
      console.error("Error executing query", err);
      res.status(500).json({
        error: "Internal Server Error",
        details: err.message,
      });
    } finally {
      sql.close();
    }
  } else {
    res.status(400).json({ error: "Unsupported database type" });
  }
});

app.post("/add-config-db-query", async (req, res) => {
  const { config_db_id, menu_action, menu_desc, sql_query } = req.body;
  const numericConfigDbId = Number(config_db_id);

  console.log(req.body);

  try {
    const pool = new PostgresPool({
      user: "nikmeruva",
      host: "localhost",
      database: "db_insight",
      password: base_cred_pass,
      port: 5432,
    });

    // Insert the configuration into the config_db_info table
    const query = `
      INSERT INTO public.conf_db_query (
        menu_action, menu_desc, sql_query, config_db_id
      ) VALUES ($1, $2, $3, $4)`;

    await pool.query(query, [
      menu_action,
      menu_desc,
      sql_query,
      numericConfigDbId,
    ]);

    res
      .status(201)
      .json({ message: "Database configuration added successfully" });
  } catch (error) {
    console.error("Error adding config_db_info", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/add-config-db-info", async (req, res) => {
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

  const secretName = `db_password_${db_name}`;
  const secretValue = {
    password: db_password,
    connection_str: connection_str,
  };

  try {
    // Ensure there aren't duplicate secrets
    if (!(await secretExists(secretName))) {
      await createSecret(secretName, secretValue);
    }

    // Create the new database
    await postgresPoolMain.query(`CREATE DATABASE ${db_name}`);

    const pool = new PostgresPool({
      user: "nikmeruva",
      host: "localhost",
      database: "db_insight",
      password: base_cred_pass,
      port: 5432,
    });

    // Create a new pool for the newly created database
    // const newDbPool = new PostgresPool({
    //   user: db_user_id,
    //   host: host_id,
    //   database: db_name,
    //   password: db_password,
    //   port: port_id,
    // });

    // Insert the configuration into the config_db_info table
    const query = `
      INSERT INTO public.config_db_info (
        db_name, db_type, enviornment, db_user_id,
        host_id, port_id, team_name, team_poc
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;

    await pool.query(query, [
      db_name,
      db_type,
      enviornment,
      db_user_id,
      host_id,
      port_id,
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
const { createConnection } = require("net");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
