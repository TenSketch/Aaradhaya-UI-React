import React from "react";
import "./AdminFooter.css";

const AdminFooter = () => {
  return (
    <footer className="admin-footer fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white z-20 shadow-lg">
      <div className="flex items-center justify-between px-4 py-4 lg:pl-72">
        {/* Left side - Copyright beside sidebar */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">
            © 2025 <span className="text-yellow-400">Aaradhya Trust</span>
          </span>
        </div>
        
        {/* Right side - Product info */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-blue-200 hidden sm:inline">Product of</span>
          <span className="text-sm font-semibold text-yellow-400">TenSketch</span>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
