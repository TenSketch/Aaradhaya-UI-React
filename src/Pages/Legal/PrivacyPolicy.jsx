
import React from "react";
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const PrivacyPolicy = () => (
  <>
    <Navbar />
    <main className="pt-[200px] container mx-auto px-4 pb-5">
      <section className="bg-white py-10 px-4 md:px-8 lg:px-16 text-gray-800">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-secondary mb-2">Privacy Policy</h1>
            <p className="text-sm text-gray-500">Last Updated: February 2025</p>
          </div>
          {/* 1. Introduction */}
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-secondary">
              <i className="fas fa-handshake text-secondary"></i> Introduction
            </h2>
            <p className="mt-2 text-gray-700">
              Aaradhya Charitable Trust is committed to safeguarding your privacy. This policy outlines how we collect, use, and protect your personal data.
            </p>
          </div>
          {/* 2. Information We Collect */}
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-secondary">
              <i className="fas fa-database text-secondary"></i> Information We Collect
            </h2>
            <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-1">
              <li>Personal details like name, email, and phone number.</li>
              <li>Donation transaction details.</li>
              <li>Technical data like IP address and browser cookies.</li>
            </ul>
          </div>
          {/* 3. How We Use Your Information */}
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-secondary">
              <i className="fas fa-bullhorn text-secondary"></i> How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-1">
              <li>To process donations and send acknowledgments.</li>
              <li>To inform you about events, projects, and campaigns.</li>
              <li>To enhance website experience through analytics.</li>
            </ul>
          </div>
          {/* 4. Data Security */}
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-secondary">
              <i className="fas fa-lock text-secondary"></i> Data Security
            </h2>
            <p className="mt-2 text-gray-700">
              We employ robust security practices to ensure that your information remains protected from unauthorized access or misuse.
            </p>
          </div>
          {/* 5. Third-Party Sharing */}
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-secondary">
              <i className="fas fa-share-alt text-secondary"></i> Third-Party Sharing
            </h2>
            <p className="mt-2 text-gray-700">
              We do not sell your data. It is only shared with trusted service providers for the sole purpose of supporting our operations.
            </p>
          </div>
          {/* 6. Your Rights */}
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-secondary">
              <i className="fas fa-user-shield text-secondary"></i> Your Rights
            </h2>
            <p className="mt-2 text-gray-700">
              You may contact us to view, update, or delete your personal data at any time.
            </p>
          </div>
          {/* 7. Contact Us */}
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-secondary">
              <i className="fas fa-envelope text-secondary"></i> Contact Us
            </h2>
            <p className="mt-2 text-gray-700">
              If you have questions or concerns about this Privacy Policy, feel free to email us at
              <a href="mailto:trustaaradhya@gmail.com" className="text-blue-600 underline hover:text-blue-800 ml-1">trustaaradhya@gmail.com</a>.
            </p>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default PrivacyPolicy;
