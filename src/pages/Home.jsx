import React from 'react';
import { useSelector } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Home() {
  const meals = useSelector((state) => state.meals.meals);
  const weeklyProgress = useSelector((state) => state.meals.weeklyProgress);

  // Daily goals
  const DAILY_GOALS = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 70,
  };

  // Calculate current totals based on the meals in the Redux store
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

  const MacroCard = ({ title, current, goal, unit = 'g' }) => {
    const isOverGoal = current > goal;
    const progressColor = isOverGoal ? 'red-500' : 'green-500';
    const textColor = isOverGoal ? 'text-red-500' : 'text-green-500';

    return (
      <div className="card p-4 rounded-md shadow-md">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Goal</span>
          <span className="font-bold">{goal}{unit}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Intake</span>
          <span className={`font-bold ${textColor}`}>{current || 0}{unit}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Remaining</span>
          <span className={`font-bold ${textColor}`}>
            {isOverGoal ? `+${(current - goal).toFixed(1)}` : (goal - current).toFixed(1)}{unit}
          </span>
        </div>
        <div className="mt-2 bg-gray-200 rounded-full h-2">
          <div
            className={`bg-${progressColor} rounded-full h-2 transition-all duration-300`}
            style={{ width: `${Math.min(((current || 0) / goal) * 100, 100)}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 px-2 md:px-4">
      <h2 className="text-2xl font-bold">Daily Overview</h2>

      {/* Macro Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MacroCard
          title="Calories"
          current={currentTotals.calories}
          goal={DAILY_GOALS.calories}
          unit="kcal"
        />
        <MacroCard
          title="Protein"
          current={currentTotals.protein}
          goal={DAILY_GOALS.protein}
        />
        <MacroCard
          title="Carbohydrates"
          current={currentTotals.carbs}
          goal={DAILY_GOALS.carbs}
        />
        <MacroCard
          title="Fat"
          current={currentTotals.fat}
          goal={DAILY_GOALS.fat}
        />
      </div>

      {/* Weekly Progress Chart */}
      <div className="card p-4 rounded-md shadow-md">
        <h3 className="text-lg font-semibold mb-4">Weekly Progress</h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="calories" stroke="#FF6B6B" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Home;