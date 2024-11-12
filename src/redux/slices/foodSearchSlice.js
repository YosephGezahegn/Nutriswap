// redux/slices/foodSearchSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchFood } from '../../services/foodApi';

// Async thunk to handle food search
export const fetchFoods = createAsyncThunk('foodSearch/fetchFoods', async (query, thunkAPI) => {
  try {
    const foods = await searchFood(query);
    return foods.filter((result) => result?.recipe); // Only return valid foods
  } catch (error) {
    return thunkAPI.rejectWithValue('Failed to fetch food');
  }
});

const initialState = {
  query: '',
  results: [],
  loading: false,
  error: null,
};

const foodSearchSlice = createSlice({
  name: 'foodSearch',
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    clearResults: (state) => {
      state.results = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFoods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFoods.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(fetchFoods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setQuery, clearResults } = foodSearchSlice.actions;
export default foodSearchSlice.reducer;