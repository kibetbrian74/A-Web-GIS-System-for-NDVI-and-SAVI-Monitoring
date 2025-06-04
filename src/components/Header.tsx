import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { MapIcon, Sun, Moon } from 'lucide-react';

const Header: React.FC = () => {
  const { darkMode, toggleTheme } = useTheme();
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md py-3 px-4 transition-colors duration-300">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MapIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
            Web GIS System for NDVI & SAVI Monitoring
          </h1>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? (
            <Sun className="h-5 w-5 text-yellow-400" />
          ) : (
            <Moon className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;