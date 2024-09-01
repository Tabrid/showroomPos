import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productsSlice";
import slideReducer from './slices/sliderSlice';
import cardSlideReducer from './slices/cardSlideSlice';
import sizeReducer from './slices/sizeSlice';
import otpReducer from './slices/otpSlice';
import userReducer from './slices/userSlice.js';
import cartReducer from './slices/cartSlice.js';
import authReducer from './slices/authSlice.js';
import productModalReducer from './slices/productModalSlice';

const store = configureStore({
    reducer: {
        products: productsReducer,
        slide: slideReducer,
        cardSlide: cardSlideReducer,
        size:sizeReducer,
        otp: otpReducer,
        user: userReducer,
        cart: cartReducer,
        auth: authReducer,
        productModal: productModalReducer, 
    },
});

export default store;
