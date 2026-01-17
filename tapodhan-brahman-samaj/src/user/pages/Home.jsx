
import HeroSection from '../components/HeroSection'
import MatrimonialHero from '../components/MatrimonialHero'
import Services from '../components/Services'
import Events from '../components/Events'
import Gallery from '../components/Gallery'
import Contact from '../components/Contact'
import Homeabout from '../components/Homeabout'


const Home = () => {
  return (
    <>
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
