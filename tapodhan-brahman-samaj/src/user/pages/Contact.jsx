import aboutBanner from '../assets/images/contact-banner.jpg';
import InnerBanner from "../components/InnerBanner";
import Contactform from '../components/Contactform';
import Contactmap from '../components/Contactmap';
import Contactgetstarted from '../components/Contectgetstarted';



const Contact = () => {
  return (
    <>
      <InnerBanner
        title="Contact Us"
        backgroundImage={aboutBanner}
        breadcrumb={[
          { label: "Home", link: "/" },
          { label: "Contact Us" }
        ]}
      />
      <Contactform />
      <Contactmap />
      <Contactgetstarted />
    </>
  );

};

export default Contact;
