-- Migration 014: Orders
-- Purpose: Financial purchase orders maintaining immutable transaction snapshots.

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    order_number TEXT UNIQUE NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
    discount NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (discount >= 0),
    tax NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (tax >= 0),
    total NUMERIC(10,2) NOT NULL CHECK (total >= 0),
    currency TEXT NOT NULL DEFAULT 'USD',
    coupon_id UUID, -- Foreign key added after coupons table in 017
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'refunded', 'failed')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'succeeded', 'failed', 'refunded')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Link order_id foreign key back to enrollments table
ALTER TABLE public.enrollments
    ADD CONSTRAINT fk_enrollments_order_id
    FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE SET NULL;
