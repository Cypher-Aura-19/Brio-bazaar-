import React, { useEffect } from 'react';
// React Icons for the close button
import { useDispatch, useSelector } from 'react-redux';
import OrderSummary from './OrderSummary';
import { removeFromCart, updateQuantity } from '../../redux/features/cart/cartSlice';

const CartModal = ({ isOpen, onClose, products }) => {

  // console.log(products)
  const dispatch = useDispatch();

  const handleQuantity = (type, id) => {
    // console.log(id)
    const payload = { type, id }
    dispatch(updateQuantity(payload))
  }
  const handleRemove = (e, id) => {
    e.preventDefault();
    dispatch(removeFromCart({ id }));
  };



  return (
    <div

      className={`fixed z-[1000] inset-0 bg-black bg-opacity-80 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      style={{ transition: 'opacity 300ms' }}
    >
      <div

        className={`fixed right-0 top-0 md:w-1/3 w-full bg-black border border-gray-700 h-full overflow-y-auto transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} style={{ transition: 'transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
        <div
          className="p-4 mt-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xl text-white font-semibold">Your Cart</h4>
            <button
              onClick={() => onClose()}
              className="text-gray-600 hover:text-gray-900">
              <i className="ri-xrp-fill bg-black p-1 text-white"></i>
            </button>
          </div>
          <div className="cart-items">
            {products.length === 0 ? (
              <p className='text-gray-400'>Your cart is empty.</p>
            ) : (
              products.map((item, index) => (
                <div key={index} className="flex flex-col md:flex-row md:items-center md:justify-between shadow-md md:p-5 p-2 mb-4">
                  <div className='flex items-center'>
                    <span className='mr-4 px-1 bg-black text-white rounded-full'>0{index + 1}</span>
                    <img src={item.image} alt={item.name} className="size-12 object-cover mr-4" />
                    <div>
                      <h5 className="text-lg text-white font-medium">{item.name}</h5>
                      <p className="text-gray-400 text-sm">${Number(item.price).toFixed(2)}</p>
                    </div>
                  </div>


                  <div className="flex flex-row md:justify-start justify-end items-center mt-2">
                    <button
                   
                      onClick={() => handleQuantity("decrement", item._id)}
                      className="size-6 flex items-center justify-center px-1.5 rounded-full bg-white text-black hover:bg-gray-300 ml-8"
                    >
                      -
                    </button>
                    <span className="px-2 text-center mx-1" >{item.quantity}</span>
                    <button
                      onClick={() => handleQuantity("increment", item._id)}
                      className="size-6 flex items-center justify-center px-1.5 rounded-full bg-white text-black hover:bg-gray-300 "
                    >
                      +
                    </button>
                    <div className='ml-5'>
                      <button
                        onClick={(e) => handleRemove(e, item._id)}
                        className="text-gray-400 hover:text-white mr-4">Remove</button>
                    </div>
                  </div>


                </div>
              ))
            )}
          </div>
          {products.length > 0 && (
            <OrderSummary/>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;