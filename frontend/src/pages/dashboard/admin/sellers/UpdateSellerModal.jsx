import React, { useState } from 'react';
import { useUpdateSellerStatusMutation } from '../../../../redux/features/sellers/sellerApi';
//for admin
const UpdateSellerModal = ({ seller, onClose, onStatusUpdate }) => {
  const [status, setStatus] = useState(seller.isApproved ? 'approved' : 'pending');
  const [updateSellerStatus] = useUpdateSellerStatusMutation();

  const handleUpdateStatus = async () => {
    try {
      await updateSellerStatus({ sellerId: seller._id, status }).unwrap();
      alert('Seller status updated successfully');
      onStatusUpdate();
      onClose();
    } catch (error) {
      console.error('Failed to update seller status', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-black text-white border border-gray-700 p-4 rounded shadow-lg w-1/3">
        <h2 className="text-xl mb-4">Edit Seller Status</h2>
        <div className="mb-4 space-y-4">
          <label className="block text-sm font-medium text-gray-400">Seller Name:</label>
          <input
            type="text"
            value={seller.storeName}
            readOnly
            className="mt-1 bg-black border border-gray-700 block w-full shadow-sm sm:text-sm rounded-md py-2.5 px-5 focus:outline-none"
          />
        </div>
        <div className="mb-4 space-y-4">
          <label className="block text-sm font-medium text-gray-400">Email:</label>
          <input
            type="text"
            value={seller.email}
            readOnly
            className="mt-1 bg-black border border-gray-700 block w-full shadow-sm sm:text-sm rounded-md py-2.5 px-5 focus:outline-none"
          />
        </div>
        <div className="mb-4 space-y-4">
          <label className="block text-sm font-medium text-gray-400">Approval Status:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="block w-full shadow-sm sm:text-sm bg-black border border-gray-700 rounded-md py-2.5 px-5 focus:outline-none"
          >
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div className="flex justify-end pt-5">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateStatus}
            className="bg-white text-black px-6 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateSellerModal;
