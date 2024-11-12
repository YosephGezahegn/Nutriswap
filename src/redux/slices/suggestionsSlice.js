import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [],
  loading: false,
};

const suggestionsSlice = createSlice({
  name: 'suggestions',
  initialState,
  reducers: {
    updateSuggestions: (state, action) => {
      state.data = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { updateSuggestions, setLoading } = suggestionsSlice.actions;
export default suggestionsSlice.reducer;