import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = sessionSlice.actions;

export const selectUser = (state) => state.session.user;

export default sessionSlice.reducer;
