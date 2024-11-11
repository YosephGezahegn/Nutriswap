import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import FoodSearch from '../components/FoodSearch';
import { searchFood } from '../services/foodApi';

function MealSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook to handle navigation

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('Request is taking longer than expected...');
      }
    }, 5000); // Set a timeout to handle long API requests

    return () => clearTimeout(timeoutId);
  }, [loading]);

  const handleSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) return;

      setLoading(true);
      try {
        const results = await searchFood(query);
        const meals = results.map((result) => {
          if (!result || !result.recipe) return null; // Null check for result and recipe to avoid runtime errors
          const recipe = result.recipe;
          return {
            id: recipe.uri.split('#recipe_')[1],
            name: recipe.label || 'Unknown Recipe',
            calories: Math.round(recipe.calories || 0),
            protein: Math.round(recipe.totalNutrients?.PROCNT?.quantity || 0),
            carbs: Math.round(recipe.totalNutrients?.CHOCDF?.quantity || 0),
            fat: Math.round(recipe.totalNutrients?.FAT?.quantity || 0),
            image: recipe.image || 'https://via.placeholder.com/150',
          };
        }).filter(Boolean);
        setSuggestions(meals);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setLoading(false);
      }
    }, 300), // Debounce delay of 300ms to limit API requests
    []
  );

  const handleMealClick = (id) => {
    navigate(`/recipe/${id}`); // Navigate to RecipeDetail page with the recipe id
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Meal Suggestions</h2>

      {/* Search Component */}
      <FoodSearch onSelect={handleSearch} />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading suggestions...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {suggestions.length === 0 ? (
            <div className="text-lg text-gray-600">No results found.</div>
          ) : (
            suggestions.map((meal) => (
              <div
                key={meal.id}
                className="card hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleMealClick(meal.id)} // Navigate on meal click
              >
                <img
                  src={meal.image}
                  alt={`Image of ${meal.name}`}
                  className="w-full h-48 object-cover rounded-t-xl -mt-6 -mx-6 mb-4"
                />
                <div className="px-4 pb-4">
                  <h3 className="text-lg font-semibold">{meal.name}</h3>
                  <p className="text-sm text-gray-600">Calories: {meal.calories} kcal</p>
                  <p className="text-sm text-gray-600">Protein: {meal.protein} g</p>
                  <p className="text-sm text-gray-600">Carbs: {meal.carbs} g</p>
                  <p className="text-sm text-gray-600">Fat: {meal.fat} g</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// Debounce function to limit API calls
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

export default MealSuggestions;