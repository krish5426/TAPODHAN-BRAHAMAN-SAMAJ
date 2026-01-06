import businessDirectoryIcon from '../images/Business-directory.svg';
import matrimonialIcon from '../images/Matrimonial.svg';
import studentLifeIcon from '../images/Student-Life.svg';
import donateIcon from '../images/donate1.svg';
import contactIcon from '../images/Contact.svg';

const Services = () => {
  const services = [
    {
      id: 1,
      title: 'BUSINESS DIRECTORY',
      icon: matrimonialIcon
    },
    {
      id: 2,
      title: 'MATRIMONIAL',
      icon: matrimonialIcon
    },
    {
      id: 3,
      title: 'STUDENT LIFE',
      icon: studentLifeIcon
    },
    {
      id: 4,
      title: 'DONATE',
      icon: donateIcon
    },
    {
      id: 5,
      title: 'CONTACT US',
      icon: contactIcon
    }
  ];

  return (
    <section className="services-section">
      <div className="container">
        <div className="header-section">
          <h4 className="header-label">SERVICES</h4>
          <h2 className="header-title">
            <span>QUICK ACCESS TO ALL</span> 
            <strong> ESSENTIAL COMMUNITY SERVICES</strong>
          </h2>
        </div>
        
        <div className="services-grid">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="service-card"
              onClick={() => console.log(`Clicked ${service.title}`)}
            > 
              <div className="service-icon"> 
                <img src={service.icon} alt={service.title} />
              </div>
              <h3>{service.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;