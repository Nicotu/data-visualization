import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import usersReducer from "../features/userData/userDataSlice";

export default configureStore({
  reducer: {
    counter: counterReducer,
    userData: usersReducer,
  },
});
