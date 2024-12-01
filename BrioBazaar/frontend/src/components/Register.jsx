/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../redux/features/auth/authApi";
import { FaUser, FaEnvelope, FaLock, FaFacebook, FaGoogle, FaTwitter } from "react-icons/fa";

const Register = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const data = {
      username,
      email,
      password,
    };

    try {
      await registerUser(data).unwrap();
      alert("Registration successful");
      navigate("/login");
    } catch (err) {
      setMessage("Registration failed. Please try again.");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br bg-black p-4">
      <div className="w-full max-w-5xl border border-gray-700 bg-black p-6 sm:p-8 rounded-lg shadow-lg flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2 w-full">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center md:text-left mb-4">
            Join Us
          </h2>
          <p className="text-gray-400 text-center md:text-left mb-6">
            Create an account to get started
          </p>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="relative">
              <FaUser className="absolute top-3 left-3 text-white" />
              <input
                type="text"
                value={username}
                className="w-full bg-black text-white border border-white focus:outline-none focus:ring-2 focus:ring-white pl-10 pr-4 py-2 sm:py-3 rounded-md placeholder-gray-400"
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Username"
                required
              />
            </div>
            <div className="relative">
              <FaEnvelope className="absolute top-3 left-3 text-white" />
              <input
                type="text"
                value={email}
                className="w-full bg-black text-white border border-white focus:outline-none focus:ring-2 focus:ring-white pl-10 pr-4 py-2 sm:py-3 rounded-md placeholder-gray-400"
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
                className="w-full bg-black text-white border border-white focus:outline-none focus:ring-2 focus:ring-white pl-10 pr-4 py-2 sm:py-3 rounded-md placeholder-gray-400"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
            {message && <p className="text-red-500 text-sm text-center">{message}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black font-semibold py-2 sm:py-3 rounded-md transition duration-300 hover:bg-gray-200 flex items-center justify-center gap-2"
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </form>
          <p className="text-gray-400 text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-white underline hover:text-gray-300">
              Login
            </Link>
          </p>
        </div>
        <div className="md:w-1/2 w-full flex flex-col items-center justify-center">
          <p className="text-gray-400 text-center mb-4">Or sign up with</p>
          <div className="flex flex-col gap-4 w-full">
            <button
              className="flex items-center justify-center w-full bg-white text-black border border-gray-300 font-medium py-2 sm:py-3 rounded-md transition duration-300 hover:bg-gray-100 gap-2"
              aria-label="Sign up with Facebook"
            >
              <FaFacebook size={20} className="text-blue-600" />
              Sign up with Facebook
            </button>
            <button
              className="flex items-center justify-center w-full bg-white text-black border border-gray-300 font-medium py-2 sm:py-3 rounded-md transition duration-300 hover:bg-gray-100 gap-2"
              aria-label="Sign up with Google"
            >
              <FaGoogle size={20} className="text-red-500" />
              Sign up with Google
            </button>
            <button
              className="flex items-center justify-center w-full bg-white text-black border border-gray-300 font-medium py-2 sm:py-3 rounded-md transition duration-300 hover:bg-gray-100 gap-2"
              aria-label="Sign up with Twitter"
            >
              <FaTwitter size={20} className="text-blue-400" />
              Sign up with Twitter
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
