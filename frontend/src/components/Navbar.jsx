import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CartModal from "../pages/shop/CartModal";
import avatarImg from "../assets/avatar.png";
import { logout } from "../redux/features/auth/authSlice";
import { useLogoutUserMutation } from "../redux/features/auth/authApi";

const Navbar = () => {
  const products = useSelector((store) => store.cart.products);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dispatch = useDispatch();
  const [logoutUser] = useLogoutUserMutation();
  const { user } = useSelector((state) => state.auth);
  const { seller } = useSelector((state) => state.sellerAuth);
  const navigate = useNavigate();

  const handleCartToggle = () => setIsCartOpen(!isCartOpen);
  const handleMobileMenuToggle = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const handleDropDownToggle = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
      navigate("/");
    } catch (err) {
      console.error("Failed to logout:", err);
    }
  };

  // Admin dropdown menus
  const adminDropdownMenus = [
    { label: "Dashboard", path: "/dashboard/admin" },
    { label: "Manage Items", path: "/dashboard/admin/manage-products" },
    { label: "All Orders", path: "/dashboard/admin/manage-orders" },
  ];

  // User dropdown menus
  const userDropdownMenus = [
    { label: "Dashboard", path: "/dashboard/user" },
    { label: "Profile", path: "/dashboard/user/profile" },
    { label: "Payments", path: "/dashboard/user/payments" },
    { label: "Orders", path: "/dashboard/user/orders" },
  ];

  // Seller dropdown menus (if seller is approved)
  const sellerDropdownMenus = seller?.isApproved
    ? [
        { label: "Dashboard", path: "/seller/dashboard" },
        { label: "Manage Products", path: "/dashboard/manage-products" },
        { label: "View Orders", path: "/dashboard/seller-orders" },
      ]
    : [];

  // Determine which menu to show based on user role or seller approval
  const dropdownMenus = user?.role === "admin" 
    ? adminDropdownMenus 
    : seller?.isApproved 
    ? sellerDropdownMenus 
    : userDropdownMenus;

  return (
    <header className="fixed-nav-bar w-nav bg-black text-gray-400 z-50 w-full">
      <nav className="max-w-screen-2xl mx-auto px-4 flex justify-between items-center">
        {/* Hamburger Menu for Small Devices */}
        <div className="sm:hidden flex items-center">
          <button
            onClick={handleMobileMenuToggle}
            className="text-gray-400 focus:outline-none mr-16"
          >
            <i className="ri-menu-line text-xl"></i>
          </button>
        </div>

        {/* Navigation Links */}
        <ul
          className={`nav__links sm:flex sm:space-x-4 ${
            isMobileMenuOpen
              ? "flex flex-col items-start space-y-2 mt-4 absolute bg-black top-full left-0 right-0 px-4 py-6 sm:static sm:flex-row sm:space-y-0 sm:mt-0 sm:bg-transparent sm:px-0 sm:py-0"
              : "hidden sm:flex sm:space-x-4"
          }`}
        >
          <li className="link">
            <Link to="/" className="hover:text-gray-200">
              Home
            </Link>
          </li>
          <li className="link">
            <Link to="/shop" className="hover:text-gray-200">
              Shop
            </Link>
          </li>
          <li className="link">
            <Link to="/Seller-register" className="hover:text-gray-200">
              Become a Seller
            </Link>
          </li>
          <li className="link">
            <Link to="/about-us" className="hover:text-gray-200">
              About Us
            </Link>
          </li>
        </ul>

        {/* Logo */}
        <div className="nav__logo text-gray-200 flex-1 text-center hidden sm:block">
          <Link to="/">BrioBazaar<span>.</span></Link>
        </div>

        {/* Nav Icons (Search, Cart, Avatar) */}
        <div className="nav__icons relative flex items-center space-x-4 sm:flex-none">
          <span>
            <Link to="/search" className="hover:text-gray-200">
              <i className="ri-search-line"></i>
            </Link>
          </span>
          <span>
            <button onClick={handleCartToggle} className="hover:text-gray-200">
              <i className="ri-shopping-bag-line"></i>
              <sup className="text-sm inline-block px-1.5 text-black rounded-full bg-gray-400 text-center">
                {products.length}
              </sup>
            </button>
          </span>
          <span>
            {user ? (
              <>
                <img
                  onClick={handleDropDownToggle}
                  src={user?.profileImage || avatarImg}
                  alt="User Avatar"
                  className="w-6 h-6 rounded-full cursor-pointer"
                />
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 p-4 w-48 bg-black border border-gray-600 rounded-lg shadow-lg z-50">
                    <ul className="font-medium space-y-4 p-2">
                      {dropdownMenus.map((menu, index) => (
                        <li key={index}>
                          <Link
                            onClick={() => setIsDropdownOpen(false)}
                            to={menu.path}
                            className="dropdown-items hover:text-gray-200"
                          >
                            {menu.label}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link
                          onClick={handleLogout}
                          className="dropdown-items hover:text-gray-200"
                        >
                          Logout
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login" className="hover:text-gray-200">
                <i className="ri-user-line"></i>
              </Link>
            )}
          </span>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-black bg-opacity-90 flex flex-col items-center justify-center space-y-6 transition-all duration-300 ${
          isMobileMenuOpen ? "block z-50" : "hidden"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={handleMobileMenuToggle}
          className="absolute top-6 right-6 text-2xl text-gray-200"
        >
          <i className="ri-close-line"></i>
        </button>

        {/* Navigation Links */}
        <ul className="space-y-6 text-center">
          <li className="link">
            <Link to="/" className="hover:text-gray-200" onClick={handleMobileMenuToggle}>
              Home
            </Link>
          </li>
          <li className="link">
            <Link to="/shop" className="hover:text-gray-200" onClick={handleMobileMenuToggle}>
              Shop
            </Link>
          </li>
          <li className="link">
            <Link to="/about-us" className="hover:text-gray-200" onClick={handleMobileMenuToggle}>
              About Us
            </Link>
          </li>
        </ul>
      </div>

      {/* Cart Modal */}
      {isCartOpen && (
        <CartModal
          products={products}
          isOpen={isCartOpen}
          onClose={handleCartToggle}
        />
      )}
    </header>
  );
};

export default Navbar;
