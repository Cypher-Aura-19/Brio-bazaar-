import React, { useState } from 'react';
import { formatDate } from '../../../utils/dateFormater';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { usePostReviewMutation } from '../../../redux/features/reviews/reviewApi';
import { useFetchProductByIdQuery } from '../../../redux/features/products/productsApi';

const PostAReview = ({ isModalOpen, handleClose }) => {
    const { id } = useParams();
    const { user } = useSelector((state) => state.auth);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [postReview] = usePostReviewMutation();

    const { refetch } = useFetchProductByIdQuery(id, {
        skip: !id,
    });

    const handleRating = (value) => {
        setRating(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Submit the review
        console.log(`Rating: ${rating}, Comment: ${comment}`);
        const newComment = {
            comment: comment,
            rating: rating,
            userId: user?._id,
            productId: id
        }
        try {
            const response = await postReview(newComment).unwrap();
            console.log(response)
            alert('Comment posted successfully!')
            setRating(0);
            setComment('');
            refetch();
        } catch (err) {
            alert(err.message);
        }
        handleClose();
    };

    return (
        <div
            className={`fixed inset-0 bg-black/90 flex items-center justify-center z-40 px-2 ${isModalOpen ? 'block' : 'hidden'
                }`}
        >
            <div className="bg-black border border-gray-700 p-6 rounded-md shadow-lg w-96 z-50">
                <h2 className="text-lg text-white font-bold mb-4">Post a Review</h2>

                <div className="flex items-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            onClick={() => handleRating(star)}
                            className="cursor-pointer text-white text-xl"
                        >
                            {rating >= star ? (
                                <i className="ri-star-fill"></i>
                            ) : (
                                <i className="ri-star-line"></i>
                            )}
                        </span>
                    ))}
                </div>

                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="4"
                    className="w-full border border-gray-400 p-2 bg-black rounded-md mb-4"
                    placeholder="Write your comment here..."
                />

                <div className="flex justify-end gap-2">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-gray-400 text-white 00 rounded-md flex items-center gap-2"
                    >
                        <i className="ri-close-line"></i> Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-white text-black font-semibold rounded-md transition duration-300 hover:bg-gray-200 text-black rounded-md flex items-center gap-2"
                    >
                        <i className="ri-check-line"></i> Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostAReview;
