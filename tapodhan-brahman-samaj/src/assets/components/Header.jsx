import { NavLink } from 'react-router-dom';
import logo from '../images/logo.png';
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-row">
        <div className="logo-container"> 
          <img src={logo} className="logo-image" alt="Tapodhan Brahman Samaj Logo" />
        </div>
          <nav>
            <ul><li>
            <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>
            Home
            </NavLink></li>
           <li><NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>
            About Us
            </NavLink></li> 
           <li> <NavLink to="/events" className={({ isActive }) => isActive ? "active" : ""}>
            Events
            </NavLink></li>
             <li> <NavLink to="/matrimonial" className={({ isActive }) => isActive ? "active" : ""}>
               Matrimonial 
            </NavLink></li>
             <li> <NavLink to="/students" className={({ isActive }) => isActive ? "active" : ""}>
              Students Life
            </NavLink></li> <li> <NavLink to="/contact" className={({ isActive }) => isActive ? "active" : ""}>
               Contact us 
            </NavLink></li>
            </ul>
          </nav>
        <div className="header-buttons-cols">
          <Link to="/donate" className="header-button dark-button">Donate</Link>
          <Link to="/join" className="header-button">Join Us</Link>
        </div>
      </div>
      </div>
    </header>
  );
};

export default Header;