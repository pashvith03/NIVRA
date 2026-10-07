// frontend/src/routes.js — single source of truth for app URLs
export const ROUTES = {
  home: '/',
  assistant: '/assistant',
  services: '/services',
  scholarships: '/scholarships',
  scholarship: (id) => `/scholarships/${encodeURIComponent(id)}`,
  documents: '/documents',
  emergency: '/emergency',
  profile: '/profile',
};

// Navigate to the tracker and hand it a service to add
export const trackState = (item) => ({ trackItem: item, trackKey: `${item.id || item.name}-${Date.now()}` });
