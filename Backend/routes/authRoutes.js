const express = require('express');
const router = express.Router();
const { uploadImage } = require('../middleware/uploadMiddleware');
const { createRateLimiter } = require('../utils/rateLimitHelper');

const {
  loginUser,
  superAdminLogin,
  submitInquiry,
  registerEmployee,
  getActiveCompanies
} = require('../controllers/authController');

// ═══════════════════════════════════════════════
//  RATE LIMITERS (Brute Force Protection)
// ═══════════════════════════════════════════════

const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { message: 'Too many login attempts. Please try again after 15 minutes.' },
  redisKeyPrefix: 'rl:login:'
});

const superAdminLimiter = createRateLimiter({
  windowMs: 30 * 60 * 1000,
  max: 100,
  message: { message: 'Too many attempts. Try again after 30 minutes.' },
  redisKeyPrefix: 'rl:superadmin:'
});

const registerLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 1000,
  message: { message: 'Too many registration attempts. Please try again later.' },
  redisKeyPrefix: 'rl:register:'
});

const inquiryLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 50,
  message: { message: 'Too many inquiries. Please try again later.' },
  redisKeyPrefix: 'rl:inquiry:'
});

// ═══════════════════════════════════════════════
//  ROUTES
// ═══════════════════════════════════════════════

// Logins (rate-limited)
router.post('/login', loginLimiter, loginUser);
router.post('/super-admin-login', superAdminLimiter, superAdminLogin);

// Registration (rate-limited)
router.post('/register', registerLimiter, uploadImage.single('image'), registerEmployee);

// Inquiry (rate-limited)
router.post('/inquiry', inquiryLimiter, submitInquiry);

// Helper
router.get('/companies', getActiveCompanies);

module.exports = router;
