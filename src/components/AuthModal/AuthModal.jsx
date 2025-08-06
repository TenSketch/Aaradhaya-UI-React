import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // Handle signup
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match!');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5000/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password
          })
        });

        const data = await response.json();
        if (data.success) {
          toast.success('Account created successfully!');
          setIsSignUp(false);
          setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        } else {
          toast.error(data.message || 'Signup failed');
        }
      } else {
        // Handle signin
        const response = await fetch('http://localhost:5000/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        const data = await response.json();
        if (data.success) {
          toast.success('Signed in successfully!');
          localStorage.setItem('user_token', data.token);
          localStorage.setItem('user_data', JSON.stringify(data.user));
          setTimeout(() => {
            onClose();
            window.location.reload(); // Refresh to update navbar
          }, 1500);
        } else {
          toast.error(data.message || 'Signin failed');
        }
      }
    } catch (error) {
      toast.error('Server error. Please try again.');
    }
    setLoading(false);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  if (!isOpen) return null;

  return (
    <>
      <ToastContainer />
      <div className="auth-modal-overlay" onClick={onClose}>
        <div className="auth-modal-container" onClick={(e) => e.stopPropagation()}>
          <div className="auth-modal-header">
            <h2 className="auth-modal-title">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <button className="auth-modal-close" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="auth-modal-body">
            <form onSubmit={handleSubmit} className="auth-form">
              {isSignUp && (
                <div className="auth-input-group">
                  <i className="fas fa-user auth-input-icon"></i>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="auth-input"
                  />
                </div>
              )}

              <div className="auth-input-group">
                <i className="fas fa-envelope auth-input-icon"></i>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="auth-input"
                />
              </div>

              <div className="auth-input-group">
                <i className="fas fa-lock auth-input-icon"></i>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="auth-input"
                />
              </div>

              {isSignUp && (
                <div className="auth-input-group">
                  <i className="fas fa-lock auth-input-icon"></i>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="auth-input"
                  />
                </div>
              )}

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                  </>
                ) : (
                  <>
                    <i className={`fas ${isSignUp ? 'fa-user-plus' : 'fa-sign-in-alt'} mr-2`}></i>
                    {isSignUp ? 'Create Account' : 'Sign In'}
                  </>
                )}
              </button>
            </form>

            <div className="auth-toggle">
              <p>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <button
                  type="button"
                  className="auth-toggle-btn"
                  onClick={toggleMode}
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </div>

          <div className="auth-modal-footer">
            <p className="text-sm text-gray-500">
              © 2025 Aaradhya Trust. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthModal;
