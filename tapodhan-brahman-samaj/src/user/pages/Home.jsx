
import HeroSection from '../components/HeroSection'
import MatrimonialHero from '../components/MatrimonialHero'
import Services from '../components/Services'
import Events from '../components/Events'
import Gallery from '../components/Gallery'
import Contact from '../components/Contact'
import Homeabout from '../components/Homeabout'
import { useState, useEffect } from 'react';
import shivMahapuranImg from '../assets/images/shiv-mahapuran-parayan.png';

const Home = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Check if the popup has already been shown in this session
    const isPopupShown = sessionStorage.getItem('homePopupShown');
    if (!isPopupShown) {
      setShowPopup(true);
      sessionStorage.setItem('homePopupShown', 'true');
    }
  }, []);

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      {showPopup && (
        <div className="home-popup-overlay" onClick={closePopup}>
          <div className="home-popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="home-popup-close" onClick={closePopup}>&times;</button>
            <a href="/shiv-mahapuran-parayan.pdf" target="_blank" rel="noopener noreferrer">
              <img src={shivMahapuranImg} alt="Shiv Mahapuran Parayan" className="home-popup-image" />
            </a>
          </div>
        </div>
      )}
      <HeroSection />
      <Services />
      <Homeabout />
      <MatrimonialHero />
      <Events />
      <Gallery />
    </>
  );
};

export default Home;
