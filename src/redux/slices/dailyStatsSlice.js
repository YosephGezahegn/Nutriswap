import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  goals: {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 70,
  },
  intake: {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  },
};

const dailyStatsSlice = createSlice({
  name: 'dailyStats',
  initialState,
  reducers: {
    setGoals: (state, action) => {
      state.goals = { ...state.goals, ...action.payload };
    },
    addIntake: (state, action) => {
      const { calories, protein, carbs, fat } = action.payload;
      state.intake.calories += calories;
      state.intake.protein += protein;
      state.intake.carbs += carbs;
      state.intake.fat += fat;
    },
    resetIntake: (state) => {
      state.intake = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      };
    },
  },
});

export const { setGoals, addIntake, resetIntake } = dailyStatsSlice.actions;
export default dailyStatsSlice.reducer;