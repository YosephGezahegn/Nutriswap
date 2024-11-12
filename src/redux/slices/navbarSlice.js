// redux/slices/navbarSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isMenuOpen: false,
};

const navbarSlice = createSlice({
  name: 'navbar',
  initialState,
  reducers: {
    toggleMenu: (state) => {
      state.isMenuOpen = !state.isMenuOpen;
    },
    closeMenu: (state) => {
      state.isMenuOpen = false;
    },
  },
});

export const { toggleMenu, closeMenu } = navbarSlice.actions;
export default navbarSlice.reducer;