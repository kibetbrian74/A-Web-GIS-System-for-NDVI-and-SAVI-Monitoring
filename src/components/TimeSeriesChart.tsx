import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { useMap } from '../context/MapContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TimeSeriesChart: React.FC = () => {
  const { viData } = useMap();

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        min: -0.2,
        max: 1,
        title: {
          display: true,
          text: 'Index Value',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  const data = {
    labels: viData?.timeSeries?.dates || [],
    datasets: [
      {
        label: 'NDVI',
        data: viData?.timeSeries?.ndvi || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.3,
      },
      {
        label: 'SAVI',
        data: viData?.timeSeries?.savi || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="h-64 w-full">
      <Line options={options} data={data} />
    </div>
  );
};

export default TimeSeriesChart;