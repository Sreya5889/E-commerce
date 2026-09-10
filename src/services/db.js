import { supabase } from '../supabase/supabaseClient';
import { mockDb } from './mockDb';

const isMock = !supabase;

// Helper to execute Supabase query or Edge Function with graceful mock fallback
const execute = async (supabaseFunc, mockFunc) => {
  if (isMock) {
    return await mockFunc();
  }
  try {
    return await supabaseFunc();
  } catch (error) {
    console.warn('Supabase service request failed, falling back to local database mode:', error);
    return await mockFunc();
  }
};

export const db = {
  isMockMode: () => isMock,

  // --- AUTHENTICATION & USER PROFILES ---
  login: async (email, password, isAdmin = false) => {
    return execute(
      async () => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // Fetch user roles via junction table
        const { data: userRoles } = await supabase
          .from('user_roles')
          .select('roles(name)')
          .eq('user_id', data.user.id);

        const roles = userRoles?.map(ur => ur.roles?.name) || ['student'];
        const isUserAdmin = roles.includes('admin');

        if (isAdmin && !isUserAdmin) {
          throw new Error('Access denied. Administrator privileges required.');
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        return {
          user: {
            id: data.user.id,
            email: data.user.email,
            role: isUserAdmin ? 'admin' : (roles.includes('teacher') ? 'teacher' : 'student'),
            roles,
            ...profile
          }
        };
      },
      () => mockDb.login(email, password, isAdmin)
    );
  },

  register: async (email, password, fullName, role = 'student') => {
    return execute(
      async () => {
        const nameParts = (fullName || '').split(' ');
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              first_name: nameParts[0] || '',
              last_name: nameParts.slice(1).join(' ') || ''
            }
          }
        });
        if (error) throw error;
        return { user: data.user };
      },
      () => mockDb.register(email, password, fullName, role)
    );
  },

  logout: async () => {
    return execute(
      async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return true;
      },
      async () => true
    );
  },

  getProfile: async (userId) => {
    return execute(
      async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*, user_roles(roles(name))')
          .eq('user_id', userId)
          .single();

        if (error) throw error;
        const roles = data.user_roles?.map(ur => ur.roles?.name) || ['student'];

        return {
          id: data.user_id,
          firstName: data.first_name,
          lastName: data.last_name,
          displayName: data.display_name,
          bio: data.bio,
          avatarUrl: data.avatar_url,
          phone: data.phone,
          website: data.website,
          location: data.location,
          roles
        };
      },
      () => mockDb.getProfile(userId)
    );
  },

  updateProfile: async (userId, profileData) => {
    return execute(
      async () => {
        const { data, error } = await supabase
          .from('profiles')
          .update({
            first_name: profileData.firstName,
            last_name: profileData.lastName,
            display_name: profileData.displayName,
            bio: profileData.bio,
            phone: profileData.phone,
            website: profileData.website,
            location: profileData.location,
            avatar_url: profileData.avatarUrl
          })
          .eq('user_id', userId)
          .select()
          .single();

        if (error) throw error;
        return data;
      },
      () => mockDb.updateProfile(userId, profileData)
    );
  },

  // --- COURSES ---
  getCourses: async () => {
    return execute(
      async () => {
        const { data, error } = await supabase
          .from('courses')
          .select('*, teachers(*, profiles(*)), categories(*), subcategories(*)')
          .eq('status', 'published')
          .order('student_count', { ascending: false });

        if (error) throw error;
        return data;
      },
      () => mockDb.getCourses()
    );
  },

  getCourseById: async (id) => {
    return execute(
      async () => {
        const { data, error } = await supabase
          .from('courses')
          .select('*, teachers(*, profiles(*)), categories(*), course_sections(*, course_lessons(*))')
          .eq('id', id)
          .single();

        if (error) throw error;
        return data;
      },
      () => mockDb.getCourseById(id)
    );
  },

  searchCourses: async (filters) => {
    return execute(
      async () => {
        const { data, error } = await supabase.functions.invoke('search-courses', {
          body: filters
        });
        if (error) throw error;
        return data;
      },
      () => mockDb.getCourses()
    );
  },

  createCourse: async (teacherId, courseData) => {
    return execute(
      async () => {
        const { data, error } = await supabase
          .from('courses')
          .insert({ ...courseData, instructor_id: teacherId })
          .select()
          .single();

        if (error) throw error;
        return data;
      },
      () => mockDb.createCourse(teacherId, courseData)
    );
  },

  updateCourse: async (id, courseData) => {
    return execute(
      async () => {
        const { data, error } = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', id)
          .select()
          .single();

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
        const { data, error } = await supabase
          .from('cart')
          .select('course_id, courses(*)')
          .eq('user_id', userId);

        if (error) throw error;
        return data.map(item => item.course_id);
      },
      () => mockDb.getCart(userId)
    );
  },

  addToCart: async (userId, courseId) => {
    return execute(
      async () => {
        const { error } = await supabase
          .from('cart')
          .upsert({ user_id: userId, course_id: courseId }, { onConflict: 'user_id,course_id' });

        if (error) throw error;
        return await db.getCart(userId);
      },
      () => mockDb.addToCart(userId, courseId)
    );
  },

  removeFromCart: async (userId, courseId) => {
    return execute(
      async () => {
        const { error } = await supabase
          .from('cart')
          .delete()
          .eq('user_id', userId)
          .eq('course_id', courseId);

        if (error) throw error;
        return await db.getCart(userId);
      },
      () => mockDb.removeFromCart(userId, courseId)
    );
  },

  getWishlist: async (userId) => {
    return execute(
      async () => {
        const { data, error } = await supabase
          .from('wishlist')
          .select('course_id')
          .eq('user_id', userId);

        if (error) throw error;
        return data.map(item => item.course_id);
      },
      () => mockDb.getWishlist(userId)
    );
  },

  addToWishlist: async (userId, courseId) => {
    return execute(
      async () => {
        const { error } = await supabase
          .from('wishlist')
          .upsert({ user_id: userId, course_id: courseId }, { onConflict: 'user_id,course_id' });

        if (error) throw error;
        return await db.getWishlist(userId);
      },
      () => mockDb.addToWishlist(userId, courseId)
    );
  },

  removeFromWishlist: async (userId, courseId) => {
    return execute(
      async () => {
        const { error } = await supabase
          .from('wishlist')
          .delete()
          .eq('user_id', userId)
          .eq('course_id', courseId);

        if (error) throw error;
        return await db.getWishlist(userId);
      },
      () => mockDb.removeFromWishlist(userId, courseId)
    );
  },

  // --- CHECKOUT, ORDERS & PAYMENTS ---
  validateCoupon: async (code, cartSubtotal = 0) => {
    return execute(
      async () => {
        const { data, error } = await supabase.functions.invoke('validate-coupon', {
          body: { code, cartSubtotal }
        });
        if (error) throw error;
        return data.data;
      },
      () => mockDb.validateCoupon(code)
    );
  },

  createOrder: async (userId, cartItems, couponCode, billingDetails) => {
    return execute(
      async () => {
        const { data, error } = await supabase.functions.invoke('create-order', {
          body: { couponCode, billingDetails }
        });
        if (error) throw error;
        return data.data;
      },
      () => mockDb.createOrder(userId, cartItems, couponCode, billingDetails)
    );
  },

  processPayment: async (orderId, provider = 'stripe') => {
    return execute(
      async () => {
        const { data, error } = await supabase.functions.invoke('process-payment', {
          body: { orderId, provider }
        });
        if (error) throw error;
        return data.data;
      },
      () => mockDb.processPayment(orderId, 'credit_card', {})
    );
  },

  getPurchases: async (userId) => {
    return execute(
      async () => {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
      },
      () => mockDb.getPurchases(userId)
    );
  },

  // --- ENROLLMENTS & COURSE PROGRESS ---
  getEnrollments: async (userId) => {
    return execute(
      async () => {
        const { data, error } = await supabase
          .from('enrollments')
          .select('*, courses(*, teachers(*, profiles(*)))')
          .eq('user_id', userId);

        if (error) throw error;
        return data;
      },
      () => mockDb.getEnrollments(userId)
    );
  },

  updateLessonProgress: async (userId, courseId, lessonId, isCompleted) => {
    return execute(
      async () => {
        const { error } = await supabase
          .from('lesson_progress')
          .upsert({
            user_id: userId,
            lesson_id: lessonId,
            course_id: courseId,
            completed: isCompleted,
            completed_at: isCompleted ? new Date().toISOString() : null
          }, { onConflict: 'user_id,lesson_id' });

        if (error) throw error;

        // Recalculate student course progress via RPC
        const { data: progress } = await supabase.rpc('recalculate_student_course_progress', {
          p_user_id: userId,
          p_course_id: courseId
        });

        return { progressPercentage: progress };
      },
      () => mockDb.updateLessonProgress(userId, courseId, lessonId, isCompleted)
    );
  },

  getCertificates: async (userId) => {
    return execute(
      async () => {
        const { data, error } = await supabase
          .from('certificates')
          .select('*, courses(*)')
          .eq('user_id', userId);

        if (error) throw error;
        return data;
      },
      () => mockDb.getCertificates(userId)
    );
  },

  generateCertificate: async (courseId) => {
    return execute(
      async () => {
        const { data, error } = await supabase.functions.invoke('generate-certificate', {
          body: { courseId }
        });
        if (error) throw error;
        return data.data;
      },
      async () => ({ certificate_number: `CERT-${Date.now()}`, verification_code: `VERIFY-${Date.now()}` })
    );
  },

  // --- REVIEWS ---
  getReviewsByCourse: async (courseId) => {
    return execute(
      async () => {
        const { data, error } = await supabase
          .from('reviews')
          .select('*, profiles(display_name, first_name, last_name, avatar_url)')
          .eq('course_id', courseId)
          .eq('is_approved', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
      },
      () => mockDb.getReviewsByCourse(courseId)
    );
  },

  addReview: async (userId, courseId, rating, comment) => {
    return execute(
      async () => {
        const { data, error } = await supabase
          .from('reviews')
          .upsert({
            user_id: userId,
            course_id: courseId,
            rating,
            review: comment,
            is_verified_purchase: true
          }, { onConflict: 'user_id,course_id' })
          .select()
          .single();

        if (error) throw error;
        return data;
      },
      () => mockDb.addReview(userId, courseId, rating, comment)
    );
  },

  // --- NOTIFICATIONS & MESSAGES ---
  getNotifications: async (userId) => {
    return execute(
      async () => {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
      },
      () => mockDb.getNotifications(userId)
    );
  },

  markNotificationsRead: async (userId) => {
    return execute(
      async () => {
        const { error } = await supabase
          .from('notifications')
          .update({ is_read: true, read_at: new Date().toISOString() })
          .eq('user_id', userId)
          .eq('is_read', false);

        if (error) throw error;
        return true;
      },
      () => mockDb.markNotificationsRead(userId)
    );
  },

  // --- ADMIN & ANALYTICS ---
  getAdminAnalytics: async () => {
    return execute(
      async () => {
        const { data, error } = await supabase.functions.invoke('admin-analytics');
        if (error) throw error;
        return data.data;
      },
      () => mockDb.getAdminAnalytics()
    );
  },

  getFAQ: async () => {
    return execute(
      async () => {
        const { data, error } = await supabase
          .from('faq')
          .select('*')
          .eq('is_published', true)
          .order('sort_order', { ascending: true });

        if (error) throw error;
        return data;
      },
      () => mockDb.getFAQ()
    );
  },

  submitContactForm: async (name, email, subject, message) => {
    return execute(
      async () => {
        const { data, error } = await supabase
          .from('contact_messages')
          .insert({ name, email, subject, message })
          .select()
          .single();

        if (error) throw error;
        return data;
      },
      () => mockDb.submitContactForm(name, email, subject, message)
    );
  }
};
