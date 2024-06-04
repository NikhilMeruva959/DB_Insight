import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { selectDbName } from "../state/db_name/DBSlice";
import CreateDBForm from "./CreateDBForm";
import { useDispatch, useSelector } from "react-redux";
import {
  changeState,
  changeInfoState,
  changeIdState,
} from "../state/sub_db_name/SubDBSlice";
import Link from "@mui/material/Link"; // Import Link component
import { selectSubDBName } from "../state/sub_db_name/SubDBSlice";
import DisplaySubTable from "./DisplaySubTable";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function DisplayTable() {
  const [configDbInfo, setConfigDbInfo] = useState([]);
  const [selectedSubStateStr, setSelectedSubStateStr] = useState("");
  const [confId, setConfId] = useState("");
  const dispatch = useDispatch();
  const subDBVar = useSelector(selectSubDBName);
  const dbVar = useSelector(selectDbName);

  useEffect(() => {
    // Fetch the config_db_info from the backend for the specified dbName
    fetch(`http://localhost:3002/get-config-db-info/db_insight`)
      .then((response) => response.json())
      .then((data) => {
        // Assuming the data is an array of objects
        setConfigDbInfo(data.configDbInfoArray);
      })
      .catch((error) => console.error("There was an error!", error));
  }, []);

  const handleDbNameClick = (row) => {
    dispatch(changeState({ sub_db_name: row.db_name }));
    console.log(row.connection_str);
    dispatch(changeInfoState({ sub_db_info: row.connection_str }));
    dispatch(changeIdState({ sub_db_id: row.config_db_id }));
    setConfId(row.config_db_id);
    // setSelectedSubStateStr(row.connection_str);
  };

  if (subDBVar === "") {
    return (
      <>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Config DB ID</StyledTableCell>
                <StyledTableCell>DB Name</StyledTableCell>
                <StyledTableCell>DB Type</StyledTableCell>
                <StyledTableCell>Environment</StyledTableCell>
                <StyledTableCell>DB User ID</StyledTableCell>
                <StyledTableCell>DB Password</StyledTableCell>
                <StyledTableCell>Host ID</StyledTableCell>
                <StyledTableCell>Port ID</StyledTableCell>
                <StyledTableCell>Connection String</StyledTableCell>
                <StyledTableCell>Team Name</StyledTableCell>
                <StyledTableCell>Team POC</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {configDbInfo.map((row) => (
                <StyledTableRow key={row.config_db_id}>
                  <StyledTableCell>{row.config_db_id}</StyledTableCell>
                  <StyledTableCell>
                    <Link
                      component="button"
                      variant="body2"
                      onClick={() => handleDbNameClick(row)}
                    >
                      {row.db_name}
                    </Link>
                  </StyledTableCell>
                  <StyledTableCell>{row.db_type}</StyledTableCell>
                  <StyledTableCell>{row.enviornment}</StyledTableCell>
                  <StyledTableCell>{row.db_user_id}</StyledTableCell>
                  <StyledTableCell>{row.db_password}</StyledTableCell>
                  <StyledTableCell>{row.host_id}</StyledTableCell>
                  <StyledTableCell>{row.port_id}</StyledTableCell>
                  <StyledTableCell>{row.connection_str}</StyledTableCell>
                  <StyledTableCell>{row.team_name}</StyledTableCell>
                  <StyledTableCell>{row.team_poc}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <h3>CRUD Operations</h3>
        <CreateDBForm />
        <h5>Update DB</h5>
        <h5>Delete DB</h5>
      </>
    );
  } else {
    return (
      <>
        <DisplaySubTable />
      </>
    );
  }
}
