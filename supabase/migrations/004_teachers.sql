-- Migration 004: Teachers Profile & Verification
-- Purpose: Educator details, verification workflow, public contact toggles, and metrics.

CREATE TABLE IF NOT EXISTS public.teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    qualification TEXT,
    designation TEXT,
    biography TEXT,
    experience_years INTEGER DEFAULT 0 CHECK (experience_years >= 0),
    specialization TEXT,
    skills TEXT[],
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    website_url TEXT,
    email_public BOOLEAN DEFAULT FALSE,
    phone_public BOOLEAN DEFAULT FALSE,
    verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected', 'suspended')),
    verification_badge BOOLEAN NOT NULL DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    total_courses INTEGER DEFAULT 0 CHECK (total_courses >= 0),
    total_students INTEGER DEFAULT 0 CHECK (total_students >= 0),
    average_rating NUMERIC(3,2) DEFAULT 0.00 CHECK (average_rating >= 0 AND average_rating <= 5.00),
    total_reviews INTEGER DEFAULT 0 CHECK (total_reviews >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
