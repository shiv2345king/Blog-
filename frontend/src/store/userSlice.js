import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  status: false, // ✅ track login state
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.status = true;
    },
    logout: (state) => {
      state.user = null;
      state.status = false;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;