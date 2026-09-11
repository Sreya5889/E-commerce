-- Migration 039: EduAcademy Aptitude Arena Schema
-- Purpose: Complete placement preparation, competitive exams, and aptitude assessments ecosystem.

-- 1. Aptitude Categories
CREATE TABLE IF NOT EXISTS public.aptitude_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    display_order INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Aptitude Topics
CREATE TABLE IF NOT EXISTS public.aptitude_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.aptitude_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    display_order INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(category_id, slug)
);

-- 3. Aptitude Questions
CREATE TABLE IF NOT EXISTS public.aptitude_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.aptitude_categories(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES public.aptitude_topics(id) ON DELETE SET NULL,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL DEFAULT 'single_choice' CHECK (question_type IN ('single_choice', 'multiple_choice', 'data_sufficiency')),
    difficulty TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    explanation TEXT NOT NULL,
    correct_option TEXT NOT NULL CHECK (correct_option IN ('A', 'B', 'C', 'D')),
    image_url TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Aptitude Options
CREATE TABLE IF NOT EXISTS public.aptitude_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES public.aptitude_questions(id) ON DELETE CASCADE,
    option_key TEXT NOT NULL CHECK (option_key IN ('A', 'B', 'C', 'D')),
    option_text TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 1,
    UNIQUE(question_id, option_key)
);

-- 5. Mock Tests
CREATE TABLE IF NOT EXISTS public.aptitude_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    category_id UUID REFERENCES public.aptitude_categories(id) ON DELETE SET NULL,
    difficulty TEXT NOT NULL DEFAULT 'all_levels' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'all_levels')),
    duration_minutes INTEGER NOT NULL DEFAULT 30 CHECK (duration_minutes > 0),
    question_count INTEGER NOT NULL DEFAULT 20 CHECK (question_count > 0),
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Mock Test Questions Mapping
CREATE TABLE IF NOT EXISTS public.aptitude_test_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID NOT NULL REFERENCES public.aptitude_tests(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.aptitude_questions(id) ON DELETE CASCADE,
    display_order INTEGER NOT NULL DEFAULT 1,
    UNIQUE(test_id, question_id)
);

-- 7. Student Attempts (Practice, Timed, Mock Test, Daily Challenge)
CREATE TABLE IF NOT EXISTS public.aptitude_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    test_id UUID REFERENCES public.aptitude_tests(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.aptitude_categories(id) ON DELETE SET NULL,
    topic_id UUID REFERENCES public.aptitude_topics(id) ON DELETE SET NULL,
    mode TEXT NOT NULL CHECK (mode IN ('practice', 'timed', 'daily_challenge', 'mock_test')),
    total_questions INTEGER NOT NULL DEFAULT 0,
    correct_answers INTEGER NOT NULL DEFAULT 0,
    incorrect_answers INTEGER NOT NULL DEFAULT 0,
    unanswered INTEGER NOT NULL DEFAULT 0,
    score NUMERIC(6,2) NOT NULL DEFAULT 0.00,
    accuracy NUMERIC(5,2) NOT NULL DEFAULT 0.00 CHECK (accuracy >= 0 AND accuracy <= 100.00),
    time_taken_seconds INTEGER NOT NULL DEFAULT 0,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 8. Student Attempt Answer Logs
CREATE TABLE IF NOT EXISTS public.aptitude_attempt_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES public.aptitude_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.aptitude_questions(id) ON DELETE CASCADE,
    selected_option TEXT CHECK (selected_option IN ('A', 'B', 'C', 'D') OR selected_option IS NULL),
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    time_taken_seconds INTEGER NOT NULL DEFAULT 0,
    answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(attempt_id, question_id)
);

-- 9. Daily Challenges
CREATE TABLE IF NOT EXISTS public.aptitude_daily_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_date DATE NOT NULL UNIQUE,
    title TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 10,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Daily Challenge Questions Mapping
CREATE TABLE IF NOT EXISTS public.aptitude_daily_challenge_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES public.aptitude_daily_challenges(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.aptitude_questions(id) ON DELETE CASCADE,
    display_order INTEGER NOT NULL DEFAULT 1,
    UNIQUE(challenge_id, question_id)
);

-- 11. Aptitude Achievements
CREATE TABLE IF NOT EXISTS public.aptitude_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    requirement_type TEXT NOT NULL,
    requirement_value INTEGER NOT NULL DEFAULT 1
);

-- 12. Student Earned Aptitude Achievements
CREATE TABLE IF NOT EXISTS public.student_aptitude_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    achievement_id UUID NOT NULL REFERENCES public.aptitude_achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Indexes for Speed & Performance
CREATE INDEX IF NOT EXISTS idx_aptitude_categories_slug ON public.aptitude_categories(slug);
CREATE INDEX IF NOT EXISTS idx_aptitude_topics_cat ON public.aptitude_topics(category_id, display_order);
CREATE INDEX IF NOT EXISTS idx_aptitude_questions_topic ON public.aptitude_questions(topic_id, difficulty);
CREATE INDEX IF NOT EXISTS idx_aptitude_questions_cat ON public.aptitude_questions(category_id);
CREATE INDEX IF NOT EXISTS idx_aptitude_options_question ON public.aptitude_options(question_id, display_order);
CREATE INDEX IF NOT EXISTS idx_aptitude_tests_slug ON public.aptitude_tests(slug);
CREATE INDEX IF NOT EXISTS idx_aptitude_attempts_user ON public.aptitude_attempts(user_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_aptitude_attempt_answers_attempt ON public.aptitude_attempt_answers(attempt_id);
CREATE INDEX IF NOT EXISTS idx_aptitude_daily_challenges_date ON public.aptitude_daily_challenges(challenge_date);

-- Enable RLS
ALTER TABLE public.aptitude_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aptitude_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aptitude_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aptitude_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aptitude_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aptitude_test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aptitude_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aptitude_attempt_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aptitude_daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aptitude_daily_challenge_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aptitude_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_aptitude_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view active aptitude categories"
    ON public.aptitude_categories FOR SELECT
    USING (is_active = TRUE);

CREATE POLICY "Public can view active aptitude topics"
    ON public.aptitude_topics FOR SELECT
    USING (is_active = TRUE);

CREATE POLICY "Public can view active aptitude questions"
    ON public.aptitude_questions FOR SELECT
    USING (is_active = TRUE);

CREATE POLICY "Public can view aptitude options"
    ON public.aptitude_options FOR SELECT
    USING (TRUE);

CREATE POLICY "Public can view published aptitude tests"
    ON public.aptitude_tests FOR SELECT
    USING (is_published = TRUE);

CREATE POLICY "Public can view aptitude test questions"
    ON public.aptitude_test_questions FOR SELECT
    USING (TRUE);

CREATE POLICY "Students can view and manage their own attempts"
    ON public.aptitude_attempts FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can view and manage their attempt answers"
    ON public.aptitude_attempt_answers FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.aptitude_attempts
        WHERE aptitude_attempts.id = aptitude_attempt_answers.attempt_id
        AND aptitude_attempts.user_id = auth.uid()
    ));

CREATE POLICY "Public can view active daily challenges"
    ON public.aptitude_daily_challenges FOR SELECT
    USING (is_active = TRUE);

CREATE POLICY "Public can view daily challenge questions"
    ON public.aptitude_daily_challenge_questions FOR SELECT
    USING (TRUE);

CREATE POLICY "Public can view aptitude achievements"
    ON public.aptitude_achievements FOR SELECT
    USING (TRUE);

CREATE POLICY "Students can view their earned achievements"
    ON public.student_aptitude_achievements FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
