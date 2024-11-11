import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

function Home() {
  const [dailyStats, setDailyStats] = useState({
    goals: {
      calories: 2000,
      protein: 150,
      carbs: 250,
      fat: 70,
    },
    intake: {
      calories: 1450,
      protein: 95,
      carbs: 180,
      fat: 45,
    },
  });

  const mockData = [
    { day: 'Mon', calories: 2100 },
    { day: 'Tue', calories: 1950 },
    { day: 'Wed', calories: 2200 },
    { day: 'Thu', calories: 2000 },
    { day: 'Fri', calories: 1800 },
  ];

  const MacroCard = ({ title, current, goal, unit = 'g', color }) => (
    <div className="card">
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
        <span className="font-bold text-gray-700">{goal - current}{unit}</span>
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Daily Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MacroCard
          title="Calories"
          current={dailyStats.intake.calories}
          goal={dailyStats.goals.calories}
          unit="kcal"
          color="primary"
        />
        <MacroCard
          title="Protein"
          current={dailyStats.intake.protein}
          goal={dailyStats.goals.protein}
          color="blue-500"
        />
        <MacroCard
          title="Carbohydrates"
          current={dailyStats.intake.carbs}
          goal={dailyStats.goals.carbs}
          color="yellow-500"
        />
        <MacroCard
          title="Fat"
          current={dailyStats.intake.fat}
          goal={dailyStats.goals.fat}
          color="green-500"
        />
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Weekly Progress</h3>
        <LineChart width={800} height={300} data={mockData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="calories" stroke="#FF6B6B" />
        </LineChart>
      </div>

      <div className="card">
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