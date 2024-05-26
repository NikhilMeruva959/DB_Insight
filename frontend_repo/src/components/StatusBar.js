import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import { selectDbName } from "../state/db_name/DBSlice";
import { selectSubDBName } from "../state/sub_db_name/SubDBSlice";
import Typography from "@mui/material/Typography";

export default function StatusBar() {
  //   const [value, setValue] = useState(null);
  const dbVar = useSelector(selectDbName);
  const subDBVar = useSelector(selectSubDBName);
  console.log(dbVar);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar sx={{ bgcolor: "green" }} position="static">
        <Toolbar sx={{ display: "flex" }}>
          {dbVar !== "" && (
            <Typography variant="h6" sx={{ marginRight: 1 }}>
              {dbVar} /
            </Typography>
          )}
          {subDBVar !== "" && (
            <Typography variant="h6">{subDBVar} /</Typography>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
