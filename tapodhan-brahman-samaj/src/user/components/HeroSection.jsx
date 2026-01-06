import React, { useState, useEffect } from 'react';

import gallery1 from '../assets/images/banner1.png';
import gallery2 from '../assets/images/gallery2.jpg';
import gallery3 from '../assets/images/gallery3.jpg';
import gallery4 from '../assets/images/gallery4.jpg';
import gallery5 from '../assets/images/gallery5.jpg';
import gallery6 from '../assets/images/gallery6.jpg';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const backgroundImages = [
    gallery1,
    gallery2,
    gallery3,
    gallery4,
    gallery5,
    gallery6
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