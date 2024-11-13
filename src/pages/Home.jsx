import React from 'react';
import { useSelector } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Home() {
  const meals = useSelector((state) => state.meals.meals);
  const weeklyProgress = useSelector((state) => state.meals.weeklyProgress);

  const DAILY_GOALS = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 70,
  };

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

  const MacroCard = ({ title, current, goal, unit = 'g', category }) => {
    const percentage = Math.min((current / goal) * 100, 100);
    const getColor = () => {
      if (percentage > 100) return 'red';
      if (percentage > 80) return 'orange';
      return '#10B981';
    };

    return (
      <div className="card p-4 rounded-md shadow-md">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <span className="text-sm text-gray-500">{category}</span>
        </div>
        
        <div className="relative pt-8">
          <svg className="w-32 h-32 mx-auto" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#f3f4f6"
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
              fill={getColor()}
            >
              {Math.round(percentage)}%
            </text>
          </svg>
          
          <div className="mt-4 text-center">
            <div className="text-sm text-gray-600">
              {current}/{goal}{unit}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 px-2 md:px-4">
      <h2 className="text-2xl font-bold">Daily Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MacroCard
          title="Calories"
          current={currentTotals.calories}
          goal={DAILY_GOALS.calories}
          unit="kcal"
          category="Energy"
        />
        <MacroCard
          title="Protein"
          current={currentTotals.protein}
          goal={DAILY_GOALS.protein}
          category="Macros"
        />
        <MacroCard
          title="Carbohydrates"
          current={currentTotals.carbs}
          goal={DAILY_GOALS.carbs}
          category="Macros"
        />
        <MacroCard
          title="Fat"
          current={currentTotals.fat}
          goal={DAILY_GOALS.fat}
          category="Macros"
        />
      </div>

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