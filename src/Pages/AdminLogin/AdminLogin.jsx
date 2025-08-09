import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const logo = "/assets/images/logo-Aaradhya_trust.png";
import "./AdminLogin.css";

const AdminLogin = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const username = e.target.username.value;
    const password = e.target.password.value;
  const apiUrl = "https://backend-beta-seven-41.vercel.app/api/admin/login";
    fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok && data.success) {
          setError("");
          toast.success("Sign-in successful!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          localStorage.setItem("admin_token", data.token);
          setTimeout(() => {
            navigate("/admin/dashboard");
          }, 2200);
        } else {
          setError(data.message || "Invalid credentials. Please try again.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Server error. Please try again later.");
        setLoading(false);
      });
  };

  return (
    <>
    <ToastContainer />
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="logo-container text-center mb-8">
          <img src={logo} alt="Aaradhya Trust Logo" className="mx-auto mb-4 w-24" />
          <h1 className="text-3xl font-bold mb-2">Aaradhya Trust</h1>
          <p className="text-lg">Admin Panel</p>
        </div>
        {/* Login Form */}
        <div className="form-container login-container rounded-2xl p-8 shadow-2xl bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-title text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2">Welcome Back</h2>
              <p>Please sign in to your account</p>
            </div>
            {/* Error Message */}
            {error && (
              <div className="error-message px-4 py-3 rounded-lg bg-red-100 text-red-700 mb-2 flex items-center">
                <i className="fas fa-exclamation-circle mr-2"></i>
                <span>{error}</span>
              </div>
            )}
            {/* Email Field */}
            <div className="input-group flex items-center border rounded-lg px-3 py-2 bg-gray-50 mb-2">
              <i className="fas fa-user text-gray-400 mr-2"></i>
              <input
                type="email"
                id="username"
                name="username"
                required
                className="w-full bg-transparent outline-none"
                placeholder="Email"
                autoComplete="username"
              />
            </div>
            {/* Password Field */}
            <div className="input-group flex items-center border rounded-lg px-3 py-2 bg-gray-50 mb-2">
              <i className="fas fa-lock text-gray-400 mr-2"></i>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="w-full bg-transparent outline-none"
                placeholder="Password"
                autoComplete="current-password"
              />
            </div>
            {/* Login Button */}
            <button
              type="submit"
              className="btn-login w-full py-3 text-white font-semibold rounded-lg bg-green-700 hover:bg-green-800 transition flex items-center justify-center"
              disabled={loading}
            >
              <span>Sign In</span>
              {loading && <i className="fas fa-spinner fa-spin ml-2"></i>}
            </button>
          </form>
          {/* Footer */}
          <div className="login-footer mt-8 text-center">
            <p className="text-sm">© 2025 Aaradhya Trust. All rights reserved.</p>
            <p className="text-xs mt-1">Product of <span className="brand font-semibold">TenSketch</span></p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default AdminLogin;
