import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./profileSlice";
import systemReducer from "./systemSlice";
import bagReducer from "./bagSlice";

export default configureStore({
  reducer: {
    profile: profileReducer,
    system: systemReducer,
    bag: bagReducer,
  },
});
