-- Migration 003: Profiles
-- Purpose: User profiles table linked to auth.users.id with automatic signup trigger.

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    display_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    phone TEXT,
    website TEXT,
    location TEXT,
    timezone TEXT DEFAULT 'UTC',
    language TEXT DEFAULT 'en',
    date_of_birth DATE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Automatic Profile & Student Role creation trigger on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER AS $$
DECLARE
    student_role_id UUID;
BEGIN
    INSERT INTO public.profiles (
        user_id,
        first_name,
        last_name,
        display_name,
        avatar_url
    ) VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.raw_user_meta_data->>'full_name', ' ', 1), ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', split_part(NEW.raw_user_meta_data->>'full_name', ' ', 2), ''),
        COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.raw_user_meta_data->>'avatar_url'
    ) ON CONFLICT (user_id) DO NOTHING;

    SELECT id INTO student_role_id FROM public.roles WHERE name = 'student';
    IF student_role_id IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role_id)
        VALUES (NEW.id, student_role_id)
        ON CONFLICT DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_signup();
