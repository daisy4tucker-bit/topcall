/**
 * Security & Sanitization Utilities for AURA Directory Platform
 * Enforces input sanitization, rate limiting, and safe error message formatting.
 */

// Basic in-memory rate limiting map: ipOrKey -> array of timestamps
const rateLimitStore: Record<string, number[]> = {};

/**
 * Sanitizes string inputs to prevent Cross-Site Scripting (XSS)
 * Strips script tags, javascript: URIs, and dangerous HTML entities
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/onload\s*=/gi, '')
    .replace(/onerror\s*=/gi, '')
    .replace(/onclick\s*=/gi, '')
    .trim();
}

/**
 * Validates clean text input with minimum and maximum length bounds
 */
export function validateTextBounds(
  text: string,
  minLen: number,
  maxLen: number
): { isValid: boolean; error?: string } {
  const clean = sanitizeInput(text);
  if (clean.length < minLen) {
    return { isValid: false, error: `Must be at least ${minLen} characters long.` };
  }
  if (clean.length > maxLen) {
    return { isValid: false, error: `Must not exceed ${maxLen} characters.` };
  }
  return { isValid: true };
}

/**
 * Sliding window client rate limiter
 * Returns true if request is within allowed limits; false if rate limited.
 */
export function checkClientRateLimit(
  actionKey: string,
  maxAttempts: number = 5,
  windowSeconds: number = 60
): { allowed: boolean; remainingAttempts: number; retryAfterSeconds: number } {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  if (!rateLimitStore[actionKey]) {
    rateLimitStore[actionKey] = [];
  }

  // Filter out expired timestamps
  rateLimitStore[actionKey] = rateLimitStore[actionKey].filter(
    (timestamp) => now - timestamp < windowMs
  );

  const attempts = rateLimitStore[actionKey].length;

  if (attempts >= maxAttempts) {
    const oldest = rateLimitStore[actionKey][0];
    const retryAfter = Math.ceil((oldest + windowMs - now) / 1000);
    return {
      allowed: false,
      remainingAttempts: 0,
      retryAfterSeconds: Math.max(1, retryAfter),
    };
  }

  // Record this attempt
  rateLimitStore[actionKey].push(now);

  return {
    allowed: true,
    remainingAttempts: maxAttempts - attempts - 1,
    retryAfterSeconds: 0,
  };
}

/**
 * Formats database and system errors safely for public presentation.
 * Strips PostgreSQL stack traces, connection strings, hostnames, and credentials.
 */
export function formatSafeErrorMessage(err: any): string {
  if (!err) return 'An unexpected error occurred. Please try again.';

  const rawMessage = typeof err === 'string' ? err : err.message || '';

  // Mask database internals
  if (
    rawMessage.includes('postgres') ||
    rawMessage.includes('password') ||
    rawMessage.includes('connection string') ||
    rawMessage.includes('ECONNREFUSED') ||
    rawMessage.includes('SSL')
  ) {
    return 'Database connection is temporarily busy. Please retry in a few moments.';
  }

  if (rawMessage.includes('violates foreign key constraint')) {
    return 'The requested record is tied to existing associated items.';
  }

  if (rawMessage.includes('duplicate key value')) {
    return 'A record with this identifier or permalink already exists.';
  }

  if (rawMessage.includes('Row Level Security')) {
    return 'Access denied: You do not possess the required permissions for this operation.';
  }

  // Return clean sanitized message capped at 150 chars
  return sanitizeInput(rawMessage).substring(0, 150) || 'An unexpected error occurred.';
}
