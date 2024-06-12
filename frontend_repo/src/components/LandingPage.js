import React from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  ButtonBase,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { changeLandingState } from "../state/app_state/Homepage";
import Autocomplete from "./Autocomplete";

const cardData = [
  {
    title: "Want to see all the avaliable DB's?",
    description: "Check all the DB's",
  },
  {
    title: "Self Service Features",
    description: "Step-by-step guide to help you get started with your DB's",
  },
  {
    title: "Owner guide",
    description: "Learn more about account owner permissions",
  },
  {
    title: "App & Features",
    description: "Discover how to use Database Insight",
  },
  {
    title: "Discover One",
    description: "All you need to know to start on a solid base.",
  },
];

const LandingPage = () => {
  const dispatch = useDispatch();
  return (
    <Container maxWidth="lg " sx={{ marginBottom: 4 }}>
      <Box sx={{ textAlign: "center", marginTop: 4, marginBottom: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Search for you DB/Atlas Right Here!
        </Typography>
        <Box
          component="form"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Autocomplete />
          <Button variant="contained" color="primary">
            Search
          </Button>
        </Box>
      </Box>
      <Grid container spacing={4} justifyContent="center">
        {cardData.map((card, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <ButtonBase
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
              }}
              onClick={() =>
                dispatch(changeLandingState({ landingPage_state: index }))
              }
            >
              <Card
                sx={{
                  width: "100%",
                  minHeight: 200,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                <CardContent>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {card.description}
                  </Typography>
                </CardContent>
              </Card>
            </ButtonBase>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default LandingPage;
