import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import complaintReducer from "./slices/ComplaintSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    complaints: complaintReducer,
  },
});
