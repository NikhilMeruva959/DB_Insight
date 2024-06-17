import React from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { changeLandingState } from "../state/app_state/Homepage";

const services = {
  Database: [
    "Create Database, schema",
    "Add a query to a DB",
    "Data Refresh a DB",
    "Scale resources - memory, storage",
    "Stop Database",
  ],
  "DB User": [
    "Create user_id",
    "Revoke a user_id",
    "View individual user profile/access",
  ],
  "Database Metrics": [
    "List of Databases",
    "Add/Change Database Query",
    "List users and roles for a DB",
  ],
  Status: ["Last Successful Backup"],
  Logs: [
    "Check Logs",
    "Alerts and Incident Trend",
    "Database growth trend",
    "Cost and sizing analysis",
  ],
};

const LandingPage = () => {
  const dispatch = useDispatch();

  return (
    <Box
      p={3}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      width="90%"
      gap={4}
      sx={{
        margin: "0 auto", // centers the box horizontally
        padding: "20px", // adds padding inside the box
        background: "#FAF9F6",
        marginTop: "15px",
        marginBottom: "15px",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Services by category
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {Object.keys(services).map((category) => (
          <Grid item xs={12} md={6} key={category}>
            <Box mb={2}>
              <Typography variant="h6">{category}</Typography>
              {services[category].map((service, index) => (
                <Button
                  key={`${category}--${index}`}
                  variant="outlined"
                  size="small"
                  sx={{ margin: "4px" }}
                  onClick={() =>
                    dispatch(
                      changeLandingState({
                        landingPage_state: `${category}-${index}`,
                      })
                    )
                  }
                >
                  {service}
                </Button>
              ))}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LandingPage;
