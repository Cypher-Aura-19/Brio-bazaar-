import React, { useState } from 'react';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';
import ProductCards from '../shop/ProductCards';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // Fetch products using the Redux API query
  const { data, error, isLoading } = useFetchAllProductsQuery({ page: 1, limit: 50 });

  // Handle the search functionality
  const handleSearch = () => {
    const query = searchQuery.toLowerCase();

    if (data) {
      // Filter products based on the search query
      const filtered = data.products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );

      // If no products are found, set an empty array, otherwise, set the filtered products
      if (filtered.length === 0) {
        setFilteredProducts([]); // Optionally show a message saying "No products found"
      } else {
        setFilteredProducts(filtered);
      }
    }
  };

  // Handle loading and error states
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching products: {error.message}</div>;
  }

  return (
    <>
      <section className="section__container bg-black border border-b-gray-400">
        <h2 className="section__header">Search Products</h2>
        <p className="section__subheader">
          Browse a diverse range of categories, from chic dresses to versatile accessories. Elevate your style today!
        </p>
      </section>
      
      <section className="section__container">
        <div className="w-full mb-12 flex flex-col md:flex-row items-center justify-center gap-4">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar w-full max-w-4xl p-2 border rounded bg-black text-white"
          />
          <button
            onClick={handleSearch}
            className="search-button w-full md:w-auto py-2 px-8 bg-white text-black font-semibold rounded-md transition duration-300 hover:bg-gray-200 rounded"
          >
            Search
          </button>
        </div>

        {/* Conditional rendering: Show message if no products found */}
        {filteredProducts.length === 0 && searchQuery !== '' ? (
          <p className="text-center text-gray-500">No products found for "{searchQuery}".</p>
        ) : (
          <ProductCards products={filteredProducts.length > 0 ? filteredProducts : data?.products} />
        )}
      </section>
    </>
  );
};

export default Search;
