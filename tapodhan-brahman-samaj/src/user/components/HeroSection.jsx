import React, { useState, useEffect } from 'react';

import banner01 from '../assets/images/banner01.jpg';
import banner02 from '../assets/images/banner02.jpg';
import banner03 from '../assets/images/banner03.jpg';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const backgroundImages = [
    banner02,
    banner03,
    banner01
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <section className="hero-section">
      <div className="hero-slider">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
      </div>

      <div className="hero-content">
        <div className='container'>
          <div className="hero-text">
            <h2>Welcome to</h2>
            <h1>Tapodhan Brahman Samaj<br />
              Charitable Trust (TBSCT)</h1>
            <p>Come, join hands with our vibrant community and be a part of something meaningful.</p>
            <button className="read-more-btn"><span>Get Started</span></button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;