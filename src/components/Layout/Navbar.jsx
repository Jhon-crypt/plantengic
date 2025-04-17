import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <a href="/">
            <div className="logo-avatar-container">
              <div className="logo-avatars">
                <span className="avatar avatar-1">👩</span>
                <span className="avatar avatar-2">👨</span>
                <span className="avatar avatar-3">👩</span>
                <span className="avatar avatar-4">👨</span>
                <span className="avatar avatar-5">👩</span>
              </div>
            </div>
          </a>
        </div>
        
        <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <ul className="navbar-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#blog">Blog</a></li>
            <li><a href="#support">Support</a></li>
          </ul>
          <a href="#login" className="navbar-link-button">Log in</a>
        </div>
        
        <button className="menu-toggle" onClick={toggleMenu}>
          <span className={`menu-icon ${menuOpen ? 'open' : ''}`}></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 