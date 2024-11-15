import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetSwapState, fetchSwapOptions } from '../redux/slices/swapSlice';
import { useNavigate } from 'react-router-dom';

function SwapSuggestion({ meal, onSwap, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { swapOptions, loading } = useSelector((state) => state.swap);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentSuggestion = swapOptions[currentIndex];

  const handleNextOption = () => {
    if (currentIndex < swapOptions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      dispatch(fetchSwapOptions(meal));
      setCurrentIndex(0);
    }
  };

  const handleViewRecipe = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  const compareNutrient = (original, suggested, label) => {
    const diff = suggested - original;
    const color = diff < 0 ? 'text-green-600' : 'text-red-600';
    const sign = diff > 0 ? '+' : '';
    return (
      <div className="flex justify-between items-center">
        <span>{label}</span>
        <div className="flex items-center space-x-2">
          <span>{original}</span>
          <span>→</span>
          <span className={color}>
            {suggested} ({sign}{diff})
          </span>
        </div>
      </div>
    );
  };

  if (!meal || !currentSuggestion) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-6 w-full max-w-md text-center">
          <h3 className="text-xl font-semibold mb-4">No Alternatives Found</h3>
          <p className="text-gray-600 mb-4">We couldn't find any healthier alternatives for this meal.</p>
          <button onClick={onClose} className="btn btn-primary">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Healthier Alternative</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-red-50 rounded-lg">
            <h4 className="font-medium text-red-700">Current Meal</h4>
            <div className="flex items-center space-x-3">
              {meal.image && (
                <img src={meal.image} alt={meal.name} className="w-16 h-16 rounded-md object-cover" />
              )}
              <div>
                <p className="text-red-600">{meal.name}</p>
                <p className="text-sm text-red-500">
                  {meal.calories} calories, {meal.protein}g protein
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-700">Suggested Alternative</h4>
            <div className="flex items-center space-x-3">
              {currentSuggestion.image && (
                <img 
                  src={currentSuggestion.image} 
                  alt={currentSuggestion.name} 
                  className="w-16 h-16 rounded-md object-cover"
                />
              )}
              <div>
                <p className="text-green-600">{currentSuggestion.name}</p>
                <p className="text-sm text-green-500">
                  {currentSuggestion.calories} calories, {currentSuggestion.protein}g protein
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {currentSuggestion.healthLabels?.slice(0, 3).map((label, index) => (
                    <span key={index} className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Nutrition Comparison</h4>
            {compareNutrient(meal.calories, currentSuggestion.calories, 'Calories (kcal)')}
            {compareNutrient(meal.protein, currentSuggestion.protein, 'Protein (g)')}
            {compareNutrient(meal.carbs, currentSuggestion.carbs, 'Carbs (g)')}
            {compareNutrient(meal.fat, currentSuggestion.fat, 'Fat (g)')}
          </div>

          <div className="flex flex-col space-y-2">
            <button
              onClick={() => onSwap(currentSuggestion)}
              className="btn btn-primary"
              disabled={loading}
            >
              Switch to Healthier Option
            </button>
            <button
              onClick={handleNextOption}
              className="btn bg-secondary text-white hover:bg-secondary/90"
              disabled={loading}
            >
              Show Another Option ({currentIndex + 1}/{swapOptions.length})
            </button>
            <button
              onClick={() => handleViewRecipe(currentSuggestion.recipeId)}
              className="btn bg-primary/10 text-primary hover:bg-primary/20"
            >
              View Recipe Details
            </button>
            <button
              onClick={() => {
                onClose();
                dispatch(resetSwapState());
              }}
              className="btn bg-gray-200 hover:bg-gray-300"
            >
              Keep Current
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SwapSuggestion;