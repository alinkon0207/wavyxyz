import { createSlice } from "@reduxjs/toolkit";
import { SEND_DATA } from "config/constants/demo";

const initialState = SEND_DATA;

export const networkSlice = createSlice({
  name: "send",
  initialState,
  reducers: {
    changeSend: (state, action) => {
      return action.payload;
    },
    setSendToken: (state, action) => {
      if (action.payload.sIdx !== undefined) {
        state.sIdx = action.payload.sIdx;
      }

      if (action.payload.rIdx !== undefined) {
        state.rIdx = action.payload.rIdx;
      }
    },
  },
});

export const { changeSend, setSendToken } = networkSlice.actions;

export default networkSlice.reducer;
