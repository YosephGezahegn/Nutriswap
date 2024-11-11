function SwapSuggestion({ meal, suggestion, onSwap, onClose }) {
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Suggested Swap</h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-red-50 rounded-lg">
            <h4 className="font-medium text-red-700">Current Meal</h4>
            <p className="text-red-600">{meal.name}</p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-700">Suggested Alternative</h4>
            <p className="text-green-600">{suggestion.name}</p>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Nutrition Comparison</h4>
            {compareNutrient(meal.calories, suggestion.calories, 'Calories')}
            {compareNutrient(meal.protein, suggestion.protein, 'Protein (g)')}
            {compareNutrient(meal.carbs, suggestion.carbs, 'Carbs (g)')}
            {compareNutrient(meal.fat, suggestion.fat, 'Fat (g)')}
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => onSwap(suggestion)}
              className="btn btn-primary flex-1"
            >
              Swap Meal
            </button>
            <button
              onClick={onClose}
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