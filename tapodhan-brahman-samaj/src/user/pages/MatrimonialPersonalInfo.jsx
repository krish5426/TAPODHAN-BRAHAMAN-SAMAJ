import InnerBanner from "../components/InnerBanner";
import registerBanner from '../assets/images/register-banner.jpg';
import Matrimonialpersonalinfo from '../components/Matrimonialpersonalinfo';

const MatrimonialPersonalInfoPage = () => {
  return (
    <>
      <InnerBanner
        title="Matrimonial Personal Info"
        backgroundImage={registerBanner}
        breadcrumb={[
          { label: "Home", link: "/" },
          { label: "Matrimonial Personal Info" }
        ]}
      />
      <Matrimonialpersonalinfo />
    </>
  );
};

export default MatrimonialPersonalInfoPage;
