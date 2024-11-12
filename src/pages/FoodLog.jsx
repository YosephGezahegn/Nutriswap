import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addMeal, removeMeal } from '../redux/slices/mealsSlice';
import { fetchSwapOptions, resetSwapState } from '../redux/slices/swapSlice';
import FoodSearch from '../components/FoodSearch';
import SwapSuggestion from '../components/SwapSuggestion';

function FoodLog() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const meals = useSelector((state) => state.meals.meals) || {};
  const swapOptions = useSelector((state) => state.swap.swapOptions);
  const swapLoading = useSelector((state) => state.swap.loading);
  const [selectedMealType, setSelectedMealType] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [showSwapOptions, setShowSwapOptions] = useState(false);

  // Daily goals for comparison
  const DAILY_GOALS = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 70,
  };

  // Fixed meal times
  const MEAL_TIMES = {
    breakfast: '08:00 AM',
    lunch: '12:00 PM',
    dinner: '07:00 PM',
  };

  // Add meal to breakfast, lunch, or dinner
  const handleAddMeal = (mealData) => {
    if (!selectedMealType) return;

    const newMeal = {
      id: Date.now(),
      name: mealData.name || 'Unknown Meal',
      time: MEAL_TIMES[selectedMealType] || 'Unknown Time',
      items: mealData.items || [],
      calories: Number(mealData.calories) || 0,
      protein: Number(mealData.protein) || 0,
      carbs: Number(mealData.carbs) || 0,
      fat: Number(mealData.fat) || 0,
    };

    dispatch(addMeal({ mealType: selectedMealType, meal: newMeal }));
    setShowSearch(false);
    setSelectedMealType(null);
  };

  // Remove meal from a specific meal type
  const handleRemoveMeal = (mealType, mealId) => {
    dispatch(removeMeal({ mealType, mealId }));
  };

  // Check if meal exceeds daily goals
  const shouldShowSwap = (meal) => {
    return (
      meal.calories > DAILY_GOALS.calories / 3 ||
      meal.protein > DAILY_GOALS.protein / 3 ||
      meal.carbs > DAILY_GOALS.carbs / 3 ||
      meal.fat > DAILY_GOALS.fat / 3
    );
  };

  // Handle swap meal functionality
  const handleSwapMeal = (meal) => {
    setSelectedMeal(meal);
    dispatch(fetchSwapOptions(meal));
    setShowSwapOptions(true);
  };

  // Navigate to recipe detail
  const handleViewRecipe = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  // Select a meal to swap
  const handleSelectSwap = (newMeal) => {
    if (selectedMeal) {
      const mealType = Object.keys(meals).find((type) =>
        meals[type].some((meal) => meal.id === selectedMeal.id)
      );

      if (mealType) {
        dispatch(addMeal({ mealType, meal: { ...newMeal, id: selectedMeal.id, time: selectedMeal.time } }));
        dispatch(removeMeal({ mealType, mealId: selectedMeal.id }));
      }

      setShowSwapOptions(false);
      setSelectedMeal(null);
      dispatch(resetSwapState());
    }
  };

  // Render meals for breakfast, lunch, or dinner
  const renderMeals = (mealType) => {
    const mealsForType = meals[mealType] || [];
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
        {mealsForType.length > 0 ? (
          mealsForType.map((meal) => (
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
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => handleViewRecipe(meal.recipeId)}
                  >
                    Details
                  </button>
                  {shouldShowSwap(meal) && (
                    <button
                      className="text-orange-500 hover:text-orange-700"
                      onClick={() => handleSwapMeal(meal)}
                    >
                      Swap
                    </button>
                  )}
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveMeal(mealType, meal.id)}
                  >
                    Remove
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

      {/* Food Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Add {selectedMealType} Meal</h3>
              <button
                onClick={() => setShowSearch(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <FoodSearch onSelect={handleAddMeal} />
          </div>
        </div>
      )}

      {/* Swap Meal Options */}
      {showSwapOptions && (
        <SwapSuggestion
          meal={selectedMeal}
          suggestion={swapOptions.length > 0 ? swapOptions[0] : null}
          onSwap={handleSelectSwap}
          onClose={() => {
            setShowSwapOptions(false);
            setSelectedMeal(null);
            dispatch(resetSwapState());
          }}
        />
      )}
    </div>
  );
}

export default FoodLog;