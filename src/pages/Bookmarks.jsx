import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleBookmark } from '../redux/slices/mealsSlice';

function Bookmarks() {
  const bookmarkedMeals = useSelector((state) => state.meals.bookmarkedMeals);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMealClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  return (
    <div className="space-y-6 px-4">
      <h2 className="text-2xl font-bold">Bookmarked Meals</h2>

      {bookmarkedMeals.length === 0 ? (
        <div className="text-center text-gray-600 py-8">
          <p className="text-lg">No bookmarked meals yet</p>
          <p className="text-sm mt-2">Save your favorite meals for quick access</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedMeals.map((meal) => (
            <div
              key={meal.id}
              className="card hover:shadow-lg transition-shadow cursor-pointer"
            >
              {meal.image && (
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="w-full h-48 object-cover rounded-t-xl -mt-6 -mx-6 mb-4"
                />
              )}
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">{meal.name}</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(toggleBookmark(meal));
                    }}
                    className="text-primary"
                  >
                    ★
                  </button>
                </div>
                
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">Calories: {meal.calories} kcal</p>
                  <p className="text-sm text-gray-600">Protein: {meal.protein}g</p>
                  <p className="text-sm text-gray-600">Carbs: {meal.carbs}g</p>
                  <p className="text-sm text-gray-600">Fat: {meal.fat}g</p>
                </div>

                <button
                  onClick={() => handleMealClick(meal.recipeId)}
                  className="mt-4 w-full btn btn-primary"
                >
                  View Recipe
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Bookmarks;