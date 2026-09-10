-- Migration 031: Database Performance Indexes
-- Purpose: High-speed query execution and composite index optimization across all application tables.

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_teachers_user_id ON public.teachers(user_id);
CREATE INDEX IF NOT EXISTS idx_teachers_verification_status ON public.teachers(verification_status);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_subcategories_category_id ON public.subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_subcategories_slug ON public.subcategories(category_id, slug);

CREATE INDEX IF NOT EXISTS idx_courses_slug ON public.courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON public.courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_category_id ON public.courses(category_id);
CREATE INDEX IF NOT EXISTS idx_courses_subcategory_id ON public.courses(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_courses_status ON public.courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_created_at ON public.courses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_courses_average_rating ON public.courses(average_rating DESC);
CREATE INDEX IF NOT EXISTS idx_courses_student_count ON public.courses(student_count DESC);
CREATE INDEX IF NOT EXISTS idx_courses_title_trgm ON public.courses USING gin (title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_course_sections_course_id ON public.course_sections(course_id);
CREATE INDEX IF NOT EXISTS idx_course_sections_order ON public.course_sections(course_id, sort_order);

CREATE INDEX IF NOT EXISTS idx_course_lessons_section_id ON public.course_lessons(section_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_sort_order ON public.course_lessons(section_id, sort_order);

CREATE INDEX IF NOT EXISTS idx_course_resources_course_id ON public.course_resources(course_id);
CREATE INDEX IF NOT EXISTS idx_course_resources_lesson_id ON public.course_resources(lesson_id);

CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON public.enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON public.enrollments(course_id);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON public.lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_course_id ON public.lesson_progress(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_id ON public.lesson_progress(lesson_id);

CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON public.wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON public.cart(user_id);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_course_id ON public.order_items(course_id);

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON public.payments(transaction_id);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupon_usages_user ON public.coupon_usages(user_id, coupon_id);

CREATE INDEX IF NOT EXISTS idx_reviews_course_id ON public.reviews(course_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(user_id, is_read);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON public.certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_course_id ON public.certificates(course_id);
CREATE INDEX IF NOT EXISTS idx_certificates_verification_code ON public.certificates(verification_code);

CREATE INDEX IF NOT EXISTS idx_recently_viewed_user ON public.recently_viewed_courses(user_id, viewed_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON public.analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id);
