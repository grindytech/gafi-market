import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./profileSlice";
import systemReducer from "./systemSlice";
export default configureStore({
  reducer: {
    profile: profileReducer,
    system: systemReducer,
  },
});
