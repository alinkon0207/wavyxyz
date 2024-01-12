import { createSlice } from '@reduxjs/toolkit';
import { WITHDRAW } from 'config/constants/demo';

const initialState = WITHDRAW;

export const networkSlice = createSlice({
    name: 'withdraw',
    initialState,
    reducers: {
        changeWithdraw: (state, action) => {
            state = action.payload;
        },
        setWithdrawToken: (state, action) => {
            if (action.payload.sIdx > -1) {
                state.sIdx = action.payload.sIdx;
            }
            if (action.payload.rIdx > -1) {
                state.rIdx = action.payload.rIdx;
            }
        },
        changeWithdrawMethod: (state, action) => {
            state.method = action.payload;
        }
    }
});

export const { changeWithdraw, setWithdrawToken, changeWithdrawMethod } = networkSlice.actions;

export default networkSlice.reducer;
