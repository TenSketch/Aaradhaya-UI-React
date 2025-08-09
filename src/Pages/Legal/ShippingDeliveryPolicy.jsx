
import React from "react";
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const ShippingDeliveryPolicy = () => (
  <>
    <Navbar />
    <main className="pt-[200px] container mx-auto px-4 pb-5">
      <section className="bg-white py-10 px-4 md:px-8 lg:px-16 text-gray-800">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-secondary mb-2">Shipping and Delivery Policy</h1>
            <p className="text-sm text-gray-500">Last Updated: February 2025</p>
          </div>
          {/* 1. General Shipping Information */}
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-secondary">
              <i className="fas fa-box-open text-secondary"></i> General Shipping Information
            </h2>
            <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-1">
              <li>Aaradhya Charitable Trust primarily focuses on donations and community services. However, if any physical goods (such as merchandise, books, or event materials) are offered, this policy applies.</li>
              <li>Orders will be processed and shipped within <strong>7-10 business days</strong> from the date of confirmation.</li>
              <li>Shipping services are available only within India at this time.</li>
            </ul>
          </div>
          {/* 2. Delivery Timelines */}
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-secondary">
              <i className="fas fa-clock text-secondary"></i> Delivery Timelines
            </h2>
            <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-1">
              <li>Delivery timelines vary based on location and courier partners.</li>
              <li>Metropolitan areas: <strong>5-7 business days</strong>.</li>
              <li>Other regions: <strong>7-10 business days</strong>.</li>
              <li>Unforeseen delays due to weather, strikes, or operational issues may extend delivery times.</li>
            </ul>
          </div>
          {/* 3. Shipping Charges */}
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-secondary">
              <i className="fas fa-indian-rupee-sign text-secondary"></i> Shipping Charges
            </h2>
            <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-1">
              <li>Shipping charges (if applicable) will be displayed during checkout.</li>
              <li>For orders above <strong>₹1,000</strong>, shipping may be free.</li>
            </ul>
          </div>
          {/* 4. Order Tracking */}
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-secondary">
              <i className="fas fa-location-arrow text-secondary"></i> Order Tracking
            </h2>
            <p className="mt-2 text-gray-700">
              Once your order is shipped, tracking details will be shared via email or SMS.
            </p>
          </div>
          {/* 5. Lost or Damaged Shipments */}
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-secondary">
              <i className="fas fa-triangle-exclamation text-secondary"></i> Lost or Damaged Shipments
            </h2>
            <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-1">
              <li>If your order is lost or arrives damaged, please report it within <strong>48 hours</strong> of delivery.</li>
              <li>We will initiate a replacement or refund based on the issue.</li>
            </ul>
          </div>
          {/* 6. Contact for Shipping Queries */}
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-secondary">
              <i className="fas fa-envelope-open-text text-secondary"></i> Contact for Shipping Queries
            </h2>
            <p className="mt-2 text-gray-700">
              For any concerns regarding shipping and delivery, please email us at
              <a href="mailto:trustaaradhya@gmail.com" className="text-blue-600 underline hover:text-blue-800 ml-1">trustaaradhya@gmail.com</a>.
            </p>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default ShippingDeliveryPolicy;
