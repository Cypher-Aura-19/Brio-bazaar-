import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetchAllProductsQuery } from "../../redux/features/products/productsApi";
import { useSelector } from "react-redux";
import { useGetFavoriteProductsQuery } from "../../redux/features/auth/authApi"; // Import favorites API hook
import ProductCards from "../shop/ProductCards";

const CategoryPage = () => {
  const { categoryName } = useParams(); // Get category name from URL
  const [filteredProducts, setFilteredProducts] = useState([]);
  const user = useSelector((state) => state.auth.user); // Get logged-in user
  
  // Fetch all products
  const { data: productsData, isLoading: productsLoading, error: productsError } = useFetchAllProductsQuery({
    category: categoryName === "favorites" ? null : categoryName,
    page: 1,
    limit: 50,
  });

  // Fetch favorite product IDs if the user is logged in and category is "favorites"
  const { data: favoritesData, isLoading: favoritesLoading } = useGetFavoriteProductsQuery(user?._id, {
    skip: !user || categoryName !== "favorites",
  });

  useEffect(() => {
    if (categoryName === "favorites" && favoritesData && productsData) {
      // Filter products to match favorite IDs
      const favoriteProductIds = favoritesData?.favorites || [];
      const filtered = productsData.products.filter((product) =>
        favoriteProductIds.includes(product._id)
      );
      setFilteredProducts(filtered);
    } else if (productsData) {
      // Filter products for other categories
      const filtered = productsData.products.filter(
        (product) => product.category.toLowerCase() === categoryName.toLowerCase()
      );
      setFilteredProducts(filtered);
    }
  }, [categoryName, favoritesData, productsData]);

  // Scroll to top when category changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryName]);

  // Loading and error handling
  if (productsLoading || favoritesLoading) {
    return <div>Loading...</div>;
  }

  if (productsError) {
    return <div>Error fetching products: {productsError.message}</div>;
  }

  return (
    <>
      <section className="section__container bg-black border border-b-gray-400">
        <h2 className="section__header capitalize">{categoryName}</h2>
        <p className="section__subheader">
          {categoryName === "favorites"
            ? "Your favorite products in one place!"
            : "Browse a diverse range of categories, from chic dresses to versatile accessories. Elevate your style today!"}
        </p>
      </section>

      {/* Display Product Cards */}
      <div className="section__container">
        {filteredProducts.length === 0 ? (
          <p>No products available in this category.</p>
        ) : (
          <ProductCards products={filteredProducts} />
        )}
      </div>
    </>
  );
};

export default CategoryPage;
