import * as React from "react";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import {
  changeState,
  selectSubDBName,
  changeInfoState,
  changeIdState,
} from "../state/sub_db_name/SubDBSlice";
import { useDispatch, useSelector } from "react-redux";

export default function FreeSoloCreateOptionDialog() {
  const [dbNames, setDbNames] = useState([]); // Initialize as an empty array
  const [value, setValue] = React.useState(null);

  const dispatch = useDispatch();
  const stateSelected = useSelector((state) => state.sub_db_name);
  const subDBVar = useSelector(selectSubDBName);

  const filter = createFilterOptions();

  useEffect(() => {
    // Fetch the database names from the backend
    fetch("http://localhost:3002/get-config-db-info/db_insight")
      .then((response) => response.json())
      .then((data) => {
        // Filter and set only the db_names
        const dbNamesArray = data.configDbInfoArray.map(
          (dbInfo) => dbInfo.db_name
        );
        setDbNames(dbNamesArray);
      })
      .catch((error) => console.error("There was an error!", error));

    fetch(`http://localhost:3002/get-config-db-info-selector/${subDBVar}`)
      .then((response) => response.json())
      .then((data) => {
        // Filter and set only the db_names
        dispatch(changeInfoState({ sub_db_info: data.connection_str }));
        dispatch(changeIdState({ sub_db_id: data.config_db_id }));
      })
      .catch((error) => console.error("There was an error!", error));
  }, [subDBVar]);

  return (
    <>
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          // Check if newValue is a string and exists in the dbNames array
          if (typeof newValue === "string") {
            const isExisting = dbNames.includes(newValue);
            if (isExisting) {
              // Handle as if selecting from the dropdown
              console.log(newValue); // Optionally log the value
              dispatch(changeState({ sub_db_name: newValue }));
            }
          } else if (newValue && newValue.inputValue) {
            // Create a new value from the user input
            console.log(newValue.inputValue);
            dispatch(changeState({ sub_db_name: "CREATE NEW DB" }));
          } else {
            // Handle selection from the dropdown directly
            console.log(newValue);
            dispatch(changeState(newValue));
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          const { inputValue } = params;
          // Suggest the creation of a new value
          const isExisting = options.includes(inputValue);
          if (inputValue !== "" && !isExisting) {
            filtered.push(`Add "${inputValue}"`);
          }

          return filtered;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        id="free-solo-with-text-demo"
        options={dbNames}
        getOptionLabel={(option) => {
          // Value selected with enter, right from the input
          if (typeof option === "string") {
            return option;
          }
          // Add "xxx" option created dynamically
          if (option.inputValue) {
            return option.inputValue;
          }
          // Regular option
          return option;
        }}
        renderOption={(props, option) => <li {...props}>{option}</li>}
        sx={{ width: 300, marginRight: "20px" }}
        freeSolo
        renderInput={(params) => (
          <TextField {...params} label="Database Name/Atlas" />
        )}
      />
    </>
  );
}
