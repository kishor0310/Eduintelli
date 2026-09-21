import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { generalLimiter } from './middleware/rateLimiter';
import { csrfProtection, generateCsrfToken } from './middleware/csrf';
import { config } from './config';

export const app = express();

// Trust reverse proxy for accurate client IP resolution in rate limiters
app.set('trust proxy', 1);

// Whitelist of allowed origins (prevents CSRF via permissive CORS - CWE-352)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests without an origin header (e.g., mobile apps, curl) or whitelisted origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy: unauthorized origin.'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token'],
}));

// Global Rate Limiter to protect against resource exhaustion (CWE-400)
app.use(generalLimiter);

// Parse request bodies before CSRF inspection so req.body.csrf_token is accessible
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Attach anti-CSRF token cookie to GET requests for frontend double-submit verification (CWE-352)
app.use((req, res, next) => {
  if (req.method === 'GET') {
    const token = generateCsrfToken();
    res.cookie('XSRF-TOKEN', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    res.setHeader('X-CSRF-Token', token);
  }
  next();
});

// CSRF Protection Middleware applied globally to state-modifying requests (CWE-352)
app.use(csrfProtection);

// API Routes
app.use('/api', routes);

// Centralized error handler
app.use(errorHandler);
