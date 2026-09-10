import { supabaseAdmin, query } from '../config/db.js';
import { AppError } from './errorHandler.js';
import { env } from '../config/env.js';
import { verifyJwt } from '../utils/jwt.js';

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authentication required. Missing or malformed token.', 401, 'UNAUTHORIZED');
    }

    const token = authHeader.split(' ')[1];
    let user = null;

    // 1. Try Supabase Auth
    try {
      const { data, error } = await supabaseAdmin.auth.getUser(token);
      if (!error && data?.user) {
        user = data.user;
      }
    } catch {
      // Supabase offline
    }

    // 2. Try JWT fallback if Supabase is offline
    if (!user) {
      const payload = verifyJwt(token, env.JWT_SECRET || 'super-secret-jwt-token-key-min-32-chars');
      if (payload) {
        user = {
          id: payload.id || payload.sub,
          email: payload.email,
          roles: payload.roles || [payload.role || 'student'],
          user_metadata: {
            role: payload.role || 'student',
            full_name: payload.fullName || payload.name || payload.email?.split('@')[0]
          }
        };
      }
    }

    if (!user) {
      throw new AppError('Invalid, expired, or revoked session token.', 401, 'INVALID_TOKEN');
    }

    // Fetch user roles from DB if available
    let roles = user.roles || [];
    try {
      const rolesRes = await query(
        `SELECT r.name 
         FROM public.user_roles ur
         JOIN public.roles r ON ur.role_id = r.id
         WHERE ur.user_id = $1`,
        [user.id]
      );

      if (rolesRes.rows.length > 0) {
        roles = rolesRes.rows.map(r => r.name);
      }
    } catch {
      // Database offline - fallback to role in user object
    }

    if (roles.length === 0) {
      roles = [user.user_metadata?.role || 'student'];
    }

    req.user = {
      ...user,
      roles,
      isAdmin: roles.includes('admin'),
      isTeacher: roles.includes('teacher'),
      isStudent: roles.includes('student') || (!roles.includes('admin') && !roles.includes('teacher')),
      isSupport: roles.includes('support')
    };

    next();
  } catch (err) {
    next(err);
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      let user = null;

      try {
        const { data } = await supabaseAdmin.auth.getUser(token);
        if (data?.user) user = data.user;
      } catch {}

      if (!user) {
        const payload = verifyJwt(token, env.JWT_SECRET || 'super-secret-jwt-token-key-min-32-chars');
        if (payload) {
          user = {
            id: payload.id || payload.sub,
            email: payload.email,
            roles: payload.roles || [payload.role || 'student'],
            user_metadata: { role: payload.role || 'student' }
          };
        }
      }

      if (user) {
        let roles = user.roles || [user.user_metadata?.role || 'student'];
        try {
          const rolesRes = await query(
            `SELECT r.name FROM public.user_roles ur JOIN public.roles r ON ur.role_id = r.id WHERE ur.user_id = $1`,
            [user.id]
          );
          if (rolesRes.rows.length > 0) roles = rolesRes.rows.map(r => r.name);
        } catch {}

        req.user = {
          ...user,
          roles,
          isAdmin: roles.includes('admin'),
          isTeacher: roles.includes('teacher')
        };
      }
    }
    next();
  } catch {
    next();
  }
};
