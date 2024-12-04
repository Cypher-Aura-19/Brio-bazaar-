import React, { useEffect, useState } from "react";
import dealsImg from "../../assets/deals.png";

const DealsSection = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Define the deadline date
  const deadlineDate = new Date("2024-12-01T00:00:00").getTime();

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime(); // Current time
      const distance = deadlineDate - now; // Difference between deadline and now

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        // When the countdown is over
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval); // Stop the interval when the deadline is reached
      }
    };

    // Set up the interval to update every second
    const interval = setInterval(calculateTimeLeft, 1000);

    // Initial calculation to avoid delay
    calculateTimeLeft();

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, [deadlineDate]);

  return (
    <section className="section__container deals__container  bg-black text-gray-300 py-10 px-6 md:px-12">
      <div className="deals__image mb-6 md:mb-0">
        <img
          src={dealsImg}
          alt="deals"
          className="w-full max-w-md mx-auto rounded-lg"
        />
      </div>
      <div className="deals__content text-center md:text-left">
        <h5 className="text-gray-400 text-lg uppercase font-semibold mb-2">
          Get Up To 20% Discount
        </h5>
        <h4 className="text-white text-3xl font-bold mb-4">
          Deals Of This Month
        </h4>
        <p className="text-gray-400 leading-relaxed mb-6">
          Our Women's Fashion Deals of the Month are here to make your style
          dreams a reality without breaking the bank. Discover a curated
          collection of exquisite clothing, accessories, and footwear, all
          handpicked to elevate your wardrobe.
        </p>
        <div className="deals__countdown flex justify-center md:justify-start items-center gap-4 flex-wrap">
          <div className="deals__countdown__card bg-white text-black px-4 py-3 rounded-md text-center">
            <h4 className="text-2xl font-bold">{timeLeft.days}</h4>
            <p className="text-sm">Days</p>
          </div>
          <div className="deals__countdown__card bg-white text-black px-4 py-3 rounded-md text-center">
            <h4 className="text-2xl font-bold">{timeLeft.hours}</h4>
            <p className="text-sm">Hours</p>
          </div>
          <div className="deals__countdown__card bg-white text-black px-4 py-3 rounded-md text-center">
            <h4 className="text-2xl font-bold">{timeLeft.minutes}</h4>
            <p className="text-sm">Mins</p>
          </div>
          <div className="deals__countdown__card bg-white text-black px-4 py-3 rounded-md text-center">
            <h4 className="text-2xl font-bold">{timeLeft.seconds}</h4>
            <p className="text-sm">Secs</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DealsSection;
