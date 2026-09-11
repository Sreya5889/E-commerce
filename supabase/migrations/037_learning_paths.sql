-- Migration 037: Learning Paths, Courses Mapping & Student Roadmaps
-- Purpose: Career-oriented learning paths organizing courses into sequential stages.

-- 1. Learning Paths Table
CREATE TABLE IF NOT EXISTS public.learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    subtitle TEXT,
    description TEXT,
    thumbnail_url TEXT,
    banner_url TEXT,
    category TEXT NOT NULL DEFAULT 'Development',
    difficulty TEXT NOT NULL DEFAULT 'all_levels' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'all_levels')),
    estimated_duration TEXT NOT NULL DEFAULT '3-6 months',
    skills TEXT[] DEFAULT ARRAY[]::TEXT[],
    prerequisites TEXT[] DEFAULT ARRAY[]::TEXT[],
    career_outcomes TEXT[] DEFAULT ARRAY[]::TEXT[],
    projects TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    student_count INTEGER DEFAULT 0 CHECK (student_count >= 0),
    average_rating NUMERIC(3,2) DEFAULT 4.90 CHECK (average_rating >= 0 AND average_rating <= 5.00),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Learning Path Courses (Stages) Table
CREATE TABLE IF NOT EXISTS public.learning_path_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learning_path_id UUID NOT NULL REFERENCES public.learning_paths(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL,
    stage_title TEXT NOT NULL,
    sequence_order INTEGER NOT NULL DEFAULT 1,
    is_required BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Student Enrolled Learning Paths Table
CREATE TABLE IF NOT EXISTS public.student_learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    learning_path_id UUID NOT NULL REFERENCES public.learning_paths(id) ON DELETE CASCADE,
    progress_percentage NUMERIC(5,2) NOT NULL DEFAULT 0.00 CHECK (progress_percentage >= 0 AND progress_percentage <= 100.00),
    current_course_id TEXT,
    completed_course_ids TEXT[] DEFAULT ARRAY[]::TEXT[],
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'paused')),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, learning_path_id)
);

-- 4. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_learning_paths_slug ON public.learning_paths(slug);
CREATE INDEX IF NOT EXISTS idx_learning_paths_published ON public.learning_paths(is_published);
CREATE INDEX IF NOT EXISTS idx_learning_paths_category ON public.learning_paths(category);
CREATE INDEX IF NOT EXISTS idx_learning_path_courses_path ON public.learning_path_courses(learning_path_id, sequence_order);
CREATE INDEX IF NOT EXISTS idx_student_learning_paths_user ON public.student_learning_paths(user_id);

-- 5. Row Level Security (RLS)
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_path_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_learning_paths ENABLE ROW LEVEL SECURITY;

-- Public can view published paths & their course mappings
CREATE POLICY "Public can view published learning paths"
    ON public.learning_paths FOR SELECT
    USING (is_published = TRUE);

CREATE POLICY "Public can view learning path courses"
    ON public.learning_path_courses FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.learning_paths lp 
        WHERE lp.id = learning_path_courses.learning_path_id AND lp.is_published = TRUE
    ));

-- Authenticated students can view and manage their own path progress
CREATE POLICY "Students can view own learning paths"
    ON public.student_learning_paths FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Students can enroll in learning paths"
    ON public.student_learning_paths FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can update own learning path progress"
    ON public.student_learning_paths FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

-- Admins have full access
CREATE POLICY "Admins have full access to learning_paths"
    ON public.learning_paths FOR ALL
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.user_roles ur 
        JOIN public.roles r ON ur.role_id = r.id 
        WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    ));

CREATE POLICY "Admins have full access to learning_path_courses"
    ON public.learning_path_courses FOR ALL
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.user_roles ur 
        JOIN public.roles r ON ur.role_id = r.id 
        WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    ));

CREATE POLICY "Admins have full access to student_learning_paths"
    ON public.student_learning_paths FOR ALL
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.user_roles ur 
        JOIN public.roles r ON ur.role_id = r.id 
        WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    ));
