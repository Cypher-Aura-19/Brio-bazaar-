import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/home/Home';
import CategoryPage from '../pages/category/CategoryPage';
import ShopPage from '../pages/shop/ShopPage';
import ErrorPage from '../components/ErrorPage';
import Search from '../pages/search/Search';
import Login from '../components/Login';
import Register from '../components/Register';
import SellerRegistration from '../pages/seller/SellerRegistration'; // Import Seller Registration
import DashboardLayout from '../pages/dashboard/DashboardLayout';
import PrivateRoute from './PrivateRoute';
import SellerPrivateRoute from './SellerPrivateRoute'; // Import SellerPrivateRoute
import SingleProduct from '../pages/shop/productdetais/SingleProduct';
import PaymentSuccess from '../components/PaymentSuccess';
import UserOrders from '../pages/dashboard/user/UserOrders';
import UserPayments from '../pages/dashboard/user/UserPayments';
import OrderDetails from '../pages/dashboard/user/OrderDetails';
import UserReviews from '../pages/dashboard/user/UserReviews';
import UserProfile from '../pages/dashboard/user/UserProfile';
import AdminDMain from '../pages/dashboard/admin/dashboard/AdminDMain';
import UserDMain from '../pages/dashboard/user/dashboard/UserDMain';
import AddProduct from '../pages/dashboard/admin/addProduct/AddProduct';
import ManageProducts from '../pages/dashboard/admin/manageProduct/ManageProducts';
import UpdateProduct from '../pages/dashboard/admin/manageProduct/UpdateProduct';
import ManageUser from '../pages/dashboard/admin/users/ManageUser';
import ManageOrders from '../pages/dashboard/admin/manageOrders/ManageOrders';
import ManageSellers from '../pages/dashboard/admin/sellers/ManageSeller'; // Import Manage Sellers
import Aboutus from '../pages/AboutUs/AboutUsPage';
import SellerLogin from '../components/SellerLogin';  // Import Seller Login component

// Import Promotion related components
import AddPromotion from '../pages/dashboard/admin/Promotions/AddPromotion';  // Add Promotion component
import ManagePromotions from '../pages/dashboard/admin/Promotions/ManagePromotions';  // Manage Promotions component

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/categories/:categoryName', element: <CategoryPage /> },
      { path: '/shop', element: <ShopPage /> },
      { path: '/search', element: <Search /> },
      { path: '/shop/:id', element: <PrivateRoute role="user"><SingleProduct /></PrivateRoute> },
      { path: '/about-us', element: <Aboutus /> },
      {
        path: "/success",
        element: <PaymentSuccess />
      },
      {
        path: "/orders/:orderId",
        element: <OrderDetails />
      },
    ],
  },
  { path: '/seller-register', element: <SellerRegistration /> }, 
  { path: '/seller-login', element: <SellerLogin /> }, // Seller Login Route  
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  {
    path: '/dashboard',
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
      // User routes
      { path: '', element: <UserDMain /> },
      { path: 'orders', element: <UserOrders /> },
      { path: 'payments', element: <UserPayments /> },
      { path: 'profile', element: <UserProfile /> },
      { path: 'reviews', element: <UserReviews /> },

      // Admin routes (only accessible by admins)
      {
        path: 'admin',
        element: <PrivateRoute role="admin"><AdminDMain /></PrivateRoute>,
      },
      {
        path: 'add-new-post',
        element: <PrivateRoute role="admin"><AddProduct /></PrivateRoute>,
      },
      {
        path: 'manage-products',
        element: <PrivateRoute role="admin"><ManageProducts /></PrivateRoute>,
      },
      {
        path: 'update-product/:id',
        element: <PrivateRoute role="admin"><UpdateProduct /></PrivateRoute>,
      },
      {
        path: 'users',
        element: <PrivateRoute role="admin"><ManageUser /></PrivateRoute>,
      },
      {
        path: 'manage-orders',
        element: <PrivateRoute role="admin"><ManageOrders /></PrivateRoute>,
      },
      // Admin route for managing sellers
      {
        path: 'manage-sellers',
        element: <PrivateRoute role="admin"><ManageSellers /></PrivateRoute>,
      },
      // Admin route for Add Promotion
      {
        path: 'add-promotion',
        element: <PrivateRoute role="admin"><AddPromotion /></PrivateRoute>,
      },
      // Admin route for Manage Promotions
      {
        path: 'manage-promotions',
        element: <PrivateRoute role="admin"><ManagePromotions /></PrivateRoute>,
      }
    ],
  },
  // Seller Dashboard Routes
  // {
  //   path: '/dashboard/seller',
  //   element: <SellerPrivateRoute><DashboardLayout /></SellerPrivateRoute>,
  //   children: [
  //     { path: '', element: <SellerDMain /> },
  //     { path: 'add-product', element: <SellerPrivateRoute><AddProduct /></SellerPrivateRoute> },
  //     { path: 'manage-products', element: <SellerPrivateRoute><ManageProducts /></SellerPrivateRoute> },
  //     { path: 'manage-orders', element: <SellerPrivateRoute><ManageOrders /></SellerPrivateRoute> },
  //   ],
  // },
]);

export default router;
