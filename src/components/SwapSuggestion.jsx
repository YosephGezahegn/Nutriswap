import React from 'react';
import { useDispatch } from 'react-redux';
import { resetSwapState } from '../redux/slices/swapSlice';

function SwapSuggestion({ meal, suggestion, onSwap, onClose }) {
  const dispatch = useDispatch();

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

  if (!meal || !suggestion) {
    return <div className="text-center text-lg text-red-500">Meal or suggestion data is missing!</div>;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Healthier Alternative</h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-red-50 rounded-lg">
            <h4 className="font-medium text-red-700">Current Meal</h4>
            <p className="text-red-600">{meal?.name || 'N/A'}</p>
            <p className="text-sm text-red-500 mt-1">
              {meal?.calories || 0} calories, {meal?.protein || 0}g protein
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-700">Suggested Alternative</h4>
            <p className="text-green-600">{suggestion?.name || 'N/A'}</p>
            <p className="text-sm text-green-500 mt-1">
              {suggestion?.calories || 0} calories, {suggestion?.protein || 0}g protein
            </p>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Nutrition Comparison</h4>
            {compareNutrient(meal.calories || 0, suggestion.calories || 0, 'Calories (kcal)')}
            {compareNutrient(meal.protein || 0, suggestion.protein || 0, 'Protein (g)')}
            {compareNutrient(meal.carbs || 0, suggestion.carbs || 0, 'Carbs (g)')}
            {compareNutrient(meal.fat || 0, suggestion.fat || 0, 'Fat (g)')}
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => onSwap(suggestion)}
              className="btn btn-primary flex-1"
            >
              Switch to Healthier Option
            </button>
            <button
              onClick={() => {
                onClose();
                dispatch(resetSwapState());
              }}
              className="btn bg-gray-200 hover:bg-gray-300 flex-1"
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
