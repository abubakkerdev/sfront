import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("forgotToken")
    ? JSON.parse(localStorage.getItem("forgotToken"))
    : { forgotToken: "101010" },
};

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    addToken: (state, action) => {
      state.token = action.payload;
    },
    deleteToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const { addToken, deleteToken } = tokenSlice.actions;
export default tokenSlice.reducer;
