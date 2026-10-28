import { NextRequest, NextResponse } from 'next/server';

interface RateLimitRecord {
  timestamps: number[];
}

// In-memory sliding window store
const rateLimitMap = new Map<string, RateLimitRecord>();

// Periodic cleanup every 5 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpiredRecords(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;

  lastCleanup = now;
  for (const [key, record] of rateLimitMap.entries()) {
    const validTimestamps = record.timestamps.filter((ts) => now - ts < windowMs);
    if (validTimestamps.length === 0) {
      rateLimitMap.delete(key);
    } else {
      record.timestamps = validTimestamps;
    }
  }
}

export interface RateLimitOptions {
  maxRequests: number;
  windowSeconds: number;
  actionName?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  retryAfterSeconds?: number;
}

/**
 * Extracts client IP from standard reverse proxy headers (Vercel, Cloudflare, etc.).
 */
export function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const parts = forwardedFor.split(',');
    return parts[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

/**
 * Checks sliding window rate limit for a client IP.
 */
export function checkRateLimit(
  request: NextRequest,
  options: RateLimitOptions
): RateLimitResult {
  const { maxRequests, windowSeconds, actionName = 'default' } = options;
  const windowMs = windowSeconds * 1000;
  const ip = getClientIp(request);
  const key = `${actionName}:${ip}`;
  const now = Date.now();

  cleanupExpiredRecords(windowMs);

  let record = rateLimitMap.get(key);
  if (!record) {
    record = { timestamps: [] };
    rateLimitMap.set(key, record);
  }

  // Filter out timestamps outside the sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= maxRequests) {
    const oldestTimestamp = record.timestamps[0];
    const retryAfterMs = Math.max(0, oldestTimestamp + windowMs - now);
    const retryAfterSeconds = Math.ceil(retryAfterMs / 1000) || 1;

    return {
      allowed: false,
      remaining: 0,
      limit: maxRequests,
      retryAfterSeconds,
    };
  }

  // Record this request
  record.timestamps.push(now);

  return {
    allowed: true,
    remaining: maxRequests - record.timestamps.length,
    limit: maxRequests,
  };
}

/**
 * Convenience helper returning a standard 429 response if rate limited.
 */
export function enforceRateLimit(
  request: NextRequest,
  options: RateLimitOptions
): NextResponse | null {
  const result = checkRateLimit(request, options);
  if (!result.allowed) {
    return NextResponse.json(
      {
        error: 'Troppe richieste. Riprova più tardi.',
        retryAfter: result.retryAfterSeconds,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(result.retryAfterSeconds || 60),
          'X-RateLimit-Limit': String(result.limit),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }
  return null;
}

/**
 * Resets the rate limit map (useful for test isolation).
 */
export function _resetRateLimitMap() {
  rateLimitMap.clear();
}
