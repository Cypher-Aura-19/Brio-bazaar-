import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';

const ProductCards = ({ products }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  return (
    <section className="section__container  product__container bg-black">
      <h2 className="section__header text-white">Our Latest Products</h2>
      <p className="section__subheader text-gray-400">
        Discover the finest selection of products tailored just for you.
      </p>
      <div className="md:p-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 rounded-lg">
        {products.map((product) => (
          <div
            key={product._id}
            className="product__card bg-black border border-gray-700 cursor-pointer hover:scale-105 transition-all duration-200 rounded-lg"
          >
            {/* Product Image */}
            <Link to={`/shop/${product._id}`}>
              <div className="w-full h-48 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-t-lg"
                />
              </div>
            </Link>

            {/* Product Details */}
            <div className="product__card__content text-center mt-4">
              <h6 className="text-gray-400">{product.category}</h6>
              <h4 className="text-white text-lg font-semibold">{product.name}</h4>

              {/* Price */}
              <p className="mt-2 text-gray-400">
                <span className="text-gray-400 text-lg">${product.price}</span>
                {product.oldPrice && (
                  <span className="text-gray-400 line-through ml-2">${product.oldPrice}</span>
                )}
              </p>

              {/* Rating */}
              <div className="flex justify-center items-center mt-2">
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={`${
                      i < product.rating ? 'text-white' : 'text-gray-400'
                    } ri-star-fill`}
                  ></i>
                ))}
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(product)}
                className="mt-4 px-4 py-2 bg-white text-black font-semibold rounded-md transition duration-300 hover:bg-gray-200 font-medium rounded-lg  transition"
              >
                Add To Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductCards;
