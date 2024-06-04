import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import { selectDbName, setDbName } from "../state/db_name/DBSlice";
import {
  changeState,
  changeInfoState,
  changeIdState,
  selectSubDBName,
  setSubDBName,
} from "../state/sub_db_name/SubDBSlice";
import Typography from "@mui/material/Typography";

export default function StatusBar() {
  const dispatch = useDispatch();
  const dbVar = useSelector(selectDbName);
  const subDBVar = useSelector(selectSubDBName);

  const handleDbInsightClick = () => {
    // Perform any desired logic here, e.g., resetting subDBVar or fetching data
    console.log("db_insight clicked");
    dispatch(changeState({ sub_db_name: "" }));
    dispatch(changeInfoState({ sub_db_info: "" }));
    dispatch(changeIdState({ sub_db_id: "" }));
  };

  const handleSubDbInsightClick = () => {
    console.log("just click handle sub status button");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar sx={{ bgcolor: "green" }} position="static">
        <Toolbar sx={{ display: "flex" }}>
          <Typography
            variant="h6"
            sx={{ marginRight: 1, cursor: "pointer" }}
            onClick={handleDbInsightClick}
          >
            db_insight /
          </Typography>

          {subDBVar !== "" && (
            <Typography variant="h6" onClick={handleSubDbInsightClick}>
              {subDBVar} /
            </Typography>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
