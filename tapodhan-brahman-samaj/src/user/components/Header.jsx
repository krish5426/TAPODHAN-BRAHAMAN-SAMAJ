import { NavLink } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-row">
          <div className="logo-container">
            <a href='/'><img src={logo} className="logo-image" alt="Tapodhan Brahman Samaj Logo" /></a>
          </div>
          <nav>
            <ul><li>
              <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>
                Home
              </NavLink></li>
              <li><NavLink to="/About" className={({ isActive }) => isActive ? "active" : ""}>
                About Us
              </NavLink></li>
              <li><NavLink to="/events" className={({ isActive }) => isActive ? "active" : ""}>
                Events
              </NavLink></li>
              <li> <NavLink to="/matrimonial" className={({ isActive }) => isActive ? "active" : ""}>
                Matrimonial
              </NavLink></li>
              <li> <NavLink to="/business-contact" className={({ isActive }) => isActive ? "active" : ""}>
                Business Directory
              </NavLink></li> <li> <NavLink to="/contact" className={({ isActive }) => isActive ? "active" : ""}>
                Contact us
              </NavLink></li>
            </ul>
          </nav>
          <div className="header-buttons-cols">
            <Link to="/signup" className="header-button dark-button">Sign Up</Link>
            <Link to="/login" className="header-button">Login</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;