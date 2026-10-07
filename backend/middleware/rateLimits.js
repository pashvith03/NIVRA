// backend/middleware/rateLimits.js
// In-memory counters: per-instance on serverless, so treat these as abuse damping,
// not hard quotas. OTP sends are additionally capped per phone in the database.
const rateLimit = require('express-rate-limit');
const config = require('../config');

const make = (windowMs, limit, message) => rateLimit({
  windowMs,
  limit: config.isTest ? 10_000 : limit,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: message },
});

module.exports = {
  general: make(60 * 1000, 300, 'Too many requests, please slow down.'),
  auth:    make(15 * 60 * 1000, 30, 'Too many sign-in attempts. Try again in a few minutes.'),
  otp:     make(15 * 60 * 1000, 5, 'Too many codes requested. Try again in 15 minutes.'),
  ai:      make(60 * 1000, 20, 'Too many AI requests. Please wait a minute.'),
  upload:  make(60 * 60 * 1000, 30, 'Too many uploads. Try again later.'),
};
