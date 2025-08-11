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
  const { amount, donor_name, donor_email, donor_mobile, donor_aadhar, pan, donor_message, donor_address } = req.body;
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
      donor_address,
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
      donor_address: donorDetails.donor_address,
      razorpay_order_id,
      razorpay_payment_id,
      status,
      createdAt: new Date(),
    };
    const docRef = await db.collection('donations').add(donationDoc);
    console.log('[VERIFY] Payment verified and stored:', { razorpay_order_id, razorpay_payment_id, status });

    // Generate receipt number and date
    const receiptNo = `AAR/${new Date().getFullYear()}/${Date.now()}`;
    const issueDate = new Date().toLocaleDateString('en-IN');
    const donationDate = new Date().toLocaleDateString('en-IN');

    // Send automated email with 80G donation receipt
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: donorDetails.donor_email || process.env.DEFAULT_REPLY_TO,
      subject: '80G Donation Receipt - Thank you for your contribution!',
      html: `
        <div style="background: #f6f8fa; padding: 40px 20px; font-family: 'Segoe UI', Arial, sans-serif;">
          <table style="max-width: 650px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(20,83,45,0.12); overflow: hidden;">
            
            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #14532d 0%, #166534 100%); padding: 30px 0; text-align: center;">
                <img src="https://aaradhyatrust.org/assets/images/logo-Aaradhya_trust.png" alt="Aaradhaya Trust Logo" style="height: 70px; margin-bottom: 12px;" />
                <h1 style="color: #fff; font-size: 2.2rem; margin: 0; letter-spacing: 1px;">Aaradhaya Trust</h1>
                <p style="color: #e6f4ea; margin: 8px 0 0 0; font-size: 1rem;">Regd. Office: [Complete Address]</p>
                <p style="color: #e6f4ea; margin: 4px 0 0 0; font-size: 0.9rem;">📞 97910 14236 | 📧 trustaaradhya@gmail.com</p>
                <p style="color: #e6f4ea; margin: 4px 0 0 0; font-size: 0.9rem; font-weight: bold;">PAN: AAJTA6207E</p>
              </td>
            </tr>

            <!-- Receipt Title -->
            <tr>
              <td style="background: #14532d; padding: 15px 0; text-align: center; border-top: 3px solid #fff;">
                <h2 style="color: #fff; font-size: 1.4rem; margin: 0; font-weight: bold;">DONATION RECEIPT</h2>
                <p style="color: #e6f4ea; margin: 5px 0 0 0; font-size: 0.95rem;">(For Income Tax Deduction under Section 80G)</p>
              </td>
            </tr>

            <!-- Receipt Details -->
            <tr>
              <td style="padding: 25px 30px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 20px; padding: 15px; background: #f8fffe; border-radius: 8px; border-left: 4px solid #14532d;">
                  <div>
                    <p style="margin: 0; color: #14532d; font-weight: bold;">Receipt No.: ${receiptNo}</p>
                  </div>
                  <div>
                    <p style="margin: 0; color: #14532d; font-weight: bold;">Date of Issue: ${issueDate}</p>
                  </div>
                </div>

                <!-- 80G Registration Info -->
                <div style="background: #e6f4ea; border: 2px solid #14532d; padding: 15px; border-radius: 8px; margin-bottom: 25px; text-align: center;">
                  <p style="margin: 0; color: #14532d; font-weight: bold; font-size: 1rem;">80G Registration No.: AAJTA6207EF20211</p>
                  <p style="margin: 5px 0 0 0; color: #14532d; font-size: 0.9rem;">Valid for FY 2021-22 onwards (Subject to renewal)</p>
                </div>

                <!-- Donor Details -->
                <h3 style="color: #14532d; font-size: 1.3rem; margin: 0 0 15px 0; padding-bottom: 8px; border-bottom: 2px solid #14532d;">DONOR DETAILS</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                  <tr>
                    <td style="padding: 8px 0; color: #555; font-weight: 600; width: 35%;">Donor's Full Name:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: bold;">${donorDetails.donor_name || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #555; font-weight: 600;">Donor's Address:</td>
                    <td style="padding: 8px 0; color: #333;">${donorDetails.donor_address || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #555; font-weight: 600;">Donor's PAN:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: bold;">${donorDetails.pan || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #555; font-weight: 600;">Email ID:</td>
                    <td style="padding: 8px 0; color: #333;">${donorDetails.donor_email || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #555; font-weight: 600;">Mobile Number:</td>
                    <td style="padding: 8px 0; color: #333;">${donorDetails.donor_mobile || 'N/A'}</td>
                  </tr>
                </table>

                <!-- Donation Details -->
                <h3 style="color: #14532d; font-size: 1.3rem; margin: 0 0 15px 0; padding-bottom: 8px; border-bottom: 2px solid #14532d;">DONATION DETAILS</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                  <tr>
                    <td style="padding: 8px 0; color: #555; font-weight: 600; width: 35%;">Donation Amount (₹):</td>
                    <td style="padding: 8px 0; color: #14532d; font-weight: bold; font-size: 1.1rem;">₹${donorDetails.amount}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #555; font-weight: 600;">Mode of Payment:</td>
                    <td style="padding: 8px 0; color: #333;">Online Payment (Razorpay)</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #555; font-weight: 600;">Date of Donation:</td>
                    <td style="padding: 8px 0; color: #333;">${donationDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #555; font-weight: 600;">Payment ID:</td>
                    <td style="padding: 8px 0; color: #333; font-family: monospace;">${razorpay_payment_id}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #555; font-weight: 600;">Order ID:</td>
                    <td style="padding: 8px 0; color: #333; font-family: monospace;">${razorpay_order_id}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #555; font-weight: 600;">Purpose:</td>
                    <td style="padding: 8px 0; color: #333;">General Corpus Fund</td>
                  </tr>
                  ${donorDetails.donor_message ? `
                  <tr>
                    <td style="padding: 8px 0; color: #555; font-weight: 600;">Message:</td>
                    <td style="padding: 8px 0; color: #333;">${donorDetails.donor_message}</td>
                  </tr>
                  ` : ''}
                </table>

                <!-- Tax Exemption Declaration -->
                <div style="background: #f0f9f4; border: 2px solid #14532d; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                  <h3 style="color: #14532d; font-size: 1.2rem; margin: 0 0 12px 0;">TAX EXEMPTION DECLARATION</h3>
                  <p style="margin: 0 0 12px 0; color: #333; line-height: 1.6; text-align: justify;">
                    This is to certify that the above-mentioned donation is eligible for deduction under Section 80G of the Income Tax Act, 1961, as per the rules and regulations applicable to our organization, <strong>Aaradhaya Trust</strong>, which is registered under Section 80G of the Income Tax Act, 1961 vide Registration No. <strong>AAJTA6207EF20211</strong>.
                  </p>
                  <p style="margin: 0; color: #dc2626; font-size: 0.9rem; font-weight: 600;">
                    <strong>Note:</strong> As per the Income Tax Act, cash donations exceeding ₹2,000 are not eligible for deduction under Section 80G. This donation was made through digital payment mode and is eligible for tax benefits.
                  </p>
                </div>

                <!-- Authorized Signature -->
                <div style="text-align: right; margin-top: 30px;">
                  <div style="border-top: 1px solid #14532d; padding-top: 15px; display: inline-block; min-width: 200px;">
                    <p style="margin: 0; color: #14532d; font-weight: bold;">Authorized Signatory</p>
                    <p style="margin: 5px 0 0 0; color: #555; font-size: 0.9rem;">[Name & Designation]</p>
                    <p style="margin: 5px 0 0 0; color: #555; font-size: 0.9rem;">(Seal of the Organization)</p>
                  </div>
                </div>

                <!-- Contact Information -->
                <div style="background: #e6f4ea; padding: 20px; border-radius: 8px; margin-top: 25px; text-align: center;">
                  <p style="margin: 0 0 8px 0; color: #14532d; font-weight: bold;">For any queries, please contact us:</p>
                  <p style="margin: 0; color: #14532d;">
                    📞 <a href="tel:+919791014236" style="color: #14532d; text-decoration: underline;">97910 14236</a> | 
                    📧 <a href="mailto:trustaaradhya@gmail.com" style="color: #14532d; text-decoration: underline;">trustaaradhya@gmail.com</a>
                  </p>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background: #14532d; text-align: center; padding: 20px 0;">
                <p style="color: #fff; margin: 0; font-size: 0.9rem;">&copy; ${new Date().getFullYear()} Aaradhaya Trust. All rights reserved.</p>
                <p style="color: #e6f4ea; margin: 5px 0 0 0; font-size: 0.8rem;">This is a computer-generated receipt and does not require a physical signature.</p>
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
const FIREBASE_API_KEY = process.env.VITE_FIREBASE_API_KEY; // Add this to your .env

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

// Admin login using Firestore collection
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required.' });
  }
  try {
    const db = admin.firestore();
    // Query the login collection for a document with matching email
    const loginSnap = await db.collection('login').where('email', '==', username).get();
    if (loginSnap.empty) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    // Assuming only one admin per email
    const adminDoc = loginSnap.docs[0].data();
    if (adminDoc.password === password) {
      // You can generate a JWT or use a dummy token for now
      const token = 'dummy-admin-token';
      return res.json({ success: true, token });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// User signup endpoint
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
  }
  try {
    const db = admin.firestore();
    // Check if user already exists
    const userSnap = await db.collection('users').where('email', '==', email).get();
    if (!userSnap.empty) {
      return res.status(400).json({ success: false, message: 'User already exists with this email.' });
    }
    // Create new user
    const newUser = {
      name,
      email,
      password, // In production, hash this password
      createdAt: new Date(),
      isActive: true
    };
    const docRef = await db.collection('users').add(newUser);
    res.json({ 
      success: true, 
      message: 'Account created successfully!',
      userId: docRef.id
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// User signin endpoint
app.post('/api/auth/signin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }
  try {
    const db = admin.firestore();
    // Find user by email
    const userSnap = await db.collection('users').where('email', '==', email).get();
    if (userSnap.empty) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }
    const userDoc = userSnap.docs[0];
    const userData = userDoc.data();
    
    if (userData.password === password) {
      // Generate a simple token (in production, use JWT)
      const token = `user-${userDoc.id}-${Date.now()}`;
      res.json({
        success: true,
        message: 'Signed in successfully!',
        token,
        user: {
          id: userDoc.id,
          name: userData.name,
          email: userData.email
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
