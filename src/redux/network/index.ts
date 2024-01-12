import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { NETWORK } from "config/constants/networks";
import { getTokensByChain } from "services/firebase";

import _find from "lodash/find";

const selectedNetwork = localStorage.getItem("selectedNetworkId");

const initialState = _find(NETWORK, ["chainId", Number(selectedNetwork) ]) || NETWORK[0];

export const fetchTokensByChainID = createAsyncThunk(
  "network/fetchTokensByChainID",
  async (chainId: number, thunkAPI) => {
    const tokens = await getTokensByChain(chainId);

    return (tokens || []).filter(({isAllowed}) => (isAllowed === true));
  }
);

export const networkSlice = createSlice({
  name: "network",
  initialState,
  reducers: {
    changeNet: (state, action) => {
      localStorage.setItem("selectedNetworkId", action.payload.chainId);
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder
      .addCase(
        fetchTokensByChainID.fulfilled,
        (state, action: PayloadAction<Array<any>>) => {
          // Add network to the state array

          return {...state, token: action.payload};
        }
      )
      .addCase(fetchTokensByChainID.rejected, (state, action) => {
      });
  },
});

export const { changeNet } = networkSlice.actions;

export default networkSlice.reducer;
