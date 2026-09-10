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
