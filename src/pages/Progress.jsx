import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function Progress() {
  const weeklyData = [
    { day: 'Mon', calories: 2100, protein: 80, carbs: 250, fat: 70 },
    { day: 'Tue', calories: 1950, protein: 85, carbs: 220, fat: 65 },
    { day: 'Wed', calories: 2200, protein: 90, carbs: 260, fat: 75 },
    { day: 'Thu', calories: 2000, protein: 82, carbs: 240, fat: 68 },
    { day: 'Fri', calories: 1800, protein: 78, carbs: 210, fat: 62 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Progress Dashboard</h2>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Calorie Intake</h3>
        <LineChart width={800} height={300} data={weeklyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="calories" stroke="#FF6B6B" />
        </LineChart>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Macronutrients</h3>
        <BarChart width={800} height={300} data={weeklyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="protein" fill="#4ECDC4" />
          <Bar dataKey="carbs" fill="#FFE66D" />
          <Bar dataKey="fat" fill="#FF6B6B" />
        </BarChart>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Average Daily Calories</h3>
          <div className="text-3xl font-bold text-primary">2,010</div>
          <div className="text-sm text-gray-600">Last 7 days</div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Goal Achievement</h3>
          <div className="text-3xl font-bold text-secondary">85%</div>
          <div className="text-sm text-gray-600">This week</div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Streak</h3>
          <div className="text-3xl font-bold text-gray-700">5 days</div>
          <div className="text-sm text-gray-600">Keep it up!</div>
        </div>
      </div>
    </div>
  );
}

export default Progress; 