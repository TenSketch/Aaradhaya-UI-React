import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase';
import 'react-toastify/dist/ReactToastify.css';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showResendEmail, setShowResendEmail] = useState(false);
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

  const resendVerificationEmail = async () => {
    setLoading(true);
    try {
      // Try to sign in the user first to get their user object
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      const user = userCredential.user;
      
      if (user.emailVerified) {
        toast.success('Your email is already verified! You can sign in.');
        setLoading(false);
        return;
      }
      
      const actionCodeSettings = {
        url: window.location.origin,
        handleCodeInApp: false,
      };
      
      await sendEmailVerification(user, actionCodeSettings);
      await signOut(auth); // Sign out after sending email
      
      toast.success('Verification email sent! Please check your inbox and spam folder.');
    } catch (error) {
      toast.error('Failed to resend verification email. Please try again.');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Store user data in localStorage
      const userData = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      };
      
      localStorage.setItem('user_token', user.accessToken || 'google_auth_token');
      localStorage.setItem('user_data', JSON.stringify(userData));
      
      toast.success('Successfully signed in with Google!');
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Google login failed. Please try again.');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // Handle Firebase signup
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match!');
          setLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          formData.email, 
          formData.password
        );
        const user = userCredential.user;
        // Send email verification
        try {
          
          const actionCodeSettings = {
            url: window.location.origin,
            handleCodeInApp: false,
          };
          
          await sendEmailVerification(user, actionCodeSettings);
        } catch (emailError) {
          toast.error('Failed to send verification email. Please try again.');
        }
        
        // Sign out the user after creating account so they must login after verification
        try {
          await signOut(auth);
        } catch (signOutError) {
        }
        
        const userData = {
          uid: user.uid,
          name: formData.name,
          email: user.email,
          emailVerified: user.emailVerified
        };
  toast.success('Account created! Please verify your email before logging in.');
  setLoading(false);
  setIsSignUp(false); 
  setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      } else {
        // Handle Firebase signin
        const userCredential = await signInWithEmailAndPassword(
          auth, 
          formData.email, 
          formData.password
        );
        const user = userCredential.user;
        
        // Reload user to get the latest verification status
        await user.reload();
        
        if (!user.emailVerified) {
          toast.error('Please verify your email before signing in. Check your inbox and spam folder.');
          setShowResendEmail(true);
          // Sign out the unverified user
          await signOut(auth);
          setLoading(false);
          return;
        }
        const userData = {
          uid: user.uid,
          name: user.displayName || 'User',
          email: user.email,
          emailVerified: user.emailVerified
        };
        localStorage.setItem('user_token', user.accessToken || 'firebase_auth_token');
        localStorage.setItem('user_data', JSON.stringify(userData));
        toast.success('Signed in successfully!');
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      let errorMessage = 'Authentication failed. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already in use. Please try signing in instead.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      }
      
      toast.error(errorMessage);
    }
    setLoading(false);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setShowResendEmail(false);
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

            {showResendEmail && !isSignUp && (
              <div className="resend-email-section" style={{ marginTop: '10px', textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                  Didn't receive the verification email?
                </p>
                <button
                  type="button"
                  onClick={resendVerificationEmail}
                  disabled={loading}
                  className="auth-submit-btn"
                  style={{ 
                    backgroundColor: '#ff6b35', 
                    fontSize: '14px', 
                    padding: '8px 16px',
                    marginBottom: '10px'
                  }}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-envelope mr-2"></i>
                      Resend Verification Email
                    </>
                  )}
                </button>
              </div>
            )}

            <div className="auth-divider">
              <span>or</span>
            </div>

            <button
              type="button"
              className="auth-google-btn"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <i className="fab fa-google mr-2"></i>
              Continue with Google
            </button>

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
