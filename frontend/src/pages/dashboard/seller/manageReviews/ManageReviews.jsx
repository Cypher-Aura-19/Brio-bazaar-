import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useFetchAllProductsQuery } from '../../../../redux/features/products/productsApi';
import { Link } from 'react-router-dom';

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const navigate = useNavigate();
  const { seller } = useSelector((state) => state.sellerAuth); // Get logged-in seller info

  const { data: { products = [] } = {}, error, isLoading, refetch } = useFetchAllProductsQuery({
    category: '',
    color: '',
    minPrice: '',
    maxPrice: '',
  });

  // Filter products belonging to the logged-in seller
  const sellerProducts = products.filter((product) => product.author?._id === seller?._id);

  // Extract product IDs of the seller's products
  const sellerProductIds = sellerProducts.map((product) => product._id);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/reviews/total-review');
        const data = await response.json();

        // Filter reviews to only include those whose productId matches the seller's products
        const filteredReviews = data.reviews.filter((review) =>
          sellerProductIds.includes(review.productId?._id)
        );

        setReviews(filteredReviews);
        setTotalReviews(filteredReviews.length);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [sellerProductIds]);

  if (!reviews.length) {
    return <p className="mb-4 text-white font-bold">No reviews available for your products.</p>;
  }

  const handleCardClick = () => {
    navigate('/shop');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Given Reviews</h1>
      <p className="mb-4">Total Reviews: {totalReviews}</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-black shadow-md rounded-lg p-4 border border-gray-700 text-white cursor-pointer hover:scale-105 transition-all duration-200"
          >
            <p className="text-lg font-semibold mb-2">Rating: {review.rating}</p>
            <p className="mb-2 text-gray-200"><strong>Comment:</strong> {review.comment}</p>
            <p className="text-sm text-gray-400 mb-2"><strong>Product Name:</strong> {review.productId?.name}</p>
            <p className="text-sm text-gray-400 mb-2"><strong>Product ID:</strong> {review.productId?._id}</p>
            <p className="text-sm text-gray-400"><strong>Created At:</strong> {new Date(review.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageReviews;
