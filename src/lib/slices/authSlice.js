import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios.js';

// Async thunk to handle registration
export const register = createAsyncThunk('auth/register', async (mobile) => {
  const response = await axios.post('/auth/register', { mobile });
  return response.data;
});

// Async thunk to handle OTP verification
export const verify = createAsyncThunk('auth/verify', async ({ mobile, otp, password }) => {
  const response = await axios.post('/auth/verify', { mobile, otp, password });
  return response.data;
});

// Async thunk to handle login
export const login = createAsyncThunk('auth/login', async ({ mobile, password }) => {
  const response = await axios.post('/auth/login', { mobile, password });
  return response.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(verify.pending, (state) => {
        state.loading = true;
      })
      .addCase(verify.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(verify.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default authSlice.reducer;
