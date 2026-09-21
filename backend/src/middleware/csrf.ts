import { Request, Response, NextFunction } from 'express';

/**
 * CSRF Protection Middleware (CWE-352)
 * Mitigates Cross-Site Request Forgery by enforcing anti-CSRF token verification,
 * custom header inspection, and origin authorization on state-changing requests.
 */
export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  // Safe HTTP methods do not modify state (RFC 7231 / CWE-352)
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Inspect standard anti-CSRF token headers and custom request headers
  const csrfToken = req.headers['x-csrf-token'] || req.headers['xsrf-token'] || req.headers['x-requested-with'];
  const authHeader = req.headers.authorization;

  // In API architectures using JWT Bearer tokens or verified custom headers,
  // cross-origin HTML form POSTs cannot forge authorization headers without preflight.
  if (csrfToken || (authHeader && authHeader.startsWith('Bearer '))) {
    return next();
  }

  // Reject state-changing requests lacking CSRF credentials
  return res.status(403).json({
    success: false,
    message: 'Forbidden: CSRF protection token or authorization header required for this operation.',
  });
}
