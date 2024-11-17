import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BookmarkIcon, PencilIcon } from '@heroicons/react/24/outline';
import { setGoals } from '../redux/slices/dailyStatsSlice';

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const meals = useSelector((state) => state.meals.meals);
  const weeklyProgress = useSelector((state) => state.meals.weeklyProgress);
  const bookmarkedMeals = useSelector((state) => state.meals.bookmarkedMeals);
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const goals = useSelector((state) => state.dailyStats.goals);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [tempGoals, setTempGoals] = useState(goals);

  const calculateCurrentTotals = () => {
    const totals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    };

    Object.values(meals).forEach((mealType) => {
      mealType.forEach((meal) => {
        totals.calories += Number(meal.calories) || 0;
        totals.protein += Number(meal.protein) || 0;
        totals.carbs += Number(meal.carbs) || 0;
        totals.fat += Number(meal.fat) || 0;
      });
    });

    return totals;
  };

  const currentTotals = calculateCurrentTotals();

  const handleSaveGoals = () => {
    dispatch(setGoals(tempGoals));
    setShowGoalsModal(false);
  };

  const MacroCard = ({ title, current, goal, unit = 'g', category }) => {
    const percentage = Math.min((current / goal) * 100, 100);
    const getColor = () => {
      return current > goal ? 'red' : '#10B981';
    };

    return (
      <div className="card p-4 rounded-md shadow-md dark:bg-gray-800">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold dark:text-gray-200">{title}</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {category}
          </span>
        </div>

        <div className="relative pt-8">
          <svg className="w-32 h-32 mx-auto" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={isDarkMode ? '#374151' : '#f3f4f6'}
              strokeWidth="10"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={getColor()}
              strokeWidth="10"
              strokeDasharray={`${percentage * 2.83} 283`}
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dasharray 0.5s ease' }}
            />
            <text
              x="50"
              y="50"
              textAnchor="middle"
              dy="0.3em"
              className="text-2xl font-bold"
              fill={isDarkMode ? '#e5e5e5' : getColor()}
            >
              {Math.round(percentage)}%
            </text>
          </svg>

          <div className="mt-4 text-center">
            <div className="text-sm dark:text-gray-300">
              {current || 0}/{goal}
              {unit}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 px-2 md:px-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-gray-200">
          Daily Overview
        </h2>
        <button
          onClick={() => setShowGoalsModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <PencilIcon className="h-4 w-4" />
          Edit Goals
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MacroCard
          title="Calories"
          current={currentTotals.calories}
          goal={goals.calories}
          unit="kcal"
          category="Energy"
        />
        <MacroCard
          title="Protein"
          current={currentTotals.protein}
          goal={goals.protein}
          category="Macros"
        />
        <MacroCard
          title="Carbs"
          current={currentTotals.carbs}
          goal={goals.carbs}
          category="Macros"
        />
        <MacroCard
          title="Fat"
          current={currentTotals.fat}
          goal={goals.fat}
          category="Macros"
        />
      </div>

      <div className="card dark:bg-gray-800">
        <h3 className="text-lg font-semibold mb-4 dark:text-gray-200">
          Weekly Progress
        </h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyProgress}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDarkMode ? '#374151' : '#e5e7eb'}
              />
              <XAxis
                dataKey="day"
                stroke={isDarkMode ? '#9ca3af' : '#4b5563'}
              />
              <YAxis stroke={isDarkMode ? '#9ca3af' : '#4b5563'} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                  borderColor: isDarkMode ? '#374151' : '#e5e7eb',
                  color: isDarkMode ? '#e5e5e5' : '#000000',
                }}
              />
              <Line
                type="monotone"
                dataKey="calories"
                stroke={isDarkMode ? '#FF8585' : '#FF6B6B'}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Goals Modal */}
      {showGoalsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 dark:text-gray-200">
              Set Daily Goals
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Daily Calories (kcal)
                </label>
                <input
                  type="number"
                  value={tempGoals.calories}
                  onChange={(e) =>
                    setTempGoals({
                      ...tempGoals,
                      calories: Number(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
                           dark:bg-gray-700 dark:text-gray-200 shadow-sm focus:border-primary 
                           focus:ring focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Protein Goal (g)
                </label>
                <input
                  type="number"
                  value={tempGoals.protein}
                  onChange={(e) =>
                    setTempGoals({
                      ...tempGoals,
                      protein: Number(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
                           dark:bg-gray-700 dark:text-gray-200 shadow-sm focus:border-primary 
                           focus:ring focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Carbs Goal (g)
                </label>
                <input
                  type="number"
                  value={tempGoals.carbs}
                  onChange={(e) =>
                    setTempGoals({
                      ...tempGoals,
                      carbs: Number(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
                           dark:bg-gray-700 dark:text-gray-200 shadow-sm focus:border-primary 
                           focus:ring focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Fat Goal (g)
                </label>
                <input
                  type="number"
                  value={tempGoals.fat}
                  onChange={(e) =>
                    setTempGoals({ ...tempGoals, fat: Number(e.target.value) })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
                           dark:bg-gray-700 dark:text-gray-200 shadow-sm focus:border-primary 
                           focus:ring focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="mt-6 flex space-x-4">
              <button
                onClick={handleSaveGoals}
                className="btn btn-primary flex-1"
              >
                Save Goals
              </button>
              <button
                onClick={() => setShowGoalsModal(false)}
                className="btn bg-gray-200 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 
                         dark:hover:bg-gray-600 flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bookmarked Meals Section */}
      <div className="card dark:bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold dark:text-gray-200">
            Bookmarked Meals
          </h3>
          <BookmarkIcon className="h-5 w-5 text-primary dark:text-dark-primary" />
        </div>

        {bookmarkedMeals.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">
            No bookmarked meals yet. Save your favorite meals for quick access!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookmarkedMeals.slice(0, 4).map((meal) => (
              <div
                key={meal.id}
                onClick={() => navigate(`/recipe/${meal.recipeId}`)}
                className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 
                         cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                {meal.image && (
                  <img
                    src={meal.image}
                    alt={meal.name}
                    className="w-16 h-16 rounded-md object-cover"
                  />
                )}
                <div>
                  <h4 className="font-medium dark:text-gray-200">
                    {meal.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {meal.calories} kcal | {meal.protein}g protein
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {bookmarkedMeals.length > 4 && (
          <button
            onClick={() => navigate('/bookmarks')}
            className="mt-4 text-primary dark:text-dark-primary hover:underline text-sm w-full text-center"
          >
            View all bookmarked meals ({bookmarkedMeals.length})
          </button>
        )}
      </div>
    </div>
  );
}

export default Home;
