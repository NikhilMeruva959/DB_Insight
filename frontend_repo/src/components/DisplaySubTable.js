import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useSelector } from "react-redux";
import { selectSubDBInfo } from "../state/sub_db_name/SubDBSlice";
import { selectDbName } from "../state/db_name/DBSlice";
import { Button } from "@mui/material";

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

export default function DisplaySubTable() {
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(null);
  const subStr = useSelector(selectSubDBInfo);
  const dbVar = useSelector(selectDbName);
  const [configDbInfo, setConfigDbInfo] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    // Fetch the config_db_info from the backend for the specified dbName
    fetch(`http://localhost:3002/get-config-db-info-insight/${dbVar}`)
      .then((response) => response.json())
      .then((data) => {
        // Assuming the data is an array of objects
        setConfigDbInfo(data.configInfoDbInfoArray);
      })
      .catch((error) => console.error("There was an error!", error));
  }, [subStr]);

  const handleRunQueryClick = (rowId, sql_query) => {
    console.log(sql_query);
    console.log(JSON.stringify({ sql_query }));

    fetch(
      `http://localhost:3002/tables/${encodeURIComponent(subStr)}/run-query`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sql_query }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.details);
        }
        setTableData(data.tableData);
        console.log(tableData);
        setExpandedRow(expandedRow === rowId ? null : rowId);
      })
      .catch((error) => {
        console.error("There was an error!", error);
        setError(error.message);
      });
  };

  const getCountValue = (item) => {
    if (item["COUNT(*)"] !== undefined) {
      return item["COUNT(*)"];
    } else if (item.count !== undefined) {
      return parseInt(item.count, 10);
    }
    return null;
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Config Query ID</StyledTableCell>
            <StyledTableCell>Menu Action</StyledTableCell>
            <StyledTableCell>Menu Description</StyledTableCell>
            <StyledTableCell>SQL Query</StyledTableCell>
            <StyledTableCell>Config DB ID</StyledTableCell>
            <StyledTableCell>Run Query</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {configDbInfo.map((row) => (
            <React.Fragment key={row.config_query_id}>
              <StyledTableRow>
                <StyledTableCell>{row.config_query_id}</StyledTableCell>
                <StyledTableCell>{row.menu_action}</StyledTableCell>
                <StyledTableCell>{row.menu_desc}</StyledTableCell>
                <StyledTableCell>{row.sql_query}</StyledTableCell>
                <StyledTableCell>{row.config_db_id}</StyledTableCell>
                <StyledTableCell>
                  <Button
                    onClick={() =>
                      handleRunQueryClick(row.config_query_id, row.sql_query)
                    }
                  >
                    Run Query
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
              {expandedRow === row.config_query_id && (
                <StyledTableRow>
                  <TableBody>
                    {tableData.map((item, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell>{getCountValue(item)}</StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </StyledTableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}