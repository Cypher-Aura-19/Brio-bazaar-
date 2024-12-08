import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import UpdateOrderModal from './UpdateOrderModal';
import { useDeleteOrderMutation, useGetAllOrdersQuery } from '../../../../redux/features/orders/orderApi';
import { useFetchAllProductsQuery } from '../../../../redux/features/products/productsApi';
import { Link } from 'react-router-dom';
import { formatDate } from '../../../../utils/dateFormater';

const ManageOrders = () => {
    const { seller } = useSelector((state) => state.sellerAuth);
    const { data: orders, error, isLoading, refetch } = useGetAllOrdersQuery();
    const { data: productsData, isLoading: isProductsLoading } = useFetchAllProductsQuery({
        category: '',
        color: '',
        minPrice: '',
        maxPrice: '',
        page: 1,
        limit: 1000
    });

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteOrder] = useDeleteOrderMutation();

    if (!seller) {
        return <div>Please log in as a seller to manage orders.</div>;
    }

    // Filter seller products by seller's ID
    const sellerProducts = productsData?.products?.filter((product) => product?.author?._id === seller?._id) || [];
    const sellerProductIds = sellerProducts.map((product) => product._id);

    // Filter orders based on the seller's product IDs
    const sellerOrders = orders?.filter((order) => {
        return order.productIds.some((productId) => sellerProductIds.includes(productId));
    }) || [];

    const handleEditClick = (order) => {
        if (order.productIds.length > 1) {
            alert("Orders with multiple products cannot be edited.");
            return;
        }
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    const handleDeleteClick = async (orderId, productIds) => {
        if (productIds.length > 1) {
            alert("Orders with multiple products cannot be deleted.");
            return;
        }
        try {
            await deleteOrder(orderId).unwrap();
            refetch();
        } catch (err) {
            console.error("Failed to delete order:", err);
        }
    };

    if (isLoading || isProductsLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="section__container p-6">
            <h2 className="text-2xl font-semibold mb-4">Manage Orders</h2>
            <table className="min-w-full bg-black text-white border border-gray-200 rounded-lg">
                <thead className="bg-black">
                    <tr>
                        <th className="py-3 px-4 border-b">Order ID</th>
                        <th className="py-3 px-4 border-b">Customer</th>
                        <th className="py-3 px-4 border-b">Status</th>
                        <th className="py-3 px-4 border-b">Date</th>
                        <th className="py-3 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sellerOrders.map((order, index) => (
                        <tr key={index}>
                            <td className="py-3 px-4 border-b">{order.orderId}</td>
                            <td className="py-3 px-4 border-b">{order?.email}</td>
                            <td className="py-3 px-4 border-b">
                                <span
                                    className={`inline-block px-3 text-xs py-1 text-white rounded-full ${getStatusColor(
                                        order.status
                                    )}`}
                                >
                                    {order.status}
                                </span>
                            </td>
                            <td className="py-3 px-4 border-b">{formatDate(order?.updatedAt || new Date())}</td>
                            <td className="py-3 px-4 border-b flex items-center space-x-4">
                                <Link to="#" className="text-blue-500 hover:underline">
                                    View
                                </Link>
                                <button
                                    onClick={() => handleEditClick(order)}
                                    className="text-green-500 hover:underline"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(order?._id, order.productIds)}
                                    className="text-red-500 hover:underline"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedOrder && (
                <UpdateOrderModal
                    order={selectedOrder}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

// Helper function to determine the color based on status
const getStatusColor = (status) => {
    switch (status) {
        case "pending":
            return "bg-yellow-500";
        case "processing":
            return "bg-blue-500";
        case "shipped":
            return "bg-green-500";
        case "completed":
            return "bg-gray-500";
        default:
            return "bg-gray-300";
    }
};

export default ManageOrders;
