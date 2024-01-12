import { createSlice } from '@reduxjs/toolkit';
import { CURRENCY, LANGUAGE } from 'config/constants/demo';

const initialState = {
    currency: CURRENCY[1],
    language: LANGUAGE[1],
    connect: null,
    methods: {
        title: '',
        icon: '',
        list: []
    }
};

export const networkSlice = createSlice({
    name: 'info',
    initialState,
    reducers: {
        changeCurrency: (state, action) => {
            state.currency = action.payload;
        },
        changeLanguage: (state, action) => {
            state.language = action.payload;
        },
        changeConnect: (state, action) => {
            state.connect = action.payload;
        },
        changeMethod: (state, action) => {
            if (action.payload.hasOwnProperty('title')) {
                state.methods.title = action.payload.title;
            }
            if (action.payload.hasOwnProperty('icon')) {
                state.methods.icon = action.payload.icon;
            }
            if (action.payload.hasOwnProperty('list')) {
                state.methods.list = action.payload.list;
            }
        }
    }
});

export const { changeCurrency, changeConnect, changeLanguage, changeMethod } = networkSlice.actions;

export default networkSlice.reducer;
