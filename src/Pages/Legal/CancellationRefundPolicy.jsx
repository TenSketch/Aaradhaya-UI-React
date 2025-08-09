
import React from "react";
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const CancellationRefundPolicy = () => (
  <>
    <Navbar />
    <main className="pt-[200px] container mx-auto px-4 pb-5">
      <section className="bg-white py-10 px-4 md:px-8 lg:px-16 text-gray-800">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-secondary mb-2">Cancellation and Refund Policy</h1>
            <p className="text-sm text-gray-500">Last Updated: February 2025</p>
          </div>
          {/* 1. Donations and Refunds */}
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-secondary">
              <i className="fas fa-undo-alt text-secondary"></i> Donations and Refunds
            </h2>
            <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-1">
              <li>Donations made to Aaradhya Charitable Trust are voluntary and non-refundable.</li>
              <li>Refunds may be considered only in case of <strong>technical errors</strong> (e.g., duplicate transactions, incorrect amounts). Requests must be made within <strong>7 days</strong> of the donation.</li>
              <li>Refunds will be processed after verification and will be credited to the original payment method within <strong>10-15 business days</strong>.</li>
            </ul>
          </div>
          {/* 2. Event and Program Cancellations */}
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-secondary">
              <i className="fas fa-calendar-xmark text-secondary"></i> Event and Program Cancellations
            </h2>
            <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-1">
              <li>In case of cancellation of an event or program organized by Aaradhya Charitable Trust, registered participants will be notified and refunds (if applicable) will be processed.</li>
              <li>If the event is postponed, registration fees will be adjusted for the rescheduled date.</li>
            </ul>
          </div>
          {/* 3. Subscription and Membership Cancellations */}
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-secondary">
              <i className="fas fa-file-circle-xmark text-secondary"></i> Subscription and Membership Cancellations
            </h2>
            <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-1">
              <li>If you have subscribed to any recurring donation or membership plan, you may cancel it at any time by contacting us.</li>
              <li>Cancellation requests must be made at least <strong>5 days</strong> before the next scheduled payment to avoid charges.</li>
            </ul>
          </div>
          {/* 4. Contact for Refund Requests */}
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-secondary">
              <i className="fas fa-envelope text-secondary"></i> Contact for Refund Requests
            </h2>
            <p className="mt-2 text-gray-700">
              If you believe you are eligible for a refund, please email us at
              <a href="mailto:trustaaradhya@gmail.com" className="text-blue-600 underline hover:text-blue-800 ml-1">trustaaradhya@gmail.com</a> with your transaction details.
            </p>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default CancellationRefundPolicy;
