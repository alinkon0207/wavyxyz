import { createSlice } from '@reduxjs/toolkit';
import { TOPUP } from 'config/constants/demo';

const initialState = TOPUP;

export const networkSlice = createSlice({
    name: 'topup',
    initialState,
    reducers: {
        changeTopup: (state, action) => {
            state = action.payload;
        },
        setTopUpToken: (state, action) => {
            if (action.payload.sIdx > -1) {
                state.sIdx = action.payload.sIdx;
            }
            if (action.payload.rIdx > -1) {
                state.rIdx = action.payload.rIdx;
            }
        },
        changeTopupMethod: (state, action) => {
            state.method = action.payload;
        }
    }
});

export const { changeTopup, setTopUpToken, changeTopupMethod } = networkSlice.actions;

export default networkSlice.reducer;
