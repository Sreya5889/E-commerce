-- Migration 032: PostgreSQL RPC Functions
-- Purpose: Encapsulated business transactions, search algorithms, certificate verification, and executive dashboard analytics.

-- 1. Full-Text & Multi-Facet Course Search RPC
CREATE OR REPLACE FUNCTION public.search_courses(
    search_query TEXT DEFAULT NULL,
    p_category_id UUID DEFAULT NULL,
    p_subcategory_id UUID DEFAULT NULL,
    p_instructor_id UUID DEFAULT NULL,
    min_price NUMERIC DEFAULT NULL,
    max_price NUMERIC DEFAULT NULL,
    p_level TEXT DEFAULT NULL,
    p_language TEXT DEFAULT NULL,
    min_rating NUMERIC DEFAULT NULL,
    sort_by TEXT DEFAULT 'popular',
    page INTEGER DEFAULT 1,
    page_size INTEGER DEFAULT 12
)
RETURNS TABLE (
    id UUID,
    instructor_id UUID,
    category_id UUID,
    subcategory_id UUID,
    title TEXT,
    slug TEXT,
    subtitle TEXT,
    description TEXT,
    thumbnail_url TEXT,
    price NUMERIC,
    discount_price NUMERIC,
    level TEXT,
    language TEXT,
    duration_minutes INTEGER,
    total_lessons INTEGER,
    badge TEXT,
    student_count INTEGER,
    average_rating NUMERIC,
    review_count INTEGER,
    created_at TIMESTAMPTZ,
    total_count BIGINT
) AS $$
DECLARE
    v_offset INTEGER := (page - 1) * page_size;
BEGIN
    RETURN QUERY
    WITH filtered_courses AS (
        SELECT c.*, COUNT(*) OVER() as full_count
        FROM public.courses c
        WHERE c.status = 'published'
          AND (search_query IS NULL OR (c.title ILIKE '%' || search_query || '%' OR c.subtitle ILIKE '%' || search_query || '%' OR c.description ILIKE '%' || search_query || '%'))
          AND (p_category_id IS NULL OR c.category_id = p_category_id)
          AND (p_subcategory_id IS NULL OR c.subcategory_id = p_subcategory_id)
          AND (p_instructor_id IS NULL OR c.instructor_id = p_instructor_id)
          AND (min_price IS NULL OR c.price >= min_price)
          AND (max_price IS NULL OR c.price <= max_price)
          AND (p_level IS NULL OR c.level = p_level)
          AND (p_language IS NULL OR c.language = p_language)
          AND (min_rating IS NULL OR c.average_rating >= min_rating)
    )
    SELECT 
        fc.id, fc.instructor_id, fc.category_id, fc.subcategory_id, fc.title, fc.slug, fc.subtitle,
        fc.description, fc.thumbnail_url, fc.price, fc.discount_price, fc.level, fc.language,
        fc.duration_minutes, fc.total_lessons, fc.badge, fc.student_count, fc.average_rating,
        fc.review_count, fc.created_at, fc.full_count
    FROM filtered_courses fc
    ORDER BY
        CASE WHEN sort_by = 'latest' THEN fc.created_at END DESC,
        CASE WHEN sort_by = 'popular' THEN fc.student_count END DESC,
        CASE WHEN sort_by = 'rating' THEN fc.average_rating END DESC,
        CASE WHEN sort_by = 'price_low' THEN fc.price END ASC,
        CASE WHEN sort_by = 'price_high' THEN fc.price END DESC,
        fc.created_at DESC
    OFFSET v_offset
    LIMIT page_size;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Course Recommendation RPC
CREATE OR REPLACE FUNCTION public.get_recommended_courses(
    p_user_id UUID DEFAULT NULL,
    p_limit INTEGER DEFAULT 6
)
RETURNS SETOF public.courses AS $$
BEGIN
    IF p_user_id IS NOT NULL THEN
        RETURN QUERY
        SELECT DISTINCT c.*
        FROM public.courses c
        WHERE c.status = 'published'
          AND (
              c.category_id IN (
                  SELECT co.category_id 
                  FROM public.recently_viewed_courses rvc
                  JOIN public.courses co ON rvc.course_id = co.id
                  WHERE rvc.user_id = p_user_id
              )
              OR c.category_id IN (
                  SELECT co.category_id
                  FROM public.enrollments e
                  JOIN public.courses co ON e.course_id = co.id
                  WHERE e.user_id = p_user_id
              )
          )
          AND c.id NOT IN (
              SELECT course_id FROM public.enrollments WHERE user_id = p_user_id
          )
        ORDER BY c.average_rating DESC, c.student_count DESC
        LIMIT p_limit;
    ELSE
        RETURN QUERY
        SELECT *
        FROM public.courses
        WHERE status = 'published'
        ORDER BY student_count DESC, average_rating DESC
        LIMIT p_limit;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Record Course View RPC
CREATE OR REPLACE FUNCTION public.record_course_view(p_user_id UUID, p_course_id UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.recently_viewed_courses (user_id, course_id, viewed_at)
    VALUES (p_user_id, p_course_id, NOW())
    ON CONFLICT (user_id, course_id) 
    DO UPDATE SET viewed_at = NOW();

    DELETE FROM public.recently_viewed_courses
    WHERE user_id = p_user_id
      AND id NOT IN (
          SELECT id FROM public.recently_viewed_courses
          WHERE user_id = p_user_id
          ORDER BY viewed_at DESC
          LIMIT 20
      );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create Order from Cart Server-Side RPC
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

    -- Insert Order
    INSERT INTO public.orders (
        user_id, order_number, subtotal, discount, tax, total, currency, coupon_id, status, payment_status
    ) VALUES (
        p_user_id, v_order_number, v_subtotal, v_discount, v_tax, v_total, 'USD', v_coupon_id, 'pending', 'pending'
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

-- 5. Process Successful Payment RPC (Idempotent)
CREATE OR REPLACE FUNCTION public.process_successful_payment(
    p_order_id UUID,
    p_transaction_id TEXT,
    p_provider TEXT DEFAULT 'stripe'
)
RETURNS BOOLEAN AS $$
DECLARE
    v_order RECORD;
    v_item RECORD;
BEGIN
    SELECT * INTO v_order FROM public.orders WHERE id = p_order_id;
    IF v_order IS NULL THEN
        RAISE EXCEPTION 'Order not found';
    END IF;

    IF v_order.payment_status = 'succeeded' THEN
        RETURN TRUE; -- Idempotent return
    END IF;

    -- Update Order
    UPDATE public.orders
    SET status = 'completed', payment_status = 'succeeded', updated_at = NOW()
    WHERE id = p_order_id;

    -- Create Payment Record
    INSERT INTO public.payments (
        order_id, user_id, provider, transaction_id, amount, currency, status, paid_at
    ) VALUES (
        p_order_id, v_order.user_id, p_provider, p_transaction_id, v_order.total, v_order.currency, 'succeeded', NOW()
    ) ON CONFLICT (transaction_id) DO UPDATE SET status = 'succeeded', paid_at = NOW();

    -- Generate Enrollments
    FOR v_item IN SELECT * FROM public.order_items WHERE order_id = p_order_id LOOP
        INSERT INTO public.enrollments (user_id, course_id, order_id)
        VALUES (v_order.user_id, v_item.course_id, p_order_id)
        ON CONFLICT (user_id, course_id) DO NOTHING;

        -- Update course student count
        UPDATE public.courses
        SET student_count = student_count + 1
        WHERE id = v_item.course_id;
    END LOOP;

    -- Clear user cart
    DELETE FROM public.cart WHERE user_id = v_order.user_id;

    -- Send notification
    INSERT INTO public.notifications (user_id, type, title, message)
    VALUES (
        v_order.user_id, 'payment_success', 'Payment Received!', 
        'Your order #' || v_order.order_number || ' has been successfully completed.'
    );

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Generate Certificate RPC
CREATE OR REPLACE FUNCTION public.generate_certificate(
    p_user_id UUID,
    p_course_id UUID
)
RETURNS TABLE (
    certificate_id UUID,
    certificate_number TEXT,
    verification_code TEXT,
    certificate_url TEXT
) AS $$
DECLARE
    v_enrollment RECORD;
    v_cert_id UUID;
    v_cert_num TEXT;
    v_verify_code TEXT;
    v_cert_url TEXT;
BEGIN
    SELECT * INTO v_enrollment
    FROM public.enrollments
    WHERE user_id = p_user_id AND course_id = p_course_id;

    IF v_enrollment IS NULL THEN
        RAISE EXCEPTION 'Student is not enrolled in this course';
    END IF;

    IF v_enrollment.progress_percentage < 100.00 AND NOT v_enrollment.completed THEN
        RAISE EXCEPTION 'Course completion requirement (100%%) not met';
    END IF;

    v_cert_num := 'CERT-' || EXTRACT(EPOCH FROM NOW())::BIGINT || '-' || FLOOR(1000 + RANDOM() * 9000)::TEXT;
    v_verify_code := 'VERIFY-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8)) || '-' || EXTRACT(EPOCH FROM NOW())::BIGINT;
    v_cert_url := 'https://eduacademy.app/certificates/verify/' || v_verify_code;

    INSERT INTO public.certificates (
        user_id, course_id, enrollment_id, certificate_number, certificate_url, verification_code
    ) VALUES (
        p_user_id, p_course_id, v_enrollment.id, v_cert_num, v_cert_url, v_verify_code
    ) ON CONFLICT (user_id, course_id) 
    DO UPDATE SET updated_at = NOW()
    RETURNING id INTO v_cert_id;

    RETURN QUERY SELECT v_cert_id, v_cert_num, v_verify_code, v_cert_url;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Public Certificate Verification RPC
CREATE OR REPLACE FUNCTION public.verify_certificate(p_verification_code TEXT)
RETURNS TABLE (
    certificate_number TEXT,
    student_name TEXT,
    course_title TEXT,
    instructor_name TEXT,
    issued_at TIMESTAMPTZ,
    is_valid BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.certificate_number,
        COALESCE(p.display_name, p.first_name || ' ' || p.last_name, 'Verified Student')::TEXT,
        co.title,
        COALESCE(tp.display_name, tp.first_name || ' ' || tp.last_name, 'Verified Instructor')::TEXT,
        c.issued_at,
        TRUE
    FROM public.certificates c
    JOIN public.profiles p ON c.user_id = p.user_id
    JOIN public.courses co ON c.course_id = co.id
    JOIN public.teachers t ON co.instructor_id = t.id
    JOIN public.profiles tp ON t.user_id = tp.user_id
    WHERE c.verification_code = p_verification_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Admin Dashboard Statistics RPC
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats()
RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access denied. Admin privileges required.';
    END IF;

    SELECT jsonb_build_object(
        'total_users', (SELECT COUNT(*) FROM auth.users),
        'total_students', (SELECT COUNT(*) FROM public.user_roles ur JOIN public.roles r ON ur.role_id = r.id WHERE r.name = 'student'),
        'total_teachers', (SELECT COUNT(*) FROM public.teachers WHERE verification_status = 'approved'),
        'pending_teachers', (SELECT COUNT(*) FROM public.teachers WHERE verification_status = 'pending'),
        'total_courses', (SELECT COUNT(*) FROM public.courses),
        'published_courses', (SELECT COUNT(*) FROM public.courses WHERE status = 'published'),
        'total_enrollments', (SELECT COUNT(*) FROM public.enrollments),
        'total_revenue', (SELECT COALESCE(SUM(total), 0.00) FROM public.orders WHERE payment_status = 'succeeded'),
        'monthly_revenue', (SELECT COALESCE(SUM(total), 0.00) FROM public.orders WHERE payment_status = 'succeeded' AND created_at >= date_trunc('month', NOW()))
    ) INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
