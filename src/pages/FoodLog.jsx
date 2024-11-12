import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addMeal, removeMeal, swapMeal } from '../redux/slices/mealsSlice';
import { searchFood } from '../services/foodApi';
import FoodSearch from '../components/FoodSearch';
import { setCurrentMeal, setSuggestedAlternative, resetSwap } from '../redux/slices/swapSlice';

function FoodLog() {
  const dispatch = useDispatch();
  const meals = useSelector((state) => state.meals);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState(null);
  const [swapOptions, setSwapOptions] = useState([]);

  // Fixed meal times
  const MEAL_TIMES = {
    breakfast: '08:00 AM',
    lunch: '12:00 PM',
    dinner: '07:00 PM',
  };

  // Daily goals
  const DAILY_GOALS = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 70,
  };

  // Calculate current totals based on the meals added
  const calculateCurrentTotals = () => {
    const totals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    };

    Object.values(meals).flat().forEach((meal) => {
      totals.calories += meal.calories;
      totals.protein += meal.protein;
      totals.carbs += meal.carbs;
      totals.fat += meal.fat;
    });

    return totals;
  };

  const currentTotals = calculateCurrentTotals();

  // Add meal to breakfast, lunch, or dinner
  const handleAddMeal = (mealData) => {
    if (!selectedMealType) return;

    const newMeal = {
      id: new Date().getTime(),
      name: mealData.label || 'Unknown Meal',
      time: MEAL_TIMES[selectedMealType] || 'Unknown Time',
      items: Array.isArray(mealData.ingredientLines) ? mealData.ingredientLines : [],
      calories: Math.round(mealData.totalNutrients?.ENERC_KCAL?.quantity || 0),
      protein: Math.round(mealData.totalNutrients?.PROCNT?.quantity || 0),
      carbs: Math.round(mealData.totalNutrients?.CHOCDF?.quantity || 0),
      fat: Math.round(mealData.totalNutrients?.FAT?.quantity || 0),
    };

    dispatch(addMeal({ mealType: selectedMealType, meal: newMeal }));
    setShowSearch(false);
    setSelectedMealType(null);
  };

  // Remove meal from a specific meal type
  const handleRemoveMeal = (mealType, mealId) => {
    dispatch(removeMeal({ mealType, mealId }));
  };

  // Handle the swap meal logic to fetch alternatives
  const handleSwapMeal = async (meal) => {
    dispatch(setCurrentMeal(meal));
    setShowSwapOptions(true);

    try {
      const results = await searchFood('healthy meals');
      const validAlternatives = results
        .filter((result) => result?.recipe)
        .map((result) => {
          const { label, calories, totalNutrients, ingredientLines } = result.recipe;
          return {
            name: label,
            calories: Math.round(calories || 0),
            protein: Math.round(totalNutrients?.PROCNT?.quantity || 0),
            carbs: Math.round(totalNutrients?.CHOCDF?.quantity || 0),
            fat: Math.round(totalNutrients?.FAT?.quantity || 0),
            items: ingredientLines || [],
          };
        });

      setSwapOptions(validAlternatives);
    } catch (error) {
      console.error('Error fetching swap options:', error);
    }
  };

  // Handle selecting a meal to swap with the current meal
  const handleSelectSwap = (newMeal) => {
    const mealType = Object.keys(meals).find((type) =>
      meals[type].some((meal) => meal.id === newMeal.id)
    );

    if (mealType) {
      dispatch(swapMeal({ mealType, mealId: newMeal.id, newMeal }));
    }
    setShowSwapOptions(false);
    dispatch(resetSwap());
  };

  // Render meals for breakfast, lunch, or dinner
  const renderMeals = (mealType) => {
    return (
      <div className="card mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold capitalize">
            {mealType} - {MEAL_TIMES[mealType]}
          </h3>
          <button
            className="text-primary hover:text-primary/80"
            onClick={() => {
              setSelectedMealType(mealType);
              setShowSearch(true);
            }}
          >
            + Add Meal
          </button>
        </div>
        {meals[mealType]?.length > 0 ? (
          meals[mealType].map((meal) => (
            <div key={meal.id} className="border-b border-gray-200 py-2">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-medium">{meal.name}</h4>
                  <p className="text-sm text-gray-600">
                    Calories: {meal.calories}, Protein: {meal.protein}g, Carbs: {meal.carbs}g, Fat: {meal.fat}g
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveMeal(mealType, meal.id)}
                  >
                    Remove
                  </button>
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => handleSwapMeal(meal)}
                  >
                    Swap
                  </button>
                </div>
              </div>
              <ul className="space-y-1 mt-2">
                {meal.items.map((item, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No meals added yet. Click "+ Add Meal" to add a meal.</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Food Log</h2>

      {/* Breakfast Section */}
      {renderMeals('breakfast')}

      {/* Lunch Section */}
      {renderMeals('lunch')}

      {/* Dinner Section */}
      {renderMeals('dinner')}

      {/* Food Search for Adding Meals */}
      {showSearch && (
        <FoodSearch
          onSelect={(mealData) => handleAddMeal(mealData)}
        />
      )}

      {/* Swap Meal Options - Popup Style */}
      {showSwapOptions && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="swap-options border rounded shadow-md p-6 bg-white w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Swap Options for {selectedMeal?.name}</h3>

            <div className="max-h-60 overflow-y-auto space-y-4">
              {swapOptions.length > 0 ? (
                swapOptions.map((option, index) => (
                  <div key={index} className="flex flex-col p-2 border rounded-md hover:bg-gray-50">
                    {/* Nutritional Comparison */}
                    <div className="flex flex-col space-y-1 mb-2">
                      <p>
                        <span className="font-bold">Calories:</span> {selectedMeal?.calories} → {option.calories}
                      </p>
                      <p>
                        <span className="font-bold">Protein:</span> {selectedMeal?.protein}g → {option.protein}g
                      </p>
                      <p>
                        <span className="font-bold">Carbs:</span> {selectedMeal?.carbs}g → {option.carbs}g
                      </p>
                      <p>
                        <span className="font-bold">Fat:</span> {selectedMeal?.fat}g → {option.fat}g
                      </p>
                    </div>

                    {/* Swap Option */}
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{option.name}</h4>
                        <p className="text-sm text-gray-600">
                          Calories: {option.calories}, Protein: {option.protein}g, Carbs: {option.carbs}g, Fat: {option.fat}g
                        </p>
                      </div>
                      <button
                        className="text-green-600 hover:text-green-800"
                        onClick={() => handleSelectSwap(option)}
                      >
                        Swap
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No suitable swap options found.</p>
              )}
            </div>

            <button
              className="btn btn-secondary mt-4"
              onClick={() => {
                setShowSwapOptions(false);
                dispatch(resetSwap());
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FoodLog;