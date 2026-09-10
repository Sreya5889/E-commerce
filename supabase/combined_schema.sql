-- Migration 001: Extensions
-- Purpose: Enable PostgreSQL extensions required for UUID generation, crypto, full-text search, and string matching.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";
-- Migration 002: System Roles & Helper Security Functions
-- Purpose: Role taxonomy and non-recursive role evaluation helpers.

CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, role_id)
);

-- Seed static system roles
INSERT INTO public.roles (name, description) VALUES
    ('admin', 'System Administrator with full management permissions across users, courses, financial orders, and platform settings.'),
    ('teacher', 'Instructor permitted to create, manage, and edit courses, lessons, assignments, and view enrolled student progress.'),
    ('student', 'Standard platform user able to browse, purchase courses, submit reviews, earn certificates, and message instructors.'),
    ('support', 'Customer Support representative with access to ticket messages and user verification queries.')
ON CONFLICT (name) DO NOTHING;

-- SECURITY DEFINER Role Helper Functions (Prevents RLS Recursion)
CREATE OR REPLACE FUNCTION public.has_role(p_role_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.user_roles ur
        JOIN public.roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid() AND r.name = p_role_name
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN public.has_role('admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_teacher()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN public.has_role('teacher');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_student()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN public.has_role('student');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_support()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN public.has_role('support');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
-- Migration 003: Profiles
-- Purpose: User profiles table linked to auth.users.id with automatic signup trigger.

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    display_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    phone TEXT,
    website TEXT,
    location TEXT,
    timezone TEXT DEFAULT 'UTC',
    language TEXT DEFAULT 'en',
    date_of_birth DATE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Automatic Profile & Student Role creation trigger on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER AS $$
DECLARE
    student_role_id UUID;
BEGIN
    INSERT INTO public.profiles (
        user_id,
        first_name,
        last_name,
        display_name,
        avatar_url
    ) VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.raw_user_meta_data->>'full_name', ' ', 1), ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', split_part(NEW.raw_user_meta_data->>'full_name', ' ', 2), ''),
        COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.raw_user_meta_data->>'avatar_url'
    ) ON CONFLICT (user_id) DO NOTHING;

    SELECT id INTO student_role_id FROM public.roles WHERE name = 'student';
    IF student_role_id IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role_id)
        VALUES (NEW.id, student_role_id)
        ON CONFLICT DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_signup();
-- Migration 004: Teachers Profile & Verification
-- Purpose: Educator details, verification workflow, public contact toggles, and metrics.

CREATE TABLE IF NOT EXISTS public.teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    qualification TEXT,
    designation TEXT,
    biography TEXT,
    experience_years INTEGER DEFAULT 0 CHECK (experience_years >= 0),
    specialization TEXT,
    skills TEXT[],
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    website_url TEXT,
    email_public BOOLEAN DEFAULT FALSE,
    phone_public BOOLEAN DEFAULT FALSE,
    verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected', 'suspended')),
    verification_badge BOOLEAN NOT NULL DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    total_courses INTEGER DEFAULT 0 CHECK (total_courses >= 0),
    total_students INTEGER DEFAULT 0 CHECK (total_students >= 0),
    average_rating NUMERIC(3,2) DEFAULT 0.00 CHECK (average_rating >= 0 AND average_rating <= 5.00),
    total_reviews INTEGER DEFAULT 0 CHECK (total_reviews >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Migration 005: Categories & Subcategories
-- Purpose: Course hierarchy taxonomy.

CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    icon TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.subcategories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(category_id, slug)
);
-- Migration 006: Courses
-- Purpose: Primary course entity with status, pricing, badges, metrics, and SEO metadata.

CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instructor_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT,
    subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    subtitle TEXT,
    description TEXT,
    thumbnail_url TEXT,
    banner_url TEXT,
    price NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (price >= 0),
    discount_price NUMERIC(10,2) CHECK (discount_price IS NULL OR (discount_price >= 0 AND discount_price <= price)),
    currency TEXT NOT NULL DEFAULT 'USD',
    level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced', 'all_levels')),
    language TEXT NOT NULL DEFAULT 'English',
    duration_minutes INTEGER DEFAULT 0 CHECK (duration_minutes >= 0),
    total_lessons INTEGER DEFAULT 0 CHECK (total_lessons >= 0),
    certificate_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    lifetime_access BOOLEAN NOT NULL DEFAULT TRUE,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'published', 'rejected', 'archived')),
    badge TEXT CHECK (badge IN ('bestseller', 'new', 'free', 'premium', 'trending')),
    requirements TEXT[],
    learning_objectives TEXT[],
    target_audience TEXT[],
    student_count INTEGER DEFAULT 0 CHECK (student_count >= 0),
    average_rating NUMERIC(3,2) DEFAULT 0.00 CHECK (average_rating >= 0 AND average_rating <= 5.00),
    review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Migration 007: Course Sections
-- Purpose: Hierarchical course modules and ordered sections.

CREATE TABLE IF NOT EXISTS public.course_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Migration 008: Course Lessons
-- Purpose: Individual lessons, video URLs, articles, quizzes, assignments, and preview modes.

CREATE TABLE IF NOT EXISTS public.course_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID NOT NULL REFERENCES public.course_sections(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    lesson_type TEXT NOT NULL CHECK (lesson_type IN ('video', 'article', 'assignment', 'quiz', 'project')),
    video_url TEXT,
    duration_minutes INTEGER DEFAULT 0 CHECK (duration_minutes >= 0),
    content TEXT,
    is_preview BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    resources JSONB DEFAULT '[]'::jsonb,
    assignment_data JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Migration 009: Course Resources
-- Purpose: Downloadable documents, PDFs, zip assets, and exercise materials associated with courses/lessons.

CREATE TABLE IF NOT EXISTS public.course_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.course_lessons(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT,
    file_size BIGINT CHECK (file_size >= 0),
    is_downloadable BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Migration 010: Enrollments
-- Purpose: Student course access records, purchase order link, expiration, and completion status.

CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    order_id UUID, -- Foreign key added after orders table in 014
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    progress_percentage NUMERIC(5,2) DEFAULT 0.00 CHECK (progress_percentage >= 0 AND progress_percentage <= 100.00),
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    last_accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);
-- Migration 011: Lesson Progress
-- Purpose: Detailed lesson completion tracking, video playback positions, and completion function.

CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    watched_seconds INTEGER DEFAULT 0 CHECK (watched_seconds >= 0),
    completion_percentage NUMERIC(5,2) DEFAULT 0.00 CHECK (completion_percentage >= 0 AND completion_percentage <= 100.00),
    last_position_seconds INTEGER DEFAULT 0 CHECK (last_position_seconds >= 0),
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- PostgreSQL Function to calculate completion based on completed lessons
CREATE OR REPLACE FUNCTION public.calculate_course_progress(
    p_user_id UUID,
    p_course_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    v_total_lessons INTEGER := 0;
    v_completed_lessons INTEGER := 0;
    v_progress NUMERIC(5,2) := 0.00;
    v_is_completed BOOLEAN := FALSE;
BEGIN
    SELECT COUNT(cl.id) INTO v_total_lessons
    FROM public.course_lessons cl
    JOIN public.course_sections cs ON cl.section_id = cs.id
    WHERE cs.course_id = p_course_id;

    IF v_total_lessons > 0 THEN
        SELECT COUNT(id) INTO v_completed_lessons
        FROM public.lesson_progress
        WHERE user_id = p_user_id AND course_id = p_course_id AND completed = TRUE;

        v_progress := ROUND((v_completed_lessons::NUMERIC / v_total_lessons::NUMERIC) * 100.0, 2);
    END IF;

    IF v_progress >= 100.00 THEN
        v_is_completed := TRUE;
    END IF;

    UPDATE public.enrollments
    SET 
        progress_percentage = v_progress,
        completed = v_is_completed,
        completed_at = CASE WHEN v_is_completed AND completed_at IS NULL THEN NOW() ELSE completed_at END,
        last_accessed_at = NOW()
    WHERE user_id = p_user_id AND course_id = p_course_id;

    RETURN v_progress;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Migration 012: Shopping Cart
-- Purpose: User shopping cart items for courses.

CREATE TABLE IF NOT EXISTS public.cart (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);
-- Migration 013: Wishlist
-- Purpose: Saved student course bookmarks for future purchase.

CREATE TABLE IF NOT EXISTS public.wishlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);
-- Migration 014: Orders
-- Purpose: Financial purchase orders maintaining immutable transaction snapshots.

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    order_number TEXT UNIQUE NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
    discount NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (discount >= 0),
    tax NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (tax >= 0),
    total NUMERIC(10,2) NOT NULL CHECK (total >= 0),
    currency TEXT NOT NULL DEFAULT 'USD',
    coupon_id UUID, -- Foreign key added after coupons table in 017
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'refunded', 'failed')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'succeeded', 'failed', 'refunded')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Link order_id foreign key back to enrollments table
ALTER TABLE public.enrollments
    ADD CONSTRAINT fk_enrollments_order_id
    FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE SET NULL;
-- Migration 015: Order Items
-- Purpose: Individual line items preserving historical purchase pricing even if course fees change later.

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE RESTRICT,
    instructor_id UUID REFERENCES public.teachers(id) ON DELETE RESTRICT,
    course_title TEXT NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
    discount NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (discount >= 0),
    final_price NUMERIC(10,2) NOT NULL CHECK (final_price >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Migration 016: Payments
-- Purpose: Gateway transaction audit logs.

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    provider TEXT NOT NULL DEFAULT 'stripe',
    transaction_id TEXT UNIQUE NOT NULL,
    amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
    currency TEXT NOT NULL DEFAULT 'USD',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'refunded')),
    payment_method TEXT,
    provider_response JSONB DEFAULT '{}'::jsonb,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Migration 017: Coupons & Coupon Usages
-- Purpose: Promotional codes, discount limits, expiration, and user usage tracking.

CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(10,2) NOT NULL CHECK (discount_value > 0),
    minimum_order_amount NUMERIC(10,2) DEFAULT 0.00 CHECK (minimum_order_amount >= 0),
    maximum_discount NUMERIC(10,2) CHECK (maximum_discount IS NULL OR maximum_discount > 0),
    usage_limit INTEGER CHECK (usage_limit IS NULL OR usage_limit > 0),
    used_count INTEGER NOT NULL DEFAULT 0 CHECK (used_count >= 0),
    per_user_limit INTEGER DEFAULT 1 CHECK (per_user_limit > 0),
    starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.coupon_usages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    used_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.orders
    ADD CONSTRAINT fk_orders_coupon_id
    FOREIGN KEY (coupon_id) REFERENCES public.coupons(id) ON DELETE SET NULL;
-- Migration 018: Reviews
-- Purpose: Course student reviews, instructor replies, verified purchase verification, and rating recalculation.

CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    instructor_reply TEXT,
    replied_at TIMESTAMPTZ,
    is_verified_purchase BOOLEAN NOT NULL DEFAULT FALSE,
    is_approved BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);
-- Migration 019: Notifications
-- Purpose: System notification alerts for purchases, lessons, messages, certificates, and announcements.

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN (
        'course_purchased', 'new_lesson', 'assignment_added', 'certificate_generated', 
        'payment_success', 'payment_failed', 'message', 'announcement', 
        'course_approved', 'course_rejected', 'teacher_verified'
    )),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}'::jsonb,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Migration 020: Direct Messaging System
-- Purpose: Conversations, participants, and real-time student-instructor messages.

CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.conversation_participants (
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT,
    attachment_url TEXT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Migration 021: Certificates
-- Purpose: Unique course completion certificates and verification logic.

CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE RESTRICT,
    enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
    certificate_number TEXT UNIQUE NOT NULL,
    certificate_url TEXT,
    verification_code TEXT UNIQUE NOT NULL,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);
-- Migration 022: Achievements & User Badges
-- Purpose: System gamification badges and student achievement awards.

CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    criteria JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);
-- Migration 023: Lesson Bookmarks
-- Purpose: Personal notes and saved timestamps within course lessons.

CREATE TABLE IF NOT EXISTS public.lesson_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);
-- Migration 024: Recently Viewed Courses
-- Purpose: Student course viewing history.

CREATE TABLE IF NOT EXISTS public.recently_viewed_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);
-- Migration 025: Analytics Events
-- Purpose: System telemetry, search events, course views, purchases, and certificate generation logs.

CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL CHECK (event_type IN (
        'course_view', 'course_search', 'course_purchase', 'lesson_started', 
        'lesson_completed', 'course_completed', 'wishlist_added', 'cart_added', 
        'checkout_started', 'payment_success', 'certificate_generated'
    )),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    instructor_id UUID REFERENCES public.teachers(id) ON DELETE CASCADE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Migration 026: Announcements
-- Purpose: Audience-targeted system announcements.

CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    target_audience TEXT NOT NULL DEFAULT 'all' CHECK (target_audience IN ('all', 'students', 'teachers', 'admins')),
    published BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Migration 027: Frequently Asked Questions (FAQ)
-- Purpose: Admin knowledgebase for public and student helpdesk answers.

CREATE TABLE IF NOT EXISTS public.faq (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT,
    sort_order INTEGER DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Migration 028: Contact Messages
-- Purpose: Public customer inquiry submissions.

CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Migration 029: Platform Settings
-- Purpose: System parameters key-value store.

CREATE TABLE IF NOT EXISTS public.platform_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB,
    description TEXT,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed default settings
INSERT INTO public.platform_settings (key, value, description) VALUES
    ('platform_name', '"EduAcademy"', 'Platform branding name'),
    ('support_email', '"support@eduacademy.app"', 'Primary support contact email'),
    ('support_phone', '"+1-800-555-0199"', 'Support phone number'),
    ('currency', '"USD"', 'Base platform transaction currency'),
    ('tax_rate', '0.05', 'Sales tax rate percentage'),
    ('maintenance_mode', 'false', 'Global maintenance flag'),
    ('default_language', '"en"', 'Default site locale'),
    ('certificate_enabled', 'true', 'Global certificate issuing toggle'),
    ('registration_enabled', 'true', 'User signup toggle')
ON CONFLICT (key) DO NOTHING;
-- Migration 030: Security Audit Logs
-- Purpose: Audit logging for critical administrative operations (roles, teacher verification, course approvals, refunds).

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Migration 031: Database Performance Indexes
-- Purpose: High-speed query execution and composite index optimization across all application tables.

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_teachers_user_id ON public.teachers(user_id);
CREATE INDEX IF NOT EXISTS idx_teachers_verification_status ON public.teachers(verification_status);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_subcategories_category_id ON public.subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_subcategories_slug ON public.subcategories(category_id, slug);

CREATE INDEX IF NOT EXISTS idx_courses_slug ON public.courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON public.courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_category_id ON public.courses(category_id);
CREATE INDEX IF NOT EXISTS idx_courses_subcategory_id ON public.courses(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_courses_status ON public.courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_created_at ON public.courses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_courses_average_rating ON public.courses(average_rating DESC);
CREATE INDEX IF NOT EXISTS idx_courses_student_count ON public.courses(student_count DESC);
CREATE INDEX IF NOT EXISTS idx_courses_title_trgm ON public.courses USING gin (title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_course_sections_course_id ON public.course_sections(course_id);
CREATE INDEX IF NOT EXISTS idx_course_sections_order ON public.course_sections(course_id, sort_order);

CREATE INDEX IF NOT EXISTS idx_course_lessons_section_id ON public.course_lessons(section_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_sort_order ON public.course_lessons(section_id, sort_order);

CREATE INDEX IF NOT EXISTS idx_course_resources_course_id ON public.course_resources(course_id);
CREATE INDEX IF NOT EXISTS idx_course_resources_lesson_id ON public.course_resources(lesson_id);

CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON public.enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON public.enrollments(course_id);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON public.lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_course_id ON public.lesson_progress(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_id ON public.lesson_progress(lesson_id);

CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON public.wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON public.cart(user_id);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_course_id ON public.order_items(course_id);

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON public.payments(transaction_id);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupon_usages_user ON public.coupon_usages(user_id, coupon_id);

CREATE INDEX IF NOT EXISTS idx_reviews_course_id ON public.reviews(course_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(user_id, is_read);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON public.certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_course_id ON public.certificates(course_id);
CREATE INDEX IF NOT EXISTS idx_certificates_verification_code ON public.certificates(verification_code);

CREATE INDEX IF NOT EXISTS idx_recently_viewed_user ON public.recently_viewed_courses(user_id, viewed_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON public.analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id);
-- Migration 032: PostgreSQL RPC Functions
-- Purpose: Encapsulated business transactions, search algorithms, certificate verification, and executive dashboard analytics.

-- 1. Full-Text & Multi-Facet Course Search RPC
CREATE OR REPLACE FUNCTION public.search_courses(
    search_query TEXT DEFAULT NULL,
    p_category_id UUID DEFAULT NULL,
    p_subcategory_id UUID DEFAULT NULL,
    p_instructor_id UUID DEFAULT NULL,
    min_price NUMERIC DEFAULT NULL,
    max_price NUMERIC DEFAULT NULL,
    p_level TEXT DEFAULT NULL,
    p_language TEXT DEFAULT NULL,
    min_rating NUMERIC DEFAULT NULL,
    sort_by TEXT DEFAULT 'popular',
    page INTEGER DEFAULT 1,
    page_size INTEGER DEFAULT 12
)
RETURNS TABLE (
    id UUID,
    instructor_id UUID,
    category_id UUID,
    subcategory_id UUID,
    title TEXT,
    slug TEXT,
    subtitle TEXT,
    description TEXT,
    thumbnail_url TEXT,
    price NUMERIC,
    discount_price NUMERIC,
    level TEXT,
    language TEXT,
    duration_minutes INTEGER,
    total_lessons INTEGER,
    badge TEXT,
    student_count INTEGER,
    average_rating NUMERIC,
    review_count INTEGER,
    created_at TIMESTAMPTZ,
    total_count BIGINT
) AS $$
DECLARE
    v_offset INTEGER := (page - 1) * page_size;
BEGIN
    RETURN QUERY
    WITH filtered_courses AS (
        SELECT c.*, COUNT(*) OVER() as full_count
        FROM public.courses c
        WHERE c.status = 'published'
          AND (search_query IS NULL OR (c.title ILIKE '%' || search_query || '%' OR c.subtitle ILIKE '%' || search_query || '%' OR c.description ILIKE '%' || search_query || '%'))
          AND (p_category_id IS NULL OR c.category_id = p_category_id)
          AND (p_subcategory_id IS NULL OR c.subcategory_id = p_subcategory_id)
          AND (p_instructor_id IS NULL OR c.instructor_id = p_instructor_id)
          AND (min_price IS NULL OR c.price >= min_price)
          AND (max_price IS NULL OR c.price <= max_price)
          AND (p_level IS NULL OR c.level = p_level)
          AND (p_language IS NULL OR c.language = p_language)
          AND (min_rating IS NULL OR c.average_rating >= min_rating)
    )
    SELECT 
        fc.id, fc.instructor_id, fc.category_id, fc.subcategory_id, fc.title, fc.slug, fc.subtitle,
        fc.description, fc.thumbnail_url, fc.price, fc.discount_price, fc.level, fc.language,
        fc.duration_minutes, fc.total_lessons, fc.badge, fc.student_count, fc.average_rating,
        fc.review_count, fc.created_at, fc.full_count
    FROM filtered_courses fc
    ORDER BY
        CASE WHEN sort_by = 'latest' THEN fc.created_at END DESC,
        CASE WHEN sort_by = 'popular' THEN fc.student_count END DESC,
        CASE WHEN sort_by = 'rating' THEN fc.average_rating END DESC,
        CASE WHEN sort_by = 'price_low' THEN fc.price END ASC,
        CASE WHEN sort_by = 'price_high' THEN fc.price END DESC,
        fc.created_at DESC
    OFFSET v_offset
    LIMIT page_size;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Course Recommendation RPC
CREATE OR REPLACE FUNCTION public.get_recommended_courses(
    p_user_id UUID DEFAULT NULL,
    p_limit INTEGER DEFAULT 6
)
RETURNS SETOF public.courses AS $$
BEGIN
    IF p_user_id IS NOT NULL THEN
        RETURN QUERY
        SELECT DISTINCT c.*
        FROM public.courses c
        WHERE c.status = 'published'
          AND (
              c.category_id IN (
                  SELECT co.category_id 
                  FROM public.recently_viewed_courses rvc
                  JOIN public.courses co ON rvc.course_id = co.id
                  WHERE rvc.user_id = p_user_id
              )
              OR c.category_id IN (
                  SELECT co.category_id
                  FROM public.enrollments e
                  JOIN public.courses co ON e.course_id = co.id
                  WHERE e.user_id = p_user_id
              )
          )
          AND c.id NOT IN (
              SELECT course_id FROM public.enrollments WHERE user_id = p_user_id
          )
        ORDER BY c.average_rating DESC, c.student_count DESC
        LIMIT p_limit;
    ELSE
        RETURN QUERY
        SELECT *
        FROM public.courses
        WHERE status = 'published'
        ORDER BY student_count DESC, average_rating DESC
        LIMIT p_limit;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Record Course View RPC
CREATE OR REPLACE FUNCTION public.record_course_view(p_user_id UUID, p_course_id UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.recently_viewed_courses (user_id, course_id, viewed_at)
    VALUES (p_user_id, p_course_id, NOW())
    ON CONFLICT (user_id, course_id) 
    DO UPDATE SET viewed_at = NOW();

    DELETE FROM public.recently_viewed_courses
    WHERE user_id = p_user_id
      AND id NOT IN (
          SELECT id FROM public.recently_viewed_courses
          WHERE user_id = p_user_id
          ORDER BY viewed_at DESC
          LIMIT 20
      );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create Order from Cart Server-Side RPC
CREATE OR REPLACE FUNCTION public.create_order_from_cart(
    p_user_id UUID,
    p_coupon_code TEXT DEFAULT NULL
)
RETURNS TABLE (
    order_id UUID,
    order_number TEXT,
    subtotal NUMERIC,
    discount NUMERIC,
    tax NUMERIC,
    total NUMERIC
) AS $$
DECLARE
    v_subtotal NUMERIC(10,2) := 0.00;
    v_discount NUMERIC(10,2) := 0.00;
    v_tax NUMERIC(10,2) := 0.00;
    v_total NUMERIC(10,2) := 0.00;
    v_coupon_id UUID := NULL;
    v_order_id UUID;
    v_order_number TEXT;
    v_item RECORD;
BEGIN
    IF auth.uid() IS NULL OR auth.uid() != p_user_id THEN
        RAISE EXCEPTION 'Unauthorized order creation request';
    END IF;

    -- Calculate subtotal from cart
    SELECT COALESCE(SUM(COALESCE(c.discount_price, c.price)), 0.00) INTO v_subtotal
    FROM public.cart ct
    JOIN public.courses c ON ct.course_id = c.id
    WHERE ct.user_id = p_user_id;

    IF v_subtotal <= 0 THEN
        RAISE EXCEPTION 'Shopping cart is empty';
    END IF;

    -- Coupon validation if supplied
    IF p_coupon_code IS NOT NULL AND p_coupon_code != '' THEN
        SELECT id, discount_type, discount_value, maximum_discount, minimum_order_amount
        INTO v_coupon_id, v_item
        FROM public.coupons
        WHERE code = UPPER(p_coupon_code) AND is_active = TRUE
          AND (expires_at IS NULL OR expires_at > NOW())
          AND (starts_at <= NOW());

        IF v_coupon_id IS NOT NULL THEN
            IF v_item.discount_type = 'percentage' THEN
                v_discount := (v_subtotal * v_item.discount_value) / 100.0;
                IF v_item.maximum_discount IS NOT NULL AND v_discount > v_item.maximum_discount THEN
                    v_discount := v_item.maximum_discount;
                END IF;
            ELSE
                v_discount := v_item.discount_value;
            END IF;
        END IF;
    END IF;

    v_tax := ROUND((GREATEST(0.00, v_subtotal - v_discount) * 0.05), 2);
    v_total := GREATEST(0.00, v_subtotal - v_discount) + v_tax;
    v_order_number := 'EDU-' || EXTRACT(EPOCH FROM NOW())::BIGINT || '-' || FLOOR(1000 + RANDOM() * 9000)::TEXT;

    -- Insert Order
    INSERT INTO public.orders (
        user_id, order_number, subtotal, discount, tax, total, currency, coupon_id, status, payment_status
    ) VALUES (
        p_user_id, v_order_number, v_subtotal, v_discount, v_tax, v_total, 'USD', v_coupon_id, 'pending', 'pending'
    ) RETURNING id INTO v_order_id;

    -- Insert Order Items
    INSERT INTO public.order_items (order_id, course_id, instructor_id, course_title, unit_price, discount, final_price)
    SELECT 
        v_order_id,
        c.id,
        c.instructor_id,
        c.title,
        c.price,
        (c.price - COALESCE(c.discount_price, c.price)),
        COALESCE(c.discount_price, c.price)
    FROM public.cart ct
    JOIN public.courses c ON ct.course_id = c.id
    WHERE ct.user_id = p_user_id;

    RETURN QUERY SELECT v_order_id, v_order_number, v_subtotal, v_discount, v_tax, v_total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Process Successful Payment RPC (Idempotent)
CREATE OR REPLACE FUNCTION public.process_successful_payment(
    p_order_id UUID,
    p_transaction_id TEXT,
    p_provider TEXT DEFAULT 'stripe'
)
RETURNS BOOLEAN AS $$
DECLARE
    v_order RECORD;
    v_item RECORD;
BEGIN
    SELECT * INTO v_order FROM public.orders WHERE id = p_order_id;
    IF v_order IS NULL THEN
        RAISE EXCEPTION 'Order not found';
    END IF;

    IF v_order.payment_status = 'succeeded' THEN
        RETURN TRUE; -- Idempotent return
    END IF;

    -- Update Order
    UPDATE public.orders
    SET status = 'completed', payment_status = 'succeeded', updated_at = NOW()
    WHERE id = p_order_id;

    -- Create Payment Record
    INSERT INTO public.payments (
        order_id, user_id, provider, transaction_id, amount, currency, status, paid_at
    ) VALUES (
        p_order_id, v_order.user_id, p_provider, p_transaction_id, v_order.total, v_order.currency, 'succeeded', NOW()
    ) ON CONFLICT (transaction_id) DO UPDATE SET status = 'succeeded', paid_at = NOW();

    -- Generate Enrollments
    FOR v_item IN SELECT * FROM public.order_items WHERE order_id = p_order_id LOOP
        INSERT INTO public.enrollments (user_id, course_id, order_id)
        VALUES (v_order.user_id, v_item.course_id, p_order_id)
        ON CONFLICT (user_id, course_id) DO NOTHING;

        -- Update course student count
        UPDATE public.courses
        SET student_count = student_count + 1
        WHERE id = v_item.course_id;
    END LOOP;

    -- Clear user cart
    DELETE FROM public.cart WHERE user_id = v_order.user_id;

    -- Send notification
    INSERT INTO public.notifications (user_id, type, title, message)
    VALUES (
        v_order.user_id, 'payment_success', 'Payment Received!', 
        'Your order #' || v_order.order_number || ' has been successfully completed.'
    );

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Generate Certificate RPC
CREATE OR REPLACE FUNCTION public.generate_certificate(
    p_user_id UUID,
    p_course_id UUID
)
RETURNS TABLE (
    certificate_id UUID,
    certificate_number TEXT,
    verification_code TEXT,
    certificate_url TEXT
) AS $$
DECLARE
    v_enrollment RECORD;
    v_cert_id UUID;
    v_cert_num TEXT;
    v_verify_code TEXT;
    v_cert_url TEXT;
BEGIN
    SELECT * INTO v_enrollment
    FROM public.enrollments
    WHERE user_id = p_user_id AND course_id = p_course_id;

    IF v_enrollment IS NULL THEN
        RAISE EXCEPTION 'Student is not enrolled in this course';
    END IF;

    IF v_enrollment.progress_percentage < 100.00 AND NOT v_enrollment.completed THEN
        RAISE EXCEPTION 'Course completion requirement (100%%) not met';
    END IF;

    v_cert_num := 'CERT-' || EXTRACT(EPOCH FROM NOW())::BIGINT || '-' || FLOOR(1000 + RANDOM() * 9000)::TEXT;
    v_verify_code := 'VERIFY-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8)) || '-' || EXTRACT(EPOCH FROM NOW())::BIGINT;
    v_cert_url := 'https://eduacademy.app/certificates/verify/' || v_verify_code;

    INSERT INTO public.certificates (
        user_id, course_id, enrollment_id, certificate_number, certificate_url, verification_code
    ) VALUES (
        p_user_id, p_course_id, v_enrollment.id, v_cert_num, v_cert_url, v_verify_code
    ) ON CONFLICT (user_id, course_id) 
    DO UPDATE SET updated_at = NOW()
    RETURNING id INTO v_cert_id;

    RETURN QUERY SELECT v_cert_id, v_cert_num, v_verify_code, v_cert_url;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Public Certificate Verification RPC
CREATE OR REPLACE FUNCTION public.verify_certificate(p_verification_code TEXT)
RETURNS TABLE (
    certificate_number TEXT,
    student_name TEXT,
    course_title TEXT,
    instructor_name TEXT,
    issued_at TIMESTAMPTZ,
    is_valid BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.certificate_number,
        COALESCE(p.display_name, p.first_name || ' ' || p.last_name, 'Verified Student')::TEXT,
        co.title,
        COALESCE(tp.display_name, tp.first_name || ' ' || tp.last_name, 'Verified Instructor')::TEXT,
        c.issued_at,
        TRUE
    FROM public.certificates c
    JOIN public.profiles p ON c.user_id = p.user_id
    JOIN public.courses co ON c.course_id = co.id
    JOIN public.teachers t ON co.instructor_id = t.id
    JOIN public.profiles tp ON t.user_id = tp.user_id
    WHERE c.verification_code = p_verification_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Admin Dashboard Statistics RPC
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats()
RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access denied. Admin privileges required.';
    END IF;

    SELECT jsonb_build_object(
        'total_users', (SELECT COUNT(*) FROM auth.users),
        'total_students', (SELECT COUNT(*) FROM public.user_roles ur JOIN public.roles r ON ur.role_id = r.id WHERE r.name = 'student'),
        'total_teachers', (SELECT COUNT(*) FROM public.teachers WHERE verification_status = 'approved'),
        'pending_teachers', (SELECT COUNT(*) FROM public.teachers WHERE verification_status = 'pending'),
        'total_courses', (SELECT COUNT(*) FROM public.courses),
        'published_courses', (SELECT COUNT(*) FROM public.courses WHERE status = 'published'),
        'total_enrollments', (SELECT COUNT(*) FROM public.enrollments),
        'total_revenue', (SELECT COALESCE(SUM(total), 0.00) FROM public.orders WHERE payment_status = 'succeeded'),
        'monthly_revenue', (SELECT COALESCE(SUM(total), 0.00) FROM public.orders WHERE payment_status = 'succeeded' AND created_at >= date_trunc('month', NOW()))
    ) INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Migration 033: PostgreSQL Triggers
-- Purpose: Automatic updated_at timestamp updating, review statistics calculation, and audit logging triggers.

-- 1. Generic updated_at Trigger Handler
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger across all relevant tables
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_teachers_updated_at BEFORE UPDATE ON public.teachers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_subcategories_updated_at BEFORE UPDATE ON public.subcategories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_course_sections_updated_at BEFORE UPDATE ON public.course_sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_course_lessons_updated_at BEFORE UPDATE ON public.course_lessons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_lesson_progress_updated_at BEFORE UPDATE ON public.lesson_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_cart_updated_at BEFORE UPDATE ON public.cart FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_coupons_updated_at BEFORE UPDATE ON public.coupons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_conversations_updated_at BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_faq_updated_at BEFORE UPDATE ON public.faq FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_contact_messages_updated_at BEFORE UPDATE ON public.contact_messages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. Review Rating Recalculation Trigger Handler
CREATE OR REPLACE FUNCTION public.recalculate_course_ratings_trigger()
RETURNS TRIGGER AS $$
DECLARE
    v_course_id UUID;
    v_instructor_id UUID;
    v_avg NUMERIC(3,2);
    v_count INTEGER;
BEGIN
    v_course_id := CASE WHEN TG_OP = 'DELETE' THEN OLD.course_id ELSE NEW.course_id END;

    SELECT instructor_id INTO v_instructor_id FROM public.courses WHERE id = v_course_id;

    -- Calculate stats for course
    SELECT COALESCE(ROUND(AVG(rating)::NUMERIC, 2), 0.00), COUNT(id)
    INTO v_avg, v_count
    FROM public.reviews
    WHERE course_id = v_course_id AND is_approved = TRUE;

    UPDATE public.courses
    SET average_rating = v_avg, review_count = v_count
    WHERE id = v_course_id;

    -- Calculate stats for teacher
    IF v_instructor_id IS NOT NULL THEN
        UPDATE public.teachers
        SET average_rating = COALESCE((
                SELECT ROUND(AVG(r.rating)::NUMERIC, 2)
                FROM public.reviews r
                JOIN public.courses c ON r.course_id = c.id
                WHERE c.instructor_id = v_instructor_id AND r.is_approved = TRUE
            ), 0.00),
            total_reviews = (
                SELECT COUNT(r.id)
                FROM public.reviews r
                JOIN public.courses c ON r.course_id = c.id
                WHERE c.instructor_id = v_instructor_id AND r.is_approved = TRUE
            )
        WHERE id = v_instructor_id;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_reviews_recalc
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.recalculate_course_ratings_trigger();
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
-- Migration 035: Supabase Storage Buckets & Storage RLS Policies
-- Purpose: Storage bucket provisioning and path-scoped access authorization policies.

-- 1. Insert Storage Buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES
    ('course-images', 'course-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
    ('instructor-images', 'instructor-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('course-videos', 'course-videos', false, 524288000, ARRAY['video/mp4', 'video/webm', 'video/quicktime']),
    ('course-resources', 'course-resources', false, 52428800, ARRAY['application/pdf', 'application/zip', 'text/plain', 'application/json']),
    ('certificates', 'certificates', true, 10485760, ARRAY['application/pdf', 'image/png']),
    ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('attachments', 'attachments', false, 20971520, ARRAY['image/jpeg', 'image/png', 'application/pdf', 'text/plain'])
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Objects RLS Policies

-- Public Read Policies
CREATE POLICY "Public read avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Public read course-images" ON storage.objects FOR SELECT USING (bucket_id = 'course-images');
CREATE POLICY "Public read instructor-images" ON storage.objects FOR SELECT USING (bucket_id = 'instructor-images');
CREATE POLICY "Public read certificates" ON storage.objects FOR SELECT USING (bucket_id = 'certificates');

-- Path-scoped upload policies
CREATE POLICY "Users upload own avatar" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Teachers upload course media" ON storage.objects FOR INSERT WITH CHECK (
    (bucket_id IN ('course-images', 'course-videos', 'course-resources')) AND public.is_teacher()
);

-- Private asset access authorization
CREATE POLICY "Enrolled students download course videos" ON storage.objects FOR SELECT USING (
    bucket_id = 'course-videos' AND (
        public.is_teacher() OR public.is_admin() OR 
        EXISTS (
            SELECT 1 FROM public.enrollments e
            JOIN public.courses c ON e.course_id = c.id
            WHERE e.user_id = auth.uid() AND (storage.foldername(name))[1] = c.id::text
        )
    )
);

CREATE POLICY "Enrolled students download course resources" ON storage.objects FOR SELECT USING (
    bucket_id = 'course-resources' AND (
        public.is_teacher() OR public.is_admin() OR 
        EXISTS (
            SELECT 1 FROM public.enrollments e
            JOIN public.courses c ON e.course_id = c.id
            WHERE e.user_id = auth.uid() AND (storage.foldername(name))[1] = c.id::text
        )
    )
);
