import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  landingPage_state: "", // Now a string, initially set to an empty string
};

export const landingPageSelect = createSlice({
  name: "landingPageSelect", // Changed to a more descriptive name
  initialState,
  reducers: {
    changeLandingState: (state, action) => {
      // Directly update db_name to the new value
      state.landingPage_state = action.payload.landingPage_state;
    },
  },
});

// Updated the selector to reflect that db_name is now a string
export const selectLandingPage = (state) =>
  state.landingPageSelect.landingPage_state;

export const { changeLandingState } = landingPageSelect.actions;
export default landingPageSelect.reducer;
