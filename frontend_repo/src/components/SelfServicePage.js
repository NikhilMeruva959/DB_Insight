import React, { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

function SelfServicePage() {
  const [selectedCar, setSelectedCar] = useState(null);
  const [serviceFeature, setServiceFeature] = useState("");

  const cars = [
    { id: 1, name: "Car A" },
    { id: 2, name: "Car B" },
  ];

  const handleCarSelect = (car) => {
    setSelectedCar(car);
    setServiceFeature("");
  };

  const handleFeatureChange = (event) => {
    setServiceFeature(event.target.value);
  };

  return (
    <Container>
      <Typography variant="h3" align="center" gutterBottom>
        Select a Car
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {cars.map((car) => (
          <Grid item key={car.id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {car.name}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleCarSelect(car)}>
                  Select
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {selectedCar && (
        <div className="service-selection">
          <Typography variant="h4" align="center" gutterBottom>
            You selected: {selectedCar.name}
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="service-feature-label">
              Choose a self-service feature
            </InputLabel>
            <Select
              labelId="service-feature-label"
              value={serviceFeature}
              onChange={handleFeatureChange}
              label="Choose a self-service feature"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="oilChange">Oil Change</MenuItem>
              <MenuItem value="tireRotation">Tire Rotation</MenuItem>
              <MenuItem value="carWash">Car Wash</MenuItem>
            </Select>
          </FormControl>
          {serviceFeature && (
            <Typography variant="h6" align="center" gutterTop>
              You have selected the {serviceFeature.replace(/([A-Z])/g, " $1")}{" "}
              feature for {selectedCar.name}.
            </Typography>
          )}
        </div>
      )}
    </Container>
  );
}

export default SelfServicePage;
