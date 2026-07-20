import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../services/db';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUserId = localStorage.getItem('edu_user_id');
        if (storedUserId) {
          const profile = await db.getProfile(storedUserId);
          setUser(profile);
        }
      } catch (err) {
        console.error('Failed to restore authentication session:', err);
        localStorage.removeItem('edu_user_id');
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = async (email, password, isAdmin = false) => {
    setLoading(true);
    try {
      const response = await db.login(email, password, isAdmin);
      setUser(response.user);
      localStorage.setItem('edu_user_id', response.user.id);
      return response.user;
    } catch (err) {
      setUser(null);
      localStorage.removeItem('edu_user_id');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, fullName, role = 'student') => {
    setLoading(true);
    try {
      const response = await db.register(email, password, fullName, role);
      setUser(response.user);
      localStorage.setItem('edu_user_id', response.user.id);
      return response.user;
    } catch (err) {
      setUser(null);
      localStorage.removeItem('edu_user_id');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('edu_user_id');
  };

  const updateProfile = async (profileData) => {
    if (!user) throw new Error('Not authenticated');
    const updatedProfile = await db.updateProfile(user.id, profileData);
    setUser(prev => ({
      ...prev,
      ...updatedProfile,
      fullName: updatedProfile.full_name || updatedProfile.fullName,
      avatarUrl: updatedProfile.avatar_url || updatedProfile.avatarUrl,
      linkedinUrl: updatedProfile.linkedin_url || updatedProfile.linkedinUrl,
      githubUrl: updatedProfile.github_url || updatedProfile.githubUrl
    }));
    return updatedProfile;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isTeacher: user?.role === 'teacher',
        isStudent: user?.role === 'student' || !user?.role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
