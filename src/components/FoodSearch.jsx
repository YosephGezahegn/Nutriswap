import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchFoods, setQuery } from '../redux/slices/foodSearchSlice';

function FoodSearch({ onSelect }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { query, results, loading } = useSelector((state) => state.foodSearch);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    dispatch(fetchFoods(query));
  };

  const handleSelectRecipe = (recipe) => {
    navigate(`/recipe/${recipe.uri.split('#recipe_')[1]}`, { state: { recipe } });
  };

  const handleAddMeal = (recipe) => {
    onSelect(recipe);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => dispatch(setQuery(e.target.value))}
          placeholder="Search for a food..."
          className="flex-1 rounded-md border-gray-300 shadow-sm"
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
                    <div className="font-medium">{recipe.label}</div>
                    <div className="text-sm text-gray-600">
                      {recipe.totalNutrients?.ENERC_KCAL?.quantity?.toFixed(0) || 0} kcal per serving
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="btn btn-secondary text-sm px-4 py-2 rounded-md"
                    onClick={() => handleSelectRecipe(recipe)}
                  >
                    Details
                  </button>
                  <button
                    className="btn btn-primary text-sm px-4 py-2 rounded-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddMeal(recipe);
                    }}
                  >
                    +
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