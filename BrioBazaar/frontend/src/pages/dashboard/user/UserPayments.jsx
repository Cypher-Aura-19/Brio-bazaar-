import React from 'react';
import { useGetOrdersByEmailQuery } from '../../../redux/features/orders/orderApi';
import { useSelector } from 'react-redux';

const UserPayments = () => {
  const { user } = useSelector((state) => state.auth);

  const { data: orders, error, isLoading } = useGetOrdersByEmailQuery(user?.email);


  if (isLoading) return <div>Loading...</div>;

  // Calculate total payment
  const totalPayment = orders?.reduce((acc, order) => acc + order.amount, 0).toFixed(2);

  return (
    <div className="py-6 px-4">
      <h3 className="text-xl font-semibold text-blueGray-700 mb-4">Total Payments</h3>
      <div className="bg-black  border border-gray-400 text-white p-8 shadow-lg rounded">
        <p className="text-lg font-medium text-white mb-5">Total Spent: ${totalPayment ? totalPayment : 0}</p>
        <ul>
        
          {
           orders && orders.map((item, index) => (
              <li key={index}>
                <h5 className="font-medium text-gray-400 mb-2">Order #{index + 1}</h5>
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-gray-400">Order #{item.id}</span>
                  <span className="text-gray-400">${item.amount.toFixed(2)}</span>
                </div>
                <div className="flex md:flex-row items-center space-x-2">
                  <span className="text-gray-400">Date: {new Date(item.createdAt).toLocaleString()}</span>
                  <p className="text-gray-400">Status: 
                  <span className={`p-1 rounded ml-1 cursor-pointer transition-all duration-300 
                  ${item.status === 'completed' ? 'bg-gray-700 text-white hover:bg-green-500 hover:text-white' :
                  item.status === 'pending' ? 'bg-gray-700 text-white hover:bg-red-500 hover:text-white' :
                  item.status === 'processing' ? 'bg-gray-700 text-white hover:bg-blue-500 hover:text-white' :
                  'bg-gray-700 text-white hover:bg-indigo-500 hover:text-white'}`}>
                    {item.status}
                </span>

                  </p>
                </div>
                <hr className="my-2" />
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  );
}

export default UserPayments;
