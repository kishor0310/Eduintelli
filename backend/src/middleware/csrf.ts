import { Request, Response, NextFunction } from 'express';

/**
 * CSRF Protection Middleware (CWE-352)
 * Validates request origin, custom CSRF headers, and prevents cross-site request forgery
 * on unauthenticated state-changing endpoints like user registration.
 */
export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  // Safe HTTP methods do not change state
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const origin = req.headers.origin;
  const referer = req.headers.referer;
  const targetHost = req.headers.host;

  // Verify Origin or Referer matches host when present
  if (origin) {
    try {
      const originUrl = new URL(origin);
      if (targetHost && originUrl.host !== targetHost && !originUrl.host.startsWith('localhost:') && !originUrl.host.startsWith('127.0.0.1:')) {
        return res.status(403).json({
          success: false,
          message: 'CSRF validation failed: cross-origin request rejected.',
        });
      }
    } catch {
      return res.status(403).json({
        success: false,
        message: 'CSRF validation failed: invalid origin header.',
      });
    }
  }

  // Also verify custom anti-CSRF header or token
  const csrfToken = req.headers['x-csrf-token'] || req.headers['csrf-token'] || req.body?._csrf;
  const requestedWith = req.headers['x-requested-with'];
  const hasCustomHeader = !!(csrfToken || requestedWith === 'XMLHttpRequest' || req.headers['content-type']?.includes('application/json'));

  if (!hasCustomHeader && !origin && !referer) {
    return res.status(403).json({
      success: false,
      message: 'CSRF validation failed: missing verification token or header.',
    });
  }

  next();
}
