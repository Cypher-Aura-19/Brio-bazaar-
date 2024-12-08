import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const SellerPrivateRoute = ({ children }) => {
  const { seller } = useSelector((state) => state.sellerAuth); // Access seller state
  const location = useLocation();

  if (!seller || !seller.isApproved) {
    alert("You must be logged in as a seller and approved!");
    return <Navigate to="/seller-login" state={{ from: location }} replace />;
  }

  return children;
};

export default SellerPrivateRoute;
