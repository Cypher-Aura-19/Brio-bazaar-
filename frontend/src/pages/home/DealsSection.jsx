import React, { useEffect, useState } from "react";
import { useGetPromotionsQuery } from "../../redux/features/promotion/discountPromotionApi"; // Ensure the correct path for the API hook
import dealsImg from "../../assets/discount offer.png";

const DealsSection = () => {
  const [currentPromotionIndex, setCurrentPromotionIndex] = useState(0);
  const { data: promotions, isLoading, error } = useGetPromotionsQuery();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!promotions || promotions.length === 0) return;

    const promotion = promotions[currentPromotionIndex];
    const deadlineDate = new Date(promotion.endDate).getTime(); // Use the promotion's end date as the deadline

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
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Set up the interval to update every second
    const interval = setInterval(calculateTimeLeft, 1000);

    // Initial calculation to avoid delay
    calculateTimeLeft();

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, [promotions, currentPromotionIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromotionIndex((prevIndex) => (prevIndex + 1) % promotions.length); // Loop through promotions
    }, 5000); // Change promotion every 5 seconds

    return () => clearInterval(interval);
  }, [promotions]);

  if (isLoading) {
    return (
      <section className="section__container deals__container bg-black text-gray-300 py-12 px-6 md:px-12">
        <div className="text-center text-white">Loading promotions...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section__container deals__container bg-black text-gray-300 py-10 px-6 md:px-12">
        <div className="text-center text-red-500">Error loading promotions.</div>
      </section>
    );
  }

  const promotion = promotions && promotions.length > 0 ? promotions[currentPromotionIndex] : null;

  return (
    <section className="section__container deals__container bg-black text-gray-300 py-10 px-6 md:px-12">
      <div className="deals__image mb-6 md:mb-0">
        <img
          src={dealsImg}
          alt="deals"
          className="w-full max-w-md mx-auto rounded-lg"
        />
      </div>
      <div className="deals__content text-center md:text-left">
        {promotion ? (
          <>
            <h5 className="text-gray-400 text-lg uppercase font-semibold mb-2">
              Get Up To {promotion.discountPercentage}% Discount
            </h5>
            <h4 className="text-white text-3xl font-bold mb-4">
              {promotion.applyToAll ? "Deals Of This Month" : `Deal on ${promotion.productId.name}`}
            </h4>
            <p className="text-gray-400 leading-relaxed mb-6">
              {promotion.applyToAll
                ? "Enjoy a discount on all products!"
                : `Get a discount on ${promotion.productId.name}`}
            </p>
          </>
        ) : (
          <div className="text-gray-400">No active promotions at the moment.</div>
        )}
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
//for admin