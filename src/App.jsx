import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Onboarding from './pages/Onboarding.jsx';
import Home from './pages/Home.jsx';
import FoodLog from './pages/FoodLog.jsx';
import MealSuggestions from './pages/MealSuggestions.jsx';
import Progress from './pages/Progress.jsx';
import Community from './pages/Community.jsx';
import Auth from './pages/Auth.jsx';
import RecipeDetail from './pages/RecipeDetail.jsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Onboarding />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/home" element={<Home />} />
            <Route path="/food-log" element={<FoodLog />} />
            <Route path="/meal-suggestions" element={<MealSuggestions />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/community" element={<Community />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} /> {/* Added route for RecipeDetail */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;