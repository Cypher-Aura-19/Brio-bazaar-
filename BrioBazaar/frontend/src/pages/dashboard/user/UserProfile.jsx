import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEditProfileMutation } from '../../../redux/features/auth/authApi';
import { setUser } from '../../../redux/features/auth/authSlice';
import avatarImg from "../../../assets/avatar.png";

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [editProfile, { isLoading, isError, isSuccess, error }] = useEditProfileMutation();

  const [formData, setFormData] = useState({
    username: '',
    profileImage: '',
    bio: '',
    profession: '',
    userId: ''
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        profileImage: user.profileImage || '',
        bio: user.bio || '',
        profession: user.profession || '',
        userId: user._id || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedUser = {
      username: formData.username,
      profileImage: formData.profileImage,
      bio: formData.bio,
      profession: formData.profession,
      userId: formData.userId
    };

    try {
      const response = await editProfile(updatedUser).unwrap();
      dispatch(setUser(response.user)); // Update Redux state
      localStorage.setItem('user', JSON.stringify(response.user)); // Update local storage
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Failed to update profile. Please try again.');
    }

    setIsModalOpen(false); // Close the modal after submission
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-black border text-white border-gray-700 shadow-md rounded-lg p-6">
        <div className="flex items-center mb-4">
          <img
            src={formData.profileImage || avatarImg}
            alt="Profile"
            className="w-32 h-32 object-cover rounded-full"
          />
          <div className="ml-6">
            <h2 className="text-2xl font-bold">Username: {formData.username || 'N/A'}</h2>
            <p className="text-gray-400">User Bio: {formData.bio || 'N/A'}</p>
            <p className="text-gray-400">Profession: {formData.profession || 'N/A'}</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="ml-auto text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3H4a1 1 0 00-1 1v14a1 1 0 001 1h7m2 0h7a1 1 0 001-1V4a1 1 0 00-1-1h-7m-2 0v14"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Modal for Editing */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-black border border-gray-700 text-white p-6 rounded-lg md:w-96 max-w-xl mx-auto relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-400">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full border border-gray-400 bg-black rounded-md shadow-sm"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="profileImage" className="block text-sm font-medium text-gray-400">Profile Image URL</label>
                <input
                  type="text"
                  name="profileImage"
                  value={formData.profileImage}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full border border-gray-400 bg-black rounded-md shadow-sm"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-400">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full border border-gray-400 bg-black rounded-md shadow-sm"
                  rows="3"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="profession" className="block text-sm font-medium text-gray-400">Profession</label>
                <input
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full border border-gray-400 bg-black rounded-md shadow-sm"
                />
              </div>

              <button
                type="submit"
                className={`mt-4 w-full bg-white text-black font-semibold py-3 rounded-md transition duration-300 hover:bg-gray-200 py-2 px-4 rounded-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              {isError && <p className="mt-2 text-red-500">Failed to update profile. Please try again.</p>}
              {isSuccess && <p className="mt-2 text-green-500">Profile updated successfully!</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
