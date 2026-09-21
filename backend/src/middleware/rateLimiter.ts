import rateLimit from 'express-rate-limit';

// Authentication endpoints rate limiter (prevents brute force & excessive login attempts - CWE-307 / CWE-770)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  statusCode: 429,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  skipFailedRequests: false,
  requestPropertyName: 'authRateLimit',
  validate: false,
  keyGenerator: (req) => {
    // CWE-307: Key strictly on client IP to prevent rate limit bypass via email variation
    const rawIp = req.ip || req.socket?.remoteAddress || '127.0.0.1';
    return Array.isArray(rawIp) ? rawIp[0] : String(rawIp).split(',')[0].trim();
  },
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
});

// Global API rate limiter - 500 requests per 15 minutes per IP (prevents resource exhaustion - CWE-400)
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
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

// AI Risk & analysis calculation rate limiter (prevents resource exhaustion - CWE-400 / CWE-770)
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  statusCode: 429,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
});

export const riskLimiter = aiLimiter;

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

// Admin operations & dashboard rate limiter (prevents resource exhaustion - CWE-400)
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many admin dashboard requests. Please try again after 15 minutes.',
  },
});
