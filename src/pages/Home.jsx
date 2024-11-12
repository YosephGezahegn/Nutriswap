import { useSelector } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Home() {
  const meals = useSelector((state) => state.meals);
  const weeklyProgress = useSelector((state) => state.weeklyProgress);

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

    Object.values(meals).flat().forEach((meal) => {
      totals.calories += meal.calories;
      totals.protein += meal.protein;
      totals.carbs += meal.carbs;
      totals.fat += meal.fat;
    });

    return totals;
  };

  const currentTotals = calculateCurrentTotals();

  const MacroCard = ({ title, current, goal, unit = 'g', color }) => (
    <div className="card p-4 rounded-md shadow-md">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-600">Goal</span>
        <span className="font-bold">{goal}{unit}</span>
      </div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-600">Intake</span>
        <span className={`font-bold text-${color}`}>{current}{unit}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Remaining</span>
        <span className="font-bold text-gray-700">{Math.max(goal - current, 0)}{unit}</span>
      </div>
      <div className="mt-2 bg-gray-200 rounded-full h-2">
        <div
          className={`bg-${color} rounded-full h-2`}
          style={{ width: `${Math.min((current / goal) * 100, 100)}%` }}
        />
      </div>
    </div>
  );

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
          color="primary"
        />
        <MacroCard
          title="Protein"
          current={currentTotals.protein}
          goal={DAILY_GOALS.protein}
          color="blue-500"
        />
        <MacroCard
          title="Carbohydrates"
          current={currentTotals.carbs}
          goal={DAILY_GOALS.carbs}
          color="yellow-500"
        />
        <MacroCard
          title="Fat"
          current={currentTotals.fat}
          goal={DAILY_GOALS.fat}
          color="green-500"
        />
      </div>

      {/* Weekly Progress Chart */}
      <div className="card p-4 rounded-md shadow-md">
        <h3 className="text-lg font-semibold mb-4">Weekly Progress</h3>
        <div className="w-full" style={{ minWidth: "0" }}>
          <ResponsiveContainer width="100%" aspect={2}>
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

      {/* Today's Recommendations */}
      <div className="card p-4 rounded-md shadow-md">
        <h3 className="text-lg font-semibold mb-4">Today's Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium">Breakfast</h4>
            <p className="text-gray-600">Oatmeal with fruits and nuts</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium">Lunch</h4>
            <p className="text-gray-600">Grilled chicken salad</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;