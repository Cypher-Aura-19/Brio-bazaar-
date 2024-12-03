import React from 'react';
import { Pie, Line } from 'react-chartjs-2';
import 'chart.js/auto';

const AdminStatsChart = ({ stats }) => {
  // Data for Pie Chart
  const pieData = {
    labels: ['Total Orders', 'Total Products', 'Total Reviews', 'Total Users'],
    datasets: [
      {
        label: 'Admin Stats',
        data: [
          stats.totalOrders,
          stats.totalProducts,
          stats.totalReviews,
          stats.totalUsers,
        ],
        backgroundColor: [
          '#B0BEC5', // Gray color
          '#90A4AE', // Lighter gray
          '#78909C', // Even lighter gray
          '#607D8B', // Darker gray
          '#546E7A', // Dark gray
        ],
        hoverBackgroundColor: [
          '#B0BEC5',
          '#90A4AE',
          '#78909C',
          '#607D8B',
          '#546E7A',
        ],
      },
    ],
  };

  // Initialize the data array with 12 zeros
  const data = new Array(12).fill(0);

  // Map earnings to the correct month
  stats?.monthlyEarnings.forEach(entry => {
    data[entry.month - 1] = entry.earnings; // Subtract 1 because months are 0-indexed in the data array
  });

  const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Monthly Earnings',
        data, 
        fill: false,
        backgroundColor: '#90A4AE', // Lighter gray
        borderColor: '#90A4AE', // Lighter gray border
        tension: 0.1, // Optional: Add some tension to smooth the line
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#B0BEC5', // Gray text for the legend
        },
      },
    },
  };

  return (
    <div className="mt-12 space-y-8 text-gray-400"> {/* Gray text */}
      <h2 className="text-xl font-semibold mb-4 text-white">Admin Stats Overview</h2> {/* White text for the title */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="max-h-96 w-full p-4 rounded-lg">
          <Pie data={pieData} options={options} />
        </div>

        {/* Line Chart */}
        <div className="max-h-96 md:h-96 w-full  p-4 rounded-lg">
          <Line data={lineData} options={options} />
        </div>
      </div>

      <div className="relative pt-8 pb-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center md:justify-between justify-center">
            <div className="w-full md:w-6/12 px-4 mx-auto text-center">
              <div className="text-sm text-gray-500 font-semibold py-1">
                Made with <a href="https://www.creative-tim.com/product/notus-js" className="text-gray-500 hover:text-gray-300" target="_blank" rel="noopener noreferrer">Tailwind CSS</a> by <a href="https://www.creative-tim.com" className="text-gray-500 hover:text-gray-300" target="_blank" rel="noopener noreferrer">Mamun</a>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatsChart;
