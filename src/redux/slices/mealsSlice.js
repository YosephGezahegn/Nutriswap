import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  meals: {
    breakfast: [],
    lunch: [],
    dinner: [],
  },
  weeklyProgress: [
    { day: 'Mon', calories: 2100 },
    { day: 'Tue', calories: 1950 },
    { day: 'Wed', calories: 2200 },
    { day: 'Thu', calories: 2000 },
    { day: 'Fri', calories: 1800 },
    { day: 'Sat', calories: 1900 },
    { day: 'Sun', calories: 2050 },
  ],
};

const mealsSlice = createSlice({
  name: 'meals',
  initialState,
  reducers: {
    addMeal: (state, action) => {
      const { mealType, mealData } = action.payload;
      state.meals[mealType].push(mealData);
    },
    removeMeal: (state, action) => {
      const { mealType, mealId } = action.payload;
      state.meals[mealType] = state.meals[mealType].filter((meal) => meal.id !== mealId);
    },
    updateWeeklyProgress: (state) => {
      // Example logic to update weekly progress based on the meals
      const totals = { calories: 0 };
      Object.values(state.meals).flat().forEach((meal) => {
        totals.calories += meal.calories;
      });

      // Update the latest day with the current total
      const todayIndex = new Date().getDay() - 1; // -1 because array starts at 0 (Mon = 0)
      if (state.weeklyProgress[todayIndex]) {
        state.weeklyProgress[todayIndex].calories = totals.calories;
      }
    },
  },
});

export const { addMeal, removeMeal, updateWeeklyProgress } = mealsSlice.actions;
export default mealsSlice.reducer;