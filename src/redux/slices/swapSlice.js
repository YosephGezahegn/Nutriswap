import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchFood } from '../../services/foodApi';

export const fetchSwapOptions = createAsyncThunk(
  'swap/fetchSwapOptions',
  async (meal, thunkAPI) => {
    try {
      // Try multiple search queries to ensure we get results
      const searchQueries = [
        `healthy ${meal.name} low calorie high protein`,
        `${meal.name} alternative healthy`,
        `low calorie ${meal.name} substitute`,
        'healthy salad high protein', // Fallback to healthy salads
        'low calorie protein bowl', // Additional healthy alternative
      ];

      let allResults = [];
      
      for (const query of searchQueries) {
        const results = await searchFood(query);
        if (results?.length) {
          allResults = [...allResults, ...results];
        }
      }

      // Remove duplicates based on recipe URI
      allResults = allResults.filter((result, index, self) =>
        index === self.findIndex((r) => r.recipe.uri === result.recipe.uri)
      );

      const filteredResults = allResults
        .filter((result) => {
          const recipe = result?.recipe;
          if (!recipe) return false;

          const calories = Math.round(recipe.calories || 0);
          const protein = Math.round(recipe.totalNutrients?.PROCNT?.quantity || 0);

          // More flexible filtering to ensure we get results
          const isLowerCalorie = calories < meal.calories * 1.2; // Allow slightly higher calories
          const hasAdequateProtein = protein >= meal.protein * 0.6; // More flexible protein requirement
          const isReasonableSubstitute = calories >= meal.calories * 0.3; // Lower minimum calories
          const hasHealthyAttributes = recipe.healthLabels?.some(label => 
            ['High-Protein', 'Low-Fat', 'Low-Carb', 'High-Fiber'].includes(label)
          );

          return (isLowerCalorie && isReasonableSubstitute) && 
                 (hasAdequateProtein || hasHealthyAttributes);
        })
        .map((result) => {
          const recipe = result.recipe;
          return {
            id: recipe.uri.split('#recipe_')[1],
            name: recipe.label || 'Unknown Recipe',
            calories: Math.round(recipe.calories || 0),
            protein: Math.round(recipe.totalNutrients?.PROCNT?.quantity || 0),
            carbs: Math.round(recipe.totalNutrients?.CHOCDF?.quantity || 0),
            fat: Math.round(recipe.totalNutrients?.FAT?.quantity || 0),
            items: recipe.ingredientLines || [],
            recipeId: recipe.uri.split('#recipe_')[1],
            healthLabels: recipe.healthLabels || [],
            image: recipe.image,
            totalWeight: recipe.totalWeight,
            dietLabels: recipe.dietLabels || [],
            cuisineType: recipe.cuisineType || [],
            mealType: recipe.mealType || [],
            dishType: recipe.dishType || [],
            url: recipe.url,
            source: recipe.source,
          };
        });

      // If still no results, include healthy salads and bowls
      if (filteredResults.length === 0) {
        return allResults
          .filter(result => result?.recipe?.healthLabels?.includes('Healthy'))
          .map(result => ({
            id: result.recipe.uri.split('#recipe_')[1],
            name: result.recipe.label || 'Unknown Recipe',
            calories: Math.round(result.recipe.calories || 0),
            protein: Math.round(result.recipe.totalNutrients?.PROCNT?.quantity || 0),
            carbs: Math.round(result.recipe.totalNutrients?.CHOCDF?.quantity || 0),
            fat: Math.round(result.recipe.totalNutrients?.FAT?.quantity || 0),
            items: result.recipe.ingredientLines || [],
            recipeId: result.recipe.uri.split('#recipe_')[1],
            healthLabels: result.recipe.healthLabels || [],
            image: result.recipe.image,
            totalWeight: result.recipe.totalWeight,
            dietLabels: result.recipe.dietLabels || [],
            cuisineType: result.recipe.cuisineType || [],
            mealType: result.recipe.mealType || [],
            dishType: result.recipe.dishType || [],
            url: result.recipe.url,
            source: result.recipe.source,
          }));
      }

      return filteredResults.sort((a, b) => {
        const aScore = calculateHealthScore(a, meal);
        const bScore = calculateHealthScore(b, meal);
        return bScore - aScore;
      });
    } catch (error) {
      console.error('Error fetching swap options:', error);
      return thunkAPI.rejectWithValue('Error fetching swap options.');
    }
  }
);

const calculateHealthScore = (option, originalMeal) => {
  const calorieReduction = (originalMeal.calories - option.calories) / originalMeal.calories;
  const proteinRetention = option.protein / originalMeal.protein;
  const hasHealthyLabels = option.healthLabels.length / 10;
  const hasDietLabels = option.dietLabels.length / 5;

  return (
    calorieReduction * 0.4 +
    proteinRetention * 0.3 +
    hasHealthyLabels * 0.2 +
    hasDietLabels * 0.1
  );
};

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
        state.swapOptions = action.payload || [];
        state.loading = false;
      })
      .addCase(fetchSwapOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An unexpected error occurred.';
      });
  },
});

export const { resetSwapState } = swapSlice.actions;
export default swapSlice.reducer;