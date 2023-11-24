import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";

//handles the storing of data
export const store = configureStore({
  reducer: {user: userReducer},
  middleware:  (getDefaultMiddleware) =>
    getDefaultMiddleware({
        serializableCheck: false,
  }),
});

