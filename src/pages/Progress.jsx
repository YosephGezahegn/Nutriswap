import { useSelector } from 'react-redux';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Progress() {
  // Fetch weekly progress data from the Redux store
  const weeklyData = useSelector((state) => state.progress.weeklyData);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Progress Dashboard</h2>

      {/* Calorie Intake Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Calorie Intake</h3>
        <ResponsiveContainer width="100%" aspect={2}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="calories" stroke="#FF6B6B" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Macronutrients Bar Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Macronutrients</h3>
        <ResponsiveContainer width="100%" aspect={2}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="protein" fill="#4ECDC4" />
            <Bar dataKey="carbs" fill="#FFE66D" />
            <Bar dataKey="fat" fill="#FF6B6B" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Average Daily Calories</h3>
          <div className="text-3xl font-bold text-primary">
            {weeklyData.length > 0
              ? Math.round(
                  weeklyData.reduce((sum, day) => sum + day.calories, 0) / weeklyData.length
                )
              : 0}
          </div>
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