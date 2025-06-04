import React, { useState } from 'react';
import { Calendar, LineChart, Info, Layers } from 'lucide-react';
import TimeSeriesChart from './TimeSeriesChart';
import { useMap } from '../context/MapContext';

interface SidebarProps {
  selectedVI: 'ndvi' | 'savi';
  setSelectedVI: (vi: 'ndvi' | 'savi') => void;
  dateRange: {
    start: Date;
    end: Date;
  };
  setDateRange: (range: { start: Date; end: Date }) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedVI,
  setSelectedVI,
  dateRange,
  setDateRange,
}) => {
  const { viData, aoi } = useMap();
  const [activeTab, setActiveTab] = useState<'layers' | 'time' | 'info'>('layers');
  
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'start' | 'end') => {
    const newDate = new Date(event.target.value);
    setDateRange({
      ...dateRange,
      [type]: newDate,
    });
  };

  return (
    <aside className="w-full md:w-80 bg-white dark:bg-gray-800 shadow-lg flex flex-col transition-colors duration-300">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold">Analysis Tools</h2>
      </div>

      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          className={`flex-1 py-2 flex justify-center items-center gap-1 ${
            activeTab === 'layers'
              ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          onClick={() => setActiveTab('layers')}
        >
          <Layers className="h-4 w-4" />
          <span>Layers</span>
        </button>
        <button
          className={`flex-1 py-2 flex justify-center items-center gap-1 ${
            activeTab === 'time'
              ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          onClick={() => setActiveTab('time')}
        >
          <LineChart className="h-4 w-4" />
          <span>Time Series</span>
        </button>
        <button
          className={`flex-1 py-2 flex justify-center items-center gap-1 ${
            activeTab === 'info'
              ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          onClick={() => setActiveTab('info')}
        >
          <Info className="h-4 w-4" />
          <span>Info</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'layers' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-md font-medium mb-2">Vegetation Indices</h3>
              <div className="flex flex-col gap-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="vi"
                    value="ndvi"
                    checked={selectedVI === 'ndvi'}
                    onChange={() => setSelectedVI('ndvi')}
                    className="form-radio h-4 w-4 text-green-600"
                  />
                  <span>NDVI (Normalized Difference Vegetation Index)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="vi"
                    value="savi"
                    checked={selectedVI === 'savi'}
                    onChange={() => setSelectedVI('savi')}
                    className="form-radio h-4 w-4 text-green-600"
                  />
                  <span>SAVI (Soil-Adjusted Vegetation Index)</span>
                </label>
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-2">Date Range</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <label className="w-20">Start Date:</label>
                  <input
                    type="date"
                    value={formatDate(dateRange.start)}
                    onChange={(e) => handleDateChange(e, 'start')}
                    className="border rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <label className="w-20">End Date:</label>
                  <input
                    type="date"
                    value={formatDate(dateRange.end)}
                    onChange={(e) => handleDateChange(e, 'end')}
                    className="border rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                Draw a polygon or rectangle on the map to define your Area of Interest (AOI).
              </p>
            </div>
          </div>
        )}

        {activeTab === 'time' && (
          <div>
            <h3 className="text-md font-medium mb-4">Time Series Analysis</h3>
            {aoi ? (
              <TimeSeriesChart />
            ) : (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  Please define an Area of Interest (AOI) on the map to view time series data.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'info' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-md font-medium mb-2">About Vegetation Indices</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium">NDVI</h4>
                  <p>
                    Normalized Difference Vegetation Index measures vegetation health using the
                    difference between near-infrared (NIR) and red light reflection.
                  </p>
                  <p className="mt-1 font-mono bg-gray-100 dark:bg-gray-700 p-1 rounded">
                    NDVI = (NIR - RED) / (NIR + RED)
                  </p>
                  <p className="mt-1">Range: -1 to 1, with higher values indicating healthier vegetation.</p>
                </div>
                
                <div>
                  <h4 className="font-medium">SAVI</h4>
                  <p>
                    Soil-Adjusted Vegetation Index minimizes soil brightness influences in areas with
                    low vegetation cover.
                  </p>
                  <p className="mt-1 font-mono bg-gray-100 dark:bg-gray-700 p-1 rounded">
                    SAVI = (NIR - RED) / (NIR + RED + L) × (1 + L)
                  </p>
                  <p className="mt-1">
                    Where L is a soil brightness correction factor (typically 0.5).
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-md font-medium mb-2">How to Use</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Draw an Area of Interest (AOI) on the map using the drawing tools.</li>
                <li>Select either NDVI or SAVI to visualize on the map.</li>
                <li>Adjust the date range to analyze different time periods.</li>
                <li>View the time series charts to monitor vegetation health over time.</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;