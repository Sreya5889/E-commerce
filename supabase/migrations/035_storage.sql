-- Migration 035: Supabase Storage Buckets & Storage RLS Policies
-- Purpose: Storage bucket provisioning and path-scoped access authorization policies.

-- 1. Insert Storage Buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES
    ('course-images', 'course-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
    ('instructor-images', 'instructor-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('course-videos', 'course-videos', false, 524288000, ARRAY['video/mp4', 'video/webm', 'video/quicktime']),
    ('course-resources', 'course-resources', false, 52428800, ARRAY['application/pdf', 'application/zip', 'text/plain', 'application/json']),
    ('certificates', 'certificates', true, 10485760, ARRAY['application/pdf', 'image/png']),
    ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('attachments', 'attachments', false, 20971520, ARRAY['image/jpeg', 'image/png', 'application/pdf', 'text/plain'])
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Objects RLS Policies

-- Public Read Policies
CREATE POLICY "Public read avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Public read course-images" ON storage.objects FOR SELECT USING (bucket_id = 'course-images');
CREATE POLICY "Public read instructor-images" ON storage.objects FOR SELECT USING (bucket_id = 'instructor-images');
CREATE POLICY "Public read certificates" ON storage.objects FOR SELECT USING (bucket_id = 'certificates');

-- Path-scoped upload policies
CREATE POLICY "Users upload own avatar" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Teachers upload course media" ON storage.objects FOR INSERT WITH CHECK (
    (bucket_id IN ('course-images', 'course-videos', 'course-resources')) AND public.is_teacher()
);

-- Private asset access authorization
CREATE POLICY "Enrolled students download course videos" ON storage.objects FOR SELECT USING (
    bucket_id = 'course-videos' AND (
        public.is_teacher() OR public.is_admin() OR 
        EXISTS (
            SELECT 1 FROM public.enrollments e
            JOIN public.courses c ON e.course_id = c.id
            WHERE e.user_id = auth.uid() AND (storage.foldername(name))[1] = c.id::text
        )
    )
);

CREATE POLICY "Enrolled students download course resources" ON storage.objects FOR SELECT USING (
    bucket_id = 'course-resources' AND (
        public.is_teacher() OR public.is_admin() OR 
        EXISTS (
            SELECT 1 FROM public.enrollments e
            JOIN public.courses c ON e.course_id = c.id
            WHERE e.user_id = auth.uid() AND (storage.foldername(name))[1] = c.id::text
        )
    )
);
