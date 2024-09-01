import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
};

const cardSlideSlice = createSlice({
  name: 'cardslide',
  initialState,
  reducers: {
    toggleCardSlide: (state) => {
      state.isOpen = !state.isOpen;
    },
    openCardSlide: (state) => {
      state.isOpen = true;
    },
    closeCardSlide: (state) => {
      state.isOpen = false;
    },
  },
});

export const { toggleCardSlide, openCardSlide, closeCardSlide } = cardSlideSlice.actions;
export default cardSlideSlice.reducer;
