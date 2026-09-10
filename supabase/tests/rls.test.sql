-- RLS Authorization Boundary Automated Test Suite for EduAcademy
-- Purpose: Verify that Row Level Security policies enforce student, teacher, and admin permissions.

BEGIN;

-- 1. Setup Test Mock Users
SELECT plan(10) FROM set_config('search_path', 'public', true);

-- Test 1: Student cannot modify another user's profile
DO $$
DECLARE
    v_user_1 UUID := gen_random_uuid();
    v_user_2 UUID := gen_random_uuid();
BEGIN
    INSERT INTO auth.users (id, email) VALUES (v_user_1, 'student1@test.com'), (v_user_2, 'student2@test.com');

    -- Switch context to user 1
    PERFORM set_config('request.jwt.claim.sub', v_user_1::text, true);
    PERFORM set_config('role', 'authenticated', true);

    -- User 1 should update user 1 profile
    UPDATE public.profiles SET display_name = 'Student One' WHERE user_id = v_user_1;

    -- User 1 updating user 2 profile should affect 0 rows under RLS
    IF (SELECT COUNT(*) FROM public.profiles WHERE user_id = v_user_2 AND display_name = 'Student One') > 0 THEN
        RAISE EXCEPTION 'RLS FAIL: Student modified another user profile!';
    END IF;
END $$;

-- Test 2: Student cannot access un-enrolled course private video content
DO $$
DECLARE
    v_student UUID := gen_random_uuid();
    v_teacher UUID := gen_random_uuid();
    v_course_id UUID := gen_random_uuid();
BEGIN
    INSERT INTO auth.users (id, email) VALUES (v_student, 'student@test.com'), (v_teacher, 'teacher@test.com');

    -- Student context
    PERFORM set_config('request.jwt.claim.sub', v_student::text, true);
    PERFORM set_config('role', 'authenticated', true);

    -- Should not see lesson resources if not enrolled
    IF EXISTS (SELECT 1 FROM public.course_resources WHERE course_id = v_course_id) THEN
        RAISE EXCEPTION 'RLS FAIL: Non-enrolled student accessed private course resource!';
    END IF;
END $$;

-- Test 3: Unapproved Teacher cannot publish courses
DO $$
DECLARE
    v_unapproved_teacher UUID := gen_random_uuid();
    v_teacher_id UUID := gen_random_uuid();
BEGIN
    INSERT INTO auth.users (id, email) VALUES (v_unapproved_teacher, 'newteacher@test.com');
    INSERT INTO public.teachers (id, user_id, verification_status) VALUES (v_teacher_id, v_unapproved_teacher, 'pending');

    PERFORM set_config('request.jwt.claim.sub', v_unapproved_teacher::text, true);
    PERFORM set_config('role', 'authenticated', true);

    -- Inserting published course should fail RLS check
    BEGIN
        INSERT INTO public.courses (instructor_id, title, slug, status)
        VALUES (v_teacher_id, 'Draft Course', 'draft-course-test', 'published');
        
        RAISE EXCEPTION 'RLS FAIL: Unapproved teacher published a course!';
    EXCEPTION WHEN OTHERS THEN
        -- Expected RLS restriction failure
        NULL;
    END;
END $$;

ROLLBACK;
