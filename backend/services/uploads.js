// backend/services/uploads.js — image uploads stored in Postgres (persistent on serverless)
const multer = require('multer');
const db = require('../db');

const MAX_BYTES = 5 * 1024 * 1024;

// Check real file signatures, not just the client-declared MIME type.
// SVG is deliberately excluded (it can carry scripts).
function sniffImageType(buf) {
  if (buf.length >= 3 && buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return 'image/jpeg';
  if (buf.length >= 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]))) return 'image/png';
  if (buf.length >= 12 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  if (buf.length >= 6 && /^GIF8[79]a$/.test(buf.toString('ascii', 0, 6))) return 'image/gif';
  return null;
}

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES, files: 1 },
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(Object.assign(new Error('Only image uploads are allowed'), { status: 400 }));
    }
    cb(null, true);
  },
});

// Validates and stores req.file; returns { id, mimeType } or null when no file was sent
async function saveImage(file, userId) {
  if (!file) return null;
  const mimeType = sniffImageType(file.buffer);
  if (!mimeType) throw Object.assign(new Error('Unsupported image. Use JPG, PNG, WebP or GIF.'), { status: 400 });
  const row = await db.one(
    'INSERT INTO uploads (user_id, mime_type, size_bytes, data) VALUES ($1, $2, $3, $4) RETURNING id',
    [userId || null, mimeType, file.size, file.buffer]);
  return { id: row.id, mimeType };
}

module.exports = { imageUpload, saveImage, sniffImageType, MAX_BYTES };
