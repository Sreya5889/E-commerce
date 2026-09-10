-- Migration 033: PostgreSQL Triggers
-- Purpose: Automatic updated_at timestamp updating, review statistics calculation, and audit logging triggers.

-- 1. Generic updated_at Trigger Handler
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger across all relevant tables
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_teachers_updated_at BEFORE UPDATE ON public.teachers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_subcategories_updated_at BEFORE UPDATE ON public.subcategories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_course_sections_updated_at BEFORE UPDATE ON public.course_sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_course_lessons_updated_at BEFORE UPDATE ON public.course_lessons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_lesson_progress_updated_at BEFORE UPDATE ON public.lesson_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_cart_updated_at BEFORE UPDATE ON public.cart FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_coupons_updated_at BEFORE UPDATE ON public.coupons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_conversations_updated_at BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_faq_updated_at BEFORE UPDATE ON public.faq FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_contact_messages_updated_at BEFORE UPDATE ON public.contact_messages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. Review Rating Recalculation Trigger Handler
CREATE OR REPLACE FUNCTION public.recalculate_course_ratings_trigger()
RETURNS TRIGGER AS $$
DECLARE
    v_course_id UUID;
    v_instructor_id UUID;
    v_avg NUMERIC(3,2);
    v_count INTEGER;
BEGIN
    v_course_id := CASE WHEN TG_OP = 'DELETE' THEN OLD.course_id ELSE NEW.course_id END;

    SELECT instructor_id INTO v_instructor_id FROM public.courses WHERE id = v_course_id;

    -- Calculate stats for course
    SELECT COALESCE(ROUND(AVG(rating)::NUMERIC, 2), 0.00), COUNT(id)
    INTO v_avg, v_count
    FROM public.reviews
    WHERE course_id = v_course_id AND is_approved = TRUE;

    UPDATE public.courses
    SET average_rating = v_avg, review_count = v_count
    WHERE id = v_course_id;

    -- Calculate stats for teacher
    IF v_instructor_id IS NOT NULL THEN
        UPDATE public.teachers
        SET average_rating = COALESCE((
                SELECT ROUND(AVG(r.rating)::NUMERIC, 2)
                FROM public.reviews r
                JOIN public.courses c ON r.course_id = c.id
                WHERE c.instructor_id = v_instructor_id AND r.is_approved = TRUE
            ), 0.00),
            total_reviews = (
                SELECT COUNT(r.id)
                FROM public.reviews r
                JOIN public.courses c ON r.course_id = c.id
                WHERE c.instructor_id = v_instructor_id AND r.is_approved = TRUE
            )
        WHERE id = v_instructor_id;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_reviews_recalc
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.recalculate_course_ratings_trigger();
