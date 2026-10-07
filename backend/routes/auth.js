// backend/routes/auth.js — email/password, Google, mobile OTP and guest sign-in
const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { z } = require('zod');
const { OAuth2Client } = require('google-auth-library');

const config = require('../config');
const db = require('../db');
const validate = require('../middleware/validate');
const limits = require('../middleware/rateLimits');
const { startSession, endSession, requireAuth, toPublicUser } = require('../middleware/auth');
const sms = require('../services/sms');

const router = express.Router();
const googleClient = new OAuth2Client();

const OTP_TTL_MIN = 10;
const OTP_MAX_ATTEMPTS = 5;
const OTP_MAX_SENDS_PER_WINDOW = 3;

const emailSchema = z.string().trim().toLowerCase().pipe(z.email('Enter a valid email address'));
const indianMobile = z.string().trim()
  .transform(s => s.replace(/[\s-]/g, '').replace(/^(\+91|91|0)(?=\d{10}$)/, ''))
  .pipe(z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'));

const avatarFor = (name, bg = 'FF5FA2') =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=fff&bold=true`;

const hashOtp = (phone, code) =>
  crypto.createHmac('sha256', config.jwtSecret).update(`${phone}:${code}`).digest('hex');

// Signing in from a guest session carries the guest's data over, then drops the guest
async function adoptGuestData(req, user) {
  const prev = req.user;
  if (!prev || !prev.is_guest || prev.id === user.id) return;
  // drop guest trackers the account already tracks (unique per item), then move the rest
  await db.query(
    `DELETE FROM trackers g WHERE g.user_id = $2 AND g.item_id IS NOT NULL
       AND EXISTS (SELECT 1 FROM trackers t WHERE t.user_id = $1 AND t.item_id = g.item_id)`, [user.id, prev.id]);
  await db.query('UPDATE trackers SET user_id = $1 WHERE user_id = $2', [user.id, prev.id]);
  await db.query('UPDATE reports SET user_id = $1 WHERE user_id = $2', [user.id, prev.id]);
  await db.query('UPDATE uploads SET user_id = $1 WHERE user_id = $2', [user.id, prev.id]);
  await db.query(
    `INSERT INTO saved_items (user_id, item_id, created_at)
       SELECT $1, item_id, created_at FROM saved_items WHERE user_id = $2
     ON CONFLICT DO NOTHING`, [user.id, prev.id]);
  await db.query('DELETE FROM users WHERE id = $1', [prev.id]);
}

async function finishLogin(req, res, user, status = 200) {
  await adoptGuestData(req, user);
  const fresh = await db.one('UPDATE users SET last_login_at = now() WHERE id = $1 RETURNING *', [user.id]);
  startSession(res, fresh);
  res.status(status).json({ user: toPublicUser(fresh) });
}

// What the login screen should offer
router.get('/config', (req, res) => {
  res.json({
    googleClientId: config.googleClientId || null,
    mobileEnabled: sms.smsEnabled(),
    mobileDevMode: sms.devMode(),
  });
});

router.get('/me', (req, res) => {
  res.json({ user: req.user ? toPublicUser(req.user) : null });
});

// ── Email + password ──
router.post('/register', limits.auth, validate({
  body: z.object({
    name: z.string().trim().min(1, 'Name is required').max(80),
    email: emailSchema,
    password: z.string().min(8, 'Use at least 8 characters').max(200),
  }),
}), async (req, res) => {
  const { name, email, password } = req.valid.body;
  if (await db.one('SELECT id FROM users WHERE email = $1', [email])) {
    return res.status(409).json({ error: 'An account with this email already exists. Sign in instead.' });
  }
  const hash = await bcrypt.hash(password, 11);
  const user = await db.one(
    `INSERT INTO users (email, password_hash, name, avatar_url, provider)
     VALUES ($1, $2, $3, $4, 'email') RETURNING *`,
    [email, hash, name, avatarFor(name, '8B5CF6')]);
  await finishLogin(req, res, user, 201);
});

router.post('/login', limits.auth, validate({
  body: z.object({ email: emailSchema, password: z.string().min(1).max(200) }),
}), async (req, res) => {
  const { email, password } = req.valid.body;
  const user = await db.one('SELECT * FROM users WHERE email = $1', [email]);
  // same message for unknown email and wrong password (no account enumeration)
  if (!user?.password_hash || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: 'Incorrect email or password.' });
  }
  await finishLogin(req, res, user);
});

// ── Google Identity Services: the browser sends the ID token, we verify it ──
router.post('/google', limits.auth, validate({
  body: z.object({ credential: z.string().min(20) }),
}), async (req, res) => {
  if (!config.googleClientId) return res.status(503).json({ error: 'Google sign-in is not configured.' });

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({ idToken: req.valid.body.credential, audience: config.googleClientId });
    payload = ticket.getPayload();
  } catch {
    return res.status(401).json({ error: 'Google sign-in could not be verified. Please try again.' });
  }

  const email = payload.email_verified ? payload.email.toLowerCase() : null;
  let user = await db.one('SELECT * FROM users WHERE google_sub = $1', [payload.sub]);
  if (!user && email) {
    // link to an existing email account — Google has verified the address
    user = await db.one('UPDATE users SET google_sub = $1 WHERE email = $2 RETURNING *', [payload.sub, email]);
  }
  if (!user) {
    const name = payload.name || email?.split('@')[0] || 'Google User';
    user = await db.one(
      `INSERT INTO users (email, google_sub, name, avatar_url, provider)
       VALUES ($1, $2, $3, $4, 'google') RETURNING *`,
      [email, payload.sub, name, payload.picture || avatarFor(name)]);
  }
  await finishLogin(req, res, user);
});

// ── Mobile OTP ──
router.post('/otp/request', limits.otp, validate({
  body: z.object({ phone: indianMobile }),
}), async (req, res) => {
  if (!sms.smsEnabled()) return res.status(503).json({ error: 'Mobile sign-in is not available right now.' });
  const phone = '+91' + req.valid.body.phone;

  const { rows: [{ count }] } = await db.query(
    `SELECT count(*)::int AS count FROM otp_codes WHERE phone = $1 AND created_at > now() - interval '15 minutes'`, [phone]);
  if (count >= OTP_MAX_SENDS_PER_WINDOW) {
    return res.status(429).json({ error: 'Too many codes sent to this number. Try again in 15 minutes.' });
  }

  const code = String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
  await db.query(
    `INSERT INTO otp_codes (phone, code_hash, expires_at) VALUES ($1, $2, now() + interval '${OTP_TTL_MIN} minutes')`,
    [phone, hashOtp(phone, code)]);

  const result = await sms.sendOtp(phone, code);
  res.json({ sent: true, expiresInMinutes: OTP_TTL_MIN, ...(result.devCode ? { devCode: result.devCode } : {}) });
});

router.post('/otp/verify', limits.auth, validate({
  body: z.object({ phone: indianMobile, code: z.string().trim().regex(/^\d{6}$/, 'Enter the 6-digit code') }),
}), async (req, res) => {
  const phone = '+91' + req.valid.body.phone;
  const otp = await db.one(
    `SELECT * FROM otp_codes WHERE phone = $1 AND expires_at > now() ORDER BY created_at DESC LIMIT 1`, [phone]);

  if (!otp || otp.attempts >= OTP_MAX_ATTEMPTS) {
    return res.status(400).json({ error: 'This code has expired. Request a new one.' });
  }
  await db.query('UPDATE otp_codes SET attempts = attempts + 1 WHERE id = $1', [otp.id]);

  const expected = Buffer.from(otp.code_hash, 'hex');
  const actual = Buffer.from(hashOtp(phone, req.valid.body.code), 'hex');
  if (!crypto.timingSafeEqual(expected, actual)) {
    return res.status(400).json({ error: 'Incorrect code. Please check and try again.' });
  }
  await db.query('DELETE FROM otp_codes WHERE phone = $1', [phone]);

  let user = await db.one('SELECT * FROM users WHERE phone = $1', [phone]);
  if (!user) {
    const name = `User ${phone.slice(-4)}`;
    user = await db.one(
      `INSERT INTO users (phone, name, avatar_url, provider) VALUES ($1, $2, $3, 'mobile') RETURNING *`,
      [phone, name, avatarFor(name, 'FF9933')]);
  }
  await finishLogin(req, res, user);
});

// ── Guest: a real (anonymous) account so tracked items persist on this device ──
router.post('/guest', limits.auth, async (req, res) => {
  if (req.user) return res.json({ user: toPublicUser(req.user) });
  const user = await db.one(
    `INSERT INTO users (name, avatar_url, provider, is_guest)
     VALUES ('Guest Explorer', '/guest_pfp.png', 'guest', TRUE) RETURNING *`);
  await finishLogin(req, res, user, 201);
});

router.post('/logout', (req, res) => {
  endSession(res);
  res.json({ ok: true });
});

// ── Profile ──
const contactSchema = z.object({
  name: z.string().trim().min(1).max(60),
  phone: z.string().trim().regex(/^\+?[\d\s-]{8,16}$/, 'Enter a valid phone number'),
});

router.patch('/me', requireAuth, validate({
  body: z.object({
    name: z.string().trim().min(1).max(80).optional(),
    profile: z.object({
      age: z.coerce.number().int().min(5).max(110).optional(),
      gender: z.enum(['female', 'male', 'other']).optional(),
      annualIncome: z.coerce.number().int().min(0).max(1_00_00_00_000).optional(),
      category: z.enum(['general', 'obc', 'sc', 'st', 'ews']).optional(),
      educationLevel: z.enum(['school', 'class11-12', 'diploma', 'ug', 'pg', 'none']).optional(),
      state: z.string().trim().max(60).optional(),
      occupation: z.enum(['student', 'farmer', 'artisan', 'salaried', 'self-employed', 'unemployed', 'other']).optional(),
      disability: z.boolean().optional(),
      language: z.enum(['en', 'hi', 'te', 'ta', 'mr', 'bn']).optional(),
    }).optional(),
    emergencyContacts: z.array(contactSchema).max(5).optional(),
  }),
}), async (req, res) => {
  const { name, profile, emergencyContacts } = req.valid.body;
  const user = await db.one(
    `UPDATE users SET
       name = COALESCE($2, name),
       profile = CASE WHEN $3::jsonb IS NULL THEN profile ELSE profile || $3::jsonb END,
       emergency_contacts = COALESCE($4::jsonb, emergency_contacts)
     WHERE id = $1 RETURNING *`,
    [req.user.id, name ?? null, profile ? JSON.stringify(profile) : null,
      emergencyContacts ? JSON.stringify(emergencyContacts) : null]);
  res.json({ user: toPublicUser(user) });
});

// Account deletion (removes trackers/saved items via ON DELETE CASCADE)
router.delete('/me', requireAuth, async (req, res) => {
  await db.query('DELETE FROM uploads WHERE user_id = $1', [req.user.id]);
  await db.query('DELETE FROM users WHERE id = $1', [req.user.id]);
  endSession(res);
  res.json({ ok: true });
});

module.exports = router;
