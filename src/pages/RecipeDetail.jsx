import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchRecipeDetail, resetRecipeDetail } from '../redux/slices/recipeDetailSlice';
import { toggleBookmark } from '../redux/slices/mealsSlice';

const defaultRecipe = {
  label: 'Classic Chicken Salad',
  image: 'https://www.edamam.com/web-img/149/149260a63a2f9029a7434b3c3d1c0d4a.jpg',
  source: 'NutriSwap',
  url: '#',
  yield: 4,
  dietLabels: ['High-Protein', 'Low-Carb'],
  healthLabels: ['Mediterranean', 'Dairy-Free'],
  cautions: ['Gluten'],
  ingredientLines: [
    '2 cups cooked chicken, diced',
    '1/2 cup celery, chopped',
    '1/4 cup red onion, finely chopped',
    '1/2 cup mayonnaise',
    'Salt and pepper to taste',
    '1 tablespoon fresh herbs (parsley, dill, or tarragon)'
  ],
  calories: 350,
  totalWeight: 450,
  totalNutrients: {
    ENERC_KCAL: { label: 'Energy', quantity: 350, unit: 'kcal' },
    PROCNT: { label: 'Protein', quantity: 25, unit: 'g' },
    FAT: { label: 'Total Fat', quantity: 28, unit: 'g' },
    CHOCDF: { label: 'Carbohydrates', quantity: 2, unit: 'g' },
    FIBTG: { label: 'Fiber', quantity: 0.5, unit: 'g' },
  },
  cuisineType: ['american'],
  mealType: ['lunch/dinner'],
  dishType: ['salad'],
};

const RecipeDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const recipeDetail = useSelector((state) => state.recipeDetail);
  const bookmarkedMeals = useSelector((state) => state.meals.bookmarkedMeals);
  const { data: recipe, loading, error } = recipeDetail || {};

  useEffect(() => {
    if (id === 'default') {
      dispatch({ type: 'recipeDetail/setDefaultRecipe', payload: defaultRecipe });
    } else {
      dispatch(fetchRecipeDetail(id));
    }
    return () => dispatch(resetRecipeDetail());
  }, [dispatch, id]);

  if (loading) {
    return <div className="text-center text-lg">Loading recipe details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const currentRecipe = recipe || defaultRecipe;
  const isBookmarked = bookmarkedMeals.some(meal => meal.recipeId === id);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="relative">
        <img 
          src={currentRecipe.image} 
          alt={currentRecipe.label} 
          className="w-full h-64 object-cover rounded-xl shadow-lg"
        />
        <button
          onClick={() => dispatch(toggleBookmark({
            ...currentRecipe,
            id: Date.now(),
            recipeId: id,
          }))}
          className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg"
        >
          <span className={`text-2xl ${isBookmarked ? 'text-primary' : 'text-gray-400'}`}>
            ★
          </span>
        </button>
      </div>

      <div className="mt-6">
        <h1 className="text-3xl font-bold mb-2">{currentRecipe.label}</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {currentRecipe.dietLabels?.map(label => (
            <span key={label} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm">
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
          <ul className="space-y-2">
            {currentRecipe.ingredientLines?.map((ingredient, index) => (
              <li key={index} className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Nutritional Information</h2>
          <div className="bg-white border border-gray-800 p-4 rounded-md shadow-md max-w-md font-sans">
            <div className="text-3xl font-extrabold pb-2 border-b-4 border-black">Nutrition Facts</div>
            <div className="text-sm mt-1">Servings per container: <span className="font-bold">{currentRecipe.yield || 1}</span></div>
            <div className="flex justify-between text-lg font-bold mt-2 border-b-4 border-black pb-2">
              <div>Serving size</div>
              <div>1 serving</div>
            </div>

            <div className="flex justify-between items-center mt-3 text-4xl font-extrabold border-b-2 border-black pb-2">
              <div>Calories</div>
              <div>{currentRecipe.calories ? currentRecipe.calories.toFixed(0) : 0}</div>
            </div>

            <div className="text-right font-medium text-sm mt-2">% Daily Value *</div>

            {currentRecipe.totalNutrients &&
              Object.entries(currentRecipe.totalNutrients).map(([key, nutrient]) => (
                <div key={key} className="flex justify-between border-t py-2">
                  <span className="font-bold">{nutrient.label}</span>
                  <span>
                    {nutrient.quantity?.toFixed(2)} {nutrient.unit}
                  </span>
                </div>
              ))}

            <div className="flex flex-col mt-4 text-xs border-t pt-2">
              <div>* The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
