-- Migration 051: Learning Experience & AI Personalization
-- Purpose: Additive tables for timestamped notes, lesson quizzes, student quiz attempts, and personalized study plans.

-- 1. Student Personal Notes
CREATE TABLE IF NOT EXISTS public.student_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    timestamp_seconds INTEGER NOT NULL DEFAULT 0 CHECK (timestamp_seconds >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_student_notes_user_course ON public.student_notes(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_student_notes_lesson ON public.student_notes(lesson_id);

ALTER TABLE public.student_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notes" ON public.student_notes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes" ON public.student_notes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes" ON public.student_notes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes" ON public.student_notes
    FOR DELETE USING (auth.uid() = user_id);

-- 2. Lesson Quizzes
CREATE TABLE IF NOT EXISTS public.lesson_quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    passing_score INTEGER NOT NULL DEFAULT 70 CHECK (passing_score >= 0 AND passing_score <= 100),
    questions JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_lesson_quizzes_lesson ON public.lesson_quizzes(lesson_id);

ALTER TABLE public.lesson_quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone enrolled can view quizzes" ON public.lesson_quizzes
    FOR SELECT USING (TRUE);

-- 3. Student Quiz Attempts
CREATE TABLE IF NOT EXISTS public.student_quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    quiz_id UUID NOT NULL REFERENCES public.lesson_quizzes(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    passed BOOLEAN NOT NULL DEFAULT FALSE,
    answers JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_quiz ON public.student_quiz_attempts(user_id, quiz_id);

ALTER TABLE public.student_quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quiz attempts" ON public.student_quiz_attempts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz attempts" ON public.student_quiz_attempts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. Student Personalized Study Plans
CREATE TABLE IF NOT EXISTS public.student_study_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    career_goal TEXT NOT NULL,
    weekly_hours INTEGER NOT NULL DEFAULT 10 CHECK (weekly_hours > 0),
    skill_level TEXT NOT NULL DEFAULT 'Intermediate',
    plan_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_study_plans_user ON public.student_study_plans(user_id);

ALTER TABLE public.student_study_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own study plans" ON public.student_study_plans
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own study plans" ON public.student_study_plans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own study plans" ON public.student_study_plans
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own study plans" ON public.student_study_plans
    FOR DELETE USING (auth.uid() = user_id);
