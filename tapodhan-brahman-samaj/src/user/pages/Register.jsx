import RegisterBanner from '../assets/images/register-banner.jpg';
import InnerBanner from "../components/InnerBanner";
import Registerform from '../components/Registerform';



const Register = () => {
  return (
    <>
      <InnerBanner
        title="Business directory"
        backgroundImage={RegisterBanner}
        breadcrumb={[
          { label: "Home", link: "/" },
          { label: "Business directory" }
        ]}
      />
      <Registerform />
    </>
  );

};

export default Register;
