import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import FoodSearch from '../components/FoodSearch';
import {
  updateSuggestions,
  setLoading,
} from '../redux/slices/suggestionsSlice';
import { toggleBookmark } from '../redux/slices/mealsSlice';
import { searchFood } from '../services/foodApi';

function MealSuggestions() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const suggestions = useSelector((state) => state.suggestions.data);
  const loading = useSelector((state) => state.suggestions.loading);
  const bookmarkedMeals = useSelector((state) => state.meals.bookmarkedMeals);

  // Fetch default suggestions on component mount
  useEffect(() => {
    const loadDefaultSuggestions = async () => {
      dispatch(setLoading(true));
      try {
        const results = await searchFood(
          'high protein low calorie healthy meals'
        );

        const meals = results
          ?.filter((result) => {
            console.log(meals);
            const recipe = result?.recipe;
            return (
              recipe &&
              recipe.calories < 500 &&
              recipe.totalNutrients?.PROCNT?.quantity > 20 // High protein
            );
          })
          ?.map((result) => {
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
              recipeId: recipe.uri.split('#recipe_')[1],
            };
          })
          .sort((a, b) => b.protein / b.calories - a.protein / a.calories); // Sort by protein-to-calorie ratio

        dispatch(updateSuggestions(meals || []));
      } catch (error) {
        console.error('Error fetching default suggestions:', error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadDefaultSuggestions();
  }, [dispatch]);

  // Search handler
  const handleSearch = async (searchQuery) => {
    if (typeof searchQuery !== 'string' || !searchQuery.trim()) return;

    dispatch(setLoading(true));
    try {
      const results = await searchFood(searchQuery);
      const meals = results.hits?.map((result) => {
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
          recipeId: recipe.uri.split('#recipe_')[1],
        };
      });

      dispatch(updateSuggestions(meals || []));
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Meal click handler
  const handleMealClick = (id) => {
    navigate(`/recipe/${id}`);
  };

  // Bookmark toggle handler
  const handleToggleBookmark = (meal, e) => {
    e.stopPropagation();
    dispatch(
      toggleBookmark({
        ...meal,
        id: Date.now(),
        recipeId: meal.id,
      })
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Meal Suggestions</h2>

      {/* Search Component */}
      <FoodSearch onSelect={handleSearch} />

      {/* Suggestions Section */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-muted">Loading suggestions...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {suggestions.length === 0 ? (
            <div className="text-lg text-muted text-primary">
              No results found.
            </div>
          ) : (
            suggestions.map((meal) => {
              const isBookmarked = bookmarkedMeals.some(
                (bm) => bm.recipeId === meal.id
              );

              return (
                <div
                  key={meal.id}
                  className="card hover:shadow-lg transition-shadow cursor-pointer relative"
                  onClick={() => handleMealClick(meal.id)}
                >
                  <button
                    onClick={(e) => handleToggleBookmark(meal, e)}
                    className={`absolute top-4 right-4 p-2 rounded-full bg-card/90 dark:bg-dark-card/90 shadow-md z-10 ${
                      isBookmarked ? 'text-primary' : 'text-muted'
                    }`}
                  >
                    <BookmarkIcon className="h-5 w-5" />
                  </button>

                  <img
                    src={meal.image}
                    alt={`Image of ${meal.name}`}
                    className="w-full h-48 object-cover rounded-t-xl -mt-6 -mx-6 mb-4"
                  />
                  <div className="px-4 pb-4">
                    <h3 className="text-lg font-semibold">{meal.name}</h3>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div className="text-sm">
                        <span className="font-medium text-primary">
                          Calories:
                        </span>{' '}
                        {meal.calories}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-primary">
                          Protein:
                        </span>{' '}
                        {meal.protein}g
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-primary">Carbs:</span>{' '}
                        {meal.carbs}g
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-primary">Fat:</span>{' '}
                        {meal.fat}g
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default MealSuggestions;
