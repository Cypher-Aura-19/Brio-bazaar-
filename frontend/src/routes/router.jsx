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
import UserChatbot from '../pages/dashboard/user/Chatbot';
import AdminDMain from '../pages/dashboard/admin/dashboard/AdminDMain';
import UserDMain from '../pages/dashboard/user/dashboard/UserDMain';
import AddProduct from '../pages/dashboard/admin/addProduct/AddProduct';
import ManageProducts from '../pages/dashboard/admin/manageProduct/ManageProducts';
import ManageProducts1 from '../pages/dashboard/seller/manageProduct/ManageProducts';
import UpdateProduct from '../pages/dashboard/admin/manageProduct/UpdateProduct';
import UpdateProduct1 from '../pages/dashboard/seller/manageProduct/UpdateProduct';
import ManageUser from '../pages/dashboard/admin/users/ManageUser';
import ManageOrders from '../pages/dashboard/admin/manageOrders/ManageOrders';
import ManageOrders1 from '../pages/dashboard/seller/manageOrders/ManageOrders';
import ManageReviews from '../pages/dashboard/seller/manageReviews/ManageReviews';
import ManageSellers from '../pages/dashboard/admin/sellers/ManageSeller'; // Import Manage Sellers
import Aboutus from '../pages/AboutUs/AboutUsPage';
import SellerLogin from '../components/SellerLogin';  // Import Seller Login component
import SellerDMain from '../pages/dashboard/seller/dashboard/SellerDMain';  // Import Seller Dashboard Main component
// Import Promotion related components
import AddPromotion from '../pages/dashboard/admin/Promotions/AddPromotion';  // Add Promotion component
import ManagePromotions from '../pages/dashboard/admin/Promotions/ManagePromotions';  // Manage Promotions component
import SellerChatbot from '../pages/dashboard/seller/Chatbot/Chatbot';
import AdminChatbot from '../pages/dashboard/admin/chatbot/Chatbot';

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
      { path: '/seller-register', element: <SellerRegistration /> },
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
   
  { path: '/seller-login', element: <SellerLogin /> }, // Seller Login Route  
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },

  {
    path: '/dashboard/user',
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
      { path: '', element: <UserDMain /> },
      { path: 'orders', element: <UserOrders /> },
      { path: 'chatbot', element: <UserChatbot /> },
      { path: 'payments', element: <UserPayments /> },
      { path: 'profile', element: <UserProfile /> },
      { path: 'reviews', element: <UserReviews /> },
    ],
  },

  {
    path: '/dashboard/admin',
    element: <PrivateRoute role="admin"><DashboardLayout /></PrivateRoute>,
    children: [
      { path: '', element: <AdminDMain /> },
      { path: 'add-new-post', element: <PrivateRoute role="admin"><AddProduct /></PrivateRoute> },
      { path: 'manage-products', element: <PrivateRoute role="admin"><ManageProducts /></PrivateRoute> },
      { path: 'update-product/:id', element: <PrivateRoute role="admin"><UpdateProduct /></PrivateRoute> },
      { path: 'users', element: <PrivateRoute role="admin"><ManageUser /></PrivateRoute> },
      { path: 'manage-orders', element: <PrivateRoute role="admin"><ManageOrders /></PrivateRoute> },
      { path: 'manage-sellers', element: <PrivateRoute role="admin"><ManageSellers /></PrivateRoute> },
      { path: 'add-promotion', element: <PrivateRoute role="admin"><AddPromotion /></PrivateRoute> },
      { path: 'manage-promotions', element: <PrivateRoute role="admin"><ManagePromotions /></PrivateRoute> },
      { path: 'chatbot', element: <AdminChatbot /> },

    ],
  },
  // Seller Dashboard Routes
  {
    path: '/seller/dashboard',
    element: <SellerPrivateRoute><DashboardLayout /></SellerPrivateRoute>,
    children: [
      { path: '', element: <SellerDMain /> },
      { path: 'add-product', element: <SellerPrivateRoute><AddProduct /></SellerPrivateRoute> },
      { path: 'manage-products', element: <SellerPrivateRoute><ManageProducts1 /></SellerPrivateRoute> },
      { path: 'update-product/:id', element: <SellerPrivateRoute><UpdateProduct1 /></SellerPrivateRoute> },
      { path: 'manage-orders', element: <SellerPrivateRoute><ManageOrders1 /></SellerPrivateRoute> },
      { path: 'manage-reviews', element: <SellerPrivateRoute><ManageReviews /></SellerPrivateRoute> },
      { path: 'chatbot', element: <SellerPrivateRoute><SellerChatbot /></SellerPrivateRoute> },
    ],
  },
]);

export default router;
