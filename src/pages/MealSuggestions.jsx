import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FoodSearch from '../components/FoodSearch';
import { updateSuggestions, setLoading } from '../redux/slices/suggestionsSlice';
import { searchFood } from '../services/foodApi';

function MealSuggestions() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const suggestions = useSelector((state) => state.suggestions.data);
  const loading = useSelector((state) => state.suggestions.loading);

  useEffect(() => {
    // Load default egg-based suggestions when component mounts
    const loadDefaultSuggestions = async () => {
      dispatch(setLoading(true));
      try {
        const results = await searchFood('egg recipes');
        const meals = results
          .filter(result => result?.recipe)
          .map(result => {
            const recipe = result.recipe;
            return {
              id: recipe.uri.split('#recipe_')[1],
              name: recipe.label,
              calories: Math.round(recipe.calories || 0),
              protein: Math.round(recipe.totalNutrients?.PROCNT?.quantity || 0),
              carbs: Math.round(recipe.totalNutrients?.CHOCDF?.quantity || 0),
              fat: Math.round(recipe.totalNutrients?.FAT?.quantity || 0),
              image: recipe.image || 'https://via.placeholder.com/150',
              ingredients: recipe.ingredientLines || [],
            };
          });
        dispatch(updateSuggestions(meals));
      } catch (error) {
        console.error('Error fetching default suggestions:', error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadDefaultSuggestions();
  }, [dispatch]);

  const handleSearch = async (searchQuery) => {
    if (typeof searchQuery !== 'string' || !searchQuery.trim()) return;

    dispatch(setLoading(true));
    try {
      const results = await searchFood(searchQuery);
      const meals = results
        .filter(result => result?.recipe)
        .map(result => {
          const recipe = result.recipe;
          return {
            id: recipe.uri.split('#recipe_')[1],
            name: recipe.label,
            calories: Math.round(recipe.calories || 0),
            protein: Math.round(recipe.totalNutrients?.PROCNT?.quantity || 0),
            carbs: Math.round(recipe.totalNutrients?.CHOCDF?.quantity || 0),
            fat: Math.round(recipe.totalNutrients?.FAT?.quantity || 0),
            image: recipe.image || 'https://via.placeholder.com/150',
            ingredients: recipe.ingredientLines || [],
          };
        });
      dispatch(updateSuggestions(meals));
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleMealClick = (id) => {
    navigate(`/recipe/${id}`);
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
                onClick={() => handleMealClick(meal.id)}
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
                  {meal.ingredients && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700">Ingredients:</p>
                      <ul className="text-sm text-gray-600">
                        {meal.ingredients.slice(0, 3).map((ingredient, index) => (
                          <li key={index} className="truncate">{ingredient}</li>
                        ))}
                        {meal.ingredients.length > 3 && (
                          <li className="text-primary">+{meal.ingredients.length - 3} more...</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default MealSuggestions;