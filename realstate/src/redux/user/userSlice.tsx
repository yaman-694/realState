import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
    currentUser: object|null;
    error: string|null;
    loading: boolean
}

const initialState: UserState = {
    currentUser: null,
    error: null,
    loading: false
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action: PayloadAction<object>) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action: PayloadAction<string>) => {
            console.log(action.payload);
            state.error = action.payload;
            state.loading = false;
        }
    },
});

export const { signInStart, signInSuccess, signInFailure } = userSlice.actions;

export default userSlice.reducer
