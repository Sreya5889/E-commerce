import crypto from 'node:crypto';

/**
 * Signs a standard JWT with HMAC-SHA256
 */
export const signJwt = (payload, secret, expiresInSeconds = 86400) => {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const exp = now + expiresInSeconds;
  const body = Buffer.from(JSON.stringify({ ...payload, iat: now, exp })).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
};

/**
 * Verifies a JWT token signature and expiration
 */
export const verifyJwt = (token, secret) => {
  try {
    const parts = (token || '').split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;

    const expectedSignature = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
    if (signature !== expectedSignature) return null;

    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;

    return payload;
  } catch {
    return null;
  }
};

/**
 * Secure password hashing using PBKDF2
 */
export const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
};

/**
 * Verify hashed password
 */
export const verifyPassword = (password, storedHash) => {
  try {
    const [salt, originalHash] = (storedHash || '').split(':');
    if (!salt || !originalHash) return false;
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === originalHash;
  } catch {
    return false;
  }
};
