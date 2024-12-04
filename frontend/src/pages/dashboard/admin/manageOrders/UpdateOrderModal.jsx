import React, { useState } from 'react';
import { useUpdateOrderStatusMutation } from '../../../../redux/features/orders/orderApi';

const UpdateOrderModal = ({ order, onClose, isOpen }) => {
    const [status, setStatus] = useState(order.status);
    // console.log(order)
    const [updateOrderStatus, { isLoading, error }] = useUpdateOrderStatusMutation();

    const handleUpdate = async () => {
        try {
            await updateOrderStatus({ id: order._id, status }).unwrap();
            onClose(); // Close the modal after successful update
        } catch (err) {
            console.error("Failed to update order status:", err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
            <div className="bg-black border border-gray-700 text-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-xl font-semibold mb-4">Update Order Status</h2>
                
                <div className="mb-4">
                    <label className="block text-gray-400 mb-2" htmlFor="status">Status</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border border-gray-700 bg-black p-2 rounded w-full"
                    >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
                
                {error && <p className="text-red-500 mb-4">Failed to update status.</p>}
                
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="bg-gray-400 text-white px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpdate}
                        disabled={isLoading}
                        className="bg-white text-black px-4 py-2 rounded"
                    >
                        {isLoading ? 'Updating...' : 'Update'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateOrderModal;
