import rateLimit from 'express-rate-limit';

// Global API rate limiter - 500 requests per 15 minutes per IP (prevents resource exhaustion - CWE-400)
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

// Authentication endpoints rate limiter (prevents brute force - CWE-770)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
});

// User profile rate limiter (prevents resource exhaustion - CWE-400)
export const profileLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many profile requests. Please try again after 15 minutes.',
  },
});

// Attendance batch operations rate limiter (prevents resource exhaustion - CWE-400)
export const attendanceLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Rate limit exceeded for attendance recording. Please slow down.',
  },
});

// AI Risk calculation rate limiter (prevents resource exhaustion - CWE-400 / CWE-770)
export const riskLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

// Assignment listing rate limiter (CWE-770)
export const assignmentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many assignment listing requests. Please try again later.',
  },
});

// Assignment submission and grading rate limiter (prevents automated spam/exhaustion - CWE-770)
export const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many submission requests. Please wait a few minutes before submitting again.',
  },
});

