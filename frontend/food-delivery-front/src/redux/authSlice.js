import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const getRoleFromToken = (token) => {
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    const roles = decoded.roles || [];

    if (roles.includes("ROLE_ADMIN")) {
      return "ROLE_ADMIN";
    }

    return "ROLE_USER";
  } catch (e) {
    return null;
  }
};

const initialState = {
  token: localStorage.getItem("accessToken") || null,
  fullName: localStorage.getItem("fullName") || null,
  email: localStorage.getItem("email") || null,
  role: getRoleFromToken(localStorage.getItem("accessToken")),
  status: localStorage.getItem("status") || "ACTIVE",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { access_token, refresh_token, userResponse, status } =
        action.payload;

      state.token = access_token;

      const user = userResponse || action.payload.user;

      if (user) {
        state.fullName = user.fullName;
        state.email = user.email;
        localStorage.setItem("fullName", user.fullName);
        localStorage.setItem("email", user.email);
      }

      state.status = status || "ACTIVE";
      localStorage.setItem("status", state.status);

      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);
      state.role = getRoleFromToken(access_token);
    },
    activateUser: (state) => {
      state.status = "ACTIVE";
      localStorage.setItem("status", "ACTIVE");
    },
    logout: (state) => {
      state.token = null;
      state.fullName = null;
      state.email = null;
      state.role = null;
      state.status = "ACTIVE";
      localStorage.clear();
    },
  },
});

export const { setCredentials, logout, activateUser } = authSlice.actions;
export default authSlice.reducer;
