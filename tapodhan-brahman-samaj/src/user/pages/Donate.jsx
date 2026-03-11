import DonateSection from '../components/DonateSection';
import Innerbanner from '../components/InnerBanner';
import donateBanner from '../assets/images/donate-banner.png';

const Donate = () => {
  const breadcrumb = [
    { label: 'Home', link: '/' },
    { label: 'Donate' }
  ];

  return (
    <>
      <Innerbanner title="Donate" breadcrumb={breadcrumb} backgroundImage={donateBanner} />
      <DonateSection />
    </>
  );
};

export default Donate;
