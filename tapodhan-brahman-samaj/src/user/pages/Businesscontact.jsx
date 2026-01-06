import businessContactImg from '../assets/images/contactpage.png';
import InnerBanner from "../components/InnerBanner";

const BusinessContactPage = () => {
  return (
    <>
      <InnerBanner
        title="Business Contact"
        backgroundImage={businessContactImg}
        breadcrumb={[
          { label: "Home", link: "/" },
          { label: "Business Contact" }
        ]}
      />
    </>
  );
};

export default BusinessContactPage;
