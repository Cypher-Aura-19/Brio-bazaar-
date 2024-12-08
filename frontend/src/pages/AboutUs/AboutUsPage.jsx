import React from "react";
import briobazaar from "../../assets/briobazaar.jpg";
//for admin
const AboutUsPage = () => {
  return (
    <div className="bg-black text-gray-400 min-h-screen">
      <section className="section__container bg-black shadow-lg border border-gray-700 text-gray-400">
  <h2 className="section__header text-white">About Us</h2>
  <p className="section__subheader">
    Discover our story, values, and commitment to providing high-quality
    products and exceptional service.
  </p>
</section>


      <section className="section__container">
        <div className="w-full mb-12 flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="w-full md:w-1/2">
            <img
              src={briobazaar}
              alt="Company Image"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h3 className="text-xl font-semibold mb-4 text-white">Our Mission</h3>
            <p className="text-lg">
              We are committed to offering a curated selection of high-quality
              fashion pieces that fit every style and occasion. Our mission is
              to empower individuals through fashion, offering affordable yet
              trendy choices for everyone.
            </p>
            <h3 className="text-xl font-semibold mt-8 mb-4 text-white">Our Values</h3>
            <ul className="list-disc pl-6 text-lg">
              <li>Quality craftsmanship in every product.</li>
              <li>Commitment to sustainability and ethical practices.</li>
              <li>Customer-first approach with personalized service.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section__container  text-gray-400">
        <h2 className="section__header text-white">Why Choose Us?</h2>
        <p className="section__subheader">
          Learn why we’re the trusted choice for fashion lovers everywhere.
        </p>
        <div className="w-full mt-12 flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="w-full md:w-1/3 text-center">
            <h3 className="text-lg font-semibold mb-4 text-white">Top Quality</h3>
            <p>
              Every product we sell is handpicked to meet the highest standards
              of quality and durability.
            </p>
          </div>
          <div className="w-full md:w-1/3 text-center">
            <h3 className="text-lg font-semibold mb-4 text-white">
              Customer Satisfaction
            </h3>
            <p>
              Our priority is your satisfaction. We ensure a smooth shopping
              experience, from browsing to delivery.
            </p>
          </div>
          <div className="w-full md:w-1/3 text-center">
            <h3 className="text-lg font-semibold mb-4 text-white">Fast Shipping</h3>
            <p>
              We offer fast and reliable shipping, ensuring your products arrive
              on time and in perfect condition.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
