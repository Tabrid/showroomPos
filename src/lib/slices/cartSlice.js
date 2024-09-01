import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        totalQuantity: 0,
    },
    reducers: {
        setInitialState(state, action) {
            state.items = action.payload.items;
            state.totalQuantity = action.payload.totalQuantity;
        },
        addToCart(state, action) {
            const item = action.payload;
            const existingItem = state.items.find(i => i.id === item.id);
            if (existingItem) {
                existingItem.quantity += item.quantity;
            } else {
                state.items.push(item);
            }
            state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
            if (typeof window !== 'undefined') {
                localStorage.setItem('cartItems', JSON.stringify(state.items));
                localStorage.setItem('totalQuantity', JSON.stringify(state.totalQuantity));
            }
        },
        decreaseQuantity(state, action) {
            const itemId = action.payload;
            const item = state.items.find(i => i.id === itemId);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
            }
            state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
            if (typeof window !== 'undefined') {
                localStorage.setItem('cartItems', JSON.stringify(state.items));
                localStorage.setItem('totalQuantity', JSON.stringify(state.totalQuantity));
            }
        },
        increaseQuantity(state, action) {
            const itemId = action.payload;
            const item = state.items.find(i => i.id === itemId);
            if (item) {
                item.quantity += 1;
            }
            state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
            if (typeof window !== 'undefined') {
                localStorage.setItem('cartItems', JSON.stringify(state.items));
                localStorage.setItem('totalQuantity', JSON.stringify(state.totalQuantity));
            }
        },
        removeItem(state, action) {
            const itemId = action.payload;
            state.items = state.items.filter(i => i.id !== itemId);
            state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
            if (typeof window !== 'undefined') {
                localStorage.setItem('cartItems', JSON.stringify(state.items));
                localStorage.setItem('totalQuantity', JSON.stringify(state.totalQuantity));
            }
        },
        initializeCartFromLocalStorage(state) {
            if (typeof window !== 'undefined') {
                const storedItems = localStorage.getItem('cartItems');
                const storedQuantity = localStorage.getItem('totalQuantity');
                state.items = storedItems ? JSON.parse(storedItems) : [];
                state.totalQuantity = storedQuantity ? JSON.parse(storedQuantity) : 0;
            }
        },
    },
});

export const { setInitialState, addToCart, decreaseQuantity, increaseQuantity, removeItem, initializeCartFromLocalStorage } = cartSlice.actions;
export default cartSlice.reducer;
