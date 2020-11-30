import {
  createSlice,
  nanoid,
  createAsyncThunk,
  current,
} from "@reduxjs/toolkit";
import { sortCollection, filterCollection } from "../../app/helper";

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
    results: [],
    users: [],
    status: "idle",
    error: null,
  },

  reducers: {
    updateList: (state, action) => {
      console.log(action);
      return { ...state, results: action.payload };
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

export const sortByValue = (itemKey, format) => (dispatch, getState) => {
  const userList = getState().userData.users;

  sortCollection(userList, itemKey, format).then((response) => {
    dispatch(updateList(response));
  });
};

export const filterByValue = (inputValue) => (dispatch, getState) => {
  const userList = getState().userData.users;

  if (inputValue.length <= 0) {
    dispatch(updateList([]));
    return;
  }

  filterCollection(userList, inputValue).then((response) => {
    dispatch(updateList(response));
  });
};

export const { updateList } = userDataSlice.actions;
export const selectUsers = (state) => state.userData.users;
export const selectResults = (state) => state.userData.results;

export default userDataSlice.reducer;
