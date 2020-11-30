import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../features/userData/userDataSlice";

export default configureStore({
  reducer: {
    userData: usersReducer,
  },
});
