import React, { useState } from 'react';
import { useUpdateDiscountPromotionMutation } from '../../../../redux/features/promotion/discountPromotionApi';
//for admin
const UpdatePromotionModal = ({ promotion, onClose, onStatusUpdate }) => {
  const [discountPercentage, setDiscountPercentage] = useState(promotion.discountPercentage || '');
  const [startDate, setStartDate] = useState(promotion.startDate || '');
  const [endDate, setEndDate] = useState(promotion.endDate || '');
  const [updatePromotion] = useUpdateDiscountPromotionMutation();

  const handleUpdatePromotion = async () => {
    try {
      // Ensure you're passing the correct 'id' field and promotion data
      await updatePromotion({
        id: promotion._id, // Make sure to use '_id' here, not 'promotionId'
        discountPercentage,
        startDate,
        endDate,
      }).unwrap();
      alert('Promotion updated successfully');
      onStatusUpdate();
      onClose();
    } catch (error) {
      console.error('Failed to update promotion', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-black text-white border border-gray-700 p-4 rounded shadow-lg w-1/3">
        <h2 className="text-xl mb-4">Edit Promotion</h2>

        <div className="mb-4 space-y-4">
          <label className="block text-sm font-medium text-gray-400">Promotion id:</label>
          <input
            type="text"
            value={promotion._id} // Use _id here instead of id
            readOnly
            className="mt-1 bg-black border border-gray-700 block w-full shadow-sm sm:text-sm rounded-md py-2.5 px-5 focus:outline-none"
          />
        </div>

        <div className="mb-4 space-y-4">
          <label className="block text-sm font-medium text-gray-400">Discount Percentage (%):</label>
          <input
            type="number"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            className="mt-1 bg-black border border-gray-700 block w-full shadow-sm sm:text-sm rounded-md py-2.5 px-5 focus:outline-none"
          />
        </div>

        <div className="mb-4 space-y-4">
          <label className="block text-sm font-medium text-gray-400">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 bg-black border border-gray-700 block w-full shadow-sm sm:text-sm rounded-md py-2.5 px-5 focus:outline-none"
          />
        </div>

        <div className="mb-4 space-y-4">
          <label className="block text-sm font-medium text-gray-400">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 bg-black border border-gray-700 block w-full shadow-sm sm:text-sm rounded-md py-2.5 px-5 focus:outline-none"
          />
        </div>

        <div className="flex justify-end pt-5">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdatePromotion}
            className="bg-white text-black px-6 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePromotionModal;
