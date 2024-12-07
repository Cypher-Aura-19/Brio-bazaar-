import React, { useEffect, useState } from 'react';
import 'remixicon/fonts/remixicon.css'; // Import Remix Icon CSS
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../redux/features/cart/cartSlice'; // Import clearCart action
import { getBaseUrl } from '../utils/baseURL';
import TimelineStep from '../pages/dashboard/user/TimelineStep';

const PaymentSuccess = () => {
  const dispatch = useDispatch();
  const [order, setOrder] = useState(null);
  const products = useSelector((store) => store.cart.products);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const sessionId = query.get('session_id');
  
    if (sessionId) {
      fetch(`${getBaseUrl()}/api/orders/confirm-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: sessionId }),
      })
        .then((res) => res.json())
        .then((data) => {
          setOrder(data.order);
  
          // After the payment confirmation, get the product IDs from the cart
          const productIds = products.map((product) => product._id);
  
          // Log the productIds
          console.log('Product IDs from cart:', productIds);
  
          // Dispatch clearCart action
          // dispatch(clearCart());
  
          // Send productIds along with session_id to update the order status in the backend
          const body = {
            session_id: sessionId,
            productIds: productIds,
          };
  
          fetch(`${getBaseUrl()}/api/orders/update-payment-status`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          })
            .then((response) => response.json())
            .then((updateData) => {
              // Handle successful update if needed
              console.log('Payment updated successfully:', updateData);
            })
            .catch((error) => {
              console.error('Error updating payment status:', error);
            });
        })
        .catch((error) => {
          console.error('Error confirming payment:', error);
        });
    }
  }, [dispatch, products]);
  
  if (!order) {
    return <div>Loading...</div>;
  }

  const isCompleted = (status) => {
    const statuses = ['pending', 'processing', 'shipped', 'completed'];
    return statuses.indexOf(status) < statuses.indexOf(order.status);
  };

  const isCurrent = (status) => order.status === status;

  const steps = [
    {
      status: 'pending',
      label: 'Pending',
      description: 'Your order has been created and is awaiting processing.',
      icon: { iconName: 'time-line', bgColor: 'red-500', textColor: 'gray-800' },
    },
    {
      status: 'processing',
      label: 'Processing',
      description: 'Your order is currently being processed.',
      icon: { iconName: 'loader-line', bgColor: 'yellow-800', textColor: 'yellow-800' },
    },
    {
      status: 'shipped',
      label: 'Shipped',
      description: 'Your order has been shipped.',
      icon: { iconName: 'truck-line', bgColor: 'blue-800', textColor: 'blue-800' },
    },
    {
      status: 'completed',
      label: 'Completed',
      description: 'Your order has been successfully completed.',
      icon: { iconName: 'check-line', bgColor: 'green-800', textColor: 'green-900' },
    },
  ];

  return (
    <div className="section__container rounded p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Payment {order.status}
      </h2>
      <p className="mb-4">Order ID: {order.orderId}</p>
      <p className="mb-4">Status: {order.status}</p>

      {/* Display Product IDs */}
      {order.productIds ? (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Product IDs:</h3>
          <ul className="list-disc pl-5">
            {order.productIds.map((productId, index) => (
              <li key={index}>{productId}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div>Product IDs are not available.</div>
      )}

      {/* Timeline */}
      <ol className="items-center sm:flex relative">
        {steps.map((step, index) => (
          <TimelineStep
            key={step.status}
            step={step}
            order={order}
            isCompleted={isCompleted(step.status)}
            isCurrent={isCurrent(step.status)}
            isLastStep={index === steps.length - 1}
            icon={step.icon}
            description={step.description}
          />
        ))}
      </ol>
    </div>
  );
};

export default PaymentSuccess;
