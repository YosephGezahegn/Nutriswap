import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addMeal, removeMeal, toggleBookmark } from '../redux/slices/mealsSlice';
import { fetchSwapOptions, resetSwapState } from '../redux/slices/swapSlice';
import { CameraIcon, PlusIcon, ArrowPathIcon, BookmarkIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import FoodSearch from '../components/FoodSearch';
import SwapSuggestion from '../components/SwapSuggestion';
import ImageCapture from '../components/ImageCapture';

function FoodLog() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const meals = useSelector((state) => state.meals.meals) || {};
  const swapOptions = useSelector((state) => state.swap.swapOptions) || [];
  const swapLoading = useSelector((state) => state.swap.loading);
  const bookmarkedMeals = useSelector((state) => state.meals.bookmarkedMeals);
  const goals = useSelector((state) => state.dailyStats.goals);
  const [selectedMealType, setSelectedMealType] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [showSwapOptions, setShowSwapOptions] = useState(false);

  const MEAL_TIMES = {
    breakfast: '08:00 AM',
    lunch: '12:00 PM',
    dinner: '07:00 PM',
  };

  const handleAddMeal = (mealData) => {
    if (!selectedMealType) return;

    const newMeal = {
      id: Date.now(),
      name: mealData.name || 'Unknown Meal',
      time: MEAL_TIMES[selectedMealType] || 'Unknown Time',
      calories: Number(mealData.calories) || 0,
      protein: Number(mealData.protein) || 0,
      carbs: Number(mealData.carbs) || 0,
      fat: Number(mealData.fat) || 0,
      recipeId: mealData.recipeId
    };

    dispatch(addMeal({ mealType: selectedMealType, meal: newMeal }));
    setShowSearch(false);
    setSelectedMealType(null);
  };

  const handleRemoveMeal = (mealType, mealId) => {
    dispatch(removeMeal({ mealType, mealId }));
  };

  const shouldShowSwap = (meal) => {
    return (
      meal.calories > goals.calories / 3 ||
      meal.protein > goals.protein / 3 ||
      meal.carbs > goals.carbs / 3 ||
      meal.fat > goals.fat / 3
    );
  };

  const handleSwapMeal = (meal) => {
    setSelectedMeal(meal);
    dispatch(fetchSwapOptions(meal));
    setShowSwapOptions(true);
  };

  const handleViewRecipe = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  const handleSelectSwap = (newMeal) => {
    if (selectedMeal) {
      const mealType = Object.keys(meals).find((type) =>
        meals[type].some((meal) => meal.id === selectedMeal.id)
      );

      if (mealType) {
        dispatch(removeMeal({ mealType, mealId: selectedMeal.id }));
        dispatch(addMeal({ 
          mealType, 
          meal: { 
            ...newMeal, 
            id: Date.now(), 
            time: selectedMeal.time 
          } 
        }));
      }

      setShowSwapOptions(false);
      setSelectedMeal(null);
      dispatch(resetSwapState());
    }
  };

  const handleToggleBookmark = (meal) => {
    dispatch(toggleBookmark({
      ...meal,
      id: Date.now(),
      recipeId: meal.recipeId || 'default',
    }));
  };

  const renderMealTypeHeader = (mealType) => (
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-xl font-semibold capitalize dark:text-gray-200">
        {mealType} - {MEAL_TIMES[mealType]}
      </h3>
      <div className="flex space-x-2">
        <button
          className="text-primary hover:text-primary/80 p-2"
          onClick={() => {
            setSelectedMealType(mealType);
            setShowCamera(true);
          }}
        >
          <CameraIcon className="h-5 w-5" />
        </button>
        <button
          className="text-primary hover:text-primary/80 p-2"
          onClick={() => {
            setSelectedMealType(mealType);
            setShowSearch(true);
          }}
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );

  const renderMealCard = (meal, mealType) => {
    const isBookmarked = bookmarkedMeals.some(bm => bm.recipeId === meal.recipeId);
    
    return (
      <div key={meal.id} className="border-b border-gray-200 dark:border-gray-700 py-2 last:border-b-0">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <h4 className="text-lg font-medium text-primary dark:text-dark-primary">{meal.name}</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Calories: {meal.calories}</span>
              <span>Protein: {meal.protein}g</span>
              <span>Carbs: {meal.carbs}g</span>
              <span>Fat: {meal.fat}g</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleViewRecipe(meal.recipeId)}
              className="p-1 rounded-full text-gray-400 hover:text-primary dark:text-gray-500 
                       dark:hover:text-dark-primary"
            >
              <InformationCircleIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleToggleBookmark(meal)}
              className={`p-1 rounded-full ${
                isBookmarked ? 'text-primary dark:text-dark-primary' : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              <BookmarkIcon className="h-5 w-5" />
            </button>
            {shouldShowSwap(meal) && (
              <button
                className="text-orange-500 hover:text-orange-700 dark:text-orange-400 
                         dark:hover:text-orange-300"
                onClick={() => handleSwapMeal(meal)}
              >
                <ArrowPathIcon className="h-5 w-5" />
              </button>
            )}
            <button
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              onClick={() => handleRemoveMeal(mealType, meal.id)}
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 px-4">
      <h2 className="text-2xl font-bold dark:text-gray-200">Food Log</h2>

      {Object.entries(meals).map(([mealType, mealsList]) => (
        <div key={mealType} className="card dark:bg-gray-800">
          {renderMealTypeHeader(mealType)}
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {mealsList.length > 0 ? (
              mealsList.map((meal) => renderMealCard(meal, mealType))
            ) : (
              <p className="text-gray-600 dark:text-gray-400 py-4">No meals added yet</p>
            )}
          </div>
        </div>
      ))}

      {showSearch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold dark:text-gray-200">
                Add {selectedMealType} Meal
              </h3>
              <button
                onClick={() => setShowSearch(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 
                         dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            <FoodSearch onSelect={handleAddMeal} />
          </div>
        </div>
      )}

      {showCamera && (
        <ImageCapture
          onClose={() => setShowCamera(false)}
          mealType={selectedMealType}
        />
      )}

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