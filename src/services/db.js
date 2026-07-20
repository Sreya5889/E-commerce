import { supabase } from '../supabase/supabaseClient';
import { mockDb } from './mockDb';

const isMock = !supabase;

// Helper to handle API requests with transparent mock fallbacks
const execute = async (supabaseFunc, mockFunc) => {
  if (isMock) {
    return await mockFunc();
  }
  try {
    return await supabaseFunc();
  } catch (error) {
    console.error('Supabase request failed, falling back to local database:', error);
    return await mockFunc();
  }
};

export const db = {
  isMockMode: () => isMock,

  // --- AUTH ---
  login: async (email, password, isAdmin = false) => {
    return execute(
      async () => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        // Fetch role from users and profile data
        const { data: userRecord, error: rErr } = await supabase
          .from('users')
          .select('role_id, roles(name)')
          .eq('id', data.user.id)
          .single();
        
        const role = userRecord?.roles?.name || 'student';
        if (isAdmin && role !== 'admin') {
          throw new Error('Access denied. Administrator credentials required.');
        }

        const { data: profile, error: pErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        return { user: { id: data.user.id, email: data.user.email, role, ...profile } };
      },
      () => mockDb.login(email, password, isAdmin)
    );
  },

  register: async (email, password, fullName, role = 'student') => {
    return execute(
      async () => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        
        // In real Supabase, a trigger should insert into profiles and users, 
        // but here we can write directly or fallback to mock for simpler tests
        return mockDb.register(email, password, fullName, role);
      },
      () => mockDb.register(email, password, fullName, role)
    );
  },

  getProfile: async (userId) => {
    return execute(
      async () => {
        const { data, error } = await supabase.from('profiles').select('*, users(email, roles(name))').eq('id', userId).single();
        if (error) throw error;
        return {
          id: data.id,
          fullName: data.full_name,
          bio: data.bio,
          avatarUrl: data.avatar_url,
          phone: data.phone,
          website: data.website,
          linkedinUrl: data.linkedin_url,
          githubUrl: data.github_url,
          email: data.users?.email,
          role: data.users?.roles?.name
        };
      },
      () => mockDb.getProfile(userId)
    );
  },

  updateProfile: async (userId, data) => {
    return execute(
      async () => {
        const { data: updated, error } = await supabase
          .from('profiles')
          .update({
            full_name: data.fullName,
            bio: data.bio,
            phone: data.phone,
            website: data.website,
            linkedin_url: data.linkedinUrl,
            github_url: data.githubUrl,
            avatar_url: data.avatarUrl
          })
          .eq('id', userId)
          .select()
          .single();
        if (error) throw error;
        return updated;
      },
      () => mockDb.updateProfile(userId, data)
    );
  },

  // --- COURSES ---
  getCourses: async () => {
    return execute(
      async () => {
        const { data, error } = await supabase.from('courses').select('*, teachers(*, profiles(*))');
        if (error) throw error;
        return data;
      },
      () => mockDb.getCourses()
    );
  },

  getCourseById: async (id) => {
    return execute(
      async () => {
        const { data, error } = await supabase.from('courses').select('*, teachers(*, profiles(*))').eq('id', id).single();
        if (error) throw error;
        return data;
      },
      () => mockDb.getCourseById(id)
    );
  },

  createCourse: async (teacherId, courseData) => {
    return execute(
      async () => {
        const { data, error } = await supabase.from('courses').insert({ ...courseData, teacher_id: teacherId }).select().single();
        if (error) throw error;
        return data;
      },
      () => mockDb.createCourse(teacherId, courseData)
    );
  },

  updateCourse: async (id, courseData) => {
    return execute(
      async () => {
        const { data, error } = await supabase.from('courses').update(courseData).eq('id', id).select().single();
        if (error) throw error;
        return data;
      },
      () => mockDb.updateCourse(id, courseData)
    );
  },

  deleteCourse: async (id) => {
    return execute(
      async () => {
        const { error } = await supabase.from('courses').delete().eq('id', id);
        if (error) throw error;
        return true;
      },
      () => mockDb.deleteCourse(id)
    );
  },

  // --- CART & WISHLIST ---
  getCart: async (userId) => {
    return execute(
      async () => {
        const { data, error } = await supabase.from('cart').select('course_id').eq('user_id', userId);
        if (error) throw error;
        return data.map(item => item.course_id);
      },
      () => mockDb.getCart(userId)
    );
  },

  addToCart: async (userId, courseId) => {
    return execute(
      async () => {
        const { error } = await supabase.from('cart').insert({ user_id: userId, course_id: courseId });
        if (error) throw error;
        return await db.getCart(userId);
      },
      () => mockDb.addToCart(userId, courseId)
    );
  },

  removeFromCart: async (userId, courseId) => {
    return execute(
      async () => {
        const { error } = await supabase.from('cart').delete().eq('user_id', userId).eq('course_id', courseId);
        if (error) throw error;
        return await db.getCart(userId);
      },
      () => mockDb.removeFromCart(userId, courseId)
    );
  },

  getWishlist: async (userId) => {
    return execute(
      async () => {
        const { data, error } = await supabase.from('wishlist').select('course_id').eq('user_id', userId);
        if (error) throw error;
        return data.map(item => item.course_id);
      },
      () => mockDb.getWishlist(userId)
    );
  },

  addToWishlist: async (userId, courseId) => {
    return execute(
      async () => {
        const { error } = await supabase.from('wishlist').insert({ user_id: userId, course_id: courseId });
        if (error) throw error;
        return await db.getWishlist(userId);
      },
      () => mockDb.addToWishlist(userId, courseId)
    );
  },

  removeFromWishlist: async (userId, courseId) => {
    return execute(
      async () => {
        const { error } = await supabase.from('wishlist').delete().eq('user_id', userId).eq('course_id', courseId);
        if (error) throw error;
        return await db.getWishlist(userId);
      },
      () => mockDb.removeFromWishlist(userId, courseId)
    );
  },

  // --- COUPON & ORDERS ---
  validateCoupon: async (code) => {
    return execute(
      async () => {
        const { data, error } = await supabase.from('coupons').select('*').eq('code', code.toUpperCase()).single();
        if (error) throw error;
        return data;
      },
      () => mockDb.validateCoupon(code)
    );
  },

  createOrder: async (userId, cartItems, couponCode, billingDetails) => {
    return mockDb.createOrder(userId, cartItems, couponCode, billingDetails);
  },

  processPayment: async (orderId, paymentMethod, cardDetails) => {
    return mockDb.processPayment(orderId, paymentMethod, cardDetails);
  },

  getPurchases: async (userId) => {
    return mockDb.getPurchases(userId);
  },

  // --- ENROLLMENTS & COURSE PROGRESS ---
  getEnrollments: async (userId) => {
    return execute(
      async () => {
        const { data, error } = await supabase.from('enrollments').select('*, courses(*)').eq('user_id', userId);
        if (error) throw error;
        return data;
      },
      () => mockDb.getEnrollments(userId)
    );
  },

  updateLessonProgress: async (userId, courseId, lessonId, isCompleted) => {
    return mockDb.updateLessonProgress(userId, courseId, lessonId, isCompleted);
  },

  getCertificates: async (userId) => {
    return mockDb.getCertificates(userId);
  },

  // --- REVIEWS ---
  getReviewsByCourse: async (courseId) => {
    return execute(
      async () => {
        const { data, error } = await supabase.from('reviews').select('*, profiles(full_name)').eq('course_id', courseId);
        if (error) throw error;
        return data;
      },
      () => mockDb.getReviewsByCourse(courseId)
    );
  },

  addReview: async (userId, courseId, rating, comment) => {
    return mockDb.addReview(userId, courseId, rating, comment);
  },

  deleteReview: async (userId, courseId) => {
    return mockDb.deleteReview(userId, courseId);
  },

  // --- MESSAGES ---
  getMessages: async (userId) => {
    return mockDb.getMessages(userId);
  },

  sendMessage: async (senderId, receiverId, messageText) => {
    return mockDb.sendMessage(senderId, receiverId, messageText);
  },

  // --- NOTIFICATIONS ---
  getNotifications: async (userId) => {
    return mockDb.getNotifications(userId);
  },

  markNotificationsRead: async (userId) => {
    return mockDb.markNotificationsRead(userId);
  },

  // --- ADMIN & GENERAL ---
  getAdminAnalytics: async () => {
    return mockDb.getAdminAnalytics();
  },

  getFAQ: async () => {
    return mockDb.getFAQ();
  },

  addFAQ: async (question, answer) => {
    return mockDb.addFAQ(question, answer);
  },

  deleteFAQ: async (id) => {
    return mockDb.deleteFAQ(id);
  },

  submitContactForm: async (name, email, subject, message) => {
    return mockDb.submitContactForm(name, email, subject, message);
  },

  getContactMessages: async () => {
    return mockDb.getContactMessages();
  },

  resolveContactMessage: async (id) => {
    return mockDb.resolveContactMessage(id);
  },

  getCoupons: async () => {
    return mockDb.getCoupons();
  },

  addCoupon: async (code, discountPercent) => {
    return mockDb.addCoupon(code, discountPercent);
  },

  deleteCoupon: async (code) => {
    return mockDb.deleteCoupon(code);
  }
};
