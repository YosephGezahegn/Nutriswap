import { useDispatch, useSelector } from 'react-redux';
import { resetSwap } from '../redux/slices/swapSlice';
import { addMeal, removeMeal } from '../redux/slices/mealsSlice';

function SwapSuggestion() {
  const dispatch = useDispatch();
  const { currentMeal, suggestedAlternative } = useSelector((state) => state.swap);

  if (!currentMeal || !suggestedAlternative) {
    return null; // Render nothing if no current meal or suggestion is available
  }

  const compareNutrient = (original, suggested, label) => {
    const diff = suggested - original;
    const color = diff < 0 ? 'text-green-600' : 'text-red-600';
    return (
      <div className="flex justify-between items-center">
        <span>{label}</span>
        <div className="flex items-center space-x-2">
          <span>{original}</span>
          <span>→</span>
          <span className={color}>{suggested}</span>
        </div>
      </div>
    );
  };

  const handleSwap = () => {
    // Remove the current meal and add the suggested one
    dispatch(removeMeal({ mealType: currentMeal.mealType, mealId: currentMeal.id }));
    dispatch(addMeal({ mealType: currentMeal.mealType, meal: suggestedAlternative }));
    dispatch(resetSwap());
  };

  const handleClose = () => {
    dispatch(resetSwap());
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Suggested Swap</h3>

        <div className="space-y-4">
          <div className="p-4 bg-red-50 rounded-lg">
            <h4 className="font-medium text-red-700">Current Meal</h4>
            <p className="text-red-600">{currentMeal.name}</p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-700">Suggested Alternative</h4>
            <p className="text-green-600">{suggestedAlternative.name}</p>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Nutrition Comparison</h4>
            {compareNutrient(currentMeal.calories, suggestedAlternative.calories, 'Calories')}
            {compareNutrient(currentMeal.protein, suggestedAlternative.protein, 'Protein (g)')}
            {compareNutrient(currentMeal.carbs, suggestedAlternative.carbs, 'Carbs (g)')}
            {compareNutrient(currentMeal.fat, suggestedAlternative.fat, 'Fat (g)')}
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleSwap}
              className="btn btn-primary flex-1"
            >
              Swap Meal
            </button>
            <button
              onClick={handleClose}
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