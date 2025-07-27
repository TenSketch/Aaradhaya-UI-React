import React, { useState } from "react";
const logo = "/assets/images/logo-Aaradhya_trust.png";

const AdminNavbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Sign out handler: clear session and redirect to login
  const handleSignOut = () => {
    // Example: clear localStorage/sessionStorage if used for auth
    localStorage.clear();
    sessionStorage.clear();
    // Redirect to login page
    window.location.href = '/admin';
  };

  return (
    <nav className="navbar fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-900 to-blue-800 shadow-xl z-50 h-16">
      <div className="flex items-center justify-between px-6 h-full">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button id="sidebar-toggle" className="lg:hidden text-white hover:text-yellow-300 transition-colors duration-200">
            <i className="fas fa-bars text-xl"></i>
          </button>
          <div className="flex items-center space-x-4">
            <div className="bg-white rounded-full p-2 shadow-lg">
              <img src={logo} alt="Aaradhya Trust Logo" className="h-8 w-8" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-white">Aaradhya Trust</h1>
              <p className="text-xs text-yellow-300">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Profile dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 text-white hover:text-yellow-300 transition-colors duration-200 bg-blue-800 rounded-full px-3 py-2"
            >
              <div className="bg-yellow-400 rounded-full p-1">
                <i className="fas fa-user text-blue-900 text-sm"></i>
              </div>
              <span className="hidden md:block text-sm font-medium">Admin</span>
              <i className="fas fa-chevron-down text-xs"></i>
            </button>
            
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">Administrator</p>
                  <p className="text-sm text-gray-500">admin@aaradhya.org</p>
                </div>
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <i className="fas fa-sign-out-alt mr-3"></i>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
