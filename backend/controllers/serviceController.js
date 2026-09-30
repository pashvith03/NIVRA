// backend/controllers/serviceController.js
const {
  scholarships,
  educationLoans,
  governmentSchemes,
  serviceGuides,
  emergencyServices,
  disasterShelters,
  disasterReports,
  applicationTrackers
} = require('../data/database');

// GET all scholarships with optional query filters
const getScholarships = (req, res) => {
  const { category, search } = req.query;
  let results = [...scholarships];

  if (category && category !== "all") {
    results = results.filter(s => s.category.toLowerCase().includes(category.toLowerCase()));
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  res.json({ success: true, count: results.length, data: results });
};

// GET education loans
const getLoans = (req, res) => {
  res.json({ success: true, count: educationLoans.length, data: educationLoans });
};

// GET government schemes
const getGovernmentSchemes = (req, res) => {
  const { category, search } = req.query;
  let results = [...governmentSchemes];

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.benefit.toLowerCase().includes(q) ||
      s.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  res.json({ success: true, count: results.length, data: results });
};

// GET government service guides
const getServiceGuides = (req, res) => {
  res.json({ success: true, data: serviceGuides });
};

// GET emergency locator items & disaster shelters
const getEmergencyServices = (req, res) => {
  const { type } = req.query;
  let results = [...emergencyServices];

  if (type && type !== "all") {
    results = results.filter(e => e.type.toLowerCase() === type.toLowerCase());
  }

  res.json({
    success: true,
    emergencyFacilities: results,
    disasterShelters: disasterShelters
  });
};

// Disaster Issue Reporting (POST new report)
const createDisasterReport = (req, res) => {
  const { category, location, description, severity, contactNumber } = req.body;

  if (!location || !description) {
    return res.status(400).json({ error: "Location and description are required" });
  }

  const newReport = {
    id: "rep-" + (Date.now() % 10000),
    category: category || "General Disaster Emergency",
    location,
    description,
    severity: severity || "HIGH",
    reportedAt: new Date().toISOString(),
    status: "Logged & Transmitted to Response Squad",
    contactNumber: contactNumber || "Not Provided",
    image: req.file ? `/uploads/${req.file.filename}` : null
  };

  disasterReports.unshift(newReport);

  res.json({
    success: true,
    message: "Disaster issue reported successfully. Response team notified.",
    report: newReport
  });
};

// GET disaster reports list
const getDisasterReports = (req, res) => {
  res.json({ success: true, count: disasterReports.length, data: disasterReports });
};

// GET user application trackers
const getTrackers = (req, res) => {
  res.json({ success: true, count: applicationTrackers.length, data: applicationTrackers });
};

// POST add new application tracker
const addTracker = (req, res) => {
  const { title, type, referenceNo, nextReminder } = req.body;

  if (!title || !referenceNo) {
    return res.status(400).json({ error: "Title and reference number required" });
  }

  const newTracker = {
    id: "tr-" + (Date.now() % 10000),
    title,
    type: type || "Government Scheme",
    referenceNo,
    appliedDate: new Date().toISOString().split('T')[0],
    currentStatus: "Submitted - Verification Pending",
    steps: [
      { name: "Application Submitted", done: true, date: new Date().toISOString().split('T')[0] },
      { name: "Department Verification", done: false, date: "In Progress" },
      { name: "Final Approval & Benefit Disbursal", done: false, date: "Pending" }
    ],
    nextReminder: nextReminder || "Check portal status in 7 days"
  };

  applicationTrackers.unshift(newTracker);

  res.json({
    success: true,
    message: "Application added to tracking dashboard!",
    tracker: newTracker
  });
};

module.exports = {
  getScholarships,
  getLoans,
  getGovernmentSchemes,
  getServiceGuides,
  getEmergencyServices,
  createDisasterReport,
  getDisasterReports,
  getTrackers,
  addTracker
};
