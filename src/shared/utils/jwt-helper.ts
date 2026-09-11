import * as jwt from 'jsonwebtoken';

/**
 * Extracts userId from the access token without verifying the signature.
 * This is safe for logging purposes - verification is handled by the auth guard.
 * Returns null if no valid token is present.
 */
export function extractUserIdFromToken(req: any): number | null {
  try {
    const authHeader = req.headers?.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = jwt.decode(token) as { userId?: number } | null;
    return decoded?.userId ?? null;
  } catch {
    return null;
  }
}
