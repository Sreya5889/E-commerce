-- Migration 045: Interview Hub Schema
CREATE TABLE IF NOT EXISTS public.interview_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('technical', 'hr')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.interview_questions (
    id TEXT PRIMARY KEY,
    category_id TEXT REFERENCES public.interview_categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'intermediate')),
    suggested_answer TEXT NOT NULL,
    key_points TEXT[] DEFAULT '{}',
    common_mistakes TEXT[] DEFAULT '{}',
    follow_up_questions TEXT[] DEFAULT '{}',
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_interview_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL REFERENCES public.interview_questions(id) ON DELETE CASCADE,
    mastery_status TEXT NOT NULL DEFAULT 'practiced' CHECK (mastery_status IN ('review_needed', 'practiced', 'mastered')),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_interview_questions_cat ON public.interview_questions(category_id);
