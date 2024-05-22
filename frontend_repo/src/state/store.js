import { configureStore } from "@reduxjs/toolkit";
import dbReducer from "./db_name/DBSlice";

export const store = configureStore({
  reducer: {
    dbSelect: dbReducer,
  },
});
