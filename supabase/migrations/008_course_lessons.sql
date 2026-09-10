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
