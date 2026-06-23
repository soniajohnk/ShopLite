import { createSlice } from '@reduxjs/toolkit';

const favoritesSlice = createSlice({
  name: 'favorites',

  initialState: {
    items: [],
  },

  reducers: {
    setFavorites: (state, action) => {
      state.items = action.payload;
    },

    toggleFavorite: (state, action) => {
      const product = action.payload;

      const exists = state.items.find(
        item => item.id === product.id,
      );

      if (exists) {
        state.items = state.items.filter(
          item => item.id !== product.id,
        );
      } else {
        state.items.push(product);
      }
    },
  },
});

export const {
  toggleFavorite,
  setFavorites,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;