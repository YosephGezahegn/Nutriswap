import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
  LineChart,
  Line,
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
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const DAILY_GOAL = useSelector((state) => state.dailyStats.goals.calories);

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
      completion: 85,
      streak: totalMeals > 0 ? Math.min(totalMeals, 7) : 0,
    };
  };

  const dailyAverages = calculateDailyAverages();

  // Custom tile content for calendar
  const tileContent = ({ date }) => {
    const dayProgress = weeklyProgress[date.getDay()];
    if (!dayProgress) return null;

    const percentage = (dayProgress.calories / DAILY_GOAL) * 100;
    const color = percentage > 100 ? 'bg-red-500' : 'bg-green-500';

    return (
      <div className="mt-1">
        <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded">
          <div
            className={`h-full ${color} rounded`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 px-4">
      <h2 className="text-2xl font-bold dark:text-gray-200">Progress Dashboard</h2>

      {/* Calendar View */}
      <div className="card dark:bg-gray-800">
        <h3 className="text-lg font-semibold mb-4 dark:text-gray-200">Calendar View</h3>
        <div className="calendar-container">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={tileContent}
            className={`w-full rounded-lg shadow-sm ${
              isDarkMode ? 'dark-calendar' : ''
            }`}
          />
        </div>
        <style jsx global>{`
          .react-calendar {
            border: none;
            background: transparent;
          }
          .dark-calendar {
            color: #e5e5e5;
          }
          .dark-calendar .react-calendar__tile {
            color: #e5e5e5;
            background: transparent;
          }
          .dark-calendar .react-calendar__tile:enabled:hover,
          .dark-calendar .react-calendar__tile:enabled:focus {
            background-color: #374151;
          }
          .dark-calendar .react-calendar__tile--active {
            background: #FF6B6B !important;
            color: white;
          }
          .dark-calendar .react-calendar__month-view__weekdays {
            color: #9ca3af;
          }
          .dark-calendar .react-calendar__navigation button {
            color: #e5e5e5;
          }
          .dark-calendar .react-calendar__navigation button:enabled:hover,
          .dark-calendar .react-calendar__navigation button:enabled:focus {
            background-color: #374151;
          }
          @media (max-width: 640px) {
            .react-calendar {
              font-size: 0.875rem;
            }
            .react-calendar__tile {
              padding: 0.5em 0.25em;
            }
          }
        `}</style>
      </div>

      {/* Calorie Intake Line Chart */}
      <div className="card dark:bg-gray-800">
        <h3 className="text-lg font-semibold mb-4 dark:text-gray-200">Weekly Calorie Intake</h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="day" stroke={isDarkMode ? '#9ca3af' : '#4b5563'} />
              <YAxis stroke={isDarkMode ? '#9ca3af' : '#4b5563'} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                  borderColor: isDarkMode ? '#374151' : '#e5e7eb',
                  color: isDarkMode ? '#e5e5e5' : '#000000'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="calories" stroke="#FF6B6B" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Progress Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">Average Daily Calories</h3>
          <div className="text-3xl font-bold text-primary dark:text-dark-primary">
            {dailyAverages.calories}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Last 7 days</div>
        </div>
        
        <div className="card dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">Goal Achievement</h3>
          <div className="text-3xl font-bold text-secondary dark:text-dark-secondary">
            {dailyAverages.completion}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">This week</div>
        </div>
        
        <div className="card dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">Streak</h3>
          <div className="text-3xl font-bold text-gray-700 dark:text-gray-300">
            {dailyAverages.streak} days
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Keep it up!</div>
        </div>
      </div>
    </div>
  );
}

export default Progress;