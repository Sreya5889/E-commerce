-- Migration 047: Gamification & Career Readiness Schema
CREATE TABLE IF NOT EXISTS public.student_gamification_profile (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_xp INT NOT NULL DEFAULT 0,
    current_level INT NOT NULL DEFAULT 1,
    current_streak INT NOT NULL DEFAULT 0,
    best_streak INT NOT NULL DEFAULT 0,
    last_active_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.xp_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount INT NOT NULL,
    reason TEXT NOT NULL,
    source_type TEXT NOT NULL,
    source_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_career_profile (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    readiness_score INT NOT NULL DEFAULT 0,
    target_role TEXT,
    target_skills TEXT[] DEFAULT '{}',
    cv_url TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
