-- Migration 041: CodeLab Schema (Coding Practice Platform)
CREATE TABLE IF NOT EXISTS public.coding_languages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    extension TEXT NOT NULL,
    version TEXT,
    default_template TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.coding_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.coding_problems (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    category_id TEXT REFERENCES public.coding_categories(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}',
    description TEXT NOT NULL,
    input_format TEXT,
    output_format TEXT,
    constraints TEXT,
    hints TEXT[] DEFAULT '{}',
    approach TEXT,
    starter_templates JSONB DEFAULT '{}'::jsonb,
    examples JSONB DEFAULT '[]'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.coding_problem_test_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    problem_id TEXT NOT NULL REFERENCES public.coding_problems(id) ON DELETE CASCADE,
    input TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    is_sample BOOLEAN NOT NULL DEFAULT false,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.coding_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    problem_id TEXT NOT NULL REFERENCES public.coding_problems(id) ON DELETE CASCADE,
    language TEXT NOT NULL,
    code TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Accepted', 'Wrong Answer', 'Time Limit', 'Runtime Error', 'Compilation Error')),
    runtime_ms INT DEFAULT 0,
    memory_kb INT DEFAULT 0,
    test_cases_passed INT DEFAULT 0,
    total_test_cases INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_coding_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    problem_id TEXT NOT NULL REFERENCES public.coding_problems(id) ON DELETE CASCADE,
    is_solved BOOLEAN NOT NULL DEFAULT false,
    attempts_count INT NOT NULL DEFAULT 1,
    solved_at TIMESTAMPTZ,
    last_language TEXT,
    last_code TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, problem_id)
);

CREATE INDEX IF NOT EXISTS idx_coding_problems_slug ON public.coding_problems(slug);
CREATE INDEX IF NOT EXISTS idx_coding_problems_diff ON public.coding_problems(difficulty);
CREATE INDEX IF NOT EXISTS idx_coding_submissions_user ON public.coding_submissions(user_id, problem_id);
