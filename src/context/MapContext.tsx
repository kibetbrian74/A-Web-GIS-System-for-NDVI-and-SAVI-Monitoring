import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface DateRange {
  start: Date;
  end: Date;
}

interface MapContextType {
  aoi: any | null;
  setAoi: (aoi: any) => void;
  viData: any | null;
  fetchVIData: (viType: 'ndvi' | 'savi', dateRange: DateRange) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [aoi, setAoi] = useState<any | null>(null);
  const [viData, setViData] = useState<any | null>(null);

  const fetchVIData = useCallback(async (viType: 'ndvi' | 'savi', dateRange: DateRange) => {
    if (!aoi) return;

    try {
      console.log(`Fetching ${viType.toUpperCase()} data for the selected area...`);
      
      // Simulate API call to Earth Engine
      // In a real application, this would call the Earth Engine API
      setTimeout(() => {
        const startDate = dateRange.start.getTime();
        const endDate = dateRange.end.getTime();
        const timeRange = endDate - startDate;
        const numPoints = 12;
        
        // Generate dates within the specified range
        const dates = Array.from({ length: numPoints }, (_, i) => {
          const date = new Date(startDate + (timeRange * i) / (numPoints - 1));
          return date.toISOString().split('T')[0];
        });

        // Generate VI values
        const ndviValues = dates.map(() => Math.random() * 0.6 + 0.2);
        const saviValues = dates.map(() => Math.random() * 0.5 + 0.15);

        // Simulate map bounds based on AOI
        const bounds = [
          [aoi.geometry.coordinates[0][0][1], aoi.geometry.coordinates[0][0][0]],
          [aoi.geometry.coordinates[0][2][1], aoi.geometry.coordinates[0][2][0]]
        ];

        // Create a data URL for the visualization
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          // Create a gradient for the visualization
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          if (viType === 'ndvi') {
            gradient.addColorStop(0, '#d73027');
            gradient.addColorStop(0.2, '#f46d43');
            gradient.addColorStop(0.4, '#fdae61');
            gradient.addColorStop(0.6, '#a6d96a');
            gradient.addColorStop(0.8, '#66bd63');
            gradient.addColorStop(1, '#1a9850');
          } else {
            gradient.addColorStop(0, '#8c510a');
            gradient.addColorStop(0.2, '#bf812d');
            gradient.addColorStop(0.4, '#dfc27d');
            gradient.addColorStop(0.6, '#80cdc1');
            gradient.addColorStop(0.8, '#35978f');
            gradient.addColorStop(1, '#01665e');
          }
          
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Add text overlay
          ctx.fillStyle = 'white';
          ctx.font = 'bold 24px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(`${viType.toUpperCase()} Visualization`, canvas.width / 2, 30);
          
          // Convert canvas to data URL
          const imageUrl = canvas.toDataURL('image/png');

          setViData({
            type: viType,
            imageUrl,
            bounds,
            timeSeries: {
              dates,
              ndvi: ndviValues,
              savi: saviValues
            }
          });
        }
      }, 500);
    } catch (error) {
      console.error('Error fetching vegetation index data:', error);
    }
  }, [aoi]);

  return (
    <MapContext.Provider value={{ aoi, setAoi, viData, fetchVIData }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = (): MapContextType => {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
};