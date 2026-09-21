import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { config } from '../config';

/**
 * Cryptographically verifies an anti-CSRF token using HMAC-SHA256 (CWE-352).
 * Rejects dummy tokens, arbitrary UUIDs, and forged strings.
 */
function verifyHmacToken(token: string): boolean {
  if (!token.includes('.')) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [timestampStr, signature] = parts;
  const timestamp = parseInt(timestampStr, 10);
  // Valid window of 24 hours
  if (isNaN(timestamp) || Math.abs(Date.now() - timestamp) > 24 * 60 * 60 * 1000) {
    return false;
  }
  const expected = crypto.createHmac('sha256', config.jwtSecret).update(timestampStr).digest('hex');
  if (signature.length !== expected.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}

/**
 * Validates the cryptographic structure, length, and authenticity of an anti-CSRF token (CWE-352).
 * Verifies that the token is not an arbitrary string or dummy value, but a cryptographically valid token.
 */
export function isValidCsrfToken(token: unknown, req?: Request): boolean {
  if (!token || typeof token !== 'string') {
    return false;
  }
  const cleanToken = token.trim();

  // Reject empty, trivially short, or known static dummy bypass values
  if (cleanToken.length < 24) {
    return false;
  }
  const dummyTokens = [
    'undefined', 'null', 'test', 'true', 'false', 'csrf',
    '1234567890123456', 'dummy_invalid_token', 'test-token', 'dummy_token',
    'dummy', 'fake_token', 'sample_token', '00000000-0000-0000-0000-000000000000'
  ];
  if (dummyTokens.some((d) => cleanToken.toLowerCase().includes(d))) {
    return false;
  }

  // Double-submit cookie verification if XSRF-TOKEN / CSRF-TOKEN cookie is set
  if (req && req.headers && req.headers.cookie) {
    const cookies = req.headers.cookie.split(';').map(c => c.trim());
    const xsrfCookie = cookies.find(c => c.startsWith('XSRF-TOKEN=') || c.startsWith('CSRF-TOKEN='));
    if (xsrfCookie) {
      const cookieVal = decodeURIComponent(xsrfCookie.split('=')[1] || '');
      // If cookie is present, it must match cleanToken and cannot be a dummy value
      if (!cookieVal || cookieVal !== cleanToken) {
        return false;
      }
    }
  }

  // Cryptographically verify server-signed HMAC token (CWE-352)
  return verifyHmacToken(cleanToken);
}

/**
 * Generates a signed cryptographic anti-CSRF token (CWE-352).
 */
export function generateCsrfToken(): string {
  const timestamp = Date.now().toString();
  const hmac = crypto.createHmac('sha256', config.jwtSecret).update(timestamp).digest('hex');
  return `${timestamp}.${hmac}`;
}

/**
 * CSRF Protection Middleware (CWE-352)
 * Mitigates Cross-Site Request Forgery by enforcing anti-CSRF token verification,
 * cryptographic validity checks, and verified JWT authorization on state-changing requests.
 */
export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  // Safe HTTP methods do not modify state (RFC 7231 / CWE-352)
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Inspect standard anti-CSRF token headers and body fields
  const rawToken =
    req.headers['x-csrf-token'] ||
    req.headers['xsrf-token'] ||
    (req.body && (req.body.csrf_token || req.body._csrf));
  const csrfToken = Array.isArray(rawToken) ? rawToken[0] : rawToken;
  const authHeader = req.headers.authorization;

  // Validate anti-CSRF token cryptographic validity if provided
  if (csrfToken) {
    if (isValidCsrfToken(csrfToken, req)) {
      return next();
    }
    return res.status(403).json({
      success: false,
      message: 'Forbidden: CSRF token validation failed. Invalid or expired anti-CSRF token.',
    });
  }

  // Validate Bearer JWT cryptographic signature if authorization header is provided
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const jwtToken = authHeader.split(' ')[1];
    try {
      jwt.verify(jwtToken, config.jwtSecret);
      return next();
    } catch {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Invalid or expired session authorization token.',
      });
    }
  }

  // Reject state-changing requests lacking valid CSRF token or verified JWT
  return res.status(403).json({
    success: false,
    message: 'Forbidden: CSRF protection token or authorization header required for this operation.',
  });
}
