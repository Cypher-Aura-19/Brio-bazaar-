import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SellerRegistration = () => {
  const [formData, setFormData] = useState({
    storeName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    let formErrors = {};

    // Check if all fields are filled
    if (!formData.storeName) formErrors.storeName = "Store Name is required.";
    if (!formData.email) formErrors.email = "Email is required.";
    if (!formData.phone) formErrors.phone = "Phone number is required.";
    if (!formData.password) formErrors.password = "Password is required.";

    // Set the errors state
    setErrors(formErrors);

    // If there are no errors, proceed with form submission
    if (Object.keys(formErrors).length === 0) {
      try {
        // Submit form data to the backend API for seller registration
        const response = await fetch("http://localhost:5000/api/seller/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          // Successful registration
          toast.success(data.message || "Registration successful!");
          setFormData({
            storeName: "",
            email: "",
            phone: "",
            password: "",
          });
        } else {
          // Handle backend errors
          toast.error(data.error || "Registration failed.");
        }
      } catch (error) {
        // Handle network or server errors
        toast.error("An error occurred. Please try again.");
      }
    } else {
      toast.error("Please fill in all required fields.");
    }
  };

  return (
    <div className="bg-black text-gray-400 min-h-screen">
      <ToastContainer />

      <section className="section__container bg-black shadow-lg border border-gray-700 text-gray-400">
        <h2 className="section__header text-white">Seller Registration</h2>
        <p className="section__subheader">
          Join us and start selling your products on our platform.
        </p>
      </section>

      <section className="section__container">
        <div className="max-w-lg mx-auto border border-gray-700 p-8 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold text-white mb-6">Seller Registration Form</h3>

          <form onSubmit={handleSubmit}>
            {/* Store Name */}
            <div className="mb-4">
              <label htmlFor="storeName" className="block text-white font-semibold">
                Store Name
              </label>
              <input
                type="text"
                id="storeName"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                className="w-full p-3 mt-2 bg-black text-white border border-gray-700 rounded-md"
                placeholder="Enter your store name"
              />
              {errors.storeName && <p className="text-red-500 text-sm">{errors.storeName}</p>}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-white font-semibold">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 mt-2 bg-black text-white border border-gray-700 rounded-md"
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label htmlFor="phone" className="block text-white font-semibold">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 mt-2 bg-black text-white border border-gray-700 rounded-md"
                placeholder="Enter your phone number"
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-white font-semibold">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 mt-2 bg-black text-white border border-gray-700 rounded-md"
                placeholder="Enter your password"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-white text-black font-semibold rounded-md hover:bg-gray-200 transition"
            >
              Register
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default SellerRegistration;
