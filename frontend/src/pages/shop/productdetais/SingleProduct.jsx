import React from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useFetchProductByIdQuery } from "../../../redux/features/products/productsApi";
import {
  useAddFavoriteProductMutation,
  useRemoveFavoriteProductMutation,
  useGetFavoriteProductsQuery,
} from "../../../redux/features/auth/authApi";
import RatingStars from "../../../components/RatingStars";
import { addToCart } from "../../../redux/features/cart/cartSlice";
import ReviewsCard from "../reviews/ReviewsCard";
import { PuffLoader } from "react-spinners";

const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Fetch the logged-in user from Redux state
  const { user } = useSelector((state) => state.auth);

  // Fetch product by ID
  const { data, error, isLoading } = useFetchProductByIdQuery(id);

  // Fetch user's favorite products
  const { data: favoritesData, isLoading: favoritesLoading, refetch } = useGetFavoriteProductsQuery(user?._id, {
    skip: !user, // Skip if user is not logged in
  });

  // Mutations for adding and removing from favorites
  const [addFavoriteProduct, { isLoading: isAddingToFavorites }] = useAddFavoriteProductMutation();
  const [removeFavoriteProduct, { isLoading: isRemovingFromFavorites }] = useRemoveFavoriteProductMutation();

  // Extract data
  const singleProduct = data?.product || {};
  const productReviews = data?.reviews || [];
  const favoriteProductIds = favoritesData?.favorites || [];

  // Check if the product is already in favorites
  const isProductInFavorites = favoriteProductIds.includes(singleProduct._id);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const toggleFavorite = async (productId) => {
    if (!user) {
      alert("You need to be logged in to manage favorites.");
      return;
    }

    try {
      if (isProductInFavorites) {
        // Remove from favorites
        await removeFavoriteProduct({ userId: user._id, productId }).unwrap();
        alert("Product removed from favorites!");
        // Update the favorites locally without refresh
        refetch(); // Refetch favorites list to ensure UI is updated
      } else {
        // Add to favorites
        await addFavoriteProduct({ userId: user._id, productId }).unwrap();
        alert("Product added to favorites!");
        // Update the favorites locally without refresh
        refetch(); // Refetch favorites list to ensure UI is updated
      }
    } catch (error) {
      console.error("Failed to toggle favorite status:", error);
      alert(error?.data?.message || "Failed to toggle favorite status.");
    }
  };

  if (isLoading || favoritesLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PuffLoader color="black" size={100} />
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Error loading product details.</p>
      </div>
    );

  return (
    <div className="bg-black text-gray-400 min-h-screen">
      <section className="section__container border border-gray-700 rounded bg-black">
        <h2 className="section__header text-white">Single Product Page</h2>
        <div className="section__subheader space-x-2">
          <span className="hover:text-white">
            <Link to="/">home</Link>
          </span>
          <i className="ri-arrow-right-s-line"></i>
          <span className="hover:text-white">
            <Link to="/shop">shop</Link>
          </span>
          <i className="ri-arrow-right-s-line"></i>
          <span className="hover:text-white">{singleProduct.name}</span>
        </div>
      </section>

      <section className="section__container mt-8">
        <div className="flex flex-col items-center md:flex-row gap-8">
          {/* Product Image */}
          <div className="w-full md:w-1/2">
            <img
              src={singleProduct.image}
              alt={singleProduct.name}
              className="rounded-md w-full h-auto object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="w-full md:w-1/2">
            <h3 className="text-2xl font-semibold mb-4 text-white">
              {singleProduct.name}
            </h3>
            <p className="text-xl text-gray-400 mb-4">
              ${singleProduct.price}{" "}
              {singleProduct.oldPrice && <s>${singleProduct.oldPrice}</s>}
            </p>
            <p className="mb-4">{singleProduct.description}</p>

            {/* Additional Product Information */}
            <div className="flex flex-col space-y-2">
              <p>
                <strong className="text-white">Category:</strong>{" "}
                {singleProduct.category}
              </p>
              <p>
                <strong className="text-white">Color:</strong>{" "}
                {singleProduct.color}
              </p>
              <div className="flex gap-1 items-center">
                <strong className="text-white">Rating:</strong>
                <RatingStars rating={singleProduct.rating} />
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(singleProduct);
              }}
              className="mt-6 px-6 py-3 bg-white text-black font-semibold rounded-md transition duration-300 hover:bg-gray-200 flex items-center justify-center gap-2"
            >
              Add to Cart
            </button>

            {/* Toggle Favorites Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(singleProduct._id);
              }}
              disabled={isAddingToFavorites || isRemovingFromFavorites}
              className={`mt-4 px-6 py-3 ${
                isProductInFavorites ? "bg-green-700" : "bg-gray-700 hover:bg-gray-600"
              } text-white font-semibold rounded-md transition duration-300 flex items-center justify-center gap-2`}
            >
              {isAddingToFavorites || isRemovingFromFavorites
                ? "Processing..."
                : isProductInFavorites
                ? "Remove from Favorites"
                : "Add to Favorites"}
            </button>
          </div>
        </div>
      </section>

      {/* Display Reviews */}
      <section className="section__container mt-8">
        <ReviewsCard productReviews={productReviews} />
      </section>
    </div>
  );
};

export default SingleProduct;
