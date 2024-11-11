import { useState } from 'react';
import FoodSearch from './FoodSearch';

function MealForm({ meal, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    name: meal?.name || '',
    time: meal?.time || '',
    calories: meal?.calories || 0,
    protein: meal?.protein || 0,
    carbs: meal?.carbs || 0,
    fat: meal?.fat || 0,
    items: meal?.items || [],
  });

  const [showFoodSearch, setShowFoodSearch] = useState(false);

  const handleFoodSelect = (food) => {
    const newItem = {
      name: food.label,
      calories: Math.round(food.nutrients.ENERC_KCAL || 0),
      protein: Math.round(food.nutrients.PROCNT || 0),
      carbs: Math.round(food.nutrients.CHOCDF || 0),
      fat: Math.round(food.nutrients.FAT || 0),
    };

    setFormData({
      ...formData,
      items: [...formData.items, newItem.name],
      calories: formData.calories + newItem.calories,
      protein: formData.protein + newItem.protein,
      carbs: formData.carbs + newItem.carbs,
      fat: formData.fat + newItem.fat,
    });

    setShowFoodSearch(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: meal?.id || Date.now(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">
          {meal ? 'Edit Meal' : 'Add Meal'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Food Items
            </label>
            <div className="space-y-2">
              {formData.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowFoodSearch(true)}
              className="mt-2 text-sm text-primary hover:text-primary/80"
            >
              + Add Food Item
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Calories</label>
              <input
                type="number"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Protein (g)</label>
              <input
                type="number"
                value={formData.protein}
                onChange={(e) => setFormData({ ...formData, protein: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Carbs (g)</label>
              <input
                type="number"
                value={formData.carbs}
                onChange={(e) => setFormData({ ...formData, carbs: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fat (g)</label>
              <input
                type="number"
                value={formData.fat}
                onChange={(e) => setFormData({ ...formData, fat: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <button type="submit" className="btn btn-primary flex-1">
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn bg-gray-200 hover:bg-gray-300 flex-1"
            >
              Cancel
            </button>
          </div>
        </form>

        {showFoodSearch && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Search Food</h3>
                <button
                  onClick={() => setShowFoodSearch(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <FoodSearch onSelect={handleFoodSelect} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MealForm;