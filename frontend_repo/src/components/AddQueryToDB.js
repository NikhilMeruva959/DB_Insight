import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Paper,
  Container,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

const AddQueryToDB = () => {
  const [avaliableDB, setAvaliableDB] = useState([]);

  const [formData, setFormData] = useState({
    config_db_id: "",
    menu_action: "",
    menu_desc: "",
    sql_query: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    fetch("http://localhost:3002/add-config-db-info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        setFormData({
          config_db_id: "",
          menu_action: "",
          menu_desc: "",
          sql_query: "",
        });
      })
      .catch((error) => console.error("There was an error!", error));
  };

  useEffect(() => {
    fetch("http://localhost:3002/get-config-db-info")
      .then((response) => response.json())
      .then((data) => {
        // Assuming the data is an array of objects
        const tempArr = data.configDbInfoArray.map((db) => [
          db.db_name,
          db.config_db_id,
        ]);
        setAvaliableDB(tempArr);
      })
      .catch((error) => console.error("There was an error!", error));
  }, []);

  return (
    <Container sx={{ marginTop: "10px" }}>
      <Paper elevation={3} style={{ padding: 20 }}>
        <Typography variant="h6" gutterBottom>
          Add New Query to a DB
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Database Name</InputLabel>
            <Select
              name="config_db_id"
              value={formData.config_db_id}
              onChange={handleChange}
            >
              {avaliableDB.map(([dbName, dbId]) => (
                <MenuItem key={dbId} value={dbId}>
                  {dbName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Menu Action"
            name="menu_action"
            value={formData.menu_action}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Menu Desc"
            name="menu_desc"
            value={formData.menu_desc}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="SQL Query"
            name="sql_query"
            value={formData.sql_query}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" type="submit">
            Add Query to the DB
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AddQueryToDB;
