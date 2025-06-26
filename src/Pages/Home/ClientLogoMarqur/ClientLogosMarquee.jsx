// src/components/ClientLogoSlider.jsx
import React from "react";
import Marquee from "react-fast-marquee";
import logo1 from '../../../assets/assets/brands/amazon.png';
import logo2 from '../../../assets/assets/brands/amazon_vector.png';
import logo3 from '../../../assets/assets/brands/casio.png';
import logo4 from '../../../assets/assets/brands/moonstar.png';
import logo5 from '../../../assets/assets/brands/randstad.png';
import logo6 from '../../../assets/assets/brands/start-people 1.png';
import logo7 from '../../../assets/assets/brands/start.png';
const logos=[logo1,logo2,logo3,logo4,logo5,logo6,logo7]

const ClientLogosMarquee = () => {
 

  return (
    <section className="bg-gray-50 py-10">
      <h2 className="text-2xl text-primary font-bold text-center mb-6">
        Trusted by Leading Brands
      </h2>

      {/* Marquee does all the scrolling work */}
      <Marquee
        /* --- key props --- */
        direction="right"   // slides L → R
        speed={50}          // pixels per second (adjust as you like)
        gradient={false}    // no fading edges
        pauseOnHover        // stops when the user hovers
        autoFill            // duplicates children so there’s never a gap
        /* optional Tailwind styling */
        className="gap-16"  // horizontal spacing between logos
      >
        {logos.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Client logo ${i + 1}`}
            className="h-6 w-auto mx-8 select-none"
            draggable={false}
          />
        ))}
      </Marquee>
    </section>
  );
};

export default ClientLogosMarquee;
