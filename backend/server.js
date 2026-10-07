// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    platform: 'NIVRA — Navigate Inform Verify Reach Assist API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', apiRoutes);

// Global Error Handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // Multer and validation errors are client errors, not server faults
  const status = err.status || (err.name === 'MulterError' ? 400 : 500);
  if (status >= 500) console.error('Unhandled Error:', err);
  res.status(status).json({
    error: status >= 500 ? 'Internal Server Error' : err.message
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 NIVRA Platform Server running on port ${PORT}`);
    console.log(`🔗 API Base Endpoint: http://localhost:${PORT}/api`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
