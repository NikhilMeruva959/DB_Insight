import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sub_db_name: "",
  sub_db_info: "",
  sub_db_id: "",
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
    changeIdState: (state, action) => {
      state.sub_db_id = action.payload.sub_db_id;
    },
  },
});

export const { changeState, changeInfoState, changeIdState } =
  subDBSelect.actions;

export const selectSubDBName = (state) => state.subDBSelect.sub_db_name;
export const selectSubDBInfo = (state) => state.subDBSelect.sub_db_info;
export const selectSubDBId = (state) => state.subDBSelect.sub_db_id;

export default subDBSelect.reducer;
