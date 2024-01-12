import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    key: '',
    order: 0,
    type: '',
    tokens: []
};

export const networkSlice = createSlice({
    name: 'selectToken',
    initialState,
    reducers: {
        changeCategoryKey: (state, action) => {
            state.key = action.payload;
        },
        changeOrder: (state, action) => {
            state.order = action.payload;
        },
        changeType: (state, action) => {
            state.type = action.payload;
        },
        changeSetToken: (state, action) => {
            return action.payload;
        }
    }
});

export const { changeCategoryKey, changeOrder, changeType, changeSetToken } = networkSlice.actions;

export default networkSlice.reducer;
