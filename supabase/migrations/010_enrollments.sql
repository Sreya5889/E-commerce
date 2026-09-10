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
