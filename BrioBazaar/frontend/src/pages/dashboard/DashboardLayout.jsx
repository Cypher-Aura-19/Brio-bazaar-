import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';
import SellerDashboard from './SellerDashboard'; // Import SellerDashboard

const DashboardLayout = () => {
  const { user } = useSelector((state) => state.auth || {});
  const { seller } = useSelector((state) => state.sellerAuth || {});

  // Debugging logs
  console.log('User:', user); // Check if user is correctly populated
  console.log('Seller:', seller); // Check if seller is correctly populated

  // If neither user nor seller is logged in, redirect to login page
  if (!user && !seller) {
    console.log("You must be logged in!");
    return <Navigate to="/login" replace />;
  }

  // Render different dashboards based on user role or seller status
  const renderDashboard = () => {

    if (seller) {
      console.log('Seller Approved:', seller.isApproved); // Check if seller is approved
      if (seller.isApproved) {
        return <SellerDashboard />;
      }
    }

    if (user) {
      console.log('User Role:', user.role); // Check the user role
      if (user.role === 'admin') {
        return <AdminDashboard />;
      } else if (user.role === 'user') {
        return <UserDashboard />;
      }
    }



    return <Navigate to="/unauthorized" replace />;
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col md:flex-row gap-4">
      {/* Sidebar */}
      <header className="lg:w-1/5 sm:w-2/5 w-full border border-gray-700 p-4">
        {/* Show the correct dashboard layout based on user or seller */}
        {renderDashboard()}
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-black border border-gray-700 mt-5 md:mt-0">
        {/* Here, Outlet renders the child components based on the route */}
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
