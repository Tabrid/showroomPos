import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const sendOtp = createAsyncThunk('user/sendOtp', async (phoneNumber) => {
  const response = await axios.post('/api/sendOtp', { phoneNumber });
  return response.data;
});

export const verifyOtp = createAsyncThunk('user/verifyOtp', async ({ phoneNumber, otp }) => {
  const response = await axios.post('/api/verifyOtp', { phoneNumber, otp });
  return response.data;
});

export const setPassword = createAsyncThunk('user/setPassword', async (password, { getState }) => {
  const { token } = getState().user;
  const response = await axios.post('/api/setPassword', { password }, {
    headers: {
      Authorization: token
    }
  });
  return response.data;
});

export const login = createAsyncThunk('user/login', async ({ phoneNumber, password }) => {
  const response = await axios.post('/api/login', { phoneNumber, password });
  return response.data;
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: null,
    status: 'idle',
    error: null
  },
  reducers: {
    logout(state) {
      state.token = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOtp.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.status = 'succeeded';
      })
      .addCase(setPassword.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.status = 'succeeded';
      });
  }
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
