import { useEffect, useRef } from "react";
import "./burgermanu.css";

const burgermanu = () => {
  const burgerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const overlayRef = useRef(null);

  const toggleMenu = () => {
    burgerRef.current.classList.toggle("active");
    mobileMenuRef.current.classList.toggle("active");
    overlayRef.current.classList.toggle("active");
    document.body.style.overflow =
      mobileMenuRef.current.classList.contains("active") ? "hidden" : "";
  };

  useEffect(() => {
    const closeOnEsc = (e) => {
      if (e.key === "Escape" && mobileMenuRef.current.classList.contains("active")) {
        toggleMenu();
      }
    };
    document.addEventListener("keydown", closeOnEsc);
    return () => document.removeEventListener("keydown", closeOnEsc);
  }, []);

  return (
    <>
      <header className="header-burger">
        <div className="container-burger">
          <div className="header-row-burger">

            {/* Desktop Nav */}
            <nav>
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/services">Services</a></li>
                <li><a href="/events">Events</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </nav>

            {/* Desktop Buttons */}
            <div className="header-buttons-cols-burger">
              <a href="/login" className="header-button-burger">Login</a>
              <a href="/signup" className="header-button-dark-button-burger">Sign Up</a>
            </div>

            {/* Burger */}
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
        <ul>
          <li><a href="/" onClick={toggleMenu}>Home</a></li>
          <li><a href="/about" onClick={toggleMenu}>About</a></li>
          <li><a href="/services" onClick={toggleMenu}>Services</a></li>
          <li><a href="/events" onClick={toggleMenu}>Events</a></li>
          <li><a href="/contact" onClick={toggleMenu}>Contact</a></li>
        </ul>

        <div className="mobile-menu-buttons">
          <a href="/login" className="login-btn">Login</a>
          <a href="/signup" className="signup-btn">Sign Up</a>
        </div>
      </div>
    </>
  );
};

export default burgermanu;
