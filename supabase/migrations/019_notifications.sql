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
