import type { NextRequest } from 'next/server';

export interface RateLimitOptions {
  /** Maximum requests allowed within the window */
  limit: number;
  /** Time window in seconds */
  windowSec: number;
  /** Namespace prefix (e.g. 'admin-login', 'subscribe') */
  prefix: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSec: number;
  backend: 'upstash' | 'memory';
}

interface MemoryBucket {
  count: number;
  resetAt: number;
}

// Bounded in-memory fallback store (auto-pruned to avoid unbounded memory growth)
const memoryStore = new Map<string, MemoryBucket>();
const MAX_MEMORY_ENTRIES = 5000;

function pruneMemoryStore(now: number) {
  if (memoryStore.size <= MAX_MEMORY_ENTRIES) return;
  for (const [k, v] of memoryStore.entries()) {
    if (v.resetAt <= now) {
      memoryStore.delete(k);
    }
  }
  // If still oversized, evict oldest entries
  if (memoryStore.size > MAX_MEMORY_ENTRIES) {
    const excess = memoryStore.size - Math.floor(MAX_MEMORY_ENTRIES * 0.8);
    let removed = 0;
    for (const k of memoryStore.keys()) {
      memoryStore.delete(k);
      removed += 1;
      if (removed >= excess) break;
    }
  }
}

export function getClientIp(request: Request | NextRequest): string {
  const headers = request.headers;
  const cfIp = headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();

  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }

  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  return 'unknown';
}

async function checkUpstashRateLimit(
  bucketKey: string,
  limit: number,
  windowSec: number
): Promise<RateLimitResult | null> {
  const restUrl = (process.env.UPSTASH_REDIS_REST_URL || '').trim().replace(/\/$/, '');
  const restToken = (process.env.UPSTASH_REDIS_REST_TOKEN || '').trim();
  if (!restUrl || !restToken) return null;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`${restUrl}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${restToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', bucketKey],
        ['EXPIRE', bucketKey, String(windowSec), 'NX'],
        ['TTL', bucketKey],
      ]),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) return null;
    const data = (await res.json()) as Array<{ result?: number }>;
    const count = Number(data?.[0]?.result ?? 1);
    const ttl = Math.max(1, Number(data?.[2]?.result ?? windowSec));

    return {
      allowed: count <= limit,
      remaining: Math.max(0, limit - count),
      retryAfterSec: count <= limit ? 0 : ttl,
      backend: 'upstash',
    };
  } catch {
    return null;
  }
}

export async function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const safeId = identifier.replace(/[^a-zA-Z0-9:._-]/g, '_').slice(0, 128);
  const bucketKey = `pleadings:rl:${options.prefix}:${safeId}`;

  // 1. Prefer distributed Upstash Redis when configured
  const upstash = await checkUpstashRateLimit(bucketKey, options.limit, options.windowSec);
  if (upstash) return upstash;

  // 2. Fallback to bounded in-memory sliding counter
  const now = Date.now();
  pruneMemoryStore(now);
  const existing = memoryStore.get(bucketKey);

  if (!existing || existing.resetAt <= now) {
    memoryStore.set(bucketKey, {
      count: 1,
      resetAt: now + options.windowSec * 1000,
    });
    return {
      allowed: true,
      remaining: Math.max(0, options.limit - 1),
      retryAfterSec: 0,
      backend: 'memory',
    };
  }

  existing.count += 1;
  memoryStore.set(bucketKey, existing);
  const remaining = Math.max(0, options.limit - existing.count);
  const retryAfterSec = existing.count <= options.limit
    ? 0
    : Math.max(1, Math.ceil((existing.resetAt - now) / 1000));

  return {
    allowed: existing.count <= options.limit,
    remaining,
    retryAfterSec,
    backend: 'memory',
  };
}

/**
 * Reset in-memory rate limit buckets (used exclusively in automated unit tests).
 */
export function _resetMemoryRateLimitsForTest() {
  memoryStore.clear();
}

const SENSITIVE_KEY_PATTERN = /(password|secret|token|key|authorization|cookie|email|phone|contact|barcouncil)/i;

function redactMetadata(meta: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(meta)) {
    if (SENSITIVE_KEY_PATTERN.test(k)) {
      out[k] = '[REDACTED]';
    } else if (typeof v === 'string' && v.length > 200) {
      out[k] = `${v.slice(0, 200)}...[truncated]`;
    } else {
      out[k] = v;
    }
  }
  return out;
}

/**
 * Structured security & audit logger with automatic PII/secret redaction.
 */
export function logSecurityEvent(
  event: string,
  level: 'info' | 'warn' | 'error',
  metadata: Record<string, unknown> = {}
) {
  const entry = {
    ts: new Date().toISOString(),
    service: 'pleadings-security',
    event,
    level,
    ...redactMetadata(metadata),
  };

  const line = JSON.stringify(entry);
  if (level === 'error') {
    console.error(line);
  } else if (level === 'warn') {
    console.warn(line);
  } else {
    console.info(line);
  }
}
