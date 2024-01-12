import { createSlice } from '@reduxjs/toolkit';
import { SWAP_DATA } from 'config/constants/demo';

const initialState = SWAP_DATA;

export const networkSlice = createSlice({
    name: 'swap',
    initialState,
    reducers: {
        changeSwap: (state, action) => {
            return action.payload;
        },
        setSwapToken: (state, action) => {
            if (action.payload.sIdx !== undefined) {
                state.sIdx = action.payload.sIdx;
            }
            if (action.payload.rIdx !== undefined) {
                state.rIdx = action.payload.rIdx;
            }
        }
    }
});

export const { changeSwap, setSwapToken } = networkSlice.actions;

export default networkSlice.reducer;
