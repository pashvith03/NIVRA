// backend/routes/api.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '../uploads');
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
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const upload = multer({ storage: storage });

// Controllers
const { processAIQuery, analyzeImage } = require('../controllers/aiController');
const {
  getScholarships,
  getLoans,
  getGovernmentSchemes,
  getServiceGuides,
  getEmergencyServices,
  createDisasterReport,
  getDisasterReports,
  getTrackers,
  addTracker
} = require('../controllers/serviceController');

// 🤖 AI Endpoints
router.post('/ai/chat', processAIQuery);
router.post('/ai/analyze-image', upload.single('image'), analyzeImage);

// 🎓 Student Services & Schemes
router.get('/scholarships', getScholarships);
router.get('/loans', getLoans);
router.get('/schemes', getGovernmentSchemes);
router.get('/guides', getServiceGuides);

// 🚨 Emergency Services & Disaster Assistance
router.get('/emergency', getEmergencyServices);
router.get('/reports', getDisasterReports);
router.post('/reports', upload.single('image'), createDisasterReport);

// 📊 Application Tracking
router.get('/trackers', getTrackers);
router.post('/trackers', addTracker);

module.exports = router;
