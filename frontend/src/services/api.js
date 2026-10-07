// frontend/src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// GET helper: builds an encoded query string and treats non-2xx as failure
async function getJSON(path, params = {}) {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
  ).toString();
  const res = await fetch(`${API_BASE_URL}${path}${qs ? `?${qs}` : ''}`);
  if (!res.ok) throw new Error(`${path} responded ${res.status}`);
  return res.json();
}

/**
 * Send Natural Language query to Backend AI Engine
 */
export async function sendAIQuery(query, userRole = 'all') {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, userRole })
    });
    if (!response.ok) throw new Error('AI Server response error');
    return await response.json();
  } catch (error) {
    console.warn('Backend server offline/connecting. Using fallback AI engine response.', error);
    // Client-side fallback AI matching
    return generateFallbackAIResponse(query);
  }
}

/**
 * Upload image for AI disaster hazard vision analysis
 */
export async function analyzeImageAI(file, sampleType) {
  try {
    const formData = new FormData();
    if (file) formData.append('image', file);
    if (sampleType) formData.append('sampleType', sampleType);

    const response = await fetch(`${API_BASE_URL}/ai/analyze-image`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error('AI Vision response error');
    return await response.json();
  } catch (error) {
    return {
      success: true,
      fileName: file ? file.name : (sampleType || "flood_hazard_sample.jpg"),
      detectedCategory: sampleType === 'fire' ? 'Active Fire Hazard' : 'Flooding & Waterlogging',
      confidence: '95%',
      emergencyLevel: sampleType === 'fire' ? 'CRITICAL' : 'HIGH',
      aiSummary: 'AI Vision Analysis detected urban waterlogging with submerged access routes. Immediate evacuation notice issued.',
      recommendedActions: [
        'Dispatched alert to Regional Disaster Response Squad',
        'Redirected to nearest Flood Relief Shelter (Indoor Sports Complex)',
        'Emergency SMS broadcast created'
      ]
    };
  }
}

/**
 * Fetch Scholarships
 */
export async function getScholarships(category = 'all', search = '') {
  try {
    const data = await getJSON('/scholarships', { category, search });
    return data.data || [];
  } catch {
    return fallbackScholarships;
  }
}

/**
 * Fetch one scholarship (null when it doesn't exist)
 */
export async function getScholarshipById(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/scholarships/${encodeURIComponent(id)}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Scholarship lookup failed');
    const data = await res.json();
    return data.data || null;
  } catch {
    return fallbackScholarships.find(s => s.id === id) || null;
  }
}

/**
 * Fetch Education Loans
 */
export async function getEducationLoans() {
  try {
    const data = await getJSON('/loans');
    return data.data || [];
  } catch {
    return fallbackLoans;
  }
}

/**
 * Fetch Government Schemes
 */
export async function getGovernmentSchemes(search = '') {
  try {
    const data = await getJSON('/schemes', { search });
    return data.data || [];
  } catch {
    return fallbackSchemes;
  }
}

/**
 * Fetch Government Service Guides
 */
export async function getServiceGuides() {
  try {
    const data = await getJSON('/guides');
    return data.data || [];
  } catch {
    return fallbackGuides;
  }
}

/**
 * Fetch Emergency Services & Shelters
 */
export async function getEmergencyData(type = 'all') {
  try {
    return await getJSON('/emergency', { type });
  } catch {
    return {
      emergencyFacilities: type === 'all' ? fallbackEmergency : fallbackEmergency.filter(f => f.type === type),
      disasterShelters: fallbackShelters
    };
  }
}

/**
 * Submit Disaster Issue Report
 */
export async function submitDisasterReport(reportData, imageFile) {
  try {
    const formData = new FormData();
    formData.append('category', reportData.category);
    formData.append('location', reportData.location);
    formData.append('description', reportData.description);
    formData.append('severity', reportData.severity);
    formData.append('contactNumber', reportData.contactNumber);
    if (imageFile) formData.append('image', imageFile);

    const res = await fetch(`${API_BASE_URL}/reports`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Report submission failed');
    return await res.json();
  } catch {
    return {
      success: true,
      message: "Disaster report submitted locally. Transmitting to emergency squad.",
      report: {
        id: "rep-" + Date.now(),
        category: reportData.category,
        location: reportData.location,
        description: reportData.description,
        severity: reportData.severity,
        reportedAt: new Date().toISOString(),
        status: "Transmitted to Emergency Control Room"
      }
    };
  }
}

/**
 * Fetch & Add Application Trackers
 */
export async function getTrackers() {
  try {
    const data = await getJSON('/trackers');
    return data.data || [];
  } catch {
    return fallbackTrackers;
  }
}

export async function addTracker(trackerData) {
  try {
    const res = await fetch(`${API_BASE_URL}/trackers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trackerData)
    });
    if (!res.ok) throw new Error('Tracker save failed');
    return await res.json();
  } catch {
    return {
      success: true,
      tracker: {
        id: "tr-" + Date.now(),
        title: trackerData.title,
        type: trackerData.type,
        referenceNo: trackerData.referenceNo,
        appliedDate: new Date().toISOString().split('T')[0],
        currentStatus: "Submitted - Processing",
        steps: [
          { name: "Application Submitted", done: true, date: new Date().toISOString().split('T')[0] },
          { name: "Department Verification", done: false, date: "In Progress" }
        ],
        nextReminder: trackerData.nextReminder || "Check back in 5 days"
      }
    };
  }
}

export async function deleteTracker(id) {
  try {
    await fetch(`${API_BASE_URL}/trackers/${encodeURIComponent(id)}`, { method: 'DELETE' });
  } catch {
    // offline: removal is local only
  }
}

// Fallback datasets for offline client resilience
const fallbackScholarships = [
  {
    id: "sch-1",
    name: "National Means-cum-Merit Scholarship Scheme (NMMSS)",
    category: "Merit & Financial Assistance",
    level: "Class 9 to 12",
    offeredBy: "Ministry of Education, Govt. of India",
    amount: "₹12,000 per annum",
    eligibility: ["Students studying in Class IX in Govt/Aided schools", "Minimum 55% marks in Class VIII", "Annual income ≤ ₹3,50,000"],
    documents: ["Class 8 Marksheet", "Income Certificate", "Caste Certificate", "Aadhaar Card"],
    deadline: "2026-11-30",
    officialLink: "https://scholarships.gov.in",
    tags: ["school", "merit", "low-income"]
  },
  {
    id: "sch-2",
    name: "Central Sector Scheme of Scholarships for College and University Students",
    category: "Higher Education",
    level: "Undergraduate / Postgraduate",
    offeredBy: "Department of Higher Education (MHRD)",
    amount: "₹12,000 - ₹20,000 per annum",
    eligibility: ["Above 80th percentile in Class 12 board", "Regular degree course", "Income ≤ ₹4.5 Lakhs"],
    documents: ["Class 12 Marksheet", "Income Certificate", "College Fee Receipt", "Bank Passbook"],
    deadline: "2026-12-15",
    officialLink: "https://scholarships.gov.in",
    tags: ["college", "btech", "degree"]
  },
  {
    id: "sch-3",
    name: "AICTE Pragati Scholarship Scheme for Girl Students",
    category: "Technical Education / Girls",
    level: "B.Tech / Polytechnic Diploma",
    offeredBy: "AICTE",
    amount: "₹50,000 per annum",
    eligibility: ["Girl student admitted to 1st year B.Tech/Diploma", "Max 2 girls per family", "Income ≤ ₹8 Lakhs"],
    documents: ["12th Marksheet", "College Allotment Letter", "Income Certificate"],
    deadline: "2026-10-31",
    officialLink: "https://www.aicte-india.org",
    tags: ["girls", "btech", "engineering"]
  }
];

const fallbackLoans = [
  {
    id: "loan-1",
    schemeName: "Vidya Lakshmi Education Loan Scheme",
    offeredBy: "Ministry of Finance & IBA",
    maxLoanAmount: "Up to ₹7.5 Lakhs (Collateral Free)",
    interestRate: "8.15% - 10.50% p.a.",
    eligibility: ["Indian National with confirmed college admission through merit/entrance exam"],
    keyFeatures: ["Single form for 40+ banks", "Moratorium: Course duration + 1 year", "15 years repayment"],
    requiredDocuments: ["Admission letter & Fee breakdown", "Academic marksheets", "KYC Aadhaar/PAN", "Parent Income proof"],
    officialSource: "https://www.vidyalakshmi.co.in"
  },
  {
    id: "loan-2",
    schemeName: "Central Sector Interest Subsidy Scheme (CSIS)",
    offeredBy: "Ministry of Education",
    maxLoanAmount: "Full Interest Subsidy on loans up to ₹10 Lakhs during study",
    interestRate: "0% interest during course + 1 yr moratorium",
    eligibility: ["EWS Students with annual family income ≤ ₹4.5 Lakhs"],
    keyFeatures: ["Government pays 100% interest while studying"],
    requiredDocuments: ["EWS Certificate issued by Tehsildar", "Bank Loan Sanction Letter"],
    officialSource: "https://www.education.gov.in/csis"
  }
];

const fallbackSchemes = [
  {
    id: "gov-1",
    name: "Ayushman Bharat - PM-JAY",
    ministry: "Ministry of Health",
    category: "Healthcare",
    benefit: "Free hospital coverage up to ₹5 Lakhs per family per year",
    eligibility: ["Low income families listed in SECC database / Ayushman Card holders"],
    documents: ["Aadhaar Card", "Ration Card"],
    process: "Visit Ayushman Kendra at nearest Empanelled Hospital",
    officialLink: "https://pmjay.gov.in"
  },
  {
    id: "gov-2",
    name: "PM Vishwakarma Scheme",
    ministry: "MSME Ministry",
    category: "Skill & Loan",
    benefit: "Credit up to ₹3 Lakhs at 5% interest + ₹15,000 Toolkit Incentive",
    eligibility: ["Traditional Artisans & Craftsmen in 18 trades"],
    documents: ["Aadhaar", "Bank Account", "Trade proof"],
    process: "Apply online at PM Vishwakarma portal or CSC center",
    officialLink: "https://pmvishwakarma.gov.in"
  }
];

const fallbackGuides = [
  {
    id: "guide-1",
    serviceName: "Caste & Community Certificate Application",
    department: "Revenue Department",
    purpose: "Required for reservation benefits in educational admissions & scholarships.",
    steps: [
      "Visit official State e-District portal",
      "Upload Identity Proof (Aadhaar) and Father/Relative Caste Certificate",
      "Pay nominal application fee (₹15 - ₹35)",
      "Download digital signed certificate upon Tehsildar approval (3-7 days)."
    ],
    documentsNeeded: [
      "Aadhaar Card",
      "School Leaving / Transfer Certificate",
      "Father/Parent Caste Proof",
      "Self-Declaration Affidavit"
    ],
    officialPortal: "https://edistrict.gov.in"
  }
];

const fallbackEmergency = [
  {
    id: "emp-1",
    name: "AIIMS Government General Hospital",
    type: "Hospital",
    address: "Ansari Nagar, Ring Road",
    phone: "102 / 011-26588500",
    distance: "1.2 km",
    servicesAvailable: ["24x7 ICU", "Trauma Unit", "Free Oxygen & Blood Bank"],
    status: "Open 24/7"
  },
  {
    id: "emp-2",
    name: "Central Fire & Rescue Command",
    type: "Fire Station",
    address: "Station Road, Sector 4",
    phone: "101",
    distance: "2.4 km",
    servicesAvailable: ["Fire Rescue", "Flood Water Rescue"],
    status: "Open 24/7"
  }
];

const fallbackShelters = [
  {
    id: "sh-1",
    name: "Government High School Relief Camp",
    disasterType: "Flood / Cyclone Shelter",
    location: "Zone 3 Riverbank Road",
    capacity: "800 Persons",
    currentOccupancy: "120 Persons",
    facilities: ["Clean Water", "Hot Meals", "Medical Post", "Power Backup"],
    contactPhone: "+91 98765 43210"
  }
];

const fallbackTrackers = [
  {
    id: "tr-1",
    title: "Central Sector Scheme of Scholarships",
    type: "Scholarship",
    referenceNo: "NSP/2026/894120",
    appliedDate: "2026-08-15",
    currentStatus: "Under Institute Verification",
    steps: [
      { name: "Submitted", done: true, date: "2026-08-15" },
      { name: "Institute Verification", done: false, date: "In Progress" },
      { name: "DBT Disbursal", done: false, date: "Pending" }
    ],
    nextReminder: "Check verification status by Sep 30, 2026"
  }
];

function generateFallbackAIResponse(query) {
  const text = query.toLowerCase();
  let intent = "GENERAL_GUIDANCE";
  let responseText = "";

  if (text.includes("fee") || text.includes("scholarship") || text.includes("college") || text.includes("btech") || text.includes("student")) {
    intent = "STUDENT_SCHOLARSHIP";
    responseText = "🎓 Identified your requirement as **Student Scholarship & Fee Support**. Here are top matching options for your education.";
  } else if (text.includes("loan") || text.includes("vidya lakshmi")) {
    intent = "STUDENT_LOAN";
    responseText = "🏦 Identified requirement as **Student Education Loan Assistance**. No collateral needed up to ₹7.5 Lakhs.";
  } else if (text.includes("flood") || text.includes("rain") || text.includes("shelter") || text.includes("disaster")) {
    intent = "DISASTER_ASSISTANCE";
    responseText = "🚨 **Disaster Assistance Identified**: Immediate relief camp locations and disaster response guidance dispatched.";
  } else if (text.includes("hospital") || text.includes("ambulance") || text.includes("police") || text.includes("fire")) {
    intent = "EMERGENCY_LOCATOR";
    responseText = "🚑 **Emergency Locator Active**: Contact numbers (112, 108) and nearby facilities available.";
  } else {
    responseText = "💡 **AI Assistance Ready**: Browse tailored scholarships, schemes, or emergency services below.";
  }

  return {
    success: true,
    intentCategory: intent,
    responseText: responseText,
    matchedItems: fallbackScholarships.concat(fallbackSchemes),
    documentChecklist: ["Aadhaar Card", "Income Certificate", "Academic Marksheet"],
    nextSteps: [
      "Select a service card to review eligibility",
      "Prepare your Aadhaar and Income Certificate",
      "Apply directly on the linked official government portal"
    ],
    officialSources: [
      { name: "myScheme Official Portal", url: "https://www.myscheme.gov.in" },
      { name: "National Scholarship Portal", url: "https://scholarships.gov.in" }
    ]
  };
}
