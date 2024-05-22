import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  db_name: "", // Now a string, initially set to an empty string
};

export const dbSelect = createSlice({
  name: "dbSelect", // Changed to a more descriptive name
  initialState,
  reducers: {
    changeState: (state, action) => {
      // Directly update db_name to the new value
      state.db_name = action.payload.db_name;
    },
  },
});

// Updated the selector to reflect that db_name is now a string
export const selectDbName = (state) => state.dbSelect.db_name;

export const { changeState } = dbSelect.actions;
export default dbSelect.reducer;
