import React from 'react';
import bannerImg from "../../assets/BrioBazaar.jpg"
import { Link } from 'react-router-dom';
//for admin
const Banner = () => {
  return (
    <header className="section__container header__container bg-black shadow-lg border border-black text-gray-400">
      <div className="header__content z-30">
        <h4 className='text-gray-400'>UP TO 20% DISCOUNT ON</h4>
        <h1 className='text-white'>Brio Bazaar</h1>
        <p>
          Discover the latest trends and express your unique style with our Store. Explore a curated collection of clothing, accessories, and footwear that caters to every taste and occasion.
        </p>
        <button className="btn bg-white text-black font-semibold py-3 rounded-md transition duration-300 hover:bg-gray-200 flex items-center justify-center gap-2"><Link to="/shop">EXPLORE NOW</Link></button>
      </div>
      <div className="header__image">
        <img src={bannerImg} alt="header" />
      </div>
    </header>
  );
};

export default Banner;
