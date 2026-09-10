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
