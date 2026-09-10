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
