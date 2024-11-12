import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, BookOpenIcon, CakeIcon, ChartBarIcon, UserGroupIcon, DocumentTextIcon, MenuIcon, XIcon } from '@heroicons/react/24/outline';
import { toggleMenu, closeMenu } from '../redux/slices/navbarSlice';

function Navbar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const isMenuOpen = useSelector((state) => state.navbar.isMenuOpen);

  const navItems = [
    { path: '/home', icon: HomeIcon, label: 'Home' },
    { path: '/food-log', icon: BookOpenIcon, label: 'Food Log' },
    { path: '/meal-suggestions', icon: CakeIcon, label: 'Meals' },
    { path: '/progress', icon: ChartBarIcon, label: 'Progress' },
    { path: '/community', icon: UserGroupIcon, label: 'Community' },
    { path: '/recipe/1', icon: DocumentTextIcon, label: 'Recipe Detail' },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/home" className="text-xl font-bold text-primary">
            NutriSwap
          </Link>

          {/* Hamburger Button for Mobile View */}
          <div className="md:hidden">
            <button
              className="text-primary hover:text-primary-dark focus:outline-none"
              onClick={() => dispatch(toggleMenu())}
            >
              {isMenuOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Navbar Links - Hidden on Mobile, Shown on Medium+ Screens */}
          <div className="hidden md:flex space-x-4">
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

          {/* Sign In Button - Hidden on Mobile, Shown on Medium+ Screens */}
          <div className="hidden md:block">
            <Link to="/auth" className="btn btn-primary">
              Sign In
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="flex flex-col space-y-2 mt-2">
              {navItems.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => dispatch(closeMenu())} // Close menu on link click
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

              {/* Sign In Button */}
              <Link
                to="/auth"
                onClick={() => dispatch(closeMenu())} // Close menu on link click
                className="btn btn-primary w-full text-center mt-2"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;