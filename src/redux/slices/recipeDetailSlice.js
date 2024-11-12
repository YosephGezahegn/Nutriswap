import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'https://api.edamam.com/api/recipes/v2';
const APP_ID = '2ba6c4af';
const APP_KEY = '85b0a40c803717b78498';

// Thunk to fetch recipe details by ID
export const fetchRecipeDetail = createAsyncThunk(
  'recipeDetail/fetchRecipeDetail',
  async (id, { rejectWithValue }) => {
    try {
      // Ensure the query parameters are correct
      const url = `${BASE_URL}/${id}?type=public&?app_id=${APP_ID}&app_key=${APP_KEY}`;
      const response = await axios.get(url);
      return response.data.recipe;
    } catch (error) {
      console.error('Error fetching recipe detail:', error);
      return rejectWithValue('Failed to fetch recipe details');
    }
  }
);

const recipeDetailSlice = createSlice({
  name: 'recipeDetail',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetRecipeDetail: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipeDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipeDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchRecipeDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetRecipeDetail } = recipeDetailSlice.actions;
export default recipeDetailSlice.reducer;