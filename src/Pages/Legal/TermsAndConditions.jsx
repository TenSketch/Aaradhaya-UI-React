
import React from "react";
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const TermsAndConditions = () => (
  <>
    <Navbar />
    <main className="pt-[200px] container mx-auto px-4 pb-5">
      <section className="bg-white py-10 px-4 md:px-8 lg:px-16 text-gray-800">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-secondary mb-2">Terms and Conditions</h1>
            <p className="text-sm text-gray-500">Last Updated: February 2025</p>
          </div>
          {/* 1. Introduction */}
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-secondary">
              <i className="fas fa-handshake-angle text-secondary"></i> Introduction
            </h2>
            <p className="mt-2 text-gray-700">
              Welcome to Aaradhya Charitable Trust. By accessing our website and services, you agree to comply with these Terms and Conditions.
            </p>
          </div>
          {/* 2. Use of Our Website */}
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-secondary">
              <i className="fas fa-globe text-secondary"></i> Use of Our Website
            </h2>
            <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-1">
              <li>You agree to use our website only for lawful purposes.</li>
              <li>Unauthorized use or duplication of content is prohibited.</li>
              <li>We reserve the right to modify or discontinue any part of the website without prior notice.</li>
            </ul>
          </div>
          {/* 3. Donations and Payments */}
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-secondary">
              <i className="fas fa-donate text-secondary"></i> Donations and Payments
            </h2>
            <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-1">
              <li>All donations are voluntary and non-refundable unless specified otherwise.</li>
              <li>Aaradhya Charitable Trust is a registered non-profit and donations may qualify for tax exemptions.</li>
              <li>We use secure and reliable third-party gateways for all payment transactions.</li>
            </ul>
          </div>
          {/* 4. Intellectual Property */}
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-secondary">
              <i className="fas fa-lightbulb text-secondary"></i> Intellectual Property
            </h2>
            <p className="mt-2 text-gray-700">
              All content on this website, including text, logos, images, and designs, belongs to Aaradhya Charitable Trust and may not be used without permission.
            </p>
          </div>
          {/* 5. Limitation of Liability */}
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-secondary">
              <i className="fas fa-scale-balanced text-secondary"></i> Limitation of Liability
            </h2>
            <p className="mt-2 text-gray-700">
              Aaradhya Charitable Trust is not liable for any direct or indirect damages resulting from your use of the website or services.
            </p>
          </div>
          {/* 6. Changes to Terms */}
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-secondary">
              <i className="fas fa-pen-nib text-secondary"></i> Changes to Terms
            </h2>
            <p className="mt-2 text-gray-700">
              We may revise these Terms and Conditions at any time. Continued use of our site signifies your acceptance of the changes.
            </p>
          </div>
          {/* 7. Contact Us */}
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-secondary">
              <i className="fas fa-envelope-open-text text-secondary"></i> Contact Us
            </h2>
            <p className="mt-2 text-gray-700">
              If you have any questions, please write to us at
              <a href="mailto:trustaaradhya@gmail.com" className="text-blue-600 underline hover:text-blue-800 ml-1">trustaaradhya@gmail.com</a>.
            </p>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default TermsAndConditions;
