import logo from '../assets/images/logo.png';
import twitter from '../assets/images/twitter.svg';
import facebook from '../assets/images/facebook.svg';
import whatsapp from '../assets/images/whatsapp.svg';
import instagram from '../assets/images/instagram.svg';
import { Link } from 'react-router-dom';
const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-left">
            <div className="footer-logo">
              <img src={logo} alt="Tapodhan Brahman Samaj" />
            </div>
            <p>The Trust is registered under the Gujarat Public Trust Act, 2011 with Registration No. A-1090 / PATAN, and is governed by the Charity Commissioner's Office, Patan, Gujarat (India)</p>
            <div className="footer-social">
              <a href="#" className="social-icon"> <img src={twitter} alt="Twitter" /></a>
              <a href="#" className="social-icon"> <img src={facebook} alt="Facebook" /></a>
              <a href="#" className="social-icon"> <img src={whatsapp} alt="Whatsapp" /></a>
              <a href="#" className="social-icon"> <img src={instagram} alt="Instagram" /></a>
            </div>
          </div>
          <div className="footer-links">
            <div className="footer-column-row">
              <div className="footer-column">
                <h4>USEFUL LINKS</h4>
                <ul>
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/about">About</Link></li>
                  <li><Link to="/contact">Contact Us</Link></li>
                  <li><Link to="/matrimonial">Matrimonial</Link></li>
                  <li><Link to="/events">Events</Link></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>QUICK LINKS</h4>
                <ul>
                  <li><Link to="/business-contact">Business Directory</Link></li>
                  <li><Link to="/signup">Register</Link></li>
                  <li><Link to="/login">Login</Link></li>
                  <li><Link to="/profile">Profile</Link></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>CONTACT DETAILS</h4>
                <div className="contact-info">
                  <p><strong>Phone :</strong><br />978857xxxx | 928857xxxx</p>
                  <p><strong>Email :</strong><br />lorem@gmail.com</p>
                </div>
              </div>
            </div>
            <div className="footer-bottom">
              <p>Copyright @ 2026 Tapodhan Brahman Samaj Charitable Trust | All Rights Reserved</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;