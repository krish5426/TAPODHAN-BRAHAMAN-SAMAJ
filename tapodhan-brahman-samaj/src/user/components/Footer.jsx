import logo from '../assets/images/logo.png';
import twitter from '../assets/images/twitter.svg';
import facebook from '../assets/images/facebook.svg';
import whatsapp from '../assets/images/whatsapp.svg';
import instagram from '../assets/images/instagram.svg';
const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-left">
            <div className="footer-logo">
              <img src={logo} alt="Tapodhan Brahman Samaj" />
            </div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod</p>
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
                  <li><a href="#">Home</a></li>
                  <li><a href="#">About</a></li>
                  <li><a href="#">Gallery</a></li>
                  <li><a href="#">News</a></li>
                  <li><a href="#">Gallery</a></li>
                  <li><a href="#">Contact Us</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>OUR SERVICES</h4>
                <ul>
                  <li><a href="#">Matrimonial</a></li>
                  <li><a href="#">Students Life</a></li>
                  <li><a href="#">Business Directory</a></li>
                  <li><a href="#">Matrimonial</a></li>
                  <li><a href="#">Events</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>QUICK LINKS</h4>
                <ul>
                  <li><a href="#">Privacy Policy</a></li>
                  <li><a href="#">Terms Condition</a></li>
                  <li><a href="#">Disclaimer</a></li>
                  <li><a href="#">FAQs</a></li>
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