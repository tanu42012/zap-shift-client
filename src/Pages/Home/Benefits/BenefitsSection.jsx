import React from 'react';
import tracking from '../../../assets/assets/benefits/tracking.png';
import call from '../../../assets/assets/benefits/call.png';
import support from '../../../assets/assets/benefits/Vector.png';

const benefits = [
  {
    title: 'Live Parcel Tracking',
    description: 'Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment journey and get instant status updates for complete peace of mind',
    image: tracking,
  },
  {
    title: '100% Safe Delivery',
    description: 'We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.',
    image: call,

  },
  {
    title: '24/7 Call Service',
    description: 'Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us..',
    image: support,
  },
];

const BenefitsSection = () => {
  return (
    <section className="py-12 px-4 md:px-12 bg-base-100">
      <h2 className="text-3xl font-bold text-center mb-10">Why Choose Us</h2>
      <div className="flex flex-col gap-6">
        {benefits.map((benefit, i) => (
          <div
            key={i}
            className="card md:card-side bg-base-200 shadow-md"
          >
            {/* Left: Image */}
            <figure className="p-4">
              <img
                src={benefit.image}
                alt={benefit.title}
                className="h-24 w-24 object-contain"
              />
            </figure>

            {/* Middle: Vertical line (only on md+) */}
            <div className="hidden md:flex items-center">
              <div className="w-px h-20 bg-gray-300 mx-4"></div>
            </div>

            {/* Right: Content */}
            <div className="card-body">
              <h3 className="card-title text-xl">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BenefitsSection;
