// backend/routes/api.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Serverless platforms (Vercel) only allow writes under the OS temp dir
const uploadsDir = process.env.VERCEL
  ? path.join(os.tmpdir(), 'nivra-uploads')
  : path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const safeName = path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, uniqueSuffix + '-' + safeName);
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      const err = new Error('Only image uploads are allowed');
      err.status = 400;
      return cb(err);
    }
    cb(null, true);
  }
});

// Controllers
const { processAIQuery, analyzeImage } = require('../controllers/aiController');
const {
  getScholarships,
  getScholarshipById,
  getLoans,
  getGovernmentSchemes,
  getSchemeById,
  getServiceGuides,
  getEmergencyServices,
  getShelters,
  createDisasterReport,
  getDisasterReports,
  getTrackers,
  addTracker,
  deleteTracker
} = require('../controllers/serviceController');

// Uploaded report images (served under /api so the Vercel rewrite reaches them)
router.use('/uploads', express.static(uploadsDir));

// 🩺 Health (reachable through the /api rewrite on Vercel)
router.get('/health', (req, res) => {
  res.json({ status: 'ONLINE', timestamp: new Date().toISOString() });
});

// 🤖 AI Endpoints
router.post('/ai/chat', processAIQuery);
router.post('/ai/analyze-image', upload.single('image'), analyzeImage);

// 🎓 Student Services & Schemes
router.get('/scholarships', getScholarships);
router.get('/scholarships/:id', getScholarshipById);
router.get('/loans', getLoans);
router.get('/schemes', getGovernmentSchemes);
router.get('/schemes/:id', getSchemeById);
router.get('/guides', getServiceGuides);

// 🚨 Emergency Services & Disaster Assistance
router.get('/emergency', getEmergencyServices);
router.get('/shelters', getShelters);
router.get('/reports', getDisasterReports);
router.post('/reports', upload.single('image'), createDisasterReport);

// 📊 Application Tracking
router.get('/trackers', getTrackers);
router.post('/trackers', addTracker);
router.delete('/trackers/:id', deleteTracker);

// Unknown API route → JSON 404 instead of Express HTML page
router.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

module.exports = router;
