import React, { useState } from "react";
import { useLogoutUserMutation } from "../../redux/features/auth/authApi";
import { useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../redux/features/auth/authSlice";
import { FaWhatsapp } from "react-icons/fa"; // Import WhatsApp icon
import { useGetSellersQuery } from "../../redux/features/sellers/sellerApi"; // Import sellerApi hook

const UserDashboard = () => {
  const [logoutUser] = useLogoutUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: sellers = [], isLoading } = useGetSellersQuery(); // Fetch sellers
  const [isDropdownOpen, setDropdownOpen] = useState(false); // Dropdown state

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      console.log("User logged out successfully");
      dispatch(logout());
      navigate("/");
    } catch (err) {
      console.error("Failed to logout:", err);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  return (
    <div className="space-y-5 bg-black text-white p-8 md:h-screen flex flex-col justify-between relative">
      <div>
        <div className="nav__logo">
          <Link to="/">
            BrioBazaar<span>.</span>
          </Link>
          <p className="text-xs italic">User dashboard</p>
        </div>
        <hr className="mt-5 text-gray-400" />
        <ul className="space-y-5 pt-5">
          <li>
            <NavLink
              to="/dashboard/user"
              end
              className={({ isActive }) =>
                isActive ? "text-white font-bold" : "text-gray-400"
              }
            >
              DASHBOARD
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/user/orders"
              className={({ isActive }) =>
                isActive ? "text-white font-bold" : "text-gray-400"
              }
            >
              Orders
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/user/payments"
              className={({ isActive }) =>
                isActive ? "text-white font-bold" : "text-gray-400"
              }
            >
              Payments
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/user/profile"
              className={({ isActive }) =>
                isActive ? "text-white font-bold" : "text-gray-400"
              }
            >
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/user/chatbot"
              className={({ isActive }) =>
                isActive ? "text-white font-bold" : "text-gray-400"
              }
            >
              Chatbot
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/user/reviews"
              className={({ isActive }) =>
                isActive ? "text-white font-bold" : "text-gray-400"
              }
            >
              Reviews
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="mb-3">
        <hr className="mb-3" />
        <button
          onClick={handleLogout}
          className="bg-white text-black font-semibold py-3 rounded-md transition duration-300 hover:bg-gray-200 font-medium px-5 py-1 rounded-sm"
        >
          Logout
        </button>
      </div>

      {/* WhatsApp Icon and Dropdown */}
      <div className="fixed bottom-24 left-5">
        <button
          onClick={toggleDropdown}
          className="bg-white text-black p-4 rounded-full shadow-lg hover:bg-black hover:text-white transition"
          title="Chat with a Seller on WhatsApp"
        >
          <FaWhatsapp size={24} />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-[-260px] left-0 bg-white text-black rounded-lg shadow-lg w-64 overflow-y-auto max-h-64 border border-gray-300">
            {isLoading ? (
              <p className="p-3 text-center">Loading sellers...</p>
            ) : sellers.length > 0 ? (
              sellers
                .filter((seller) => seller.isApproved) // Filter approved sellers
                .map((seller) => (
                  <div
                    key={seller._id}
                    className="p-3 border-b hover:bg-gray-100 cursor-pointer"
                  >
                    <a
                      href={`https://wa.me/${seller.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col"
                    >
                      <span className="font-semibold">{seller.storeName}</span>
                      <span className="text-sm text-gray-600">
                        +{seller.phone}
                      </span>
                    </a>
                  </div>
                ))
            ) : (
              <p className="p-3 text-center">No sellers available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
