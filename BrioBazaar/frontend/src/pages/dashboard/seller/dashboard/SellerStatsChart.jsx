import React from 'react';
import { useSelector } from 'react-redux';
import { useFetchAllProductsQuery } from '../../../../redux/features/products/productsApi';
import { useGetAllOrdersQuery } from '../../../../redux/features/orders/orderApi';
import { Pie, Line } from 'react-chartjs-2';
import 'chart.js/auto';

const AdminStatsChart = () => {
  const { seller } = useSelector((state) => state.sellerAuth);

  // Fetch all products
  const { data: productsData, isLoading: productsLoading } = useFetchAllProductsQuery({
    category: '',
    color: '',
    minPrice: '',
    maxPrice: '',
    page: 1,
    limit: 1000,
  });

  // Fetch all orders
  const { data: ordersData, isLoading: ordersLoading } = useGetAllOrdersQuery();

  if (productsLoading || ordersLoading) {
    return <div>Loading...</div>;
  }

  // Filter seller products
  const sellerProducts = productsData?.products?.filter((product) => product?.author?._id === seller?._id) || [];

  // Calculate seller orders
  const sellerProductIds = sellerProducts.map((product) => product._id);
  const sellerOrders = ordersData?.filter((order) =>
    order.productIds.some((productId) => sellerProductIds.includes(productId))
  ) || [];

  // Calculate total earnings
  const totalEarnings = sellerOrders.reduce((sum, order) => sum + (order.amount || 0), 0);

  // Monthly earnings
  const monthlyEarnings = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    earnings: sellerOrders.reduce(
      (sum, order) =>
        new Date(order.createdAt).getMonth() + 1 === i + 1 ? sum + (order.amount || 0) : sum,
      0
    ),
  }));

  // Data for Pie Chart
  const pieData = {
    labels: ['Total Orders', 'Total Products'],
    datasets: [
      {
        label: 'Admin Stats',
        data: [sellerOrders.length, sellerProducts.length],
        backgroundColor: ['#B0BEC5', '#90A4AE'],
        hoverBackgroundColor: ['#B0BEC5', '#90A4AE'],
      },
    ],
  };

  // Line Chart Data
  const lineData = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    datasets: [
      {
        label: 'Monthly Earnings',
        data: monthlyEarnings.map((entry) => entry.earnings),
        fill: false,
        backgroundColor: '#90A4AE',
        borderColor: '#90A4AE',
        tension: 0.1,
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
    <div className="mt-12 space-y-8 text-gray-400">
      <h2 className="text-xl font-semibold mb-4 text-white">Seller Stats Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="max-h-96 w-full p-4 rounded-lg">
          <Pie data={pieData} options={options} />
        </div>

        {/* Line Chart */}
        <div className="max-h-96 md:h-96 w-full p-4 rounded-lg">
          <Line data={lineData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default AdminStatsChart;
