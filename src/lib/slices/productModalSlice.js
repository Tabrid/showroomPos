import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  product: null,  
};

const productModalSlice = createSlice({
  name: 'productModal',
  initialState,
  reducers: {
    toggleProductModal: (state) => {
      state.isOpen = !state.isOpen;
    },
    openProductModal: (state, action) => {
      state.isOpen = true;
      state.product = action.payload;  
    },
    closeProductModal: (state) => {
      state.isOpen = false;
      state.product = null;  
    },
  },
});

export const { toggleProductModal, openProductModal, closeProductModal } = productModalSlice.actions;
export default productModalSlice.reducer;
