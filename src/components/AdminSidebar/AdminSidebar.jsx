import React, { useState } from "react";

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile collapse

  const menuItems = [
    {
      id: 'dashboard',
      icon: 'fas fa-chart-pie',
      label: 'Dashboard',
      badge: null
    },
    {
      id: 'donations',
      icon: 'fas fa-hand-holding-heart',
      label: 'Donations',
      badge: null
    },
    {
      id: 'contact',
      icon: 'fas fa-envelope-open',
      label: 'Contact Forms',
      badge: null
    },
  ];

  return (
    <>
      {/* Hamburger button for mobile */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-900 rounded-md shadow-md focus:outline-none"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <span className="block w-6 h-1 bg-yellow-400 mb-1 rounded"></span>
        <span className="block w-6 h-1 bg-yellow-400 mb-1 rounded"></span>
        <span className="block w-6 h-1 bg-yellow-400 rounded"></span>
      </button>

      <aside
        className={`sidebar fixed left-0 top-16 h-full bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white w-64 lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 shadow-2xl
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
        style={{
          transitionProperty: 'transform',
        }}
      >
        <div className="p-6">
          {/* Welcome section */}
          <div className="mb-8 pb-6 border-b border-blue-700">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-400 rounded-full p-2">
                <i className="fas fa-crown text-blue-900 text-sm"></i>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-yellow-300">Welcome back!</h3>
                <p className="text-xs text-blue-300">Administrator</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <h4 className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-4">Main Menu</h4>
            {menuItems.slice(0, 4).map((item) => (
              <a
                key={item.id}
                href="#"
                onClick={() => setActiveTab(item.id)}
                className={`nav-item group flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-yellow-400 text-blue-900 shadow-lg transform scale-105'
                    : 'hover:bg-blue-700 hover:transform hover:translate-x-2'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    activeTab === item.id ? 'bg-blue-900 text-yellow-400' : 'bg-blue-800 group-hover:bg-blue-600'
                  }`}>
                    <i className={`${item.icon} text-sm`}></i>
                  </div>
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-1 text-xs rounded-full font-bold ${
                    activeTab === item.id 
                      ? 'bg-blue-900 text-yellow-400' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </nav>

          {/* Bottom section */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-blue-800 rounded-xl p-4 border border-blue-700">
              <div className="flex items-center space-x-3 mb-3">
                <div className="bg-green-500 rounded-full p-1">
                  <i className="fas fa-bolt text-white text-xs"></i>
                </div>
                <div>
                  <p className="text-sm font-semibold">System Status</p>
                  <p className="text-xs text-blue-300">All systems operational</p>
                </div>
              </div>
              <div className="w-full bg-blue-700 rounded-full h-2">
                <div className="bg-green-400 h-2 rounded-full" style={{width: '85%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
