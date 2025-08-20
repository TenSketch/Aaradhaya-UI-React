# Aaradhaya UI — Setup & Environment Variables

This document explains how to populate the project's `.env` file and how to obtain each required value from Firebase, Razorpay, and email providers. It includes formatting tips, security recommendations, and quick verification steps for onboarding a new owner or client.

## Quick plan
- Provide a clear mapping for every `FIREBASE_*` and `VITE_FIREBASE_*` variable
- Explain Razorpay and EMAIL variables and security best-practices
- Give an `.env.example` template and smoke-test steps

## Checklist (what this README covers)
- Obtain & map Firebase service account values -> `FIREBASE_*` (server)
- Obtain Firebase web app config -> `VITE_FIREBASE_*` (client)
- Obtain Razorpay keys -> `VITE_RAZORPAY_*`
- Configure email sending -> `EMAIL_*`
- Private key formatting and Node usage
- Security, onboarding, and verification steps

---

## 1) Contract / success criteria
- Inputs: Firebase project, service account JSON, Firebase web app, Razorpay account, email account (or transactional provider).
- Output: a filled `.env` that allows the server to initialize Firebase Admin, client to initialize Firebase SDK, creating/validating Razorpay orders server-side, and sending email.
- Success: Admin SDK initializes without credential errors; client app boots with Firebase config; server can create Razorpay orders and send an email.

---

## 2) Firebase Admin (server) — FIREBASE_*
These values come from a Firebase Service Account JSON you create in Google Cloud / Firebase Console.

How to create the service account and key:
1. Open Firebase Console (https://console.firebase.google.com) and select the project (or use Google Cloud Console → IAM & Admin → Service Accounts).
2. Go to Project Settings → Service accounts (or IAM & Admin → Service Accounts).
3. Create a service account (name it e.g. `project-server-admin`).
4. Grant minimal necessary roles (Firestore Admin, Storage Admin, or custom roles). Avoid `Owner` unless required.
5. Create a new key (JSON) for the service account and download the JSON file.

Map JSON fields to `.env` keys (example JSON fields shown for clarity):
- `type`                        -> `FIREBASE_TYPE`
- `project_id`                  -> `FIREBASE_PROJECT_ID`
- `private_key_id`              -> `FIREBASE_PRIVATE_KEY_ID`
- `private_key`                 -> `FIREBASE_PRIVATE_KEY`
- `client_email`                -> `FIREBASE_CLIENT_EMAIL`
- `client_id`                   -> `FIREBASE_CLIENT_ID`
- `auth_uri`                    -> `FIREBASE_AUTH_URI`
- `token_uri`                   -> `FIREBASE_TOKEN_URI`
- `auth_provider_x509_cert_url` -> `FIREBASE_AUTH_PROVIDER_X509_CERT_URL`
- `client_x509_cert_url`        -> `FIREBASE_CLIENT_X509_CERT_URL`

Formatting the private key
- The service account `private_key` contains real newline characters. In a single-line `.env` file you should store it with escaped newlines and wrap in double quotes, for example:

```env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
```

In Node you must convert the `\n` sequences back to real newlines when building the credential object:

```js
const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey,
  }),
});
```

Permissions & rotation
- Use least-privilege roles. Create separate keys per environment (staging/production).
- Rotate keys if they are leaked or when handing control to a client.

Verification
- A quick check: attempt to initialize `firebase-admin` and read a simple resource (list a storage bucket or read a small Firestore doc).

---

## 3) Firebase client (web) — VITE_FIREBASE_*
These values are provided by the Firebase Console when you register a Web App.

How to obtain:
1. Firebase Console → Project → Settings → General.
2. Under "Your apps" add/register a Web App (if none exists) and copy the SDK config.

Map config fields to `.env`:
- `apiKey`            -> `VITE_FIREBASE_API_KEY`
- `authDomain`        -> `VITE_FIREBASE_AUTH_DOMAIN`
- `projectId`         -> `VITE_FIREBASE_PROJECT_ID`
- `storageBucket`     -> `VITE_FIREBASE_STORAGE_BUCKET`
- `messagingSenderId` -> `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `appId`             -> `VITE_FIREBASE_APP_ID`
- `measurementId`     -> `VITE_FIREBASE_MEASUREMENT_ID` (optional)

Notes
- Variables prefixed with `VITE_` are embedded in the client bundle by Vite. Do not store secrets in `VITE_` variables.
- Firebase client API keys are not secret in the same way a private key is — they identify the project but don’t grant admin privileges by themselves.

Verification
- Run the dev server and check the browser console for successful Firebase initialization or errors.

---

## 4) Razorpay — VITE_RAZORPAY_KEY_ID and server-side secret
How to obtain keys:
1. Sign in to Razorpay Dashboard (https://dashboard.razorpay.com).
2. Go to Developer → API Keys (or Settings → API Keys) and create a new key pair.
3. You will receive Key ID and Key Secret. Save the secret immediately (it is shown once).

Environment placement and security
- `VITE_RAZORPAY_KEY_ID` is safe to include client-side (used to initialize the checkout).
- `VITE_RAZORPAY_KEY_SECRET` is a server-only secret and must never be exposed to the client bundle.

Best practice
- Keep the Key Secret only in server environment variables (or secret manager). Use the secret to create orders and verify webhooks.

Verification
- Use server-side code to create a test order and ensure Razorpay responds with an order id.

---

## 5) Email configuration — EMAIL_* variables
Typical variables used by `nodemailer` or similar:
- `EMAIL_SERVICE` (e.g., `gmail` or SMTP host)
- `EMAIL_USER` (e.g., `your@gmail.com`)
- `EMAIL_PASS` (app password or SMTP password)
- `DEFAULT_REPLY_TO`

Gmail quick setup (development)
1. Enable 2-Step Verification on the Google account.
2. Create an App Password (Security → App passwords) and use it as `EMAIL_PASS`.

Gmail OAuth2 (production)
- Prefer OAuth2 tokens or a transactional email provider (SendGrid, Mailgun, SES) for production to avoid storing account passwords.

Verification
- Send a test message from the server and verify delivery and headers.

---

## 6) `.env.example` (template)
Create a non-sensitive example file to hand off to clients. Do NOT include real secrets.

```env
# Firebase Admin (service account JSON values)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_TYPE=service_account
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...escaped key...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=service-account@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/...
FIREBASE_UNIVERSE_DOMAIN=googleapis.com

# Firebase Client (public config)
VITE_FIREBASE_API_KEY=AIza...your-api-key...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXX

# Razorpay
VITE_RAZORPAY_KEY_ID=rzp_test_xxx
# Keep the secret server-side ONLY
VITE_RAZORPAY_KEY_SECRET=rzp_test_secret_xxx

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=you@example.com
EMAIL_PASS=your_app_password
DEFAULT_REPLY_TO=you@example.com
```

---

## 7) Common pitfalls & troubleshooting
- Private key incorrectly formatted: errors like "invalid private key" — ensure `\n` sequences are present and converted in code with `.replace(/\\n/g, '\n')`.
- Missing project id: double-check `FIREBASE_PROJECT_ID` exactly matches the project id from Firebase Console.
- Secret leaked: rotate keys, revoke the leaked service account key, and create a new one.
- Vite caching: changes to `VITE_` variables require restarting the dev server.

---

## 8) Hand-off & security checklist for clients
- Do NOT accept copied `.env` files with secrets. Instead provide this `README.md` and the `.env.example`.
- The client should create their own Firebase project, service account, web app, Razorpay account, and email credentials.
- Add environment variables to the hosting platform (Vercel/Netlify/AWS/GCP) rather than committing `.env` to the repo.
- Use secret manager solutions in production.

---

## 9) Quick smoke tests
1. Server: run a tiny Node script that calls `admin.initializeApp` with the credentials from `.env` and logs `OK` on success.
2. Client: start the Vite dev server and check the browser console for Firebase init messages.
3. Razorpay: use server-side secret to create an order; check dashboard for the order id.
4. Email: send a test email and confirm delivery.

If you'd like, I can also add a `scripts/verifyEnv.js` smoke-test file and a `.env.example` file to the repository — tell me which and I'll add them.

---

## Contact / Notes
Keep this README in the root of the project and share it alongside onboarding instructions when transferring the repository or deploying to a hosting provider.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
