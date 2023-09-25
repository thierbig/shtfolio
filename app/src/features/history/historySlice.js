import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    history: null,
};

export const ethersSlice = createSlice({
    name: 'env',
    initialState,
    reducers: {
        setHistory: (state, action) => {
            state.history = action;
        },
    },

});

export const { setHistory } = ethersSlice.actions;

export const selectHistory = (state) => state.ethers.provider;

export default ethersSlice.reducer;
