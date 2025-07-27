import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./Contact.css";

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would send the form data to your backend or service
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
                        <input type="email" name="contact_email" required
                          className="peer w-full px-3 pt-5 pb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-clr"
                          placeholder=" " value={form.contact_email} onChange={handleChange} />
                        <label className="absolute text-sm text-gray-500 left-3 top-2 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm transition-all">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="relative">
                        <input type="tel" name="contact_phone" pattern="[6-9]\d{9}" maxLength={10}
                          className="peer w-full px-3 pt-5 pb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-clr"
                          placeholder=" " value={form.contact_phone} onChange={handleChange} />
                        <label className="absolute text-sm text-gray-500 left-3 top-2 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm transition-all">
                          Mobile Number (Optional)
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
                          className="w-full bg-secondary text-white py-2 px-4 rounded-md hover:bg-green-800 transition">
                          Send Message
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
