import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchFood } from '../../services/foodApi';

export const fetchSwapOptions = createAsyncThunk(
  'swap/fetchSwapOptions',
  async (meal, thunkAPI) => {
    try {
      // Search for healthier alternatives based on the meal type
      const searchQuery = `healthy low calorie ${meal.name}`;
      const results = await searchFood(searchQuery);
      
      return results
        .filter((result) => {
          const recipe = result?.recipe;
          if (!recipe) return false;
          
          // Filter for meals with lower calories
          const calories = Math.round(recipe.calories || 0);
          return calories < meal.calories && calories > 0;
        })
        .map((result) => {
          const recipe = result.recipe;
          return {
            id: recipe.uri.split('#recipe_')[1],
            name: recipe.label,
            calories: Math.round(recipe.calories || 0),
            protein: Math.round(recipe.totalNutrients?.PROCNT?.quantity || 0),
            carbs: Math.round(recipe.totalNutrients?.CHOCDF?.quantity || 0),
            fat: Math.round(recipe.totalNutrients?.FAT?.quantity || 0),
            items: recipe.ingredientLines || [],
            recipeId: recipe.uri.split('#recipe_')[1],
          };
        })
        .sort((a, b) => {
          // Sort by closest to original calories while still being lower
          const aDiff = meal.calories - a.calories;
          const bDiff = meal.calories - b.calories;
          return aDiff - bDiff;
        });
    } catch (error) {
      return thunkAPI.rejectWithValue('Error fetching swap options.');
    }
  }
);

const swapSlice = createSlice({
  name: 'swap',
  initialState: {
    swapOptions: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetSwapState: (state) => {
      state.swapOptions = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSwapOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSwapOptions.fulfilled, (state, action) => {
        state.swapOptions = action.payload;
        state.loading = false;
      })
      .addCase(fetchSwapOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetSwapState } = swapSlice.actions;
export default swapSlice.reducer;