import React from "react";
import { useSelector } from "react-redux";
import { useFetchAllProductsQuery } from "../../../../redux/features/products/productsApi";
import { useGetAllOrdersQuery } from "../../../../redux/features/orders/orderApi";

const AdminStats = () => {
  const { seller } = useSelector((state) => state.sellerAuth);

  // Fetch all products
  const { data: productsData, isLoading: productsLoading } = useFetchAllProductsQuery({
    category: "",
    color: "",
    minPrice: "",
    maxPrice: "",
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
  const totalEarnings = sellerOrders.reduce((sum, order) => sum + order.amount, 0);

  return (
    <div className="my-5 space-y-4">
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <div className="bg-black border border-gray-700 shadow-md rounded-lg p-6">
          <h2 className="text-xl text-white font-semibold mb-2">Total Earnings</h2>
          <p className="text-2xl text-gray-400 font-bold">${Math.round(totalEarnings)}</p>
        </div>
        <div className="bg-black border border-gray-700 shadow-md rounded-lg p-6">
          <h2 className="text-xl text-white font-semibold mb-2">All Orders</h2>
          <p className="text-2xl text-gray-400 font-bold">{sellerOrders.length}</p>
        </div>
        <div className="bg-black border border-gray-700 shadow-md rounded-lg p-6">
          <h2 className="text-xl text-white font-semibold mb-2">Total Products</h2>
          <p className="text-2xl text-gray-400 font-bold">{sellerProducts.length}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
