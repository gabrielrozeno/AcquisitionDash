'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AdSpend {
  date: string;
  platform: string;
  spend: number;
  leads: number;
  ftds: number;
  registrations: number;
}

interface DashboardGraphsProps {
  startDate?: string;
  endDate?: string;
}

export default function DashboardGraphs({ startDate, endDate }: DashboardGraphsProps) {
  const [data, setData] = useState<AdSpend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        
        const url = `/api/adspend?${params.toString()}`;
        const response = await fetch(url);
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Process data for charts
  const platforms = [...new Set(data.map(item => item.platform))];
  const dates = [...new Set(data.map(item => item.date))].sort();

  // FTD Chart Data
  const ftdData = {
    labels: platforms,
    datasets: [{
      label: 'FTDs per Platform',
      data: platforms.map(platform => 
        data.filter(item => item.platform === platform)
          .reduce((sum, item) => sum + item.ftds, 0)
      ),
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
        'rgba(255, 159, 64, 0.5)',
        'rgba(199, 199, 199, 0.5)',
        'rgba(83, 102, 255, 0.5)',
        'rgba(40, 159, 64, 0.5)',
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 206, 86)',
        'rgb(75, 192, 192)',
        'rgb(153, 102, 255)',
        'rgb(255, 159, 64)',
        'rgb(199, 199, 199)',
        'rgb(83, 102, 255)',
        'rgb(40, 159, 64)',
      ],
      borderWidth: 1,
    }],
  };

  // Registration Chart Data
  const registrationData = {
    labels: platforms,
    datasets: [{
      label: 'Registrations per Platform',
      data: platforms.map(platform => 
        data.filter(item => item.platform === platform)
          .reduce((sum, item) => sum + item.registrations, 0)
      ),
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
        'rgba(255, 159, 64, 0.5)',
        'rgba(199, 199, 199, 0.5)',
        'rgba(83, 102, 255, 0.5)',
        'rgba(40, 159, 64, 0.5)',
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 206, 86)',
        'rgb(75, 192, 192)',
        'rgb(153, 102, 255)',
        'rgb(255, 159, 64)',
        'rgb(199, 199, 199)',
        'rgb(83, 102, 255)',
        'rgb(40, 159, 64)',
      ],
      borderWidth: 1,
    }],
  };

  // Financial Chart Data
  const financialData = {
    labels: platforms,
    datasets: [
      {
        label: 'Spend',
        data: platforms.map(platform => 
          data.filter(item => item.platform === platform)
            .reduce((sum, item) => sum + item.spend, 0)
        ),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1,
      },
      {
        label: 'Registrations',
        data: platforms.map(platform => 
          data.filter(item => item.platform === platform)
            .reduce((sum, item) => sum + item.registrations, 0)
        ),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Platform Performance Metrics',
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Platform Distribution',
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">FTDs per Platform</h2>
        <Pie data={ftdData} options={pieChartOptions} />
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Registrations per Platform</h2>
        <Pie data={registrationData} options={pieChartOptions} />
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Financial Overview</h2>
        <Bar data={financialData} options={chartOptions} />
      </div>
    </div>
  );
} 