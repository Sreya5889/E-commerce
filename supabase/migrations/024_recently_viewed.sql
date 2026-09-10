-- Migration 024: Recently Viewed Courses
-- Purpose: Student course viewing history.

CREATE TABLE IF NOT EXISTS public.recently_viewed_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);
