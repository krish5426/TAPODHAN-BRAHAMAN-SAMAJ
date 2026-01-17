import { NavLink } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import logo from '../assets/images/logo.png';
import { Link } from "react-router-dom";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const burgerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const overlayRef = useRef(null);

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (burgerRef.current) {
      burgerRef.current.classList.toggle('active');
    }
    if (mobileMenuRef.current) {
      mobileMenuRef.current.classList.toggle('active');
    }
    if (overlayRef.current) {
      overlayRef.current.classList.toggle('active');
    }
    document.body.style.overflow = !mobileMenuOpen ? 'hidden' : '';
  };

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

  useEffect(() => {
    const closeOnEsc = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        toggleMenu();
      }
    };
    document.addEventListener('keydown', closeOnEsc);
    return () => document.removeEventListener('keydown', closeOnEsc);
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_details');
    setIsLoggedIn(false);
    setUser(null);
    setDropdownOpen(false);
    window.location.href = '/';
  };

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-row">
            <div className="logo-container">
              <a href='/'><img src={logo} className="logo-image" alt="Tapodhan Brahman Samaj Logo" /></a>
            </div>
            <nav className="desktop-nav">
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

            {/* Burger Menu Icon */}
            <div className="burger-menu" ref={burgerRef} onClick={toggleMenu}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay */}
      <div
        className="mobile-menu-overlay"
        ref={overlayRef}
        onClick={toggleMenu}
      ></div>

      {/* Mobile Menu */}
      <div className="mobile-menu" ref={mobileMenuRef}>
        <div className="mobile-menu-header">
          <button className="mobile-menu-close" onClick={toggleMenu}>
            ✕
          </button>
        </div>
        
        <nav className="mobile-nav">
          <ul>
            <li><NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""} onClick={toggleMenu}>Home</NavLink></li>
            <li><NavLink to="/About" className={({ isActive }) => isActive ? "active" : ""} onClick={toggleMenu}>About Us</NavLink></li>
            <li><NavLink to="/events" className={({ isActive }) => isActive ? "active" : ""} onClick={toggleMenu}>Events</NavLink></li>
            <li><NavLink to="/matrimonial" className={({ isActive }) => isActive ? "active" : ""} onClick={toggleMenu}>Matrimonial</NavLink></li>
            <li><NavLink to="/business-contact" className={({ isActive }) => isActive ? "active" : ""} onClick={toggleMenu}>Business Directory</NavLink></li>
            <li><NavLink to="/contact" className={({ isActive }) => isActive ? "active" : ""} onClick={toggleMenu}>Contact us</NavLink></li>
          </ul>
        </nav>

        <div className="mobile-menu-buttons">
          {isLoggedIn ? (
            <>
              <Link to="/profile" className="mobile-menu-btn" onClick={toggleMenu}>Profile</Link>
              <Link to="/my-business" className="mobile-menu-btn" onClick={toggleMenu}>My Business</Link>
              <button className="mobile-menu-btn logout-btn" onClick={() => {
                handleLogout();
                toggleMenu();
              }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-menu-btn">Login</Link>
              <Link to="/signup" className="mobile-menu-btn signup-btn">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;