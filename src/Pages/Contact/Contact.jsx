import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./Contact.css";
import { getUserEmail, isAuthenticated } from "../../utils/auth";

const initialState = {
  contact_name: "",
  contact_email: "",
  contact_phone: "",
  contact_subject: "",
  contact_message: "",
};

const Contact = () => {
  const [form, setForm] = useState(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  // On mount, fetch user email if logged in
  React.useEffect(() => {
    if (isAuthenticated()) {
      const email = getUserEmail();
      if (email) {
        setUserEmail(email);
        setForm(f => ({ ...f, contact_email: email }));
      }
    }
  }, []);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    fetch('https://backend-beta-seven-41.vercel.app/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.contact_name,
        email: form.contact_email,
        phone: form.contact_phone,
        message: form.contact_message,
      }),
    })
      .then(res => res.json())
      .then(data => {
        setSubmitted(true);
        setIsLoading(false);
      })
      .catch(() => {
        alert('Failed to submit your message. Please try again.');
        setIsLoading(false);
      });
  };

  return (
    <div className="contact-page">
      <Navbar />
      <main className="pt-20">
        <section className="py-12 bg-white contact-form-section bg-gradient-to-br">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              {/* Image */}
              <div className="text-center">
                <img src={"/assets/images/gallery/SPB_Museum-photos-4.jpg"} alt="Contact Us" className="mx-auto max-w-full rounded-md shadow-md" />
              </div>
              {/* Form */}
              <div>
                <div className="bg-white p-6 shadow-xl rounded-lg">
                  <h2 className="text-2xl font-bold text-secondary-clr text-center mb-2">Get in Touch</h2>
                  <p className="text-sm text-gray-600 text-center mb-4">
                    Have questions or suggestions? We'd love to hear from you. Your message will be responded to promptly.
                  </p>
                  {submitted ? (
                    <div className="text-center py-8">
                      <h3 className="text-xl font-bold text-green-700 mb-2">Thank You for Your Support!</h3>
                      <p className="mb-2">Your message has been received. We will get back to you soon.</p>
                      <p className="text-gray-700">If you have any questions, feel free to contact us:</p>
                      <p className="text-sm mt-2">
                        📞 <a href="tel:+919360934646" className="text-blue-600 underline block">97910 14236</a>
                        📧 <a href="mailto:trustaaradhya@gmail.com" className="text-blue-600 underline">trustaaradhya@gmail.com</a>
                      </p>
                    </div>
                  ) : (
                    <form className="space-y-6" onSubmit={handleSubmit}>
                      <div className="relative">
                        <input type="text" name="contact_name" required minLength={3} maxLength={50}
                          className="peer w-full px-3 pt-5 pb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-clr"
                          placeholder=" " value={form.contact_name} onChange={handleChange} />
                        <label className="absolute text-sm text-gray-500 left-3 top-2 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm transition-all">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="relative">
                        <input
                          type="email"
                          name="contact_email"
                          required
                          className="peer w-full px-3 pt-5 pb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-clr"
                          placeholder=" "
                          value={form.contact_email}
                          onChange={handleChange}
                          disabled={!!userEmail}
                        />
                        <label className="absolute text-sm text-gray-500 left-3 top-2 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm transition-all">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="relative">
                        <input type="tel" name="contact_phone" pattern="[6-9]\d{9}" maxLength={10} required
                          className="peer w-full px-3 pt-5 pb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-clr"
                          placeholder=" " value={form.contact_phone} onChange={handleChange} />
                        <label className="absolute text-sm text-gray-500 left-3 top-2 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm transition-all">
                          Mobile Number <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="relative">
                        <input type="text" name="contact_subject" required maxLength={100}
                          className="peer w-full px-3 pt-5 pb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-clr"
                          placeholder=" " value={form.contact_subject} onChange={handleChange} />
                        <label className="absolute text-sm text-gray-500 left-3 top-2 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm transition-all">
                          Subject <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="relative">
                        <textarea name="contact_message" required rows={4}
                          className="peer w-full px-3 pt-5 pb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-clr"
                          placeholder=" " value={form.contact_message} onChange={handleChange}></textarea>
                        <label className="absolute text-sm text-gray-500 left-3 top-2 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm transition-all">
                          Message <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div>
                        <button type="submit"
                          className="w-full bg-secondary text-white py-2 px-4 rounded-md hover:bg-green-800 transition"
                          disabled={isLoading}>
                          {isLoading ? "Sending..." : "Send Message"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
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
                  <i className="fas fa-envelope text-green-600 text-xl"></i>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Sending Your Message</h3>
              <p className="text-gray-600 mb-4">
                Please wait while we submit your message...
              </p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
