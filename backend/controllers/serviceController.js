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

  // Category chips (engineering, ug, pg, girls...) match category, level or tags
  if (category && category !== "all") {
    const c = category.toLowerCase();
    const aliases = { engineering: ["engineering", "btech", "technical"], ug: ["ug", "undergraduate", "degree"], pg: ["pg", "postgraduate"] };
    const terms = aliases[c] || [c];
    results = results.filter(s => terms.some(t =>
      s.category.toLowerCase().includes(t) ||
      s.level.toLowerCase().includes(t) ||
      s.tags.some(tag => tag.toLowerCase() === t)
    ));
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

// GET a single scholarship
const getScholarshipById = (req, res) => {
  const item = scholarships.find(s => s.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Scholarship not found" });
  res.json({ success: true, data: item });
};

// GET education loans
const getLoans = (req, res) => {
  res.json({ success: true, count: educationLoans.length, data: educationLoans });
};

// GET government schemes
const getGovernmentSchemes = (req, res) => {
  const { category, search } = req.query;
  let results = [...governmentSchemes];

  if (category && category !== "all") {
    results = results.filter(s => s.category.toLowerCase().includes(category.toLowerCase()));
  }

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

// GET a single government scheme
const getSchemeById = (req, res) => {
  const item = governmentSchemes.find(s => s.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Scheme not found" });
  res.json({ success: true, data: item });
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

// GET disaster relief shelters
const getShelters = (req, res) => {
  res.json({ success: true, count: disasterShelters.length, data: disasterShelters });
};

// Disaster Issue Reporting (POST new report)
const createDisasterReport = (req, res) => {
  const { category, location, description, severity, contactNumber } = req.body;

  if (!location || !description) {
    return res.status(400).json({ error: "Location and description are required" });
  }

  const newReport = {
    id: "rep-" + Date.now(),
    category: category || "General Disaster Emergency",
    location,
    description,
    severity: severity || "HIGH",
    reportedAt: new Date().toISOString(),
    status: "Logged & Transmitted to Response Squad",
    contactNumber: contactNumber || "Not Provided",
    image: req.file ? `/api/uploads/${req.file.filename}` : null
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
    id: "tr-" + Date.now(),
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

// DELETE an application tracker
const deleteTracker = (req, res) => {
  const idx = applicationTrackers.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Tracker not found" });
  applicationTrackers.splice(idx, 1);
  res.json({ success: true });
};

module.exports = {
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
};
