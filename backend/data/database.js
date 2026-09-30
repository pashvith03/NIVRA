// backend/data/database.js
// Comprehensive dataset for Indian Government Schemes, Student Scholarships, Education Loans, Emergency Facilities & Disaster Shelters

const scholarships = [
  {
    id: "sch-1",
    name: "National Means-cum-Merit Scholarship Scheme (NMMSS)",
    category: "Merit & Financial Assistance",
    level: "Class 9 to 12",
    offeredBy: "Ministry of Education, Govt. of India",
    amount: "₹12,000 per annum",
    eligibility: [
      "Students studying in Class IX in Govt/Aided schools",
      "Minimum 55% marks in Class VIII examination (5% relaxation for SC/ST)",
      "Annual family income must not exceed ₹3,50,000 per annum"
    ],
    documents: [
      "Class 8 Marksheet",
      "Income Certificate issued by competent authority",
      "Caste Certificate (if applicable)",
      "Bank Account details linked with Aadhaar",
      "Aadhaar Card copy"
    ],
    deadline: "2026-11-30",
    officialLink: "https://scholarships.gov.in",
    tags: ["school", "merit", "low-income", "central"],
    description: "Financial assistance to meritorious students of economically weaker sections to arrest their drop out at class VIII."
  },
  {
    id: "sch-2",
    name: "Central Sector Scheme of Scholarships for College and University Students",
    category: "Higher Education",
    level: "Undergraduate / Postgraduate",
    offeredBy: "Department of Higher Education (MHRD)",
    amount: "₹12,000 - ₹20,000 per annum",
    eligibility: [
      "Above 80th percentile of successful candidates in Class 12 board exam",
      "Pursuing regular course in recognized College/University",
      "Family income less than ₹4,50,000 per annum",
      "Not receiving any other government scholarship"
    ],
    documents: [
      "Class 12 Marksheet",
      "Income Certificate",
      "Admission Fee Receipt of College",
      "Aadhaar Card & Bank Passbook"
    ],
    deadline: "2026-12-15",
    officialLink: "https://scholarships.gov.in",
    tags: ["college", "btech", "degree", "merit", "ug", "pg"],
    description: "Financial support to meritorious students from low income families to meet a part of their day-to-day expenses while pursuing higher studies."
  },
  {
    id: "sch-3",
    name: "AICTE Pragati Scholarship Scheme for Girl Students",
    category: "Technical Education / Girls",
    level: "Diploma / Degree (B.E / B.Tech / Polytechnic)",
    offeredBy: "All India Council for Technical Education (AICTE)",
    amount: "₹50,000 per annum for tuition & contingency",
    eligibility: [
      "Female students admitted to 1st year Degree/Diploma course in AICTE approved institution",
      "Maximum two girls per family are eligible",
      "Annual family income less than ₹8,00,000"
    ],
    documents: [
      "10th/12th Marksheet",
      "Admit Card / College Allotment Letter",
      "Family Income Certificate",
      "Declaration by Parents for 1 or 2 girl child status"
    ],
    deadline: "2026-10-31",
    officialLink: "https://www.aicte-india.org/schemes/students-development-schemes/Pragati",
    tags: ["girls", "btech", "engineering", "diploma", "technical"],
    description: "Empowering young girls by giving them technical education opportunities with robust annual financial support."
  },
  {
    id: "sch-4",
    name: "Post-Matric Scholarship for SC / ST / OBC Students",
    category: "Social Justice & Empowerment",
    level: "Class 11 to Higher Education",
    offeredBy: "Ministry of Social Justice and Empowerment / State Govt",
    amount: "Full tuition fee reimbursement + Monthly Maintenance Allowance",
    eligibility: [
      "Belonging to SC / ST / OBC / EBC category",
      "Pursuing post-matriculation or post-secondary courses",
      "Family income within specified state limit (usually ≤ ₹2.5 Lakhs for SC/ST, ≤ ₹1.5 Lakhs for OBC)"
    ],
    documents: [
      "Caste Certificate issued by Tehsildar",
      "Income Certificate",
      "Fee Receipt & Bonafide Certificate",
      "Last Exam Marksheet"
    ],
    deadline: "2026-11-15",
    officialLink: "https://scholarships.gov.in",
    tags: ["sc", "st", "obc", "post-matric", "tuition-fee", "college"],
    description: "Complete tuition fee coverage and monthly stipend for underprivileged SC/ST/OBC students across India."
  }
];

const educationLoans = [
  {
    id: "loan-1",
    schemeName: "Vidya Lakshmi Portal Education Loan Scheme",
    offeredBy: "Ministry of Finance & IBA (Indian Banks Association)",
    maxLoanAmount: "Up to ₹7.5 Lakhs (No collateral) / Up to ₹1.5 Crore (With Collateral)",
    interestRate: "8.15% - 10.50% p.a. (Interest subsidy available under CSIS)",
    eligibility: [
      "Indian National admitted to recognized degree/diploma course in India or Abroad through entrance exam/merit",
      "Secured admission in recognized institution"
    ],
    keyFeatures: [
      "Single common application form for 40+ banks",
      "No security/collateral required up to ₹4 Lakhs - ₹7.5 Lakhs (under Credit Guarantee Fund Scheme)",
      "Moratorium Period: Course duration + 1 year",
      "Repayment tenure up to 15 years"
    ],
    requiredDocuments: [
      "Standard Loan Application Form",
      "Proof of Admission & Fee structure from College",
      "10th, 12th & Graduation Marksheets",
      "KYC Documents (Aadhaar, PAN Card, Voter ID)",
      "Income Proof of Parent/Guarantor (ITR / Form 16 / Salary slips)",
      "Bank Statement of last 6 months"
    ],
    officialSource: "https://www.vidyalakshmi.co.in",
    tags: ["education-loan", "btech", "higher-studies", "vidya-lakshmi", "collateral-free"]
  },
  {
    id: "loan-2",
    schemeName: "Central Sector Interest Subsidy Scheme (CSIS)",
    offeredBy: "Ministry of Education, Govt. of India",
    maxLoanAmount: "Full interest subsidy during Moratorium period on loan up to ₹10 Lakhs",
    interestRate: "0% interest payable during study + moratorium period",
    eligibility: [
      "Students from Economically Weaker Sections (EWS)",
      "Annual family income from all sources up to ₹4.5 Lakhs",
      "Pursuing professional/technical courses in India in NAAC / NBA accredited institutions"
    ],
    keyFeatures: [
      "Government pays 100% of interest accrued during the course duration + 1 year moratorium",
      "Available on education loans availed through Vidya Lakshmi / Scheduled Banks"
    ],
    requiredDocuments: [
      "EWS Income Certificate issued by authorized State Official",
      "Sanction Letter of Education Loan from Bank",
      "Bonafide Student Certificate"
    ],
    officialSource: "https://www.education.gov.in/csis",
    tags: ["subsidy", "interest-free", "ews", "loan-subsidy"]
  }
];

const governmentSchemes = [
  {
    id: "gov-1",
    name: "Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY)",
    ministry: "Ministry of Health & Family Welfare",
    category: "Healthcare & Emergency Protection",
    benefit: "Health coverage of up to ₹5 Lakhs per family per year for secondary & tertiary hospitalization",
    eligibility: [
      "Families listed in SEC 2011 database / Ayushman Card holders",
      "Low-income households, unorganized sector workers, rural poor"
    ],
    documents: [
      "Aadhaar Card",
      "Ration Card",
      "Mobile Number linked to Aadhaar"
    ],
    process: "Visit nearest Ayushman Kendra / Empanelled Hospital with Aadhaar & Ration Card for instant e-KYC & card creation.",
    officialLink: "https://pmjay.gov.in",
    tags: ["health", "hospital", "medical", "free-treatment", "citizen"]
  },
  {
    id: "gov-2",
    name: "PM Vishwakarma Scheme",
    ministry: "Ministry of Micro, Small and Medium Enterprises",
    category: "Skill & Financial Assistance",
    benefit: "Collateral-free credit up to ₹3 Lakhs at 5% interest + ₹15,000 Toolkit Incentive + Skill Training stipend of ₹500/day",
    eligibility: [
      "Artisans & Craftspeople working with hands and tools in 18 traditional trades (Carpenters, Blacksmiths, Cobblers, Tailors, Masons, etc.)",
      "Minimum age 18 years"
    ],
    documents: [
      "Aadhaar Card",
      "Bank Account Details",
      "Ration Card",
      "Trade Certificate / Verification"
    ],
    process: "Apply online at PM Vishwakarma Portal or through nearest CSC (Common Service Center).",
    officialLink: "https://pmvishwakarma.gov.in",
    tags: ["skill", "craftsman", "artisan", "self-employed", "loan"]
  },
  {
    id: "gov-3",
    name: "Pradhan Mantri Awas Yojana (PMAY-Urban / Rural)",
    ministry: "Ministry of Housing and Urban Affairs",
    category: "Housing & Shelter",
    benefit: "Financial subsidy up to ₹2.67 Lakhs on home loan interest or direct grant for house construction",
    eligibility: [
      "EWS / LIG / MIG families who do not own a pucca house in India",
      "Annual household income limits apply per category"
    ],
    documents: [
      "Aadhaar Card",
      "Income Proof",
      "Land Ownership Documents / Site photos",
      "Bank Account details"
    ],
    process: "Apply online on PMAY portal or consult local municipal office / Gram Panchayat.",
    officialLink: "https://pmaymis.gov.in",
    tags: ["housing", "shelter", "home-loan", "subsidy"]
  }
];

const serviceGuides = [
  {
    id: "guide-1",
    serviceName: "Caste & Community Certificate Application",
    department: "Revenue / Revenue & Disaster Management Department",
    purpose: "Required for reservation benefits in educational admissions, government jobs & scholarships.",
    steps: [
      "Visit official State e-Seva / MeeSeva / CSC Portal (e.g., edistrict.gov.in)",
      "Upload Identity Proof (Aadhaar/Voter ID) and Father/Relative's Caste Certificate",
      "Upload Income Certificate / Ration Card",
      "Submit application and pay minor processing fee (₹15 - ₹35)",
      "Track status with Application Reference Number. Download certificate upon Tehsildar approval (3-7 days)."
    ],
    documentsNeeded: [
      "Aadhaar Card",
      "Applicant Photo",
      "School Transfer Certificate (TC) showing caste",
      "Parent's Caste Certificate or land revenue records prior to 1950/1967",
      "Self-Declaration Affidavit"
    ],
    officialPortal: "https://edistrict.gov.in"
  },
  {
    id: "guide-2",
    serviceName: "Income Certificate Application",
    department: "Revenue Department",
    purpose: "Required for fee reimbursement, scholarship eligibility, EWS quota & government assistance.",
    steps: [
      "Collect application form from local Revenue Inspector / e-Seva Center or state e-District website",
      "Attach salary slips, ITR, or employer letter (for employed) or Panchayat certificate (for rural/informal)",
      "Verification by Village Revenue Officer (VRO) / Revenue Inspector (RI)",
      "Approval by Tehsildar & digital signature certificate download."
    ],
    documentsNeeded: [
      "Aadhaar Card",
      "Ration Card copy",
      "Salary Slip / Bank Passbook / Land Holding Proof",
      "Passport size photo"
    ],
    officialPortal: "https://edistrict.gov.in"
  }
];

const emergencyServices = [
  {
    id: "emp-1",
    name: "AIIMS Government General Hospital & Emergency Care",
    type: "Hospital",
    city: "New Delhi / Metro",
    address: "Ansari Nagar, Ring Road, New Delhi",
    phone: "102 / 011-26588500",
    distance: "1.2 km",
    servicesAvailable: ["24x7 ICU", "Trauma Care", "Oxygen Supply", "Free Blood Bank", "Ambulance Station"],
    status: "Open 24/7",
    lat: 28.5672,
    lng: 77.2100
  },
  {
    id: "emp-2",
    name: "Central Fire & Rescue Command Center",
    type: "Fire Station",
    city: "Metro Region",
    address: "Station Road, Sector 4, Main City",
    phone: "101",
    distance: "2.4 km",
    servicesAvailable: ["Fire Control", "Flood Water Rescue", "Collapse Evacuation", "Hazmat Unit"],
    status: "Open 24/7",
    lat: 28.5700,
    lng: 77.2150
  },
  {
    id: "emp-3",
    name: "City Police Control Room & Women Safety Help Desk",
    type: "Police Station",
    city: "Metro Region",
    address: "Civil Lines, Police Headquarter",
    phone: "112 / 100",
    distance: "0.8 km",
    servicesAvailable: ["Law & Order", "Women Helpline (1091)", "Cyber Crime", "Emergency Patrol"],
    status: "Open 24/7",
    lat: 28.5650,
    lng: 77.2050
  },
  {
    id: "emp-4",
    name: "24x7 Express National Ambulance Services",
    type: "Ambulance",
    city: "All Regions",
    address: "Mobile Response Fleet Network",
    phone: "108",
    distance: "Available in 8-12 mins",
    servicesAvailable: ["Advanced Life Support (ALS)", "Basic Life Support (BLS)", "Neonatal Ambulance"],
    status: "Active Fleet",
    lat: 28.5680,
    lng: 77.2080
  },
  {
    id: "emp-5",
    name: "Government Central Jan Aushadhi Pharmacy",
    type: "Pharmacy",
    city: "Metro Region",
    address: "Opposite General Hospital Gate 2",
    phone: "011-26599999",
    distance: "1.5 km",
    servicesAvailable: ["Generic Medicines (50-90% Discount)", "Emergency First Aid Kits", "Insulin & Oxygen Cylinders"],
    status: "Open 24/7",
    lat: 28.5665,
    lng: 77.2120
  }
];

const disasterShelters = [
  {
    id: "sh-1",
    name: "Government Model High School Disaster Relief Center",
    disasterType: "Flood / Cyclone / Fire Shelter",
    location: "Zone 3, Riverbank Road",
    capacity: "800 Persons",
    currentOccupancy: "120 Persons",
    facilities: ["Clean Water", "Free Cooked Meals", "Medical Post", "Blankets & Sanitation", "Power Backup"],
    contactPhone: "+91 98765 43210",
    status: "ACTIVE RELIEF CAMP",
    lat: 28.5620,
    lng: 77.2180
  },
  {
    id: "sh-2",
    name: "Indoor Community Sports Complex Shelter",
    disasterType: "Severe Storm / Earthquake / Emergency Evacuation",
    location: "High Ground Sector 12",
    capacity: "1500 Persons",
    currentOccupancy: "45 Persons",
    facilities: ["High Ground Safety", "Helipad Access", "Emergency Doctor Team", "Child Care & Nursery"],
    contactPhone: "1070 (State Disaster Helpline)",
    status: "ACTIVE RELIEF CAMP",
    lat: 28.5750,
    lng: 77.2010
  }
];

// In-Memory Storage for Reported Disaster Issues & Application Trackers
const disasterReports = [
  {
    id: "rep-101",
    category: "Flooding & Waterlogging",
    location: "Sector 5 Low-Lying Area, Main Road",
    description: "Waterlogging up to 3 feet in residential street. 4 families trapped, need food packets and rescue boat.",
    severity: "HIGH",
    reportedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: "Dispatched to Rescue Team",
    image: null,
    contactNumber: "+91 99887 76655"
  }
];

const applicationTrackers = [
  {
    id: "tr-1",
    title: "Central Sector Scheme of Scholarships",
    type: "Scholarship",
    referenceNo: "NSP/2026/894120",
    appliedDate: "2026-08-15",
    currentStatus: "Under Institute Verification",
    steps: [
      { name: "Submitted", done: true, date: "2026-08-15" },
      { name: "Institute Verification", done: false, date: "Pending (Due Sep 30)" },
      { name: "State Officer Approval", done: false, date: "-" },
      { name: "Direct Benefit Transfer (DBT) Disbursal", done: false, date: "-" }
    ],
    nextReminder: "Check verification status on Sep 30, 2026"
  },
  {
    id: "tr-2",
    title: "Vidya Lakshmi SBI Education Loan",
    type: "Education Loan",
    referenceNo: "VL/SBI/2026/5549",
    appliedDate: "2026-09-01",
    currentStatus: "Document Verification Completed",
    steps: [
      { name: "Application Received", done: true, date: "2026-09-01" },
      { name: "Document Verification", done: true, date: "2026-09-10" },
      { name: "Sanction Letter Issued", done: false, date: "Expected Sep 28" },
      { name: "Disbursal to College", done: false, date: "-" }
    ],
    nextReminder: "Submit signed sanction letter copy by Oct 05, 2026"
  }
];

module.exports = {
  scholarships,
  educationLoans,
  governmentSchemes,
  serviceGuides,
  emergencyServices,
  disasterShelters,
  disasterReports,
  applicationTrackers
};
