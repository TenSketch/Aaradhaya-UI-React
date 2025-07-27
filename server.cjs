require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
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
    await db.collection('donations').add({
      ...donorDetails,
      razorpay_order_id,
      razorpay_payment_id,
      status,
      createdAt: new Date(),
    });
    console.log('[VERIFY] Payment verified and stored:', { razorpay_order_id, razorpay_payment_id, status });
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
