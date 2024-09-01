import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    otp: ['', '', '', '', '', ''],
    resendTimer: 60,
};

const otpSlice = createSlice({
    name: 'otp',
    initialState,
    reducers: {
        setOtp: (state, action) => {
            state.otp = action.payload;
        },
        decrementResendTimer: (state) => {
            state.resendTimer = Math.max(0, state.resendTimer - 1);
        },
        resetResendTimer: (state) => {
            state.resendTimer = 60;
        },
    },
});

export const { setOtp, decrementResendTimer, resetResendTimer } = otpSlice.actions;

export default otpSlice.reducer;
