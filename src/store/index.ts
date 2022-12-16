import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./profileSlice";
import systemReducer from "./systemSlice";
import bagReducer from "./bagSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root_bag",
  storage,
};

const persistedReducerBag = persistReducer(persistConfig, bagReducer);

const store = configureStore({
  reducer: {
    profile: profileReducer,
    system: systemReducer,
    bag: persistedReducerBag,
  },
});
export default store;
export const persistor = persistStore(store);
