import { createSlice } from '@reduxjs/toolkit';
import { NETWORK } from 'config/constants/networks';

const initialState = NETWORK[0];

export const selectedNetSlices = createSlice({
    name: 'selectedNet',
    initialState,
    reducers: {
        selectNet: (state, action) => {
            return action.payload;
        }
    }
});

export const { selectNet } = selectedNetSlices.actions;

export default selectedNetSlices.reducer;
