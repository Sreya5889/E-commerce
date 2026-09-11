-- Migration 049: Career & Jobs Board Schema
CREATE TABLE IF NOT EXISTS public.job_listings (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    company_logo TEXT,
    location TEXT NOT NULL,
    work_mode TEXT NOT NULL CHECK (work_mode IN ('Remote', 'Hybrid', 'On-site')),
    employment_type TEXT NOT NULL CHECK (employment_type IN ('Full-time', 'Part-time', 'Internship', 'Contract')),
    experience_level TEXT NOT NULL,
    salary_range TEXT,
    category TEXT NOT NULL,
    skills TEXT[] DEFAULT '{}',
    description TEXT NOT NULL,
    requirements TEXT[] DEFAULT '{}',
    benefits TEXT[] DEFAULT '{}',
    external_apply_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    posted_date TEXT NOT NULL DEFAULT 'Recent',
    application_deadline DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_job_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id TEXT NOT NULL REFERENCES public.job_listings(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);

CREATE TABLE IF NOT EXISTS public.student_job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id TEXT NOT NULL REFERENCES public.job_listings(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'applied' CHECK (status IN ('saved', 'applied', 'interview', 'rejected', 'offer')),
    notes TEXT,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);

CREATE INDEX IF NOT EXISTS idx_job_listings_slug ON public.job_listings(slug);
CREATE INDEX IF NOT EXISTS idx_job_listings_cat ON public.job_listings(category);
CREATE INDEX IF NOT EXISTS idx_job_bookmarks_user ON public.student_job_bookmarks(user_id);
