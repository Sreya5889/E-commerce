-- Migration 015: Order Items
-- Purpose: Individual line items preserving historical purchase pricing even if course fees change later.

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE RESTRICT,
    instructor_id UUID REFERENCES public.teachers(id) ON DELETE RESTRICT,
    course_title TEXT NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
    discount NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (discount >= 0),
    final_price NUMERIC(10,2) NOT NULL CHECK (final_price >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
