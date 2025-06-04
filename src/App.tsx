import React, { useState } from 'react';
import Header from './components/Header';
import MapContainer from './components/MapContainer';
import Sidebar from './components/Sidebar';
import { MapProvider } from './context/MapContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [selectedVI, setSelectedVI] = useState<'ndvi' | 'savi'>('ndvi');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
    end: new Date()
  });
  
  return (
    <ThemeProvider>
      <MapProvider>
        <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
          <Header />
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            <Sidebar 
              selectedVI={selectedVI}
              setSelectedVI={setSelectedVI}
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
            <main className="flex-1 overflow-hidden">
              <MapContainer 
                selectedVI={selectedVI}
                dateRange={dateRange}
              />
            </main>
          </div>
        </div>
      </MapProvider>
    </ThemeProvider>
  );
}

export default App;