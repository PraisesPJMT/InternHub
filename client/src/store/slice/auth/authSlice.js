import { createSlice } from "@reduxjs/toolkit";

import { initialAuthState } from "../actions";

export const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;

      // Support multiple payload shapes:
      // - { user, accessToken, refreshToken } (preferred)
      // - { access, refresh } (token keys from some backends)
      // - full user object passed directly (legacy)
      const payload = action.payload || {};

      // If payload contains a `user` field, use it; otherwise treat payload itself as the user object
      const user = payload.user ?? payload;

      // Accept both `accessToken` and `access` keys for access token
      const accessToken = payload.accessToken ?? payload.access ?? null;

      // Accept both `refreshToken` and `refresh` keys for refresh token
      const refreshToken = payload.refreshToken ?? payload.refresh ?? null;

      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { login, logout, setUser } = authSlice.actions;

export default authSlice.reducer;
