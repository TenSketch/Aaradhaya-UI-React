

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggle = () => setMenuOpen((open) => !open);
  const handleLinkClick = () => setMenuOpen(false);

  return (
    <nav className="navbar fixed top-0 z-50 transition-all mx-auto px-5 py-3 flex items-center justify-between">
      <div className="navbar-brand flex-auto">
        <img src="/assets/images/logo-Aaradhya_trust.png" className="logo" alt="logo-Aaradhya_trust" />
      </div>
      <ul
        id="menu"
        className={
          'nav-links flex flex-col md:flex-row space-y-10 md:space-y-0 md:space-x-6 justify-center items-center' +
          (menuOpen ? ' active' : '')
        }
      >
        <li>
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link flex items-center active' : 'nav-link flex items-center'} onClick={handleLinkClick}>
            <i className="fas fa-home mr-1"></i> Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/memorial" className={({ isActive }) => isActive ? 'nav-link flex items-center active' : 'nav-link flex items-center'} onClick={handleLinkClick}>
            <i className="fas fa-monument mr-1"></i> SPB Memorial
          </NavLink>
        </li>
        {/* <li>
          <NavLink to="/board-members" className={({ isActive }) => isActive ? 'nav-link flex items-center active' : 'nav-link flex items-center'} onClick={handleLinkClick}>
            <i className="fas fa-users mr-1"></i> Board Members
          </NavLink>
        </li> */}
        <li>
          <NavLink to="/gallery" className={({ isActive }) => isActive ? 'nav-link flex items-center active' : 'nav-link flex items-center'} onClick={handleLinkClick}>
            <i className="fas fa-images mr-1"></i> Gallery
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-link flex items-center active' : 'nav-link flex items-center'} onClick={handleLinkClick}>
            <i className="fas fa-envelope mr-1"></i> Contact Us
          </NavLink>
        </li>
        <li>
          <NavLink to="/donate" className={({ isActive }) => isActive ? 'nav-link flex items-center active' : 'nav-link flex items-center'} onClick={handleLinkClick}>
            <i className="fas fa-donate mr-1"></i> Donate
          </NavLink>
        </li>
      </ul>
      <button id="menu-toggle" className="flex-auto lg:hidden" onClick={handleToggle} aria-label="Toggle menu">
        <i className="fa-brands fa-pagelines fa-3x"></i>
      </button>
    </nav>
  );
};

export default Navbar;
