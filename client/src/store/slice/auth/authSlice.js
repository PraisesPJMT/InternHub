import { createSlice } from "@reduxjs/toolkit";

import { initialAuthState } from "../actions";

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
