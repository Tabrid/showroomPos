import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  sizes: null,  // Initialize sizes as null, similar to product
};

const sizeSlice = createSlice({
  name: 'size',
  initialState,
  reducers: {
    toggleSize: (state) => {
      state.isOpen = !state.isOpen;
    },
    openSize: (state, action) => {
      state.isOpen = true;
      state.sizes = action.payload;  // Sets the sizes array when opening
    },
    closeSize: (state) => {
      state.isOpen = false;
      state.sizes = null;  // Resets sizes to null when closing
    },
  },
});

export const { toggleSize, openSize, closeSize } = sizeSlice.actions;
export default sizeSlice.reducer;
