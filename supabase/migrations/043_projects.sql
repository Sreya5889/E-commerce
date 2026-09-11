-- Migration 043: Projects Hub Schema
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    estimated_hours INT NOT NULL DEFAULT 20,
    banner_url TEXT,
    description TEXT NOT NULL,
    real_world_use_case TEXT,
    learning_objectives TEXT[] DEFAULT '{}',
    prerequisites TEXT[] DEFAULT '{}',
    technologies TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    database_requirements TEXT,
    api_requirements TEXT,
    ui_requirements TEXT,
    deployment_requirements TEXT,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.project_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    step_number INT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('started', 'in_progress', 'completed')),
    progress_pct INT NOT NULL DEFAULT 0,
    completed_steps INT[] DEFAULT '{}',
    github_url TEXT,
    live_demo_url TEXT,
    notes TEXT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, project_id)
);

CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_student_projects_user ON public.student_projects(user_id);
