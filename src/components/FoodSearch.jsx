import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchFoods, setQuery } from '../redux/slices/foodSearchSlice';

function FoodSearch({ onSelect }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { query, results, loading } = useSelector((state) => state.foodSearch);

  const handleSearch = async (e) => {
    e.preventDefault();
        if (typeof query !== 'string' || !query.trim()) return;
    dispatch(fetchFoods(query));
  };

  const handleSelectRecipe = (recipe) => {
    const recipeId = recipe.uri.split('#recipe_')[1];
    navigate(`/recipe/${recipeId}`);
  };

  const handleAddMeal = (recipe) => {
    const formattedRecipe = {
      name: recipe.label,
      calories: Math.round(recipe.totalNutrients?.ENERC_KCAL?.quantity || 0),
      protein: Math.round(recipe.totalNutrients?.PROCNT?.quantity || 0),
      carbs: Math.round(recipe.totalNutrients?.CHOCDF?.quantity || 0),
      fat: Math.round(recipe.totalNutrients?.FAT?.quantity || 0),
      items: recipe.ingredientLines || [],
      recipeId: recipe.uri.split('#recipe_')[1]
    };
    onSelect(formattedRecipe);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => dispatch(setQuery(e.target.value))}
          placeholder="Search for a food..."
          className="flex-1 rounded-md border-gray-300 shadow-sm p-2"
        />
        <button type="submit" className="btn btn-primary">
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {results.length > 0 && (
        <div className="max-h-60 overflow-y-auto space-y-2">
          {results.map((result) => {
            const recipe = result.recipe;
            return (
              <div
                key={recipe.uri}
                className="p-2 hover:bg-gray-50 rounded-md flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  {recipe.image && (
                    <img
                      src={recipe.image}
                      alt={recipe.label}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                  )}
                  <div>
                    <div className="font-medium text-primary">{recipe.label}</div>
                    <div className="text-sm text-gray-600">
                      {Math.round(recipe.totalNutrients?.ENERC_KCAL?.quantity || 0)} kcal per serving
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    className="btn btn-secondary text-sm px-4 py-2 rounded-md"
                    onClick={() => handleSelectRecipe(recipe)}
                  >
                    Details
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary text-sm px-4 py-2 rounded-md"
                    onClick={() => { 
                      handleAddMeal(recipe);
                      console.log("HIII"+recipe.uri.split('#recipe_')[1])
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FoodSearch;