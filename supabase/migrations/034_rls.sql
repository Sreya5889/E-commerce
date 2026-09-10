-- Migration 034: Complete Row Level Security (RLS) Policies
-- Purpose: Enable and enforce strict authorization policies on every application table.

-- Helper functions for course ownership and enrollment
CREATE OR REPLACE FUNCTION public.is_course_owner(p_course_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.courses c
        JOIN public.teachers t ON c.instructor_id = t.id
        WHERE c.id = p_course_id AND t.user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_enrolled(p_course_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.enrollments
        WHERE course_id = p_course_id AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 1. Enable RLS on ALL Tables
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recently_viewed_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 2. Define RLS Policies

-- Roles & User Roles
CREATE POLICY "Roles viewable by authenticated users" ON public.roles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "User roles viewable by owner or admin" ON public.user_roles FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Admins manage user roles" ON public.user_roles FOR ALL USING (public.is_admin());

-- Profiles
CREATE POLICY "Public profiles viewable by anyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users edit own profile" ON public.profiles FOR UPDATE USING (user_id = auth.uid() OR public.is_admin());

-- Teachers
CREATE POLICY "Public teacher profiles viewable by anyone" ON public.teachers FOR SELECT USING (true);
CREATE POLICY "Users request teacher profile" ON public.teachers FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Teachers edit own bio, Admins approve" ON public.teachers FOR UPDATE USING (user_id = auth.uid() OR public.is_admin());

-- Categories & Subcategories
CREATE POLICY "Public categories viewable by anyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL USING (public.is_admin());

CREATE POLICY "Public subcategories viewable by anyone" ON public.subcategories FOR SELECT USING (true);
CREATE POLICY "Admins manage subcategories" ON public.subcategories FOR ALL USING (public.is_admin());

-- Courses
CREATE POLICY "Published courses viewable by anyone, draft by owner/admin" ON public.courses FOR SELECT USING (
    status = 'published' OR 
    instructor_id IN (SELECT id FROM public.teachers WHERE user_id = auth.uid()) OR 
    public.is_admin()
);
CREATE POLICY "Approved teachers create draft courses" ON public.courses FOR INSERT WITH CHECK (
    instructor_id IN (SELECT id FROM public.teachers WHERE user_id = auth.uid() AND verification_status = 'approved') OR public.is_admin()
);
CREATE POLICY "Teachers edit own course, Admins approve/manage" ON public.courses FOR UPDATE USING (
    public.is_course_owner(id) OR public.is_admin()
);
CREATE POLICY "Admins delete courses" ON public.courses FOR DELETE USING (public.is_admin());

-- Course Sections & Lessons & Resources
CREATE POLICY "Sections viewable by anyone" ON public.course_sections FOR SELECT USING (true);
CREATE POLICY "Teachers manage own sections" ON public.course_sections FOR ALL USING (public.is_course_owner(course_id) OR public.is_admin());

CREATE POLICY "Preview lessons public, premium for enrolled or owner" ON public.course_lessons FOR SELECT USING (
    is_preview = TRUE OR 
    public.is_enrolled((SELECT course_id FROM public.course_sections WHERE id = section_id)) OR 
    public.is_course_owner((SELECT course_id FROM public.course_sections WHERE id = section_id)) OR 
    public.is_admin()
);
CREATE POLICY "Teachers manage own lessons" ON public.course_lessons FOR ALL USING (
    public.is_course_owner((SELECT course_id FROM public.course_sections WHERE id = section_id)) OR public.is_admin()
);

CREATE POLICY "Resources accessible by enrolled or owner" ON public.course_resources FOR SELECT USING (
    public.is_enrolled(course_id) OR public.is_course_owner(course_id) OR public.is_admin()
);
CREATE POLICY "Teachers manage own resources" ON public.course_resources FOR ALL USING (public.is_course_owner(course_id) OR public.is_admin());

-- Enrollments & Progress
CREATE POLICY "Students view own enrollments, Teachers view course students" ON public.enrollments FOR SELECT USING (
    user_id = auth.uid() OR public.is_course_owner(course_id) OR public.is_admin()
);

CREATE POLICY "Students view and update own lesson progress" ON public.lesson_progress FOR ALL USING (
    user_id = auth.uid() OR public.is_course_owner(course_id) OR public.is_admin()
);

-- Cart & Wishlist
CREATE POLICY "Users manage own cart" ON public.cart FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users manage own wishlist" ON public.wishlist FOR ALL USING (user_id = auth.uid());

-- Orders, Items, & Payments
CREATE POLICY "Users view own orders" ON public.orders FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Users create own orders" ON public.orders FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins manage orders" ON public.orders FOR UPDATE USING (public.is_admin());

CREATE POLICY "Users view own order items" ON public.order_items FOR SELECT USING (
    order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()) OR 
    instructor_id IN (SELECT id FROM public.teachers WHERE user_id = auth.uid()) OR 
    public.is_admin()
);

CREATE POLICY "Users view own payments" ON public.payments FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

-- Coupons
CREATE POLICY "Coupons viewable by authenticated users" ON public.coupons FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage coupons" ON public.coupons FOR ALL USING (public.is_admin());
CREATE POLICY "Users view own coupon usages" ON public.coupon_usages FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

-- Reviews
CREATE POLICY "Reviews viewable by anyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Students submit review if enrolled" ON public.reviews FOR INSERT WITH CHECK (
    user_id = auth.uid() AND public.is_enrolled(course_id)
);
CREATE POLICY "Students edit own review, Teachers reply" ON public.reviews FOR UPDATE USING (
    user_id = auth.uid() OR public.is_course_owner(course_id) OR public.is_admin()
);

-- Notifications
CREATE POLICY "Users manage own notifications" ON public.notifications FOR ALL USING (user_id = auth.uid());

-- Messaging
CREATE POLICY "Participants view conversations" ON public.conversations FOR SELECT USING (
    id IN (SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid()) OR public.is_admin()
);
CREATE POLICY "Participants view participants" ON public.conversation_participants FOR SELECT USING (
    conversation_id IN (SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid()) OR public.is_admin()
);
CREATE POLICY "Participants send and view messages" ON public.messages FOR ALL USING (
    conversation_id IN (SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid()) OR public.is_admin()
);

-- Certificates
CREATE POLICY "Certificates viewable by owner or via verification" ON public.certificates FOR SELECT USING (
    user_id = auth.uid() OR public.is_admin()
);

-- Achievements & Bookmarks & Recently Viewed
CREATE POLICY "Achievements viewable by anyone" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "User achievements viewable by owner" ON public.user_achievements FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Users manage own bookmarks" ON public.lesson_bookmarks FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users manage own recently viewed" ON public.recently_viewed_courses FOR ALL USING (user_id = auth.uid());

-- Analytics, Announcements, FAQ, Contact, Settings, Audit Logs
CREATE POLICY "Admins view analytics events" ON public.analytics_events FOR SELECT USING (public.is_admin());

CREATE POLICY "Published announcements viewable by audience" ON public.announcements FOR SELECT USING (published = TRUE OR public.is_admin());
CREATE POLICY "Admins manage announcements" ON public.announcements FOR ALL USING (public.is_admin());

CREATE POLICY "Published FAQs viewable by anyone" ON public.faq FOR SELECT USING (is_published = TRUE OR public.is_admin());
CREATE POLICY "Admins manage FAQs" ON public.faq FOR ALL USING (public.is_admin());

CREATE POLICY "Anyone submit contact message" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Support and Admin view contact messages" ON public.contact_messages FOR SELECT USING (public.is_support() OR public.is_admin());

CREATE POLICY "Settings readable by authenticated users" ON public.platform_settings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage settings" ON public.platform_settings FOR ALL USING (public.is_admin());

CREATE POLICY "Admins view audit logs" ON public.audit_logs FOR SELECT USING (public.is_admin());
