-- ============================================================================
-- Migration 052: Indian Rupee (INR) Currency Standard & Smart Notifications
-- ============================================================================

-- 1. Standardize Orders & Payments Default Currency to INR
ALTER TABLE IF EXISTS public.orders 
  ALTER COLUMN currency SET DEFAULT 'INR';

ALTER TABLE IF EXISTS public.payments 
  ALTER COLUMN currency SET DEFAULT 'INR';

-- Update existing orders and payments to INR where still set to USD
UPDATE public.orders SET currency = 'INR' WHERE currency = 'USD';
UPDATE public.payments SET currency = 'INR' WHERE currency = 'USD';

-- 2. Update create_order_from_cart RPC to generate INR orders
CREATE OR REPLACE FUNCTION public.create_order_from_cart(
    p_user_id UUID,
    p_coupon_code TEXT DEFAULT NULL
)
RETURNS TABLE (
    order_id UUID,
    order_number TEXT,
    subtotal NUMERIC,
    discount NUMERIC,
    tax NUMERIC,
    total NUMERIC
) AS $$
DECLARE
    v_subtotal NUMERIC(10,2) := 0.00;
    v_discount NUMERIC(10,2) := 0.00;
    v_tax NUMERIC(10,2) := 0.00;
    v_total NUMERIC(10,2) := 0.00;
    v_coupon_id UUID := NULL;
    v_order_id UUID;
    v_order_number TEXT;
    v_item RECORD;
BEGIN
    IF auth.uid() IS NULL OR auth.uid() != p_user_id THEN
        RAISE EXCEPTION 'Unauthorized order creation request';
    END IF;

    -- Calculate subtotal from cart
    SELECT COALESCE(SUM(COALESCE(c.discount_price, c.price)), 0.00) INTO v_subtotal
    FROM public.cart ct
    JOIN public.courses c ON ct.course_id = c.id
    WHERE ct.user_id = p_user_id;

    IF v_subtotal <= 0 THEN
        RAISE EXCEPTION 'Shopping cart is empty';
    END IF;

    -- Coupon validation if supplied
    IF p_coupon_code IS NOT NULL AND p_coupon_code != '' THEN
        SELECT id, discount_type, discount_value, maximum_discount, minimum_order_amount
        INTO v_coupon_id, v_item
        FROM public.coupons
        WHERE code = UPPER(p_coupon_code) AND is_active = TRUE
          AND (expires_at IS NULL OR expires_at > NOW())
          AND (starts_at <= NOW());

        IF v_coupon_id IS NOT NULL THEN
            IF v_item.discount_type = 'percentage' THEN
                v_discount := (v_subtotal * v_item.discount_value) / 100.0;
                IF v_item.maximum_discount IS NOT NULL AND v_discount > v_item.maximum_discount THEN
                    v_discount := v_item.maximum_discount;
                END IF;
            ELSE
                v_discount := v_item.discount_value;
            END IF;
        END IF;
    END IF;

    v_tax := ROUND((GREATEST(0.00, v_subtotal - v_discount) * 0.05), 2);
    v_total := GREATEST(0.00, v_subtotal - v_discount) + v_tax;
    v_order_number := 'EDU-' || EXTRACT(EPOCH FROM NOW())::BIGINT || '-' || FLOOR(1000 + RANDOM() * 9000)::TEXT;

    -- Insert Order with INR currency
    INSERT INTO public.orders (
        user_id, order_number, subtotal, discount, tax, total, currency, coupon_id, status, payment_status
    ) VALUES (
        p_user_id, v_order_number, v_subtotal, v_discount, v_tax, v_total, 'INR', v_coupon_id, 'pending', 'pending'
    ) RETURNING id INTO v_order_id;

    -- Insert Order Items
    INSERT INTO public.order_items (order_id, course_id, instructor_id, course_title, unit_price, discount, final_price)
    SELECT 
        v_order_id,
        c.id,
        c.instructor_id,
        c.title,
        c.price,
        (c.price - COALESCE(c.discount_price, c.price)),
        COALESCE(c.discount_price, c.price)
    FROM public.cart ct
    JOIN public.courses c ON ct.course_id = c.id
    WHERE ct.user_id = p_user_id;

    RETURN QUERY SELECT v_order_id, v_order_number, v_subtotal, v_discount, v_tax, v_total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Notifications Table Enhancements
ALTER TABLE IF EXISTS public.notifications
  ADD COLUMN IF NOT EXISTS action_url TEXT,
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general';

CREATE INDEX IF NOT EXISTS idx_notifications_user_category ON public.notifications(user_id, category);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, is_read);
