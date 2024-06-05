import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import StatusBar from "./components/StatusBar";
import DisplayTable from "./components/DisplayTable";
import { useDispatch, useSelector } from "react-redux";
import { changeState } from "./state/db_name/DBSlice";
import { selectDbName } from "./state/db_name/DBSlice";
import Footer from "./components/Footer";
import { Box, CssBaseline } from "@mui/material";

function App() {
  const [dbNames, setDbNames] = useState([]);
  const [schemaNames, setSchemaNames] = useState([]);
  const [schemaCount, setSchemaCount] = useState(0);
  const dbVar = useSelector(selectDbName);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changeState({ db_name: "db_insight" }));
  }, [dispatch]);

  // useEffect(() => {
  //   // Fetch the database name from the backend
  //   fetch("http://localhost:3002/get-db-names")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log("HERE 1");
  //       console.log("Fetched db names", data); // Log the schema count
  //       setDbNames(data);
  //     })
  //     .catch((error) => console.error("There was an error!", error));

  //   fetch("http://localhost:3002/get-schema-number")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log("Fetched schema count:", data); // Log the schema count
  //       setSchemaCount(data.schemaRowCount); // Ensure this matches the property name in your response
  //     })
  //     .catch((error) => console.error("There was an error!", error));

  //   fetch("http://localhost:3002/get-schema-names")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log("Fetched schema names:", data); // Log the schema count
  //       setSchemaNames(data.schemaNameArray); // Ensure this matches the property name in your response
  //     })
  //     .catch((error) => console.error("There was an error!", error));
  // }, []);
  console.log(dbVar);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <CssBaseline />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Navbar />
        <StatusBar />
        <DisplayTable />
      </Box>
      <Footer />
    </Box>
  );
}

export default App;
