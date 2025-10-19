import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({
    name: "user",
    initialState: {
        // userData: null when not authenticated; object when authenticated
        userData: null,
        // initializing: true while the app is checking existing session on load
        initializing: true,
    },
    reducers: {
        // set userData and mark initializing false (we've finished checking)
        setUserData: (state, action) => {
            state.userData = action.payload;
            state.initializing = false;
        },
        // explicit setter for initializing when needed
        setInitializing: (state, action) => {
            state.initializing = action.payload;
        },
    },
});

export const { setUserData, setInitializing } = userSlice.actions;
export default userSlice.reducer;
