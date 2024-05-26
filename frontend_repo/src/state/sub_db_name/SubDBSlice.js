import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sub_db_name: "",
  sub_db_info: "",
};

export const subDBSelect = createSlice({
  name: "subDBSelect",
  initialState,
  reducers: {
    changeState: (state, action) => {
      state.sub_db_name = action.payload.sub_db_name;
    },
    changeInfoState: (state, action) => {
      state.sub_db_info = action.payload.sub_db_info;
    },
  },
});

export const { changeState, changeInfoState } = subDBSelect.actions;

export const selectSubDBName = (state) => state.subDBSelect.sub_db_name;
export const selectSubDBInfo = (state) => state.subDBSelect.sub_db_info;

export default subDBSelect.reducer;
