import twitter from '../assets/images/twitter.svg';
import facebook from '../assets/images/facebook.svg';
import whatsapp from '../assets/images/whatsapp.svg';
import instagram from '../assets/images/instagram.svg'; 9
const Contact = () => {
  return (
    <section className="contact-section">
      <div className="container">
        <div className="contact-content">
          <div className="contact-left">
            <div className="header-section">
              <span className="header-label">Contact Info & Social Media</span>
              <h2 className="header-title">
                <strong><span>Reach Us</span> Easily. <span>Stay</span><br />
                  <span>Connected</span> Effortlessly.</strong>
              </h2>
            </div>
            <p className="contact-description">
              Stay connected with us for regular updates, announcements, and community activities. Let's Connect Across Platforms
            </p>
            <button className="read-more-btn">
              <span>Join us Community</span>
            </button>
          </div>
          <div className="contact-right">
            <div className="contact-info">
              <div className="info-item">
                <h3>Office Address</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod</p>
              </div>

              <div className="info-item">
                <h3>Email Address</h3>
                <p>lorem@gmail.com</p>
              </div>

              <div className="info-item">
                <h3>Contact Number</h3>
                <p>978857xxxx</p>
                <p>928857xxxx</p>
              </div>

              <div className="info-item">
                <h3>Social Media</h3>
                <div className="footer-social">
                  <a href="#" className="social-icon"> <img src={twitter} alt="Twitter" /></a>
                  <a href="#" className="social-icon"> <img src={facebook} alt="Facebook" /></a>
                  <a href="#" className="social-icon"> <img src={whatsapp} alt="Whatsapp" /></a>
                  <a href="#" className="social-icon"> <img src={instagram} alt="Instagram" /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;