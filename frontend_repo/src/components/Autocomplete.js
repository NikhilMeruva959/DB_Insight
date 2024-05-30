import * as React from "react";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { changeState } from "../state/db_name/DBSlice";
import { useDispatch, useSelector } from "react-redux";

export default function FreeSoloCreateOptionDialog() {
  const [dbNames, setDbNames] = useState([]); // Initialize as an empty array
  const [value, setValue] = React.useState(null);

  const dispatch = useDispatch();
  const stateSelected = useSelector((state) => state.db_name);

  const filter = createFilterOptions();

  useEffect(() => {
    // Fetch the database names from the backend
    fetch("http://localhost:3002/get-db-names")
      .then((response) => response.json())
      .then((data) => {
        // Assuming the data is an array of objects with db_name as a key
        setDbNames(data);
      })
      .catch((error) => console.error("There was an error!", error));
  }, []);

  return (
    <>
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          // Check if newValue is a string and exists in the dbNames array
          if (typeof newValue === "string") {
            const isExisting = dbNames.some(
              (option) => newValue === option.db_name
            );
            if (isExisting) {
              // Handle as if selecting from the dropdown
              console.log(newValue); // Optionally log the value
              dispatch(changeState({ db_name: newValue }));
              console.log(stateSelected);
            }
          } else if (newValue && newValue.inputValue) {
            // Create a new value from the user input
            console.log(newValue.inputValue);
            dispatch(changeState({ db_name: "CREATE NEW DB" }));
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
          const isExisting = options.some(
            (option) => inputValue === option.db_name
          );
          if (inputValue !== "" && !isExisting) {
            filtered.push({
              inputValue,
              db_name: `Add "${inputValue}"`,
            });
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
          return option.db_name;
        }}
        renderOption={(props, option) => <li {...props}>{option.db_name}</li>}
        sx={{ width: 300, marginRight: "20px" }}
        freeSolo
        renderInput={(params) => (
          <TextField {...params} label="Database Name/Atlas" />
        )}
      />
    </>
  );
}
