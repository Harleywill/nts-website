// Simple in-memory rate limiting for Next.js
// Tracks requests per IP address

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const requestCounts: Map<string, RateLimitEntry> = new Map();

export function getRateLimitKey(request: Request): string {
  // Get client IP from various header sources
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "unknown";
  return ip.trim();
}

export interface RateLimitOptions {
  limit: number; // Max requests allowed
  window: number; // Time window in milliseconds
}

export function checkRateLimit(ip: string, options: RateLimitOptions): boolean {
  const now = Date.now();
  const entry = requestCounts.get(ip);

  // If no entry or time window has passed, reset
  if (!entry || now > entry.resetTime) {
    requestCounts.set(ip, {
      count: 1,
      resetTime: now + options.window,
    });
    return true; // Allow request
  }

  // Increment counter
  entry.count++;

  // Check if limit exceeded
  if (entry.count > options.limit) {
    return false; // Reject request
  }

  return true; // Allow request
}

export function getRateLimitStatus(ip: string, options: RateLimitOptions) {
  const entry = requestCounts.get(ip);
  if (!entry) {
    return { remaining: options.limit, resetTime: Date.now() + options.window };
  }
  return {
    remaining: Math.max(0, options.limit - entry.count),
    resetTime: entry.resetTime,
  };
}
