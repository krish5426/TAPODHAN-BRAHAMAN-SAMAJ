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
      title: 'Business Directory',
      icon: businessDirectoryIcon,
      link: '/business-contact'
    },
    {
      id: 2,
      title: 'Matrimonial',
      icon: matrimonialIcon,
      // link: '/matrimonial'
      link: ''
    },
    {
      id: 3,
      title: 'Student Life',
      icon: studentLifeIcon,
      link: '/profile'
    },
    {
      id: 4,
      title: 'Donate',
      icon: donateIcon,
      link: '/donate'
    },
    {
      id: 5,
      title: 'Contact Us',
      icon: contactIcon,
      link: '/contact'
    }
  ];

  return (
    <section className="services-section">
      <div className="container">
        <div className="header-section">
          <h4 className="header-label">Services</h4>
          <h2 className="header-title">
            <span>Quick access to all</span> <br />
            <strong> essential community services</strong>
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