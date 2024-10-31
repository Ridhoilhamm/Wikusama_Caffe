// store.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice.js';

export const Store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});
