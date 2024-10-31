// cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [], // Menyimpan item yang ditambahkan ke cart
  },
  reducers: {
    addToCart: (state, action) => {
      state.items.push(action.payload); // Menambahkan item ke cart
    },
  },
});

export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;
