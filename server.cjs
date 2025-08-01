require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Nodemailer setup
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE, // e.g., 'gmail'
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://aaradhaya-ui-react.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(bodyParser.json());

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});

// Razorpay integration
const razorpay = new Razorpay({
  key_id: process.env.VITE_RAZORPAY_KEY_ID,
  key_secret: process.env.VITE_RAZORPAY_KEY_SECRET,
});

// Save 'Get in Touch' form submissions to Firestore
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }
    const db = admin.firestore();
    await db.collection('contacts').add({
      name,
      email,
      phone: phone || '',
      message,
      created_at: new Date(),
    });
    res.json({ success: true, message: 'Contact enquiry submitted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to submit contact enquiry', details: err.message });
  }
});

// Create Razorpay order
app.post('/api/razorpay/order', async (req, res) => {
  console.log('[ORDER] Incoming donation order request:', req.body);
  try {
    const { amount, donor_name, donor_email, donor_mobile, donor_aadhar, pan, donor_message } = req.body;
    const options = {
      amount: Number(amount) * 100, // paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        donor_name,
        donor_email,
        donor_mobile,
        donor_aadhar,
        pan,
        donor_message,
      },
    };
    const order = await razorpay.orders.create(options);
    console.log('[ORDER] Razorpay order created:', order);
    res.json({ order });
  } catch (err) {
    console.error('[ORDER] Failed to create order:', err);
    res.status(500).json({ error: 'Failed to create order', details: err.message });
  }
});

// Verify payment and store in Firestore
app.post('/api/razorpay/verify', async (req, res) => {
  console.log('[VERIFY] Incoming payment verification request:', req.body);
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, donorDetails, status } = req.body;
    // Verify signature
    const generated_signature = crypto.createHmac('sha256', process.env.VITE_RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');
    if (generated_signature !== razorpay_signature) {
      console.warn('[VERIFY] Invalid signature:', { razorpay_order_id, razorpay_payment_id, razorpay_signature });
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }
    // Store in Firestore
    const db = admin.firestore();
    const donationDoc = {
      ...donorDetails,
      razorpay_order_id,
      razorpay_payment_id,
      status,
      createdAt: new Date(),
    };
    const docRef = await db.collection('donations').add(donationDoc);
    console.log('[VERIFY] Payment verified and stored:', { razorpay_order_id, razorpay_payment_id, status });

    // Send automated email with donation details
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: donorDetails.donor_email || process.env.DEFAULT_REPLY_TO,
      subject: 'Thank you for your donation!',
      html: `
        <div style="background: #f6f8fa; padding: 40px 0; font-family: 'Segoe UI', Arial, sans-serif;">
          <table style="max-width: 520px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 12px rgba(20,83,45,0.08); overflow: hidden;">
            <tr>
              <td style="background: #14532d; padding: 24px 0; text-align: center;">
                <img src="https://aaradhyatrust.org/assets/images/logo-Aaradhya_trust.png" alt="Aaradhaya Trust Logo" style="height: 60px; margin-bottom: 8px;" />
                <h1 style="color: #fff; font-size: 2rem; margin: 0; letter-spacing: 1px;">Aaradhaya Trust</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 32px 32px 16px 32px;">
                <h2 style="color: #14532d; font-size: 1.5rem; margin-bottom: 12px;">Thank you for your donation!</h2>
                <p style="font-size: 1.1rem; color: #333; margin-bottom: 24px;">Dear <b>${donorDetails.donor_name || 'Donor'}</b>,<br>We are deeply grateful for your generous support. Here are your donation details:</p>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                  <tr>
                    <td style="padding: 8px 0; color: #555;">Amount:</td>
                    <td style="padding: 8px 0; color: #14532d; font-weight: bold;">₹${donorDetails.amount}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #555;">Ticket ID:</td>
                    <td style="padding: 8px 0; color: #333;">${donorDetails.ticket_id || docRef.id}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #555;">Razorpay Payment ID:</td>
                    <td style="padding: 8px 0; color: #333;">${razorpay_payment_id}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #555;">Order ID:</td>
                    <td style="padding: 8px 0; color: #333;">${razorpay_order_id}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #555;">Status:</td>
                    <td style="padding: 8px 0; color: #333;">${status}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #555;">Email:</td>
                    <td style="padding: 8px 0; color: #333;">${donorDetails.donor_email || ''}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #555;">Mobile:</td>
                    <td style="padding: 8px 0; color: #333;">${donorDetails.donor_mobile || ''}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #555;">Message:</td>
                    <td style="padding: 8px 0; color: #333;">${donorDetails.donor_message || '-'}</td>
                  </tr>
                </table>
                <div style="background: #e6f4ea; border-left: 4px solid #14532d; padding: 16px 20px; border-radius: 6px; margin-bottom: 24px; color: #14532d;">
                  <b>We appreciate your support!</b><br>
                  Your contribution will help us make a positive impact in the lives of many.
                </div>
                <p style="font-size: 1rem; color: #555; margin-bottom: 0;">If you have any questions, feel free to contact us:</p>
                <p style="font-size: 1rem; color: #14532d; margin: 8px 0 0 0;">
                  📞 <a href="tel:+919360934646" style="color: #14532d; text-decoration: underline;">97910 14236</a><br>
                  📧 <a href="mailto:trustaaradhya@gmail.com" style="color: #14532d; text-decoration: underline;">trustaaradhya@gmail.com</a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="background: #14532d; text-align: center; padding: 18px 0;">
                <span style="color: #fff; font-size: 1rem;">&copy; ${new Date().getFullYear()} Aaradhaya Trust. All rights reserved.</span>
              </td>
            </tr>
          </table>
        </div>
      `,
    };
    try {
      await transporter.sendMail(mailOptions);
      console.log('[EMAIL] Donation confirmation sent to', donorDetails.donor_email);
    } catch (emailErr) {
      console.error('[EMAIL] Failed to send confirmation:', emailErr);
    }
    res.json({ success: true });
  } catch (err) {
    console.error('[VERIFY] Failed to verify/store payment:', err);
    res.status(500).json({ success: false, message: 'Failed to verify/store payment', details: err.message });
  }
});

// Use Firebase Auth REST API for password verification
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY; // Add this to your .env

app.get('/api/admin/stats', async (req, res) => {
  try {
    const db = admin.firestore();

    // Donations
    const donationsSnap = await db.collection('donations').get();
    let totalDonations = 0;
    const donorSet = new Set();
    donationsSnap.forEach(doc => {
      const data = doc.data();
      if (data.amount) totalDonations += Number(data.amount);
      if (data.donor) donorSet.add(data.donor);
    });
    const totalDonors = donorSet.size > 0 ? donorSet.size : donationsSnap.size;

    // Enquiries
    const contactsSnap = await db.collection('contacts').get();
    const totalEnquiries = contactsSnap.size;

    // Admins
    const adminsSnap = await db.collection('login').get();
    const activeAdmins = adminsSnap.size;

    res.json({
      totalDonations,
      totalDonors,
      totalEnquiries,
      activeAdmins
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats', details: error.message });
  }
});

app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password required.' });
  }
  try {
    // Firebase Auth REST API endpoint
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: username, password, returnSecureToken: true })
    });
    const result = await response.json();
    if (result && result.idToken) {
      // Successful login
      return res.json({ success: true, token: result.idToken, uid: result.localId });
    } else {
      // Failed login
      return res.status(401).json({ success: false, message: result.error?.message || 'Invalid credentials' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
