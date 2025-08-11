

import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthModal } from '../../context/AuthModalContext';
import { isAuthenticated, getCurrentUser, logout } from '../../utils/auth';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const checkAuthStatus = () => {
      setIsLoggedIn(isAuthenticated());
      setUser(getCurrentUser());
    };
    
    checkAuthStatus();
    // Check auth status when component mounts and when localStorage changes
    window.addEventListener('storage', checkAuthStatus);
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  const handleToggle = () => setMenuOpen((open) => !open);
  const handleLinkClick = () => setMenuOpen(false);
  const { openAuthModal } = useAuthModal();
  
  const handleAuthModalOpen = () => {
    openAuthModal();
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

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
        {/* User Authentication Section */}
        <li>
          {isLoggedIn ? (
            <div className="user-profile-dropdown">
              <button
                onClick={toggleDropdown}
                className="profile-button flex items-center bg-green-700 hover:bg-green-800 text-white font-semibold px-4 py-2 rounded-lg transition border-none cursor-pointer"
              >
                <i className="fas fa-user mr-2"></i>
                {user?.name || 'User'}
                <i className={`fas fa-chevron-down ml-2 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}></i>
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <div className="user-info">
                      <i className="fas fa-user-circle text-2xl text-green-700 mb-1"></i>
                      <div className="user-details">
                        <p className="user-name">{user?.name || 'User'}</p>
                        <p className="user-email">{user?.email || ''}</p>
                      </div>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item logout-btn"
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i>
                    Sign Out
                  </button>
                </div>
              )}
              {dropdownOpen && <div className="dropdown-overlay" onClick={closeDropdown}></div>}
            </div>
          ) : (
            <button
              onClick={handleAuthModalOpen}
              className="nav-link flex items-center bg-green-700 hover:bg-green-800 text-white font-semibold px-4 py-2 rounded-lg transition ml-2 border-none cursor-pointer"
            >
              <i className="fas fa-sign-in-alt mr-1"></i>Signin
            </button>
          )}
        </li>
      </ul>
      <button id="menu-toggle" className="flex-auto lg:hidden" onClick={handleToggle} aria-label="Toggle menu">
        <i className="fa-brands fa-pagelines fa-3x"></i>
      </button>
      
      {/* Auth Modal handled globally */}
    </nav>
  );
};

export default Navbar;
