import React, { useState } from 'react';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';
import ProductCards from './ProductCards';

const TrendingProducts = () => {
  const [visibleProducts, setVisibleProducts] = useState(8); // Initial number of visible products
  const { data, error, isLoading } = useFetchAllProductsQuery({ page: 1, limit: 50 }); // Fetch products with a large limit to allow "Load More"

  const loadMoreProducts = () => {
    setVisibleProducts((prevCount) => prevCount + 4);
  };

  // Handle loading and error states
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching products: {error.message}</div>;
  }

  // Ensure data exists and handle visible products
  const products = data?.products || [];

  // Filter products to only include approved ones
  const approvedProducts = products.filter(product => product.approved);

  return (
    <section className="section__container product__container">
      <h2 className="section__header text-white">Trending Products</h2>
      <p className="section__subheader mb-12 text-gray-400">
        Discover the Hottest Picks: Elevate Your Style with Our Curated Collection of Trending Women's Fashion Products.
      </p>

      {/* Product Cards */}
      <ProductCards products={approvedProducts.slice(0, visibleProducts)} />

      {/* Load More Button */}
      <div className="product__btn">
        {visibleProducts < approvedProducts.length && (
          <button
            className="btn bg-white text-black font-semibold py-3 rounded-md transition duration-300 hover:bg-gray-200"
            onClick={loadMoreProducts}
          >
            Load More
          </button>
        )}
      </div>
    </section>
  );
};

export default TrendingProducts;
