import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { sortCollection, filterCollection } from "../../app/helper";

export const fetchUsers = createAsyncThunk("users/fetchusers", async () => {
  const response = await fetch("MOCK_DATA.json", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (response.ok) {
    return response.json();
  }
});

export const userDataSlice = createSlice({
  name: "userData",

  initialState: {
    results: [],
    users: [],
    status: "idle",
    error: null,
    pageLimit: 20,
    totalPages: 0,
    currentPage: 1,
  },

  reducers: {
    updateList: (state, action) => {
      console.log(action);
      return { ...state, results: action.payload };
    },

    sortList: (state, action) => {
      console.log(action);
      return { ...state, users: action.payload };
    },

    goToPage: (state, action) => {
      const pageEnd = action.payload * state.pageLimit;
      const pageStart = pageEnd - state.pageLimit;

      const userGroup = state.users.slice(pageStart, pageEnd);

      return { ...state, results: userGroup, currentPage: action.payload };
    },
  },

  extraReducers: {
    [fetchUsers.pending]: (state, action) => {
      state.status = "loading";
    },

    [fetchUsers.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.users = state.users.concat(action.payload);
      state.totalPages = action.payload.length / state.pageLimit;
      state.results = state.users
        .concat(action.payload)
        .slice(0, state.pageLimit);
    },

    [fetchUsers.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },
  },
});

export const sortByValue = (itemKey, format) => (dispatch, getState) => {
  const userList = getState().userData.users;
  const pageEnd =
    getState().userData.currentPage * getState().userData.pageLimit;
  const pageStart = pageEnd - getState().userData.pageLimit;

  sortCollection(userList, itemKey, format).then((response) => {
    dispatch(sortList(response));
    dispatch(updateList(response.slice(pageStart, pageEnd)));
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

export const { updateList, goToPage, sortList } = userDataSlice.actions;
export const selectUsers = (state) => state.userData.users;
export const selectResults = (state) => state.userData.results;

export default userDataSlice.reducer;
