import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, BookOpenIcon, CakeIcon, ChartBarIcon, UserGroupIcon, DocumentTextIcon } from '@heroicons/react/24/outline'; // Replaced ReceiptTaxIcon with DocumentTextIcon

function Navbar() {
  const location = useLocation();
  
  const navItems = [
    { path: '/home', icon: HomeIcon, label: 'Home' },
    { path: '/food-log', icon: BookOpenIcon, label: 'Food Log' },
    { path: '/meal-suggestions', icon: CakeIcon, label: 'Meals' },
    { path: '/progress', icon: ChartBarIcon, label: 'Progress' },
    { path: '/community', icon: UserGroupIcon, label: 'Community' },
    { path: '/recipe/1', icon: DocumentTextIcon, label: 'Recipe Detail' },  // Updated Recipe Detail Link with DocumentTextIcon
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/home" className="text-xl font-bold text-primary">
            NutriSwap
          </Link>
          
          <div className="flex space-x-4">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium
                  ${location.pathname === path 
                    ? 'text-primary bg-primary/10' 
                    : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                  }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          <Link to="/auth" className="btn btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;