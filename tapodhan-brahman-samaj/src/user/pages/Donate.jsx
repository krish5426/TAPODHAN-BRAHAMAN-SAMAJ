import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DonateSection from '../components/DonateSection';
import Innerbanner from '../components/InnerBanner';
import donateBanner from '../assets/images/donate-banner.png';

const Donate = () => {
  const breadcrumb = [
    { label: 'Home', link: '/' },
    { label: 'Donate' }
  ];

  return (
    <div>
      <Header />
      <Innerbanner title="Donate" breadcrumb={breadcrumb} backgroundImage={donateBanner} />
      <DonateSection />
    </div>
  );
};

export default Donate;
