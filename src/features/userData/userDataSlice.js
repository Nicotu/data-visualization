import {
  createSlice,
  nanoid,
  createAsyncThunk,
  current,
} from "@reduxjs/toolkit";
import { sortCollection } from "../../app/helper";

export const fetchUsers = createAsyncThunk("users/fetchusers", async () => {
  const response = await fetch("MOCK_DATA.json", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (response.ok) {
    return await response.json();
  }
});

export const userDataSlice = createSlice({
  name: "userData",

  initialState: {
    users: [],
    status: "idle",
    error: null,
  },

  reducers: {
    sortList: (state, action) => {
      return { ...state, users: action.payload };
    },
  },

  extraReducers: {
    [fetchUsers.pending]: (state, action) => {
      state.status = "loading";
    },

    [fetchUsers.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.users = state.users.concat(action.payload);
    },

    [fetchUsers.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },
  },
});

export const { sortByDate, sortList } = userDataSlice.actions;
export const selectUsers = (state) => state.userData.users;

export const sortByValue = (itemKey, format) => (dispatch, getState) => {
  const userList = getState().userData.users;

  sortCollection(userList, itemKey, format).then((results) => {
    console.log(dispatch);
    dispatch(sortList(results));
  });
};

export default userDataSlice.reducer;
