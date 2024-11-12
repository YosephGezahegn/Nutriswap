import React from 'react';
import { useSelector } from 'react-redux';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function Progress() {
  const meals = useSelector((state) => state.meals.meals);
  const weeklyProgress = useSelector((state) => state.meals.weeklyProgress);

  // Calculate daily averages
  const calculateDailyAverages = () => {
    const totalMeals = Object.values(meals).flat().length;
    if (totalMeals === 0) return { calories: 0, completion: 0, streak: 0 };

    const totals = Object.values(meals).flat().reduce(
      (acc, meal) => ({
        calories: acc.calories + (Number(meal.calories) || 0),
      }),
      { calories: 0 }
    );

    return {
      calories: Math.round(totals.calories / 7),
      completion: 85, // Example completion rate
      streak: totalMeals > 0 ? Math.min(totalMeals, 7) : 0,
    };
  };

  const dailyAverages = calculateDailyAverages();

  // Transform meals data for the charts
  const transformMealsData = () => {
    const macroData = Object.values(meals).flat().reduce(
      (acc, meal) => {
        acc.protein += Number(meal.protein) || 0;
        acc.carbs += Number(meal.carbs) || 0;
        acc.fat += Number(meal.fat) || 0;
        return acc;
      },
      { protein: 0, carbs: 0, fat: 0 }
    );

    return [macroData];
  };

  const macroData = transformMealsData();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Progress Dashboard</h2>

      {/* Calorie Intake Line Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Calorie Intake</h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="calories" stroke="#FF6B6B" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Macronutrients Bar Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Macronutrients</h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={macroData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="protein" fill="#4ECDC4" />
              <Bar dataKey="carbs" fill="#FFE66D" />
              <Bar dataKey="fat" fill="#FF6B6B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Progress Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Average Daily Calories</h3>
          <div className="text-3xl font-bold text-primary">{dailyAverages.calories}</div>
          <div className="text-sm text-gray-600">Last 7 days</div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Goal Achievement</h3>
          <div className="text-3xl font-bold text-secondary">{dailyAverages.completion}%</div>
          <div className="text-sm text-gray-600">This week</div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Streak</h3>
          <div className="text-3xl font-bold text-gray-700">{dailyAverages.streak} days</div>
          <div className="text-sm text-gray-600">Keep it up!</div>
        </div>
      </div>
    </div>
  );
}

export default Progress;