import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Donate.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useAuthModal } from "../../context/AuthModalContext";
import { getUserEmail, isAuthenticated } from "../../utils/auth";

const Donate = () => {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const { openAuthModal, isAuthModalOpen } = useAuthModal();
  const [loginPromptModal, setLoginPromptModal] = useState(false);

  // Check if user is logged in and get their email
  useEffect(() => {
    const authenticated = isAuthenticated();
    setIsLoggedIn(authenticated);
    if (authenticated) {
      const email = getUserEmail();
      setUserEmail(email);
      setDonorEmail(email);
    }
  }, []);

  // Refresh auth state when auth modal closes (after sign-up/sign-in)
  useEffect(() => {
    if (!isAuthModalOpen) {
      const authenticated = isAuthenticated();
      setIsLoggedIn(authenticated);
      if (authenticated) {
        const email = getUserEmail();
        setUserEmail(email);
        setDonorEmail(email);
      }
    }
  }, [isAuthModalOpen]);

  // PAN input component for auto keyboard toggle
  const panAlphaRef = useRef(null);
  const panNumRef = useRef(null);
  const panLastRef = useRef(null);
  const [panAlpha, setPanAlpha] = useState("");
  const [panNum, setPanNum] = useState("");
  const [panLast, setPanLast] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAlphaChange = (e) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, "");
    setPanAlpha(val);
    if (val.length === 5) {
      panNumRef.current.focus();
    }
  };
  const handleNumChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setPanNum(val);
    if (val.length === 4) {
      panLastRef.current.focus();
    }
  };
  const handleLastChange = (e) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, "");
    setPanLast(val);
  };
  const [showThankYou, setShowThankYou] = useState(false);
  const navigate = useNavigate();
  // Address state
  const [address, setAddress] = useState("");

  // Function to reset form fields and related state
  const resetForm = () => {
    setPanAlpha("");
    setPanNum("");
    setPanLast("");
    setDonorEmail(isLoggedIn ? userEmail : "");
    setAddress("");
  };

  // Razorpay script loader
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById('razorpay-script')) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isLoading) return;
    
    // Start loading immediately
    setIsLoading(true);
    
    // Check if user is logged in
    if (!isLoggedIn) {
      setLoginPromptModal(true);
      setIsLoading(false);
      return;
    }
    
    const form = e.target;
    const donor_name = form.donor_name.value;
    const donor_mobile = form.donor_mobile.value;
    const donor_email = form.donor_email.value;
    const donor_aadhar = form.donor_aadhar.value;
    const pan = `${panAlpha}${panNum}${panLast}`;
    const amount = form.amount.value;
    const donor_message = form.donor_message.value;
    const donor_address = form.donor_address ? form.donor_address.value : address;

    const res = await loadRazorpayScript();
    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      setIsLoading(false);
      return;
    }

    // 1. Create order from backend
    let orderData;
    try {
  const orderRes = await fetch('https://backend-beta-seven-41.vercel.app/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          donor_name,
          donor_email,
          donor_mobile,
          donor_aadhar,
          pan,
          donor_message,
          donor_address,
        }),
      });
      orderData = await orderRes.json();
      if (!orderData.order) throw new Error('Order creation failed');
    } catch (err) {
      alert('Failed to create payment order. Please try again.');
      setIsLoading(false);
      return;
    }

    // 2. Open Razorpay checkout
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: Number(amount) * 100,
      currency: 'INR',
      name: 'Aaradhya Trust',
      description: 'Donation',
      image: '/assets/images/logo-Aaradhya_trust.png',
      order_id: orderData.order.id,
      handler: async function (response) {
        try {
          await fetch('https://backend-beta-seven-41.vercel.app/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              donorDetails: {
                donor_name,
                donor_email,
                donor_mobile,
                donor_aadhar,
                pan,
                amount,
                donor_message,
                donor_address,
              },
              status: 'success',
            }),
          });
        } catch (err) {
          // Optionally handle error
        }
        setIsLoading(false);
        resetForm();
        setShowThankYou(true);
      },
      prefill: {
        name: donor_name,
        email: donor_email,
        contact: donor_mobile,
      },
      notes: {
        aadhar: donor_aadhar,
        pan: pan,
        message: donor_message,
      },
      theme: {
        color: '#14532d',
      },
      modal: {
        ondismiss: async function () {
          // Optionally handle payment cancelled
          // You can also send a failed/pending status to backend here if needed
          setIsLoading(false);
        },
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
    // Loading will be set to false when payment completes or is dismissed
  };

  return (
    <div className="donate-page">
      <Navbar />
      <main className="pt-20">
        <section className="py-12 bg-white donate-form-section bg-gradient-to-br">
          <div className="container mx-auto px-4 md:max-w-[80%]">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="text-center">
                <div className="mb-8 text-left bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border-l-4 border-gold shadow-sm">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <i className="fas fa-heart text-gold mr-2"></i>
                    Support the SPB Museum
                  </h3>
                  <p className="text-base text-gray-700 leading-relaxed font-medium">
                    Your contribution directly supports the construction and development of the SPB Museum — a living tribute to <span className="font-semibold text-gray-800">Shri&nbsp;S.P.&nbsp;Balasubrahmanyam</span>. Every donation helps us preserve his legacy, create inspiring exhibits, and build a cultural space that celebrates music, art, and community.
                  </p>
                </div>
                <img src="/assets/images/gallery/SPB_Museum-photos-8.jpg" alt="Donate to Support" className="mx-auto max-w-full rounded-md shadow-md" />
              </div>
              <div className="relative">
                <div className={`${!isLoggedIn ? 'blur-sm pointer-events-none' : ''}`}>
                  <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative">
                    <input type="text" name="donor_name" required minLength={3} maxLength={50}
                      className="peer w-full px-3 pt-5 pb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-clr"
                      placeholder=" " />
                    <label className="absolute text-sm text-gray-500 left-3 top-2 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm transition-all">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="relative">
                    <input type="tel" name="donor_mobile" required pattern="[6-9]\d{9}" maxLength={10}
                      className="peer w-full px-3 pt-5 pb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-clr"
                      placeholder=" " />
                    <label className="absolute text-sm text-gray-500 left-3 top-2 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm transition-all">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      name="donor_email"
                      required
                      value={donorEmail}
                      onChange={e => !isLoggedIn && setDonorEmail(e.target.value)}
                      readOnly={isLoggedIn}
                      className={`peer w-full px-3 pt-5 pb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-clr ${isLoggedIn ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                      placeholder=" "
                    />
                    <label className="absolute text-sm text-gray-500 left-3 top-2 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm transition-all">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    {isLoggedIn && (
                      <small className="text-green-600 text-xs">Using email from your account</small>
                    )}
                  </div>
                  <div className="relative">
                    <textarea
                      name="donor_address"
                      rows={2}
                      required
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      className="peer w-full px-3 pt-5 pb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-clr"
                      placeholder=" "></textarea>
                    <label className="absolute text-sm text-gray-500 left-3 top-2 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm transition-all">
                      Address <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="relative">
                    <input type="tel" name="donor_aadhar" required pattern="\d{12}" maxLength={12}
                      className="peer w-full px-3 pt-5 pb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-clr"
                      placeholder=" " />
                    <label className="absolute text-sm text-gray-500 left-3 top-2 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm transition-all">
                      Aadhar Number <span className="text-red-500">*</span>
                    </label>
                    <small className="text-gray-500 text-xs">Required for tax benefits. We keep your Aadhar confidential.</small>
                  </div>
                  <div className="relative">
                    <label className="block mb-1 text-sm text-gray-500">PAN Number <span className="text-red-500">*</span></label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        inputMode="text"
                        pattern="[A-Z]{5}"
                        maxLength={5}
                        ref={panAlphaRef}
                        value={panAlpha}
                        onChange={handleAlphaChange}
                        className="w-16 text-center uppercase border rounded"
                        placeholder="ABCDE"
                        required
                        name="panAlpha"
                      />
                      <input
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]{4}"
                        maxLength={4}
                        ref={panNumRef}
                        value={panNum}
                        onChange={handleNumChange}
                        className="w-12 text-center border rounded"
                        placeholder="1234"
                        required
                        name="panNum"
                      />
                      <input
                        type="text"
                        inputMode="text"
                        pattern="[A-Z]{1}"
                        maxLength={1}
                        ref={panLastRef}
                        value={panLast}
                        onChange={handleLastChange}
                        className="w-8 text-center uppercase border rounded"
                        placeholder="F"
                        required
                        name="panLast"
                      />
                    </div>
                    <small className="text-gray-500 text-xs">For issuing 80G certificates.</small>
                  </div>
                  <div className="relative">
                    <input type="number" name="amount" required min={100} max={1000000}
                      className="peer w-full px-3 pt-5 pb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-clr"
                      placeholder=" " />
                    <label className="absolute text-sm text-gray-500 left-3 top-2 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm transition-all">
                      Donation Amount (INR) <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="relative">
                    <textarea name="donor_message" rows={3}
                      className="peer w-full px-3 pt-5 pb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-clr"
                      placeholder=" "></textarea>
                    <label className="absolute text-sm text-gray-500 left-3 top-2 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm transition-all">
                      Message (Optional)
                    </label>
                  </div>
                  {/* Recaptcha placeholder */}
                  <div></div>
                  <div>
                    <button type="submit"
                      disabled={isLoading}
                      className={`w-full py-3 px-4 rounded-md transition duration-300 flex items-center justify-center font-semibold ${
                        isLoading 
                          ? 'bg-gray-400 cursor-not-allowed text-gray-200' 
                          : 'bg-secondary text-white hover:bg-green-800'
                      }`}>
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-heart mr-2"></i>
                          Proceed to Donate
                        </>
                      )}
                    </button>
                  </div>
                </form>
                </div>
                
                {/* Login Prompt Overlay */}
                {!isLoggedIn && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md mx-4 text-center border">
                      <div className="mb-4">
                        <i className="fas fa-lock text-4xl text-gray-400 mb-3"></i>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Login Required</h3>
                        <p className="text-gray-600 mb-6">
                          Please sign in to your account to make a donation. This helps us provide you with proper donation receipts and track your contributions.
                        </p>
                      </div>
                      <div className="space-y-3">
                        <button
                          onClick={openAuthModal}
                          className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center"
                        >
                          <i className="fas fa-sign-in-alt mr-2"></i>
                          Sign In / Sign Up
                        </button>
                        <p className="text-sm text-gray-500">
                          Don't have an account? You can create one during the sign-in process.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4 text-center">
              <div className="relative mb-6">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <i className="fas fa-heart text-green-600 text-xl"></i>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Processing Your Donation</h3>
              <p className="text-gray-600 mb-4">
                Please wait while we prepare your secure payment...
              </p>
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Thank You Modal */}
        {showThankYou && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto p-6 text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-secondary-clr mb-4">Thank You for Your Support!</h1>
              <p className="text-gray-700 mb-3">
                Your contribution helps our trust to make a positive impact in the lives of many.
              </p>
              <p className="text-green-700 font-semibold mb-2">All donations made are eligible for tax exemptions under Section 80G.</p>
              <hr className="border-t border-gray-300 my-4" />
              <p className="text-gray-700">If you have any questions, feel free to contact us:</p>
              <p className="text-sm mt-2">
                📞 <a href="tel:+919360934646" className="text-blue-600 underline block">97910 14236 </a>
                📧 <a href="mailto:trustaaradhya@gmail.com" className="text-blue-600 underline">trustaaradhya@gmail.com</a>
              </p>
              <p className="text-gray-700 mt-3">
                A confirmation email with your donation receipt has been sent to the address you provided — please check your inbox (and spam/promotions folder).
              </p>
              <button onClick={() => { setShowThankYou(false); navigate('/'); }} className="inline-block mt-5 bg-secondary-clr text-white px-6 py-2 rounded-full hover:bg-green-800 transition">
                Go Back to Home
              </button>
            </div>
          </div>
        )}

        {/* Auth Modal handled globally */}
      </main>
      <Footer />
    </div>
  );
};

export default Donate;
