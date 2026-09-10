-- Migration 029: Platform Settings
-- Purpose: System parameters key-value store.

CREATE TABLE IF NOT EXISTS public.platform_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB,
    description TEXT,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed default settings
INSERT INTO public.platform_settings (key, value, description) VALUES
    ('platform_name', '"EduAcademy"', 'Platform branding name'),
    ('support_email', '"support@eduacademy.app"', 'Primary support contact email'),
    ('support_phone', '"+1-800-555-0199"', 'Support phone number'),
    ('currency', '"USD"', 'Base platform transaction currency'),
    ('tax_rate', '0.05', 'Sales tax rate percentage'),
    ('maintenance_mode', 'false', 'Global maintenance flag'),
    ('default_language', '"en"', 'Default site locale'),
    ('certificate_enabled', 'true', 'Global certificate issuing toggle'),
    ('registration_enabled', 'true', 'User signup toggle')
ON CONFLICT (key) DO NOTHING;
