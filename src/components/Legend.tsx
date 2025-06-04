import React from 'react';

interface LegendProps {
  selectedVI: 'ndvi' | 'savi';
}

const Legend: React.FC<LegendProps> = ({ selectedVI }) => {
  const colorGradient = [
    { color: '#d73027', label: '-1.0' },
    { color: '#f46d43', label: '-0.5' },
    { color: '#fdae61', label: '0.0' },
    { color: '#a6d96a', label: '0.3' },
    { color: '#66bd63', label: '0.6' },
    { color: '#1a9850', label: '1.0' },
  ];

  return (
    <div className="absolute bottom-5 right-5 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md z-[1000] max-w-xs">
      <h3 className="text-sm font-medium mb-2">
        {selectedVI === 'ndvi' ? 'NDVI' : 'SAVI'} Legend
      </h3>
      <div className="flex items-center space-x-1">
        <div className="flex h-4 w-full">
          {colorGradient.map((item, index) => (
            <div
              key={index}
              style={{ backgroundColor: item.color }}
              className="flex-1 h-full"
            ></div>
          ))}
        </div>
      </div>
      <div className="flex justify-between mt-1 text-xs">
        {colorGradient.map((item, index) => (
          <div key={index} className="text-center">
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Legend;