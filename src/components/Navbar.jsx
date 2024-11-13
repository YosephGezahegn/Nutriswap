import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, BookOpenIcon, CakeIcon, ChartBarIcon, UserGroupIcon, BookmarkIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/home', icon: HomeIcon, label: 'Home' },
    { path: '/food-log', icon: BookOpenIcon, label: 'Food Log' },
    { path: '/meal-suggestions', icon: CakeIcon, label: 'Meals' },
    { path: '/progress', icon: ChartBarIcon, label: 'Progress' },
    { path: '/community', icon: UserGroupIcon, label: 'Community' },
    { path: '/bookmarks', icon: BookmarkIcon, label: 'Bookmarks' },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:block bg-white shadow-md">
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

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-5 gap-1">
          {navItems.slice(0, 5).map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center justify-center py-2
                ${location.pathname === path 
                  ? 'text-primary' 
                  : 'text-gray-600'
                }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs mt-1">{label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <div className="md:hidden flex justify-between items-center px-4 h-14 bg-white shadow-md">
        <Link to="/home" className="text-lg font-bold text-primary">
          NutriSwap
        </Link>
        <Link to="/auth" className="text-sm btn btn-primary py-1 px-3">
          Sign In
        </Link>
      </div>

      {/* Add bottom padding to main content on mobile */}
      <style jsx global>{`
        @media (max-width: 768px) {
          main {
            padding-bottom: 4rem !important;
          }
        }
      `}</style>
    </>
  );
}

export default Navbar;