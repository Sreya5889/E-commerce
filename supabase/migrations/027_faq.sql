-- Migration 027: Frequently Asked Questions (FAQ)
-- Purpose: Admin knowledgebase for public and student helpdesk answers.

CREATE TABLE IF NOT EXISTS public.faq (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT,
    sort_order INTEGER DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
