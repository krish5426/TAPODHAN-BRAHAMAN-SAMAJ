import businessDirectoryIcon from '../assets/images/business.png';
import matrimonialIcon from '../assets/images/Matrimonial.svg';
import studentLifeIcon from '../assets/images/Student-Life.svg';
import donateIcon from '../assets/images/donate1.svg';
import contactIcon from '../assets/images/Contact.svg';
import { Link } from 'react-router-dom';

const Services = () => {
  const services = [
    {
      id: 1,
      title: 'BUSINESS DIRECTORY',
      icon: businessDirectoryIcon,
      link: '/business-contact'
    },
    {
      id: 2,
      title: 'MATRIMONIAL',
      icon: matrimonialIcon,
      link: '/matrimonial'
    },
    {
      id: 3,
      title: 'STUDENT LIFE',
      icon: studentLifeIcon,
      link: '/profile'
    },
    {
      id: 4,
      title: 'DONATE',
      icon: donateIcon,
      link: '/contact'
    },
    {
      id: 5,
      title: 'CONTACT US',
      icon: contactIcon,
      link: '/contact'
    }
  ];

  return (
    <section className="services-section">
      <div className="container">
        <div className="header-section">
          <h4 className="header-label">SERVICES</h4>
          <h2 className="header-title">
            <span>QUICK ACCESS TO ALL</span> <br />
            <strong> ESSENTIAL COMMUNITY SERVICES</strong>
          </h2>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <Link
              key={service.id}
              to={service.link}
              className="service-card"
            >
              <div className="service-icon">
                <img src={service.icon} alt={service.title} />
              </div>
              <h3>{service.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Services;