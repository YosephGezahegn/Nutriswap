import React, { useState } from 'react';
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
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const DAILY_GOAL = 2000; // calories

  // Generate calendar data
  const generateCalendarData = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
    
    const calendarDays = [];
    let dayCount = 1;
    
    // Generate weeks
    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDayOfMonth) {
          week.push(null);
        } else if (dayCount > daysInMonth) {
          week.push(null);
        } else {
          // Get calories for this day from weeklyProgress
          const dayCalories = weeklyProgress[j]?.calories || 0;
          const difference = dayCalories - DAILY_GOAL;
          
          week.push({
            day: dayCount,
            calories: dayCalories,
            difference: difference,
          });
          dayCount++;
        }
      }
      if (week.some(day => day !== null)) {
        calendarDays.push(week);
      }
    }
    
    return calendarDays;
  };

  const calendarData = generateCalendarData();
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Progress Dashboard</h2>

      {/* Calendar View */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Calendar View</h3>
          <div className="flex space-x-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="rounded-md border-gray-300"
            >
              {months.map((month, index) => (
                <option key={month} value={index}>{month}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="rounded-md border-gray-300"
            >
              {[2023, 2024].map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="font-medium text-gray-600">{day}</div>
          ))}
        </div>

        <div className="grid gap-2">
          {calendarData.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-2">
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`aspect-square p-2 rounded-lg ${
                    day ? 'bg-white shadow-sm' : 'bg-transparent'
                  }`}
                >
                  {day && (
                    <>
                      <div className="font-medium">{day.day}</div>
                      <div className={`text-xs ${
                        day.difference > 0 ? 'text-red-500' : 'text-green-500'
                      }`}>
                        {day.calories}
                        <span className="ml-1">
                          {day.difference > 0 ? `+${day.difference}` : day.difference}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Calorie Intake Line Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Weekly Calorie Intake</h3>
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