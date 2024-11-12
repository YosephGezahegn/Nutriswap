import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import RecipeDetail from '../components/RecipeDetail.jsx';

const RecipePage = () => {
  const { id } = useParams(); // Extract recipe ID from URL parameters

  // Get the recipe from Redux store using the suggestions state
  const recipe = useSelector((state) =>
    state.suggestions.suggestions.find((suggestion) => suggestion.id === id)
  );

  if (!recipe) {
    return <div className="text-center text-gray-600">Recipe not found. Please try another recipe.</div>;
  }

  return <RecipeDetail recipe={recipe} />;
};

export default RecipePage;