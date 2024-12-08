import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useCreateDiscountPromotionMutation } from "../../../../redux/features/promotion/discountPromotionApi"; // Update path as needed
import TextInput from "../addProduct/TextInput";
import { useNavigate } from "react-router-dom";
//for admin
const AddPromotion = () => {
  const { user } = useSelector((state) => state.auth);

  const [promotion, setPromotion] = useState({
    discountPercentage: "",
    startDate: "",
    endDate: "",
  });

  const [createPromotion, { isLoading, error }] =
    useCreateDiscountPromotionMutation();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPromotion({
      ...promotion,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { discountPercentage, startDate, endDate } = promotion;

    if (!discountPercentage || !startDate || !endDate) {
      alert("Please fill in all fields.");
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      alert("Start date and time must be earlier than the end date and time.");
      return;
    }

    try {
      await createPromotion({
        ...promotion,
        userId: user?._id, // Assigning the logged-in admin's ID
        applyToAll: true, // Indicating that this promotion applies to all products
      }).unwrap();
      alert("Promotion added successfully!");
      setPromotion({
        discountPercentage: "",
        startDate: "",
        endDate: "",
      });
      navigate("/promotions");
    } catch (err) {
      console.error("Failed to add promotion:", err);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6">Add New Promotion</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="Discount Percentage"
          name="discountPercentage"
          type="number"
          placeholder="Enter Discount Percentage (e.g., 20)"
          value={promotion.discountPercentage}
          onChange={handleChange}
        />
        <TextInput
          label="Start Date & Time"
          name="startDate"
          type="datetime-local"
          value={promotion.startDate}
          onChange={handleChange}
        />
        <TextInput
          label="End Date & Time"
          name="endDate"
          type="datetime-local"
          value={promotion.endDate}
          onChange={handleChange}
        />
        <div>
          <button
            type="submit"
            className="add-promotion-btn bg-white text-black font-semibold py-3 px-6 rounded-md transition duration-300 hover:bg-gray-200"
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Promotion"}
          </button>
        </div>
      </form>

      {error && (
        <p className="text-red-500 mt-4">Error adding promotion: {error.message}</p>
      )}
    </div>
  );
};

export default AddPromotion;
