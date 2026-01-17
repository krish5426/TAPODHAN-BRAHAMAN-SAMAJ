import InnerBanner from "../components/InnerBanner";
import matroinfo from '../../assets/images/matroinfo.jpg';
import MatrimonialListComponent from '../components/Matrimonial-list';


const Matrimoniallist = () => {
  return (
    <>
      <InnerBanner
        title="Matrimonial profile list"
        backgroundImage={matroinfo}
        breadcrumb={[
          { label: "Home", link: "/" },
          { label: "Matrimonial " }
        ]}
      />
    <MatrimonialListComponent />
    </>
  );
};

export default Matrimoniallist;
