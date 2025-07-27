import React, { useEffect, useState, useRef } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import Chart from "chart.js/auto";
import { db } from "../../firebase";
import AdminNavbar from "../../components/AdminNavbar/AdminNavbar";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import "../../components/AdminDashboard/admin-style.css";


const AdminDashboard = () => {
  // Modal state for viewing contact enquiry
  const [viewEnquiry, setViewEnquiry] = useState(null);
  // Donations state
  const [recentDonations, setRecentDonations] = useState([]);
  // Contact enquiries state
  const [contactEnquiries, setContactEnquiries] = useState([]);
  const handleRefreshDonations = async () => {
    const allDonationsSnap = await getDocs(collection(db, "donations"));
    const allDonations = [];
    allDonationsSnap.forEach(doc => {
      const data = doc.data();
      let status = data.status || data.payment_status || data.razorpay_status || "-";
      allDonations.push({ ...data, id: doc.id, status });
    });
    // Sort by created_at descending
    allDonations.sort((a, b) => {
      let aDate = typeof a.created_at === "object" && a.created_at.toDate ? a.created_at.toDate() : new Date(a.created_at);
      let bDate = typeof b.created_at === "object" && b.created_at.toDate ? b.created_at.toDate() : new Date(b.created_at);
      return bDate - aDate;
    });
    setRecentDonations(allDonations);
  };

  // Export Excel handler
  const handleExportExcel = () => {
    // Prepare data for export
    const headers = ["Name", "Email", "Phone", "PAN", "Aadhar", "Amount", "Status", "Date"];
    const rows = recentDonations.map(donation => [
      donation.donor || donation.donor_name || "Anonymous",
      donation.email || "-",
      donation.phone || "-",
      donation.pan || "-",
      donation.aadhar || "-",
      donation.amount,
      donation.status,
      donation.created_at ? (typeof donation.created_at === "object" && donation.created_at.toDate ? donation.created_at.toDate().toLocaleString() : new Date(donation.created_at).toLocaleString()) : "-"
    ]);
    // SheetJS export
    import("xlsx").then(XLSX => {
      const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Donations");
      XLSX.writeFile(workbook, "donations.xlsx");
    });
  };
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalDonors: 0,
    totalEnquiries: 0,
    activeAdmins: 0,
  });
  const [animatedStats, setAnimatedStats] = useState({
    totalDonations: 0,
    totalDonors: 0,
    totalEnquiries: 0,
    activeAdmins: 0,
  });
  // ...existing code...
  const [donationTrends, setDonationTrends] = useState({ labels: [], data: [] });
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // Auto-collapse sidebar on tab change
  useEffect(() => {
    setSidebarCollapsed(true);
    // Optionally, expand after a short delay if needed
    // setTimeout(() => setSidebarCollapsed(false), 300);
  }, [activeTab]);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortedDonations, setSortedDonations] = useState([]);

  // Sort donations by status whenever statusFilter or recentDonations changes
// Sort and search donations whenever statusFilter, searchTerm, or recentDonations changes
useEffect(() => {
  let filtered = recentDonations;
  if (statusFilter) {
    filtered = filtered.filter(donation => donation.status === statusFilter);
  }
  if (searchTerm.trim()) {
    const term = searchTerm.trim().toLowerCase();
    filtered = filtered.filter(donation => {
      const name = (donation.donor || donation.donor_name || "Anonymous").toLowerCase();
      const email = (donation.email || "-").toLowerCase();
      const pan = (donation.pan || "-").toLowerCase();
      return name.includes(term) || email.includes(term) || pan.includes(term);
    });
  }
  setSortedDonations(filtered);
}, [statusFilter, searchTerm, recentDonations]);

  useEffect(() => {
    const fetchStats = async () => {
      // Donations
      const donationsSnap = await getDocs(collection(db, "donations"));
      let totalDonations = 0;
      const donorSet = new Set();
      let donationsArr = [];
      donationsSnap.forEach(doc => {
        const data = doc.data();
        // Normalize status field: check for status, payment_status, or razorpay_status
        let status = data.status || data.payment_status || data.razorpay_status || "-";
        donationsArr.push({ ...data, id: doc.id, status });
        if (data.amount) totalDonations += Number(data.amount);
        if (data.donor) donorSet.add(data.donor);
      });

      // Donors: fallback to doc count if no donor field
      const totalDonors = donorSet.size > 0 ? donorSet.size : donationsSnap.size;

      // Enquiries
      const contactsSnap = await getDocs(collection(db, "contacts"));
      const totalEnquiries = contactsSnap.size;
      // Populate contact enquiries state
      const contactArr = [];
      contactsSnap.forEach(doc => {
        const data = doc.data();
        contactArr.push({ ...data, id: doc.id });
      });
      setContactEnquiries(contactArr);

      // Admins
      const adminsSnap = await getDocs(collection(db, "login"));
      const activeAdmins = adminsSnap.size;

      // Load all donations for the donation tab
      const allDonationsSnap = await getDocs(collection(db, "donations"));
      const allDonations = [];
      allDonationsSnap.forEach(doc => {
        const data = doc.data();
        let status = data.status || data.payment_status || data.razorpay_status || "-";
        allDonations.push({ ...data, id: doc.id, status });
      });
      // Sort by created_at descending
      allDonations.sort((a, b) => {
        let aDate = typeof a.created_at === "object" && a.created_at.toDate ? a.created_at.toDate() : new Date(a.created_at);
        let bDate = typeof b.created_at === "object" && b.created_at.toDate ? b.created_at.toDate() : new Date(b.created_at);
        return bDate - aDate;
      });
      setRecentDonations(allDonations);

      // Donation trends (last 10 transactions)
      // Sort donationsArr by created_at descending
      const sortedArr = [...donationsArr].sort((a, b) => {
        let aDate, bDate;
        if (typeof a.created_at === "object" && a.created_at.toDate) {
          aDate = a.created_at.toDate();
        } else {
          aDate = new Date(a.created_at);
        }
        if (typeof b.created_at === "object" && b.created_at.toDate) {
          bDate = b.created_at.toDate();
        } else {
          bDate = new Date(b.created_at);
        }
        return bDate - aDate;
      });
      const last10 = sortedArr.slice(0, 10).reverse(); // reverse for oldest to newest
      const labels = last10.map(donation => {
        let dateObj;
        if (typeof donation.created_at === "object" && donation.created_at.toDate) {
          dateObj = donation.created_at.toDate();
        } else {
          dateObj = new Date(donation.created_at);
        }
        return dateObj.toLocaleString();
      });
      const data = last10.map(donation => Number(donation.amount) || 0);
      setDonationTrends({ labels, data });

      setStats({
        totalDonations,
        totalDonors,
        totalEnquiries,
        activeAdmins,
      });
    };
    fetchStats();
  }, []);
  // Chart.js donation trends
  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    chartInstance.current = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels: donationTrends.labels,
        datasets: [
          {
            label: "Donations (₹)",
            data: donationTrends.data,
            borderColor: "#2563eb",
            backgroundColor: "rgba(37,99,235,0.1)",
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "#2563eb",
            pointBorderColor: "#fff",
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true, position: "top" },
          tooltip: { mode: "index", intersect: false },
        },
        interaction: { mode: "nearest", axis: "x", intersect: false },
        scales: {
          x: { display: true, title: { display: true, text: "Day" } },
          y: { display: true, title: { display: true, text: "Amount (₹)" }, beginAtZero: true },
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [donationTrends]);

  // Animate numbers when stats change
  useEffect(() => {
    const duration = 1000; // ms
    const frameRate = 30; // fps
    const steps = Math.round(duration / (1000 / frameRate));
    const animate = (key, endValue) => {
      let startValue = animatedStats[key];
      let step = 0;
      if (startValue === endValue) return;
      const increment = (endValue - startValue) / steps;
      const interval = setInterval(() => {
        step++;
        startValue += increment;
        if (step >= steps) {
          setAnimatedStats(prev => ({ ...prev, [key]: endValue }));
          clearInterval(interval);
        } else {
          setAnimatedStats(prev => ({ ...prev, [key]: Math.round(startValue) }));
        }
      }, 1000 / frameRate);
    };
    Object.keys(stats).forEach(key => {
      animate(key, stats[key]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats]);

  return (
    <>
      <AdminNavbar />
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <main className="main-content ml-0 lg:ml-64 mt-16 p-4 pb-20">
        {/* Dashboard View */}
        {activeTab === "dashboard" && (
          <div id="dashboard-view" className="view active">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-600">Welcome to Aaradhya Trust Admin Panel</p>
            </div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="stat-card bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Donations</p>
                    <p className="text-2xl font-bold text-green-600 transition-all duration-500">₹<span id="total-donations">{animatedStats.totalDonations}</span></p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <i className="fas fa-hand-holding-usd text-green-600 text-xl"></i>
                  </div>
                </div>
              </div>
              <div className="stat-card bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Donors</p>
                    <p className="text-2xl font-bold text-blue-600 transition-all duration-500"><span id="total-donors">{animatedStats.totalDonors}</span></p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <i className="fas fa-users text-blue-600 text-xl"></i>
                  </div>
                </div>
              </div>
              <div className="stat-card bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Enquiries</p>
                    <p className="text-2xl font-bold text-purple-600 transition-all duration-500"><span id="total-enquiries">{animatedStats.totalEnquiries}</span></p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <i className="fas fa-envelope text-purple-600 text-xl"></i>
                  </div>
                </div>
              </div>
              <div className="stat-card bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Admins</p>
                    <p className="text-2xl font-bold text-yellow-600 transition-all duration-500"><span id="active-admins">{animatedStats.activeAdmins}</span></p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <i className="fas fa-user-shield text-yellow-600 text-xl"></i>
                  </div>
                </div>
              </div>
            </div>
            {/* Donation Trends & Recent Donations Side by Side */}
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
              {/* Donation Trends Chart */}
              <div className="bg-white rounded-lg shadow-md p-6 flex-1 mb-6 lg:mb-0">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Donation Trends</h3>
                <canvas ref={chartRef} />
              </div>
              {/* Recent Donations */}
              <div className="bg-white rounded-lg shadow-md p-6 flex-1 max-w-full lg:max-w-md xl:max-w-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Donations</h3>
                <ul className="space-y-3">
                  {recentDonations.length === 0 && <li className="text-gray-500">No recent donations.</li>}
                  {recentDonations.map(donation => (
                    <li key={donation.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <span className="font-semibold text-blue-900">{donation.donor || donation.donor_name || "Anonymous"}</span>
                        <span className="ml-2 text-gray-500 text-xs">{donation.created_at ? new Date(donation.created_at).toLocaleString() : ""}</span>
                      </div>
                      <div className="font-bold text-green-600">₹{donation.amount}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Donations Tab View */}
        {activeTab === "donations" && (
          <div id="donations-view" className="view active">
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Donations</h1>
                  <p className="text-gray-600">Manage and track all donations</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button className="btn btn-secondary" onClick={handleRefreshDonations}>
                    <i className="fas fa-sync-alt mr-2"></i>Refresh Status
                  </button>
                  <button className="btn btn-primary" onClick={handleExportExcel}>
                    <i className="fas fa-download mr-2"></i>Export Excel
                  </button>
                </div>
              </div>
            </div>
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search by name, email, or PAN..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="captured">Captured</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Donations Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PAN</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aadhar</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedDonations.length === 0 && (
                      <tr><td colSpan={8} className="text-center text-gray-500 py-4">No donations found.</td></tr>
                    )}
                    {sortedDonations.map(donation => (
                      <tr key={donation.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{donation.donor || donation.donor_name || "Anonymous"}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{donation.email || "-"}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{donation.phone || "-"}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{donation.pan || "-"}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{donation.aadhar || "-"}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-green-600">₹{donation.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{donation.created_at ? new Date(donation.created_at).toLocaleString() : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Contact Tab View - matches index.html */}
        {activeTab === "contact" && (
          <div id="contact-view" className="view active">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Contact Enquiries</h1>
              <p className="text-gray-600">Manage contact form submissions</p>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody id="contact-table-body" className="bg-white divide-y divide-gray-200">
                    {/* Table rows should be populated by your React state, e.g., contact enquiries */}
                    {Array.isArray(contactEnquiries) && contactEnquiries.length === 0 && (
                      <tr><td colSpan={6} className="text-center text-gray-500 py-4">No contact enquiries found.</td></tr>
                    )}
                    {Array.isArray(contactEnquiries) && contactEnquiries.map(enquiry => (
                      <tr key={enquiry.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{enquiry.name || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{enquiry.email || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{enquiry.phone || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{enquiry.message || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{enquiry.created_at ? (typeof enquiry.created_at === 'object' && enquiry.created_at.toDate ? enquiry.created_at.toDate().toLocaleString() : new Date(enquiry.created_at).toLocaleString()) : '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {/* Actions: view only */}
                          <button className="btn btn-sm btn-primary mr-2" onClick={() => setViewEnquiry(enquiry)}><i className="fas fa-eye"></i></button>
                        </td>
                      </tr>
                    ))}
        {/* Modal for viewing contact enquiry details */}
        {viewEnquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-900/70 via-purple-800/60 to-pink-700/60 backdrop-blur-lg animate-fadeIn">
            <div className="relative w-full max-w-lg mx-4">
              <div className="rounded-2xl shadow-2xl bg-white/80 backdrop-blur-xl border border-gray-200 p-8 flex flex-col items-center gap-4 animate-slideUp">
                <button className="absolute top-4 right-4 text-gray-500 hover:text-pink-600 text-3xl font-bold transition-colors duration-200" onClick={() => setViewEnquiry(null)} aria-label="Close Modal">
                  <span aria-hidden="true">&times;</span>
                </button>
                <div className="flex flex-col items-center gap-2 mb-4">
                  <div className="bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 p-4 rounded-full shadow-lg">
                    <i className="fas fa-envelope-open-text text-white text-3xl"></i>
                  </div>
                  <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">Contact Enquiry</h2>
                  <span className="text-sm text-gray-500">#{viewEnquiry.id?.slice(-6) || 'ID'}</span>
                </div>
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-user text-blue-500"></i>
                    <span className="font-semibold text-gray-700">Name:</span>
                  </div>
                  <span className="text-gray-900">{viewEnquiry.name || '-'}</span>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-at text-purple-500"></i>
                    <span className="font-semibold text-gray-700">Email:</span>
                  </div>
                  <span className="text-gray-900">{viewEnquiry.email || '-'}</span>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-phone text-pink-500"></i>
                    <span className="font-semibold text-gray-700">Phone:</span>
                  </div>
                  <span className="text-gray-900">{viewEnquiry.phone || '-'}</span>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-calendar-alt text-yellow-500"></i>
                    <span className="font-semibold text-gray-700">Date:</span>
                  </div>
                  <span className="text-gray-900">{viewEnquiry.created_at ? (typeof viewEnquiry.created_at === 'object' && viewEnquiry.created_at.toDate ? viewEnquiry.created_at.toDate().toLocaleString() : new Date(viewEnquiry.created_at).toLocaleString()) : '-'}</span>
                </div>
                <div className="w-full mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="fas fa-comment-dots text-green-500"></i>
                    <span className="font-semibold text-gray-700">Message:</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-gray-800 shadow-inner min-h-[60px] whitespace-pre-line">
                    {viewEnquiry.message || '-'}
                  </div>
                </div>
              </div>
            </div>
            <style>{`
              @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
              .animate-fadeIn { animation: fadeIn 0.3s ease; }
              @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
              .animate-slideUp { animation: slideUp 0.4s cubic-bezier(.4,2,.3,1); }
            `}</style>
          </div>
        )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default AdminDashboard;
