/**
 * Simple Rate Limiting Utility
 * Prevents abuse on write endpoints and contact form
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10); // 1 minute
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX || "3", 10); // 3 requests per window

/**
 * Check if request should be rate limited
 * @param identifier - Unique identifier (e.g., IP address)
 * @returns true if rate limit exceeded, false otherwise
 */
export function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const record = store[identifier];

  // Clean up expired entries periodically
  if (Math.random() < 0.01) {
    cleanupExpiredEntries();
  }

  if (!record || now > record.resetTime) {
    // First request or window expired
    store[identifier] = {
      count: 1,
      resetTime: now + WINDOW_MS,
    };
    return false;
  }

  if (record.count >= MAX_REQUESTS) {
    return true;
  }

  record.count++;
  return false;
}

/**
 * Get client IP from request
 */
export function getClientIP(request: Request): string {
  // Try various headers for IP (works with proxies/load balancers)
  const forwarded = request.headers.get("x-forwarded-for");
  const real = request.headers.get("x-real-ip");
  const cfConnecting = request.headers.get("cf-connecting-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (real) {
    return real.trim();
  }

  if (cfConnecting) {
    return cfConnecting.trim();
  }

  return "unknown";
}

/**
 * Rate limit response helper
 */
export function rateLimitResponse() {
  return new Response(
    JSON.stringify({
      error: "Too many requests",
      message: "Please wait a moment before trying again",
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": Math.ceil(WINDOW_MS / 1000).toString(),
      },
    }
  );
}

/**
 * Clean up expired entries from store
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}

/**
 * Get remaining requests for identifier
 */
export function getRemainingRequests(identifier: string): number {
  const record = store[identifier];
  if (!record || Date.now() > record.resetTime) {
    return MAX_REQUESTS;
  }
  return Math.max(0, MAX_REQUESTS - record.count);
}
