import { configureStore } from "@reduxjs/toolkit";
import sessionReducer from "./features/session/sessionSlice";

export const store = configureStore({
  reducer: {
    // ethers: ethersReducer,
    session: sessionReducer,
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: false,
  //   }),
});
