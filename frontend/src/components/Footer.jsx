import React from 'react';
import instaImg1 from "../assets/download.jpg";
import instaImg2 from "../assets/instagram-2.jpg";
import instaImg3 from "../assets/BrioBazaar.jpg";
import instaImg4 from "../assets/instagram-4.jpg";
import instaImg5 from "../assets/instagram-5.jpg";
import instaImg6 from "../assets/instagram-6.jpg";

const Footer = () => {
  return (
    <>
      <footer className="bg-black text-gray-400 px-6 sm:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Contact Info */}
          <div className="footer__col">
            <h4 className="text-white text-lg font-bold mb-4">CONTACT INFO</h4>
            <p className="flex items-center gap-2 mb-2">
              <i className="ri-map-pin-2-fill text-gray-400"></i>
              123, London Bridge Street, London
            </p>
            <p className="flex items-center gap-2 mb-2">
              <i className="ri-mail-fill text-gray-400"></i>
              support@Lebaba.com
            </p>
            <p className="flex items-center gap-2">
              <i className="ri-phone-fill text-gray-400"></i>
              (+012) 3456 789
            </p>
          </div>

          {/* Company */}
          <div className="footer__col">
            <h4 className="text-white text-lg font-bold mb-4">COMPANY</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-white transition duration-300">Home</a>
              </li>
              <li>
                <a href="/about-us" className="hover:text-white transition duration-300">About Us</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition duration-300">Work With Us</a>
              </li>
              <li>
                <a href="/blogs" className="hover:text-white transition duration-300">Our Blog</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition duration-300">Terms & Conditions</a>
              </li>
            </ul>
          </div>

          {/* Useful Links */}
          <div className="footer__col">
            <h4 className="text-white text-lg font-bold mb-4">USEFUL LINK</h4>
            <ul className="space-y-2">
              <li>
                <a href="/about-us" className="hover:text-white transition duration-300">Help</a>
              </li>
              <li>
                <a href="/dashboard/orders" className="hover:text-white transition duration-300">Track My Order</a>
              </li>
              <li>
                <a href="/shop" className="hover:text-white transition duration-300">Men</a>
              </li>
              <li>
                <a href="/shop" className="hover:text-white transition duration-300">Women</a>
              </li>
              <li>
                <a href="/shop" className="hover:text-white transition duration-300">Dresses</a>
              </li>
            </ul>
          </div>

          {/* Instagram Gallery */}
          <div className="footer__col">
            <h4 className="text-white text-lg font-bold mb-4">INSTAGRAM</h4>
            <div className="grid grid-cols-3 gap-2">
              <img src={instaImg1} alt="instagram" className="hover:opacity-75 transition duration-300 rounded" />
              <img src={instaImg2} alt="instagram" className="hover:opacity-75 transition duration-300 rounded" />
              <img src={instaImg3} alt="instagram" className="hover:opacity-75 transition duration-300 rounded" />
              <img src={instaImg4} alt="instagram" className="hover:opacity-75 transition duration-300 rounded" />
              <img src={instaImg5} alt="instagram" className="hover:opacity-75 transition duration-300 rounded" />
              <img src={instaImg6} alt="instagram" className="hover:opacity-75 transition duration-300 rounded" />
            </div>
          </div>
        </div>
      </footer>
      <div className="bg-black text-gray-500 text-center py-4">
        Copyright © BrioBazaar. All rights reserved.
      </div>
    </>
  );
};

export default Footer;
//for admin