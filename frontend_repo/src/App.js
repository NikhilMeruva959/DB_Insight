import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import StatusBar from "./components/StatusBar";
import DisplayTable from "./components/DisplayTable";
import { useDispatch, useSelector } from "react-redux";
import { changeState } from "./state/db_name/DBSlice";
import { selectDbName } from "./state/db_name/DBSlice";
import Footer from "./components/Footer";
import { Box, CssBaseline } from "@mui/material";
import LandingPage from "./components/LandingPage";
import { selectLandingPage } from "./state/app_state/Homepage";
import CreateDBForm from "./components/CreateDBForm";
import SelfServicePage from "./components/SelfServicePage";

function App() {
  const [dbNames, setDbNames] = useState([]);
  const [schemaNames, setSchemaNames] = useState([]);
  const [schemaCount, setSchemaCount] = useState(0);
  const dbVar = useSelector(selectDbName);
  const landingPageVar = useSelector(selectLandingPage);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changeState({ db_name: "db_insight" }));
  }, [dispatch]);

  const renderContent = () => {
    switch (landingPageVar) {
      case "":
        return <LandingPage />;
      case 0:
        return <DisplayTable />;
      case 1:
        return <SelfServicePage />;
      default:
        return <LandingPage />;
    }
  };

  console.log();
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
        {renderContent()}
      </Box>
      <Footer />
    </Box>
  );
}

export default App;
