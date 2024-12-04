import React from 'react';

const ErrorPage = () => {
  return (
    <main className="grid min-h-screen place-items-center bg-black px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
      <div className="text-center animate-fade-in">
        {/* Status Code */}
        <p className="text-base font-semibold text-gray-400">404</p>

        {/* Main Heading */}
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
          Page not found
        </h1>

        {/* Supporting Text */}
        <p className="mt-6 text-base leading-7 text-gray-400">
          Sorry, we couldn’t find the page you’re looking for.
        </p>

        {/* Action Links */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
          <a
            href="/"
            className="rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-black shadow-md hover:bg-gray-200 transition duration-300 ease-in-out"
          >
            Go back home
          </a>
          <a
            href="/about-us"
            className="text-sm font-semibold text-gray-400 hover:text-white transition duration-300 ease-in-out"
          >
            About Us <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </main>
  );
};

export default ErrorPage;
