import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { authService } from '../services/auth.service';
import { profileService } from '../services/profile.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [roles, setRoles] = useState(['student']);
  const [loading, setLoading] = useState(true);

  const fetchProfileAndRoles = async (authUser) => {
    if (!authUser) {
      setProfile(null);
      setRoles(['student']);
      return;
    }
    try {
      const userProfile = await profileService.getProfile(authUser.id);
      setProfile(userProfile);
      setRoles(userProfile?.roles || ['student']);
    } catch {
      // Fallback: construct profile from user metadata
      const meta = authUser.user_metadata || {};
      const fallbackProfile = {
        id: authUser.id,
        user_id: authUser.id,
        display_name: meta.full_name || authUser.email?.split('@')[0] || 'User',
        first_name: meta.first_name || '',
        last_name: meta.last_name || '',
        role: meta.role || 'student'
      };
      setProfile(fallbackProfile);
      setRoles([meta.role || 'student']);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        let currentUser = null;
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            currentUser = session.user;
          }
        } catch {
          // Supabase offline
        }

        if (!currentUser && typeof window !== 'undefined') {
          const saved = localStorage.getItem('eduacademy_auth_session');
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              currentUser = parsed?.user;
            } catch {}
          }
        }

        if (currentUser) {
          setUser(currentUser);
          await fetchProfileAndRoles(currentUser);
        }
      } catch (err) {
        console.error('Session initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    let subscription = null;
    try {
      const authChange = supabase.auth.onAuthStateChange(async (event, session) => {
        const currentUser = session?.user || null;
        if (currentUser) {
          setUser(currentUser);
          await fetchProfileAndRoles(currentUser);
        }
      });
      subscription = authChange.data?.subscription;
    } catch {
      // Supabase offline
    }

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      const authUser = data.user;
      setUser(authUser);
      if (data.profile) {
        setProfile(data.profile);
        setRoles(data.roles || ['student']);
      } else {
        await fetchProfileAndRoles(authUser);
      }
      return authUser;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, fullName, role = 'student') => {
    setLoading(true);
    try {
      const data = await authService.register(email, password, fullName, role);
      if (data.user) {
        setUser(data.user);
        if (data.profile) {
          setProfile(data.profile);
          setRoles(data.roles || [role]);
        } else {
          await fetchProfileAndRoles(data.user);
        }
      }
      return data;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    return await authService.loginWithGoogle();
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setProfile(null);
      setRoles(['student']);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    return await authService.resetPassword(email);
  };

  const isAdmin = roles.includes('admin');
  const isTeacher = roles.includes('teacher');
  const isSupport = roles.includes('support');
  const isStudent = roles.includes('student') || (!isAdmin && !isTeacher && !isSupport);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        roles,
        loading,
        login,
        register,
        logout,
        signInWithGoogle,
        resetPassword,
        isAuthenticated: !!user,
        isAdmin,
        isTeacher,
        isStudent,
        isSupport
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);

export const useAuth = () => useContext(AuthContext);
