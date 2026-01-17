import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logo from '../assets/images/logo.png';
import { Link } from "react-router-dom";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_details');
    setIsLoggedIn(false);
    setUser(null);
    setDropdownOpen(false);
    window.location.href = '/';
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
              <div className="user-dropdown">
                <button 
                  className="user-dropdown-btn" 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  Hi, {user?.firstName || 'User'}
                  <span className="dropdown-arrow">{dropdownOpen ? '▲' : '▼'}</span>
                </button>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Profile</Link>
                    <Link to="/my-business" className="dropdown-item" onClick={() => setDropdownOpen(false)}>My Business</Link>
                    <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
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