import React, { useState } from "react";
import { TextField, Button, Paper, Container, Typography } from "@mui/material";

const CreateDBForm = () => {
  const [formData, setFormData] = useState({
    db_name: "",
    db_type: "",
    enviornment: "",
    db_user_id: "",
    db_password: "",
    host_id: "",
    port_id: "",
    connection_str: "",
    team_name: "",
    team_poc: "",
  });
  console.log(formData);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
        // Optionally clear the form
        setFormData({
          db_name: "",
          db_type: "",
          enviornment: "",
          db_user_id: "",
          db_password: "",
          host_id: "",
          port_id: "",
          connection_str: "",
          team_name: "",
          team_poc: "",
        });
      })
      .catch((error) => console.error("There was an error!", error));
  };

  console.log(formData);

  return (
    <Container>
      <Paper elevation={3} style={{ padding: 20 }}>
        <Typography variant="h6" gutterBottom>
          Add New Database Configuration
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Database Name"
            name="db_name"
            value={formData.db_name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Database Type"
            name="db_type"
            value={formData.db_type}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Environment"
            name="enviornment"
            value={formData.enviornment}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Database User ID"
            name="db_user_id"
            value={formData.db_user_id}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Database Password"
            name="db_password"
            value={formData.db_password}
            onChange={handleChange}
            type="password"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Host ID"
            name="host_id"
            value={formData.host_id}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Port ID"
            name="port_id"
            value={formData.port_id}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Connection String"
            name="connection_str"
            value={formData.connection_str}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Team Name"
            name="team_name"
            value={formData.team_name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Team POC"
            name="team_poc"
            value={formData.team_poc}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" type="submit">
            Add Configuration
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateDBForm;
