import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logo from '../assets/images/logo.png';
import { Link } from "react-router-dom";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('user_token');
    const userData = localStorage.getItem('user_details');
    
    if (token && userData) {
      try {
        setIsLoggedIn(true);
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user_token');
        localStorage.removeItem('user_details');
      }
    }
  }, []); // Empty dependency array to run only once

  const handleLogout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_details');
    setIsLoggedIn(false);
    setUser(null);
    // Remove window.location.reload() to prevent page reload
  };

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
            {isLoggedIn ? (
              <>
                <Link to="/profile" className="header-button dark-button">Profile</Link>
                <Link to="/" className="header-button" onClick={handleLogout}>Logout</Link>
              </>
            ) : (
              <>
                <Link to="/signup" className="header-button dark-button">Sign Up</Link>
                <Link to="/login" className="header-button">Login</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;