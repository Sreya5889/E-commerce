import { COURSES, INSTRUCTORS, CATEGORIES, REVIEWS, COUPONS } from '../constants/mockData';

// Helper to initialize local storage
const initLocalStorage = () => {
  if (!localStorage.getItem('edu_initialized')) {
    localStorage.setItem('edu_initialized', 'true');
    localStorage.setItem('edu_categories', JSON.stringify(CATEGORIES));
    localStorage.setItem('edu_instructors', JSON.stringify(INSTRUCTORS));
    
    // Create initial admin, teacher, and student users
    const defaultUsers = [
      { id: 'usr-admin', email: 'admin@eduacademy.com', password: 'password123', role: 'admin', fullName: 'System Administrator' },
      { id: 'usr-teacher-1', email: 'angela@eduacademy.com', password: 'password123', role: 'teacher', fullName: 'Dr. Angela Steele' },
      { id: 'usr-student', email: 'student@eduacademy.com', password: 'password123', role: 'student', fullName: 'Jane Doe' }
    ];
    localStorage.setItem('edu_users', JSON.stringify(defaultUsers));

    // Profiles table matching users
    const defaultProfiles = [
      { id: 'usr-admin', fullName: 'System Administrator', bio: 'Platform Admin', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80' },
      { id: 'usr-teacher-1', fullName: 'Dr. Angela Steele', bio: 'Google Developer Expert & Full Stack Engineer', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80', linkedinUrl: 'https://linkedin.com', githubUrl: 'https://github.com' },
      { id: 'usr-student', fullName: 'Jane Doe', bio: 'Self-taught Developer', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80' }
    ];
    localStorage.setItem('edu_profiles', JSON.stringify(defaultProfiles));

    // Seeding teachers table details
    const defaultTeachers = [
      { id: 'usr-teacher-1', qualification: 'Ph.D. in Computer Science', designation: 'Senior Full-Stack Engineer', totalCourses: 15, studentsCount: 124000, rating: 4.8, isVerified: true }
    ];
    localStorage.setItem('edu_teachers', JSON.stringify(defaultTeachers));

    localStorage.setItem('edu_courses', JSON.stringify(COURSES));
    localStorage.setItem('edu_reviews', JSON.stringify(REVIEWS));
    localStorage.setItem('edu_coupons', JSON.stringify(COUPONS));
    
    // Empty setups
    localStorage.setItem('edu_carts', JSON.stringify({}));
    localStorage.setItem('edu_wishlists', JSON.stringify({}));
    localStorage.setItem('edu_enrollments', JSON.stringify([
      { id: 'enr-1', userId: 'usr-student', courseId: 'course-1', progressPercent: 20, completedLessons: ['les-1-1'], enrolledAt: new Date().toISOString() }
    ]));
    localStorage.setItem('edu_orders', JSON.stringify([
      { id: 'ord-1', userId: 'usr-student', subtotal: 99.99, discountAmount: 80.00, taxAmount: 1.20, grandTotal: 21.19, status: 'completed', createdAt: new Date().toISOString(), billingDetails: { name: 'Jane Doe', email: 'student@eduacademy.com', address: '123 Tech Lane', country: 'United States' } }
    ]));
    localStorage.setItem('edu_payments', JSON.stringify([
      { id: 'pay-1', orderId: 'ord-1', amount: 21.19, paymentMethod: 'credit_card', status: 'success', createdAt: new Date().toISOString() }
    ]));
    localStorage.setItem('edu_notifications', JSON.stringify([
      { id: 'not-1', userId: 'usr-student', title: 'Welcome to EduAcademy!', content: 'Start learning by browsing our popular courses.', type: 'announcement', isRead: false, createdAt: new Date().toISOString() }
    ]));
    localStorage.setItem('edu_messages', JSON.stringify([]));
    localStorage.setItem('edu_certificates', JSON.stringify([]));
    localStorage.setItem('edu_faqs', JSON.stringify([
      { id: 'faq-1', question: 'How do I access my certificates?', answer: 'Once you complete 100% of a course, a certificate is generated in your dashboard.' },
      { id: 'faq-2', question: 'Is there a time limit?', answer: 'No, you get lifetime access to all purchased courses.' }
    ]));
    localStorage.setItem('edu_contact_messages', JSON.stringify([]));
  }
};

initLocalStorage();

// Database Accessor Helpers
const getTable = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const saveTable = (key, data) => localStorage.setItem(key, JSON.stringify(data));

export const mockDb = {
  // --- AUTH SERVICES ---
  login: async (email, password, isAdmin = false) => {
    const users = getTable('edu_users');
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid email or password');
    if (isAdmin && user.role !== 'admin') throw new Error('Access denied. Administrator privileges required.');
    
    // Fetch profile
    const profiles = getTable('edu_profiles');
    const profile = profiles.find(p => p.id === user.id) || {};
    
    return { user: { id: user.id, email: user.email, role: user.role, ...profile } };
  },

  register: async (email, password, fullName, role = 'student') => {
    const users = getTable('edu_users');
    if (users.find(u => u.email === email)) throw new Error('Email is already registered');
    
    const id = 'usr-' + Math.random().toString(36).substr(2, 9);
    const newUser = { id, email, password, role };
    users.push(newUser);
    saveTable('edu_users', users);

    // Create Profile
    const profiles = getTable('edu_profiles');
    const newProfile = { id, fullName, bio: 'Student Developer', avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${fullName}` };
    profiles.push(newProfile);
    saveTable('edu_profiles', profiles);

    // Create role-specific record if teacher
    if (role === 'teacher') {
      const teachers = getTable('edu_teachers');
      teachers.push({ id, qualification: '', designation: '', experience: '', specialization: '', totalCourses: 0, studentsCount: 0, rating: 5.0, isVerified: false });
      saveTable('edu_teachers', teachers);
    }

    return { user: { id, email, role, ...newProfile } };
  },

  getProfile: async (userId) => {
    const profiles = getTable('edu_profiles');
    const user = getTable('edu_users').find(u => u.id === userId);
    const profile = profiles.find(p => p.id === userId) || {};
    return { ...profile, email: user?.email, role: user?.role };
  },

  updateProfile: async (userId, data) => {
    const profiles = getTable('edu_profiles');
    const index = profiles.findIndex(p => p.id === userId);
    if (index === -1) throw new Error('Profile not found');
    profiles[index] = { ...profiles[index], ...data };
    saveTable('edu_profiles', profiles);
    return profiles[index];
  },

  // --- COURSE SERVICES ---
  getCourses: async () => {
    return getTable('edu_courses');
  },

  getCourseById: async (id) => {
    const courses = getTable('edu_courses');
    const course = courses.find(c => c.id === id);
    if (!course) throw new Error('Course not found');
    return course;
  },

  createCourse: async (teacherId, courseData) => {
    const courses = getTable('edu_courses');
    const newCourse = {
      id: 'course-' + Math.random().toString(36).substr(2, 9),
      ...courseData,
      teacherId,
      rating: 5.0,
      studentCount: 0,
      curriculum: courseData.curriculum || [],
      created_at: new Date().toISOString()
    };
    courses.push(newCourse);
    saveTable('edu_courses', courses);
    return newCourse;
  },

  updateCourse: async (id, courseData) => {
    const courses = getTable('edu_courses');
    const idx = courses.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Course not found');
    courses[idx] = { ...courses[idx], ...courseData };
    saveTable('edu_courses', courses);
    return courses[idx];
  },

  deleteCourse: async (id) => {
    let courses = getTable('edu_courses');
    courses = courses.filter(c => c.id !== id);
    saveTable('edu_courses', courses);
    return true;
  },

  // --- CART & WISHLIST SERVICES ---
  getCart: async (userId) => {
    const carts = JSON.parse(localStorage.getItem('edu_carts') || '{}');
    return carts[userId] || [];
  },

  addToCart: async (userId, courseId) => {
    const carts = JSON.parse(localStorage.getItem('edu_carts') || '{}');
    if (!carts[userId]) carts[userId] = [];
    if (!carts[userId].includes(courseId)) {
      carts[userId].push(courseId);
    }
    localStorage.setItem('edu_carts', JSON.stringify(carts));
    return carts[userId];
  },

  removeFromCart: async (userId, courseId) => {
    const carts = JSON.parse(localStorage.getItem('edu_carts') || '{}');
    if (carts[userId]) {
      carts[userId] = carts[userId].filter(id => id !== courseId);
    }
    localStorage.setItem('edu_carts', JSON.stringify(carts));
    return carts[userId] || [];
  },

  getWishlist: async (userId) => {
    const wishlists = JSON.parse(localStorage.getItem('edu_wishlists') || '{}');
    return wishlists[userId] || [];
  },

  addToWishlist: async (userId, courseId) => {
    const wishlists = JSON.parse(localStorage.getItem('edu_wishlists') || '{}');
    if (!wishlists[userId]) wishlists[userId] = [];
    if (!wishlists[userId].includes(courseId)) {
      wishlists[userId].push(courseId);
    }
    localStorage.setItem('edu_wishlists', JSON.stringify(wishlists));
    return wishlists[userId];
  },

  removeFromWishlist: async (userId, courseId) => {
    const wishlists = JSON.parse(localStorage.getItem('edu_wishlists') || '{}');
    if (wishlists[userId]) {
      wishlists[userId] = wishlists[userId].filter(id => id !== courseId);
    }
    localStorage.setItem('edu_wishlists', JSON.stringify(wishlists));
    return wishlists[userId] || [];
  },

  // --- ORDERS & CHECKOUT SERVICES ---
  validateCoupon: async (code) => {
    const coupons = getTable('edu_coupons');
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.isActive);
    if (!coupon) throw new Error('Invalid or expired coupon code');
    return coupon;
  },

  createOrder: async (userId, cartItems, couponCode, billingDetails) => {
    const courses = getTable('edu_courses');
    const buyCourses = courses.filter(c => cartItems.includes(c.id));
    
    let subtotal = buyCourses.reduce((sum, c) => sum + (c.discountPrice || c.price), 0);
    let discountAmount = 0;
    
    if (couponCode) {
      try {
        const coupon = await mockDb.validateCoupon(couponCode);
        discountAmount = (subtotal * coupon.discountPercent) / 100;
      } catch (err) {
        // ignore invalid coupon discount
      }
    }
    
    const taxAmount = (subtotal - discountAmount) * 0.05; // 5% tax
    const grandTotal = Math.max(0, subtotal - discountAmount + taxAmount);
    
    const orders = getTable('edu_orders');
    const orderId = 'ord-' + Math.random().toString(36).substr(2, 9);
    
    const newOrder = {
      id: orderId,
      userId,
      couponCode,
      subtotal: parseFloat(subtotal.toFixed(2)),
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      taxAmount: parseFloat(taxAmount.toFixed(2)),
      grandTotal: parseFloat(grandTotal.toFixed(2)),
      status: 'pending',
      billingDetails,
      cartItems,
      createdAt: new Date().toISOString()
    };
    
    orders.push(newOrder);
    saveTable('edu_orders', orders);
    return newOrder;
  },

  processPayment: async (orderId, paymentMethod, cardDetails) => {
    const orders = getTable('edu_orders');
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) throw new Error('Order not found');
    
    const order = orders[orderIndex];
    
    // Simulate payment failures for testing (e.g. if card number is "0000")
    if (cardDetails?.cardNumber?.replace(/\s/g, '') === '0000000000000000') {
      order.status = 'failed';
      orders[orderIndex] = order;
      saveTable('edu_orders', orders);
      
      const payments = getTable('edu_payments');
      payments.push({
        id: 'pay-' + Math.random().toString(36).substr(2, 9),
        orderId,
        paymentMethod,
        amount: order.grandTotal,
        status: 'failed',
        createdAt: new Date().toISOString()
      });
      saveTable('edu_payments', payments);
      throw new Error('Payment declined by card issuer. Insufficient funds or invalid details.');
    }
    
    order.status = 'completed';
    orders[orderIndex] = order;
    saveTable('edu_orders', orders);
    
    // Save payment success record
    const payments = getTable('edu_payments');
    const paymentId = 'pay-' + Math.random().toString(36).substr(2, 9);
    payments.push({
      id: paymentId,
      orderId,
      paymentMethod,
      transactionId: 'txn-' + Math.random().toString(36).substr(2, 9),
      amount: order.grandTotal,
      status: 'success',
      createdAt: new Date().toISOString()
    });
    saveTable('edu_payments', payments);

    // Create Course Enrollments
    const enrollments = getTable('edu_enrollments');
    const courses = getTable('edu_courses');
    
    order.cartItems.forEach(courseId => {
      const alreadyEnrolled = enrollments.find(e => e.userId === order.userId && e.courseId === courseId);
      if (!alreadyEnrolled) {
        enrollments.push({
          id: 'enr-' + Math.random().toString(36).substr(2, 9),
          userId: order.userId,
          courseId,
          progressPercent: 0,
          completedLessons: [],
          enrolledAt: new Date().toISOString()
        });

        // Increment student counts
        const cIndex = courses.findIndex(c => c.id === courseId);
        if (cIndex !== -1) {
          courses[cIndex].studentCount += 1;
        }
      }
    });
    saveTable('edu_enrollments', enrollments);
    saveTable('edu_courses', courses);
    
    // Clear Cart
    const carts = JSON.parse(localStorage.getItem('edu_carts') || '{}');
    carts[order.userId] = [];
    localStorage.setItem('edu_carts', JSON.stringify(carts));

    // Trigger purchase notification
    const notifications = getTable('edu_notifications');
    notifications.push({
      id: 'not-' + Math.random().toString(36).substr(2, 9),
      userId: order.userId,
      title: 'Course Enrolled Successfully',
      content: `You have successfully enrolled in ${order.cartItems.length} course(s). Start learning today!`,
      type: 'purchase',
      isRead: false,
      createdAt: new Date().toISOString()
    });
    saveTable('edu_notifications', notifications);

    return { paymentId, status: 'success' };
  },

  getPurchases: async (userId) => {
    const orders = getTable('edu_orders');
    return orders.filter(o => o.userId === userId && o.status === 'completed');
  },

  // --- ENROLLMENTS & COURSE PROGRESS ---
  getEnrollments: async (userId) => {
    const enrollments = getTable('edu_enrollments');
    const courses = getTable('edu_courses');
    const userEnrollments = enrollments.filter(e => e.userId === userId);
    
    return userEnrollments.map(enr => {
      const course = courses.find(c => c.id === enr.courseId);
      return {
        ...enr,
        course
      };
    });
  },

  updateLessonProgress: async (userId, courseId, lessonId, isCompleted) => {
    const enrollments = getTable('edu_enrollments');
    const idx = enrollments.findIndex(e => e.userId === userId && e.courseId === courseId);
    if (idx === -1) throw new Error('Enrollment not found');
    
    let enr = enrollments[idx];
    let completed = enr.completedLessons || [];
    
    if (isCompleted) {
      if (!completed.includes(lessonId)) completed.push(lessonId);
    } else {
      completed = completed.filter(id => id !== lessonId);
    }
    
    enr.completedLessons = completed;
    
    // Calculate progress percentage
    const courses = getTable('edu_courses');
    const course = courses.find(c => c.id === courseId);
    let totalLessons = 0;
    if (course && course.curriculum) {
      course.curriculum.forEach(section => {
        totalLessons += (section.lessons || []).length;
      });
    }
    
    const progress = totalLessons > 0 ? Math.round((completed.length / totalLessons) * 100) : 0;
    enr.progressPercent = progress;
    
    if (progress === 100 && !enr.completedAt) {
      enr.completedAt = new Date().toISOString();
      
      // Auto-generate Certificate
      const certificates = getTable('edu_certificates');
      const certCode = 'CERT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      certificates.push({
        id: 'cert-' + Math.random().toString(36).substr(2, 9),
        userId,
        courseId,
        certificateCode: certCode,
        issuedAt: new Date().toISOString()
      });
      saveTable('edu_certificates', certificates);

      // Notify user
      const notifications = getTable('edu_notifications');
      notifications.push({
        id: 'not-' + Math.random().toString(36).substr(2, 9),
        userId,
        title: 'Certificate Earned!',
        content: `Congratulations! You completed the course "${course?.title}" and earned a certificate.`,
        type: 'certificate',
        isRead: false,
        createdAt: new Date().toISOString()
      });
      saveTable('edu_notifications', notifications);
    }
    
    enrollments[idx] = enr;
    saveTable('edu_enrollments', enrollments);
    return enr;
  },

  getCertificates: async (userId) => {
    const certificates = getTable('edu_certificates');
    const courses = getTable('edu_courses');
    const userCerts = certificates.filter(c => c.userId === userId);
    return userCerts.map(cert => ({
      ...cert,
      course: courses.find(c => c.id === cert.courseId)
    }));
  },

  // --- REVIEWS ---
  getReviewsByCourse: async (courseId) => {
    return getTable('edu_reviews').filter(r => r.courseId === courseId);
  },

  addReview: async (userId, courseId, rating, comment) => {
    const reviews = getTable('edu_reviews');
    const users = getTable('edu_users');
    const user = users.find(u => u.id === userId);
    const profiles = getTable('edu_profiles');
    const profile = profiles.find(p => p.id === userId);
    
    const existing = reviews.find(r => r.userId === userId && r.courseId === courseId);
    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
      existing.updatedAt = new Date().toISOString();
    } else {
      reviews.push({
        id: 'rev-' + Math.random().toString(36).substr(2, 9),
        courseId,
        userId,
        userName: profile?.fullName || user?.email || 'Anonymous',
        rating,
        comment,
        isVerifiedPurchase: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    saveTable('edu_reviews', reviews);

    // Recalculate average course rating
    const courseReviews = reviews.filter(r => r.courseId === courseId);
    const avgRating = courseReviews.reduce((sum, r) => sum + r.rating, 0) / courseReviews.length;
    
    const courses = getTable('edu_courses');
    const cIdx = courses.findIndex(c => c.id === courseId);
    if (cIdx !== -1) {
      courses[cIdx].rating = parseFloat(avgRating.toFixed(1));
      saveTable('edu_courses', courses);
    }
    return reviews;
  },

  deleteReview: async (userId, courseId) => {
    let reviews = getTable('edu_reviews');
    reviews = reviews.filter(r => !(r.userId === userId && r.courseId === courseId));
    saveTable('edu_reviews', reviews);
    return true;
  },

  // --- MESSAGES & CHAT ---
  getMessages: async (userId) => {
    const messages = getTable('edu_messages');
    const users = getTable('edu_users');
    const profiles = getTable('edu_profiles');
    
    const userMessages = messages.filter(m => m.senderId === userId || m.receiverId === userId);
    
    // Enhance with sender/receiver details
    return userMessages.map(msg => {
      const sender = users.find(u => u.id === msg.senderId);
      const sProf = profiles.find(p => p.id === msg.senderId);
      const receiver = users.find(u => u.id === msg.receiverId);
      const rProf = profiles.find(p => p.id === msg.receiverId);
      
      return {
        ...msg,
        senderName: sProf?.fullName || sender?.email,
        receiverName: rProf?.fullName || receiver?.email
      };
    });
  },

  sendMessage: async (senderId, receiverId, messageText) => {
    const messages = getTable('edu_messages');
    const newMsg = {
      id: 'msg-' + Math.random().toString(36).substr(2, 9),
      senderId,
      receiverId,
      messageText,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    messages.push(newMsg);
    saveTable('edu_messages', messages);

    // Mock an auto-reply if sending message to a teacher
    if (receiverId.startsWith('usr-teacher') || receiverId === 'inst-1' || receiverId === 'inst-2' || receiverId === 'inst-3') {
      setTimeout(() => {
        const autoMsg = {
          id: 'msg-' + Math.random().toString(36).substr(2, 9),
          senderId: receiverId,
          receiverId: senderId,
          messageText: `Hello! Thank you for reaching out. I have received your message and will get back to you regarding your question as soon as possible. Happy coding!`,
          isRead: false,
          createdAt: new Date().toISOString()
        };
        const msgs = JSON.parse(localStorage.getItem('edu_messages') || '[]');
        msgs.push(autoMsg);
        localStorage.setItem('edu_messages', JSON.stringify(msgs));
        
        // Trigger notification
        const notifications = JSON.parse(localStorage.getItem('edu_notifications') || '[]');
        notifications.push({
          id: 'not-' + Math.random().toString(36).substr(2, 9),
          userId: senderId,
          title: 'New Message from Instructor',
          content: 'You received a reply to your question.',
          type: 'message',
          isRead: false,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('edu_notifications', JSON.stringify(notifications));
      }, 3000);
    }

    return newMsg;
  },

  // --- NOTIFICATIONS ---
  getNotifications: async (userId) => {
    return getTable('edu_notifications').filter(n => n.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  markNotificationsRead: async (userId) => {
    const notifications = getTable('edu_notifications');
    notifications.forEach(n => {
      if (n.userId === userId) n.isRead = true;
    });
    saveTable('edu_notifications', notifications);
    return notifications.filter(n => n.userId === userId);
  },

  // --- ADMIN ANALYTICS ---
  getAdminAnalytics: async () => {
    const users = getTable('edu_users');
    const courses = getTable('edu_courses');
    const orders = getTable('edu_orders');
    const payments = getTable('edu_payments').filter(p => p.status === 'success');
    
    const totalUsers = users.length;
    const totalStudents = users.filter(u => u.role === 'student').length;
    const totalTeachers = users.filter(u => u.role === 'teacher').length;
    const totalCourses = courses.length;
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    // Dynamic sales charts
    // Generate monthly sales for the last 6 months
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const salesChart = [];
    const revenueChart = [];
    
    // Group completed orders by month
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mLabel = monthNames[d.getMonth()];
      const mIndex = d.getMonth();
      const yIndex = d.getFullYear();
      
      const mOrders = orders.filter(o => {
        const oDate = new Date(o.createdAt);
        return oDate.getMonth() === mIndex && oDate.getFullYear() === yIndex && o.status === 'completed';
      });
      
      const monthlySalesCount = mOrders.length;
      const monthlyRevenue = mOrders.reduce((sum, o) => sum + o.grandTotal, 0);
      
      salesChart.push({ month: mLabel, sales: monthlySalesCount });
      revenueChart.push({ month: mLabel, revenue: parseFloat(monthlyRevenue.toFixed(2)) });
    }

    // Course performance analytics
    const coursePerformance = courses.map(c => {
      const cOrders = orders.filter(o => o.status === 'completed' && o.cartItems.includes(c.id));
      const revenue = cOrders.reduce((sum, o) => sum + (c.discountPrice || c.price), 0);
      return {
        id: c.id,
        title: c.title,
        students: c.studentCount,
        revenue
      };
    }).sort((a, b) => b.students - a.students);

    return {
      stats: {
        totalUsers,
        totalStudents,
        totalTeachers,
        totalCourses,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        monthlyRevenue: parseFloat((revenueChart[5]?.revenue || 0).toFixed(2))
      },
      charts: {
        sales: salesChart,
        revenue: revenueChart,
        studentGrowth: [
          { month: 'Feb', students: totalStudents - 4 },
          { month: 'Mar', students: totalStudents - 3 },
          { month: 'Apr', students: totalStudents - 2 },
          { month: 'May', students: totalStudents - 1 },
          { month: 'Jun', students: totalStudents }
        ],
        coursePerformance
      }
    };
  },

  // --- GENERAL MANAGEMENT ---
  getFAQ: async () => {
    return getTable('edu_faqs');
  },

  addFAQ: async (question, answer) => {
    const faqs = getTable('edu_faqs');
    const newFaq = { id: 'faq-' + Math.random().toString(36).substr(2, 9), question, answer };
    faqs.push(newFaq);
    saveTable('edu_faqs', faqs);
    return newFaq;
  },

  deleteFAQ: async (id) => {
    let faqs = getTable('edu_faqs');
    faqs = faqs.filter(f => f.id !== id);
    saveTable('edu_faqs', faqs);
    return true;
  },

  submitContactForm: async (name, email, subject, message) => {
    const msgs = getTable('edu_contact_messages');
    const newMsg = {
      id: 'contact-' + Math.random().toString(36).substr(2, 9),
      name,
      email,
      subject,
      message,
      isResolved: false,
      createdAt: new Date().toISOString()
    };
    msgs.push(newMsg);
    saveTable('edu_contact_messages', msgs);
    return newMsg;
  },

  getContactMessages: async () => {
    return getTable('edu_contact_messages');
  },

  resolveContactMessage: async (id) => {
    const msgs = getTable('edu_contact_messages');
    const idx = msgs.findIndex(m => m.id === id);
    if (idx !== -1) {
      msgs[idx].isResolved = true;
      saveTable('edu_contact_messages', msgs);
    }
    return msgs;
  },

  getCoupons: async () => {
    return getTable('edu_coupons');
  },

  addCoupon: async (code, discountPercent) => {
    const coupons = getTable('edu_coupons');
    const newCoupon = { code: code.toUpperCase(), discountPercent, isActive: true };
    coupons.push(newCoupon);
    saveTable('edu_coupons', coupons);
    return newCoupon;
  },

  deleteCoupon: async (code) => {
    let coupons = getTable('edu_coupons');
    coupons = coupons.filter(c => c.code.toUpperCase() !== code.toUpperCase());
    saveTable('edu_coupons', coupons);
    return true;
  }
};
