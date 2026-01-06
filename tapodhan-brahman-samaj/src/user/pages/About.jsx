import aboutimage from '../assets/images/about-image.jpg';
import aboutimage2 from '../assets/images/grid-image.png';
import aboutimage3 from '../assets/images/team.jpg';
import aboutBanner from '../assets/images/about-banner.jpg';
import InnerBanner from "../components/InnerBanner";
import IntroSection from "../components/IntroSection";
import AboutFounders from "../components/AboutFounders";
import AboutVisionWork from "../components/AboutVisionWork";
import GlobalCTA from "../components/GlobalCTA";
import ctaBg from "../assets/images/cta-bg.jpg";
import founder1 from '../assets/images/founder1.png';
import founder2 from '../assets/images/unfounder.png';
import founder3 from '../assets/images/founder3.png';
import founder4 from '../assets/images/unfounder.png';
import founder5 from '../assets/images/founder5.png';
import founder6 from '../assets/images/founder6.png';
import founder7 from '../assets/images/founder7.png';
import founder8 from '../assets/images/founder8.png';
import founder9 from '../assets/images/founder9.png';
import founder10 from '../assets/images/founder10.png';
const About = () => {
  const founders = [
    {
      name: "Late Shri Gautambhai Devshankar Dave",
      image: founder1
    },
    {
      name: "Late Shri Rajnikant Chandulal Raval",
      image: founder2
    },
    {
      name: "Late Shri Pradipbhai Kanchanlal Raval",
      image: founder3
    },
    {
      name: "Shri Hareshkumar Manelkal Raval",
      image: founder4
    },
    {
      name: "Shri Dilipkumar Anandprasad Raval",
      image: founder5
    },
    {
      name: "Shri Mahendrakumar Khemchandas Raval",
      image: founder6
    },
    {
      name: "Shri Dhruvkumar Dineshchandra Dave",
      image: founder7
    },
    {
      name: "Shri Gautambhai Chandulal Raval",
      image: founder8
    },
    {
      name: "Shri Kalpeshkumar Bhanuprasad Raval",
      image: founder9
    },
    {
      name: "Shri Manishkumar Harilal Dave",
      image: founder10
    }
  ];

  return (
    <>

      <InnerBanner
        title="About Us"
        backgroundImage={aboutBanner}
        breadcrumb={[
          { label: "Home", link: "/" },
          { label: "About Us" }
        ]}
      />

      <IntroSection
        tag="About us"
        image={aboutimage}
        title={
          <>
            <strong>Tapodhan Brahman Samaj Charitable Trust (TBSCT) is</strong>{" "}
            a non-profit organization registered under{" "}
            <strong>Gujarat Public Trust Act, 2011</strong>{" "}
            with <strong>Reg. No A-1090 / PATAN </strong>{" "}managed by the Charity Commissioner's Office,
            Patan, Gujarat, India.
          </>
        }
      />
      <AboutFounders founders={founders} />

      <IntroSection
        tag="Mission Statement"
        image={aboutimage2}
        title={
          <>
            To creating <strong>lasting positive</strong><br /> change for underserved <br /><strong>communities</strong> through <strong>education,<br /> health,</strong> and <strong>empowerment.</strong>
          </>
        }
        description={
          <>
            TBSCT is devoted to uphold, protect, and propagate the <br /> eternal Sanatan Dharma and the sacred Brahmanical tradition  <br /> in its purest form.
          </>
        }
        className="mission-statement"
      />
      <AboutVisionWork />
      <IntroSection
        tag="Team"
        image={aboutimage3}
        title={
          <>
            A dedicated team of <strong> staff, volunteers</strong> & <br /> <strong> local leaders who bring expertise, heart,</strong> <br />and <strong>unwavering commitment.</strong>
          </>
        }
        title2={
          <>
            Whether you give your <strong> time, resources, or <br />voice,</strong> when you stand with <strong>TBSC Trust,</strong> <br />you become part of a <strong>family working <br />tirelessly </strong>for a better tomorrow.
          </>
        }
        className="about-team"
      />


      <GlobalCTA
        title={
          <>
            Together, We Don't <br />Just Dream Of A Brighter <br />Future. We Build It.
          </>
        }
        buttonText="Join us Community"
        buttonLink="/join-us"
        backgroundImage={ctaBg}
      />
    </>
  );
};
export default About;
