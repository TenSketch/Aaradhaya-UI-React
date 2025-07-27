import React from "react";
import { Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/LandingPage/LandingPage';
import SPBMemorial from './Pages/SPBMemorial/SPBMemorial';
import Gallery from './Pages/Gallery/Gallery';
import Contact from './Pages/Contact/Contact';
import Donate from './Pages/Donate/Donate';
import AdminLogin from './Pages/AdminLogin/AdminLogin';
import AdminDashboard from './Pages/AdminDashboard/AdminDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/memorial" element={<SPBMemorial />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/donate" element={<Donate />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
