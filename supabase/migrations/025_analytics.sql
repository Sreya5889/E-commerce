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
