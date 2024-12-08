/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useLoginUserMutation } from '../redux/features/auth/authApi';
import { setUser } from '../redux/features/auth/authSlice';
//for admin
const Login = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const [loginUser, { isLoading: loginLoading }] = useLoginUserMutation();

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    localStorage.clear();
    console.log("Local storage cleared before login.");

    const data = {
      email,
      password,
    };

    try {
      const response = await loginUser(data).unwrap();
      const { token, user } = response;
      dispatch(setUser({ user }));
      alert('Login successful');
      navigate('/');
    } catch (err) {
      setMessage('Please provide a valid email and password!');
    }
  };

  return (
    <section className="h-screen flex items-center justify-center bg-gradient-to-br bg-black">
      <div className="w-full max-w-md border border-gray-700 bg-black p-8 rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold text-white text-center mb-4">Welcome Back</h2>
        <p className="text-gray-400 text-center mb-8">Please login to access your account</p>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-white" />
            <input
              type="text"
              value={email}
              className="w-full bg-black text-white border border-white focus:outline-none focus:ring-2 focus:ring-white pl-10 pr-4 py-3 rounded-md placeholder-white"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-white" />
            <input
              type="password"
              value={password}
              className="w-full bg-black text-white border border-white focus:outline-none focus:ring-2 focus:ring-white pl-10 pr-4 py-3 rounded-md placeholder-white"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          {message && <p className="text-red-500 text-sm text-center">{message}</p>}
          <button
            type="submit"
            disabled={loginLoading}
            className="w-full bg-white text-black font-semibold py-3 rounded-md transition duration-300 hover:bg-gray-200 flex items-center justify-center gap-2"
          >
            {loginLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="flex justify-between items-center mt-6">
          <Link to="/seller-login" className="text-sm text-gray-400 hover:text-white">
            Seller Login
          </Link>
          <Link to="/register" className="text-sm text-gray-400 hover:text-white">
            Create an account
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Login;
