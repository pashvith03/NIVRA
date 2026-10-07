// backend/data/content.js — reference content (versioned in git, not user data)
const content = require('./database');

const byId = new Map();
for (const list of [content.scholarships, content.educationLoans, content.governmentSchemes, content.serviceGuides]) {
  for (const item of list) byId.set(item.id, item);
}

// Scholarships, loans, schemes and guides share one id space (sch-*, loan-*, gov-*, guide-*)
const findContentItem = (id) => byId.get(id) || null;

module.exports = { ...content, findContentItem };
