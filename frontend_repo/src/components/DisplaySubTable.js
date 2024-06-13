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
import { Button } from "@mui/material";
import {
  selectSubDBInfo,
  selectSubDBId,
  selectSubDBName,
} from "../state/sub_db_name/SubDBSlice";
import { selectDbName } from "../state/db_name/DBSlice";
import CreateDBForm from "./CreateDBForm";

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

export default function DisplaySubTable({ confId }) {
  const db_id = useSelector(selectSubDBId);
  const castedConfId = Number(db_id);
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(null);
  const subStr = useSelector(selectSubDBInfo);
  const dbVar = useSelector(selectDbName);
  const subDbName = useSelector(selectSubDBName);
  const [configDbInfo, setConfigDbInfo] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    fetch(`http://localhost:3002/get-config-db-info-insight/${dbVar}`)
      .then((response) => response.json())
      .then((data) => {
        setConfigDbInfo(data.configInfoDbInfoArray);
      })
      .catch((error) => console.error("There was an error!", error));
  }, [subStr]);

  const handleRunQueryClick = (rowId, sql_query) => {
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
        setExpandedRow(expandedRow === rowId ? null : rowId);
      })
      .catch((error) => {
        console.error("There was an error!", error);
        setError(error.message);
      });
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedTableData = React.useMemo(() => {
    if (tableData.length === 0 || !sortConfig.key) return tableData;

    const sortedData = [...tableData];
    sortedData.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    return sortedData;
  }, [tableData, sortConfig]);

  const getCountValue = (item) => {
    if (item.number_of_employees !== undefined) {
      return `Number of Employees: ${item.number_of_employees}`;
    } else if (item.count !== undefined) {
      return `Count: ${item.count}`;
    } else if (item["COUNT(*)"] !== undefined) {
      return item["COUNT(*)"];
    } else {
      return "Unknown Data";
    }
  };

  const filteredConfigDbInfo = configDbInfo.filter(
    (row) => row.config_db_id === castedConfId
  );

  const renderTableData = () => {
    if (Array.isArray(tableData) && tableData.length > 0) {
      const keys = Object.keys(tableData[0]);

      return (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                {keys.map((key) => (
                  <StyledTableCell key={key} onClick={() => handleSort(key)}>
                    {key}{" "}
                    {sortConfig.key === key
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedTableData.map((item, index) => (
                <StyledTableRow key={index}>
                  {keys.map((key) => (
                    <StyledTableCell key={key}>{item[key]}</StyledTableCell>
                  ))}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    } else if (
      Array.isArray(tableData) &&
      tableData.length === 1 &&
      typeof tableData[0] === "object"
    ) {
      const item = tableData[0];
      const value = getCountValue(item);

      return <div>{value}</div>;
    } else {
      return <div>No data available</div>;
    }
  };

  if (subDbName !== "Creating a New DB Form") {
    return (
      <>
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
              {filteredConfigDbInfo.map((row) => (
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
                          handleRunQueryClick(
                            row.config_query_id,
                            row.sql_query
                          )
                        }
                      >
                        Run Query
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                  {expandedRow === row.config_query_id && (
                    <StyledTableRow>
                      <StyledTableCell colSpan={6}>
                        {renderTableData()}
                      </StyledTableCell>
                    </StyledTableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  } else {
    return <CreateDBForm />;
  }
}
