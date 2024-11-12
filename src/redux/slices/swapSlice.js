// redux/slices/swapSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentMeal: null,
  suggestedAlternative: null,
};

const swapSlice = createSlice({
  name: 'swap',
  initialState,
  reducers: {
    setCurrentMeal: (state, action) => {
      state.currentMeal = action.payload;
    },
    setSuggestedAlternative: (state, action) => {
      state.suggestedAlternative = action.payload;
    },
    resetSwap: (state) => {
      state.currentMeal = null;
      state.suggestedAlternative = null;
    },
  },
});

export const { setCurrentMeal, setSuggestedAlternative, resetSwap } = swapSlice.actions;
export default swapSlice.reducer;