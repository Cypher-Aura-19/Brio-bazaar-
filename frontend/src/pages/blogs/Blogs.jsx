import React from 'react';
import blogsData from '../../data/blogs.json'; 
//for admin
const Blogs = () => {
  // console.log(blogsData)
  return (
    <section className="section__container border border-gray-700 blog__container bg-black">
      <h2 className="section__header text-white">Latest From Blog</h2>
      <p className="section__subheader">
        Elevate your wardrobe with our freshest style tips, trends, and inspiration on our blog.
      </p>
      <div className="md:p-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {blogsData.map(blog => (
          <div className="blog__card bg-black border border-gray-700 cursor-pointer hover:scale-105 transition-all duration-200" key={blog.id}>
            <img src={blog.imageUrl} alt={blog.title} />
            <div className="blog__card__content">
              <h6 className='text-gray-400'>{blog.subtitle}</h6>
              <h4 className='text-white'>{blog.title}</h4>
              <p className='text-gray-400'>{blog.date}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Blogs;
