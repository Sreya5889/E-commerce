import crypto from 'node:crypto';
import { supabaseAdmin, query } from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';
import { env } from '../config/env.js';
import { signJwt, hashPassword, verifyPassword } from '../utils/jwt.js';
import { userStore } from '../utils/userStore.js';

export const authController = {
  async register(req, res, next) {
    try {
      const { email, password, fullName, role = 'student' } = req.body;
      const nameParts = (fullName || '').trim().split(' ');
      let registeredUser = null;
      let session = null;

      // 1. Try Supabase Auth first
      try {
        const { data, error } = await supabaseAdmin.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              first_name: nameParts[0] || '',
              last_name: nameParts.slice(1).join(' ') || '',
              role
            }
          }
        });

        if (!error && data?.user) {
          registeredUser = data.user;
          session = data.session;
        } else if (error && !error.message?.includes('fetch failed')) {
          throw new AppError(error.message, 400, 'AUTH_SIGNUP_FAILED');
        }
      } catch (sbErr) {
        if (sbErr instanceof AppError) throw sbErr;
        console.warn('[AuthController] Supabase Auth offline, using local persistent registry');
      }

      // 2. If Supabase is offline or returned connection error, use persistent local store
      if (!registeredUser) {
        const existing = userStore.findByEmail(email);
        if (existing) {
          throw new AppError('User with this email already exists', 400, 'USER_EXISTS');
        }

        const userId = crypto.randomUUID();
        const hashedPassword = hashPassword(password);
        const userData = {
          id: userId,
          email: email.toLowerCase().trim(),
          password_hash: hashedPassword,
          fullName,
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          role,
          created_at: new Date().toISOString()
        };

        userStore.create(userData);

        registeredUser = {
          id: userId,
          email: userData.email,
          user_metadata: {
            full_name: fullName,
            first_name: userData.firstName,
            last_name: userData.lastName,
            role
          },
          created_at: userData.created_at
        };

        const token = signJwt(
          {
            id: userId,
            sub: userId,
            email: userData.email,
            role,
            roles: [role]
          },
          env.JWT_SECRET || 'super-secret-jwt-token-key-min-32-chars',
          86400 * 7
        );

        session = {
          access_token: token,
          token_type: 'bearer',
          expires_in: 86400 * 7,
          user: registeredUser
        };
      }

      // 3. Try to sync with PostgreSQL if connected
      try {
        const roleRes = await query('SELECT id FROM public.roles WHERE name = $1', [role]);
        if (roleRes.rows.length > 0) {
          await query(
            'INSERT INTO public.user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [registeredUser.id, roleRes.rows[0].id]
          );
        }
      } catch {
        // DB offline - non-critical
      }

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: registeredUser,
          session
        }
      });
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      let authenticatedUser = null;
      let session = null;
      let roles = ['student'];
      let profile = null;

      // 1. Try Supabase Auth
      try {
        const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });
        if (!error && data?.user) {
          authenticatedUser = data.user;
          session = data.session;
        } else if (error && !error.message?.includes('fetch failed')) {
          throw new AppError(error.message, 401, 'INVALID_CREDENTIALS');
        }
      } catch (sbErr) {
        if (sbErr instanceof AppError) throw sbErr;
        console.warn('[AuthController] Supabase Auth offline, checking local registry');
      }

      // 2. Check local registry if Supabase offline
      if (!authenticatedUser) {
        const localUser = userStore.findByEmail(email);
        if (!localUser || !verifyPassword(password, localUser.password_hash)) {
          throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
        }

        authenticatedUser = {
          id: localUser.id,
          email: localUser.email,
          user_metadata: {
            full_name: localUser.fullName,
            first_name: localUser.firstName,
            last_name: localUser.lastName,
            role: localUser.role
          }
        };

        roles = [localUser.role || 'student'];
        profile = {
          id: localUser.id,
          user_id: localUser.id,
          display_name: localUser.fullName,
          first_name: localUser.firstName,
          last_name: localUser.lastName,
          role: localUser.role
        };

        const token = signJwt(
          {
            id: localUser.id,
            sub: localUser.id,
            email: localUser.email,
            role: localUser.role,
            roles
          },
          env.JWT_SECRET || 'super-secret-jwt-token-key-min-32-chars',
          86400 * 7
        );

        session = {
          access_token: token,
          token_type: 'bearer',
          expires_in: 86400 * 7,
          user: authenticatedUser
        };
      }

      // Try PostgreSQL for profile & roles if available
      try {
        const profileRes = await query('SELECT * FROM public.profiles WHERE user_id = $1', [authenticatedUser.id]);
        if (profileRes.rows.length > 0) profile = profileRes.rows[0];

        const rolesRes = await query(
          `SELECT r.name FROM public.user_roles ur JOIN public.roles r ON ur.role_id = r.id WHERE ur.user_id = $1`,
          [authenticatedUser.id]
        );
        if (rolesRes.rows.length > 0) roles = rolesRes.rows.map(r => r.name);
      } catch {
        // DB offline - non-critical
      }

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: authenticatedUser,
          session,
          profile,
          roles
        }
      });
    } catch (err) {
      next(err);
    }
  },

  async me(req, res) {
    let profile = null;
    try {
      const profileRes = await query('SELECT * FROM public.profiles WHERE user_id = $1', [req.user.id]);
      if (profileRes.rows.length > 0) profile = profileRes.rows[0];
    } catch {
      // DB offline
    }

    if (!profile) {
      const localUser = userStore.findById(req.user.id);
      if (localUser) {
        profile = {
          id: localUser.id,
          user_id: localUser.id,
          display_name: localUser.fullName,
          first_name: localUser.firstName,
          last_name: localUser.lastName,
          role: localUser.role
        };
      }
    }

    res.status(200).json({
      success: true,
      data: {
        user: req.user,
        profile,
        roles: req.user.roles || ['student']
      }
    });
  },

  async logout(req, res) {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  },

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      try {
        const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email);
        if (error && !error.message?.includes('fetch failed')) {
          throw new AppError(error.message, 400, 'PASSWORD_RESET_FAILED');
        }
      } catch (sbErr) {
        if (sbErr instanceof AppError) throw sbErr;
      }

      res.status(200).json({
        success: true,
        message: 'Password reset link sent to your email.'
      });
    } catch (err) {
      next(err);
    }
  }
};
