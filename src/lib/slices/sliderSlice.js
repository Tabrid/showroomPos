import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
};

const slideSlice = createSlice({
  name: 'slide',
  initialState,
  reducers: {
    toggleSlide: (state) => {
      state.isOpen = !state.isOpen;
    },
    openSlide: (state) => {
      state.isOpen = true;
    },
    closeSlide: (state) => {
      state.isOpen = false;
    },
  },
});

export const { toggleSlide, openSlide, closeSlide } = slideSlice.actions;
export default slideSlice.reducer;
