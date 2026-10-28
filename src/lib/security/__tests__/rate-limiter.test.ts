import { describe, it, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import {
  checkRateLimit,
  enforceRateLimit,
  getClientIp,
  _resetRateLimitMap,
} from '../rate-limiter';

describe('Rate Limiter Middleware', () => {
  beforeEach(() => {
    _resetRateLimitMap();
  });

  function createMockRequest(ip: string = '192.168.1.50') {
    return new NextRequest('http://localhost:3000/api/leads', {
      headers: {
        'x-forwarded-for': ip,
      },
    });
  }

  it('should allow requests within the rate limit threshold', () => {
    const req = createMockRequest('10.0.0.1');
    const options = { maxRequests: 3, windowSeconds: 60, actionName: 'leads' };

    const res1 = checkRateLimit(req, options);
    expect(res1.allowed).toBe(true);
    expect(res1.remaining).toBe(2);

    const res2 = checkRateLimit(req, options);
    expect(res2.allowed).toBe(true);
    expect(res2.remaining).toBe(1);

    const res3 = checkRateLimit(req, options);
    expect(res3.allowed).toBe(true);
    expect(res3.remaining).toBe(0);
  });

  it('should block requests that exceed maxRequests and calculate retryAfterSeconds', () => {
    const req = createMockRequest('10.0.0.2');
    const options = { maxRequests: 2, windowSeconds: 60, actionName: 'test-limit' };

    checkRateLimit(req, options);
    checkRateLimit(req, options);

    const res3 = checkRateLimit(req, options);
    expect(res3.allowed).toBe(false);
    expect(res3.remaining).toBe(0);
    expect(res3.retryAfterSeconds).toBeGreaterThan(0);
    expect(res3.retryAfterSeconds).toBeLessThanOrEqual(60);
  });

  it('should return a 429 response via enforceRateLimit when limit is exceeded', () => {
    const req = createMockRequest('10.0.0.3');
    const options = { maxRequests: 1, windowSeconds: 60, actionName: 'enforce' };

    const firstPass = enforceRateLimit(req, options);
    expect(firstPass).toBeNull();

    const blocked = enforceRateLimit(req, options);
    expect(blocked).not.toBeNull();
    expect(blocked?.status).toBe(429);
    expect(blocked?.headers.get('Retry-After')).toBeDefined();
  });

  it('should isolate limits by IP address', () => {
    const reqA = createMockRequest('1.1.1.1');
    const reqB = createMockRequest('2.2.2.2');
    const options = { maxRequests: 1, windowSeconds: 60, actionName: 'ip-iso' };

    expect(checkRateLimit(reqA, options).allowed).toBe(true);
    expect(checkRateLimit(reqA, options).allowed).toBe(false);

    // reqB from another IP should still be allowed
    expect(checkRateLimit(reqB, options).allowed).toBe(true);
  });

  it('should correctly parse IP from multiple x-forwarded-for entries', () => {
    const req = new NextRequest('http://localhost:3000/api/leads', {
      headers: {
        'x-forwarded-for': '203.0.113.195, 70.41.3.18, 150.172.238.178',
      },
    });

    expect(getClientIp(req)).toBe('203.0.113.195');
  });
});
