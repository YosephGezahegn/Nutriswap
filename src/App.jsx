import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { useSelector } from 'react-redux';

import Navbar from './components/Navbar';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import FoodLog from './pages/FoodLog';
import MealSuggestions from './pages/MealSuggestions';
import Progress from './pages/Progress';
import Community from './pages/Community';
import Auth from './pages/Auth';
import RecipeDetail from './pages/RecipeDetail';
import Bookmarks from './pages/Bookmarks';

function AppContent() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'dark bg-gray-900' : 'bg-background'
    }`}>
      <Router>
        <Navbar />
        <main className="container mx-auto px-0 md:px-4 py-8 md:py-8 max-w-6xl">
          <Routes>
            <Route path="/" element={<Onboarding />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/home" element={<Home />} />
            <Route path="/food-log" element={<FoodLog />} />
            <Route path="/meal-suggestions" element={<MealSuggestions />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/community" element={<Community />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;