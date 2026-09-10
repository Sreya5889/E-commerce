-- Migration 016: Payments
-- Purpose: Gateway transaction audit logs.

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    provider TEXT NOT NULL DEFAULT 'stripe',
    transaction_id TEXT UNIQUE NOT NULL,
    amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
    currency TEXT NOT NULL DEFAULT 'USD',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'refunded')),
    payment_method TEXT,
    provider_response JSONB DEFAULT '{}'::jsonb,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
