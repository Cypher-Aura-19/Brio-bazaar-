import React from 'react';
import { useLogoutSellerMutation } from '../../redux/features/sellers/sellerApi';
import { useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';  // Import useNavigate for redirect
import { logoutSeller as logoutFromStore } from "../../redux/features/auth/authSlice";  // Renaming the action

const SellerDashboard = () => {
  const [logoutSellerApi] = useLogoutSellerMutation();  // Renamed mutation hook to avoid conflict
  const dispatch = useDispatch();
  const navigate = useNavigate();  // Initialize navigate for redirection

  const handleLogout = async () => {
    try {
      await logoutSellerApi().unwrap();  // Call the API mutation
      console.log("User logged out successfully");

      // Dispatch the action to clear the seller from the Redux store
      dispatch(logoutFromStore());

      // Redirect to homepage
      navigate("/");

    } catch (err) {
      console.error("Failed to logout:", err);
    }
  };

  return (
    <div className="space-y-5 bg-black text-white p-8 md:h-screen flex flex-col justify-between">
      <div>
        <div className="nav__logo">
          <Link to="/">BrioBazaar<span>.</span></Link>
          <p className="text-xs italic">Seller dashboard</p>
        </div>
        <hr className="mt-5" />
        <ul className="space-y-5 pt-5">
          <li>
            <NavLink
              to="/seller/dashboard"
              className={({ isActive }) => (isActive ? "text-white font-bold" : "text-gray-400")}
            >
              DASHBOARD
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/seller/dashboard/add-product"
              className={({ isActive }) => (isActive ? "text-white font-bold" : "text-gray-400")}
            >
              Add New Product
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/seller/dashboard/manage-products"
              className={({ isActive }) => (isActive ? "text-white font-bold" : "text-gray-400")}
            >
              Manage Products
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/seller/dashboard/manage-orders"
              className={({ isActive }) => (isActive ? "text-white font-bold" : "text-gray-400")}
            >
              Manage Orders
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/seller/dashboard/manage-reviews"
              className={({ isActive }) => (isActive ? "text-white font-bold" : "text-gray-400")}
            >
              Manage Reviews
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/seller/dashboard/chatbot"
              className={({ isActive }) => (isActive ? "text-white font-bold" : "text-gray-400")}
            >
              Chatbot
            </NavLink>
          </li>
          
        </ul>
      </div>

      <div className="mb-3">
        <hr className="mb-3" />
        <button 
          onClick={handleLogout}
          className="text-white bg-red-500 font-medium px-5 py-1 rounded-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default SellerDashboard;
