-- Migration 017: Coupons & Coupon Usages
-- Purpose: Promotional codes, discount limits, expiration, and user usage tracking.

CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(10,2) NOT NULL CHECK (discount_value > 0),
    minimum_order_amount NUMERIC(10,2) DEFAULT 0.00 CHECK (minimum_order_amount >= 0),
    maximum_discount NUMERIC(10,2) CHECK (maximum_discount IS NULL OR maximum_discount > 0),
    usage_limit INTEGER CHECK (usage_limit IS NULL OR usage_limit > 0),
    used_count INTEGER NOT NULL DEFAULT 0 CHECK (used_count >= 0),
    per_user_limit INTEGER DEFAULT 1 CHECK (per_user_limit > 0),
    starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.coupon_usages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    used_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.orders
    ADD CONSTRAINT fk_orders_coupon_id
    FOREIGN KEY (coupon_id) REFERENCES public.coupons(id) ON DELETE SET NULL;
