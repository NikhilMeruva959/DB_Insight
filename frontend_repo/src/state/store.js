import { configureStore } from "@reduxjs/toolkit";
import dbReducer from "./db_name/DBSlice";
import subDBReducer from "./sub_db_name/SubDBSlice";
import landingPageReducer from "./app_state/Homepage";

export const store = configureStore({
  reducer: {
    dbSelect: dbReducer,
    subDBSelect: subDBReducer,
    landingPageSelect: landingPageReducer,
  },
});
