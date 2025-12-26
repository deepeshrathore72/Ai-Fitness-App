/**
 * API Utilities and Error Handling
 * Common utilities for API routes
 */

import { NextResponse } from 'next/server';

export interface ApiError {
  error: string;
  details?: string;
  statusCode?: number;
}

/**
 * Standardized error response
 */
export function errorResponse(
  message: string,
  statusCode: number = 500,
  details?: string
): NextResponse<ApiError> {
  console.error(`[API Error] ${message}`, details || '');
  
  return NextResponse.json(
    {
      error: message,
      details,
    },
    { status: statusCode }
  );
}

/**
 * Standardized success response
 */
export function successResponse<T>(
  data: T,
  statusCode: number = 200
): NextResponse<T> {
  return NextResponse.json(data, { status: statusCode });
}

/**
 * Validate required fields in request body
 */
export function validateRequiredFields(
  body: any,
  requiredFields: string[]
): { valid: boolean; missing?: string[] } {
  const missing: string[] = [];

  for (const field of requiredFields) {
    if (!body[field] && body[field] !== 0 && body[field] !== false) {
      missing.push(field);
    }
  }

  if (missing.length > 0) {
    return { valid: false, missing };
  }

  return { valid: true };
}

/**
 * Handle API errors with proper logging
 */
export function handleApiError(error: unknown, context: string): NextResponse {
  console.error(`[${context}] Error:`, error);

  if (error instanceof Error) {
    return errorResponse(
      `Failed to ${context}`,
      500,
      error.message
    );
  }

  return errorResponse(
    `Failed to ${context}`,
    500,
    'Unknown error occurred'
  );
}

/**
 * Log API requests (for debugging)
 */
export function logRequest(
  method: string,
  path: string,
  body?: any
): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[API] ${method} ${path}`);
    if (body) {
      console.log('[Body]', JSON.stringify(body, null, 2));
    }
  }
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

/**
 * Check if environment variables are set
 */
export function checkEnvVars(vars: string[]): { valid: boolean; missing?: string[] } {
  const missing: string[] = [];

  for (const varName of vars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    return { valid: false, missing };
  }

  return { valid: true };
}

/**
 * Rate limiting helper (simple in-memory implementation)
 * For production, use a proper rate limiting solution like Redis
 */
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minute
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = requestCounts.get(identifier);

  if (!record || now > record.resetTime) {
    // New window
    requestCounts.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: maxRequests - record.count };
}

/**
 * Clean up old rate limit records (call periodically)
 */
export function cleanupRateLimits(): void {
  const now = Date.now();
  for (const [key, value] of requestCounts.entries()) {
    if (now > value.resetTime) {
      requestCounts.delete(key);
    }
  }
}

// Clean up every 5 minutes
if (typeof window === 'undefined') {
  setInterval(cleanupRateLimits, 5 * 60 * 1000);
}

/**
 * Format error for logging
 */
export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}\n${error.stack || ''}`;
  }
  return String(error);
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        console.log(`Retry attempt ${i + 1} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
