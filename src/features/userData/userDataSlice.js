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
      return { ...state, results: action.payload };
    },

    sortList: (state, action) => {
      return { ...state, users: action.payload };
    },

    goToPage: (state, action) => {
      const pageEnd = action.payload * state.pageLimit;
      const pageStart = pageEnd - state.pageLimit;

      const userGroup = state.users.slice(pageStart, pageEnd);

      return { ...state, results: userGroup, currentPage: action.payload };
    },

    updatePagination: (state, action) => {
      const total = Math.ceil(action.payload / state.pageLimit);

      state.totalPages = total;
    },

    updateLimit: (state, action) => {
      state.pageLimit = action.payload;
    },

    updateCurrentPage: (state, action) => {
      state.currentPage = action.payload;
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
  const pageEnd =
    getState().userData.currentPage * getState().userData.pageLimit;
  const pageStart = pageEnd - getState().userData.pageLimit;

  if (inputValue.length <= 0) {
    dispatch(updateList(userList.slice(pageStart, pageEnd)));
    dispatch(updatePagination(userList.length));
    return;
  }

  filterCollection(userList, inputValue).then((response) => {
    dispatch(updateList(response.slice(pageStart, pageEnd)));
    dispatch(updatePagination(response.length));
  });
};

export const changeLimit = (newLimit) => (dispatch, getState) => {
  const userList = getState().userData.users;

  dispatch(updateLimit(newLimit));
  dispatch(updatePagination(userList.length));
  dispatch(updateCurrentPage(1));
  dispatch(updateList(userList.slice(0, newLimit)));
};

export const {
  updateList,
  updateLimit,
  updateCurrentPage,
  goToPage,
  sortList,
  updatePagination,
} = userDataSlice.actions;
export const selectResults = (state) => state.userData.results;

export default userDataSlice.reducer;
