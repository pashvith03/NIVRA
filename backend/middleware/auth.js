// backend/middleware/auth.js — signed httpOnly cookie sessions
const jwt = require('jsonwebtoken');
const config = require('../config');
const db = require('../db');

const COOKIE = 'nivra_session';

const cookieOptions = () => ({
  httpOnly: true,                       // not readable by page scripts (XSS can't steal it)
  sameSite: 'lax',                      // not sent on cross-site POSTs (CSRF)
  secure: config.isProduction,
  maxAge: config.sessionDays * 24 * 60 * 60 * 1000,
  path: '/',
});

function startSession(res, user) {
  const token = jwt.sign({ sub: user.id }, config.jwtSecret, { expiresIn: `${config.sessionDays}d` });
  res.cookie(COOKIE, token, cookieOptions());
}

function endSession(res) {
  const { maxAge: _maxAge, ...opts } = cookieOptions();
  res.clearCookie(COOKIE, opts);
}

// Public shape of a user — never leaks password_hash or google_sub
function toPublicUser(u) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    avatar: u.avatar_url,
    provider: u.provider,
    isGuest: u.is_guest,
    isAdmin: !!(u.email && config.adminEmails.includes(u.email.toLowerCase())),
    profile: u.profile || {},
    emergencyContacts: u.emergency_contacts || [],
    createdAt: u.created_at,
  };
}

// Attaches req.user when a valid session cookie is present
async function loadUser(req, _res, next) {
  const token = req.cookies?.[COOKIE];
  if (!token) return next();
  try {
    const { sub } = jwt.verify(token, config.jwtSecret);
    req.user = await db.one('SELECT * FROM users WHERE id = $1', [sub]);
  } catch {
    // expired/tampered token → treat as signed out
  }
  next();
}

function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Please sign in to continue.' });
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user || !toPublicUser(req.user).isAdmin) return res.status(403).json({ error: 'Admins only.' });
  next();
}

module.exports = { startSession, endSession, loadUser, requireAuth, requireAdmin, toPublicUser, COOKIE };
