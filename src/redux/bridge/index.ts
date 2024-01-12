import { createSlice } from '@reduxjs/toolkit';
import { BRIDGE } from 'config/constants/demo';

const initialState = BRIDGE;

export const bridgeSlice = createSlice({
    name: 'bridge',
    initialState,
    reducers: {
        changeBridge: (state, action) => {
            return action.payload;
        },
        setBridgeToken: (state, action) => {
            if (action.payload.sIdx > -1) {
                state.sIdx = action.payload.sIdx;
            }
            if (action.payload.rIdx > -1) {
                state.rIdx = action.payload.rIdx;
            }
        },
        setBridgeNet: (state, action) => {
            if (action.payload.sNet > -1) {
                state.sNet = action.payload.sNet;
            }
            if (action.payload.rNet > -1) {
                state.rNet = action.payload.rNet;
            }
        }
    }
});

export const { changeBridge, setBridgeToken, setBridgeNet } = bridgeSlice.actions;

export default bridgeSlice.reducer;
