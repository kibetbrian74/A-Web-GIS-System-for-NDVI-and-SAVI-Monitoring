import React, { useEffect, useState } from 'react';
import { MapContainer as LeafletMapContainer, TileLayer, FeatureGroup, ImageOverlay } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { useMap } from '../context/MapContext';
import Legend from './Legend';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw'; // Add this import to properly initialize L.drawLocal

// Initialize Leaflet icon images
import { icon } from 'leaflet';
import { setIcons } from '../utils/leafletIconFix';

// This is needed to fix Leaflet icons issue with webpack/vite
setIcons();

interface MapContainerProps {
  selectedVI: 'ndvi' | 'savi';
  dateRange: {
    start: Date;
    end: Date;
  };
}

const MapContainer: React.FC<MapContainerProps> = ({ selectedVI, dateRange }) => {
  const { setAoi, fetchVIData, viData, aoi } = useMap();
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (mapLoaded && aoi) {
      fetchVIData(selectedVI, dateRange);
    }
  }, [selectedVI, dateRange.start, dateRange.end, mapLoaded, aoi, fetchVIData]);

  // Handler for when drawing is created
  const onCreated = (e: any) => {
    const { layerType, layer } = e;
    if (layerType === 'polygon' || layerType === 'rectangle') {
      const drawnGeoJSON = layer.toGeoJSON();
      setAoi(drawnGeoJSON);
    }
  };

  const handleExport = () => {
    if (!viData?.imageUrl) return;
    
    const link = document.createElement('a');
    link.href = viData.imageUrl;
    link.download = `${selectedVI}_${dateRange.start.toISOString().split('T')[0]}_${dateRange.end.toISOString().split('T')[0]}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative h-full w-full">
      <LeafletMapContainer
        center={[0, 0]}
        zoom={2}
        className="h-full w-full"
        whenReady={() => setMapLoaded(true)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FeatureGroup>
          <EditControl
            position="topright"
            draw={{
              rectangle: true,
              polygon: true,
              polyline: false,
              circle: false,
              circlemarker: false,
              marker: false,
            }}
            edit={{
              edit: {},
              remove: true,
            }}
            onCreated={onCreated}
          />
        </FeatureGroup>
        {viData?.imageUrl && viData?.bounds && (
          <ImageOverlay
            url={viData.imageUrl}
            bounds={viData.bounds}
            opacity={0.7}
          />
        )}
      </LeafletMapContainer>
      <Legend selectedVI={selectedVI} />
      {viData?.imageUrl && (
        <button
          onClick={handleExport}
          className="absolute top-4 right-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-[1000]"
        >
          Export Map
        </button>
      )}
    </div>
  );
};

export default MapContainer;