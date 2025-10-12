/**
 * Validation Constants
 *
 * Note: These constants are intentionally duplicated between frontend and backend
 * for security and UX purposes:
 * - Frontend validation: Provides immediate user feedback (better UX)
 * - Backend validation: Enforces security (never trust the client)
 *
 * ⚠️ Important: If you change these values, you MUST update:
 * - Frontend: frontend/src/constants/validation.ts
 * - Backend: backend/src/constants/validation.ts (this file)
 *
 * For larger projects, consider shared constants package in a monorepo
 */

/**
 * Maximum file size for CSV uploads (10MB)
 * Must match frontend validation
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

/**
 * Allowed file extensions for uploads
 * Must match frontend validation
 */
export const ALLOWED_FILE_EXTENSIONS = ['.csv'];
