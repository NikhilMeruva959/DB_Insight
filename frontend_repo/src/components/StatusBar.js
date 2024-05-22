import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import { selectDbName } from "../state/db_name/DBSlice";

export default function StatusBar() {
  //   const [value, setValue] = useState(null);
  const dbVar = useSelector(selectDbName);
  console.log(dbVar);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar sx={{ bgcolor: "green" }} position="static">
        <Toolbar>{dbVar}</Toolbar>
      </AppBar>
    </Box>
  );
}
