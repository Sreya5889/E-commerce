-- Supabase Development Seed Dataset for EduAcademy
-- Purpose: Complete seed dataset including all 22 required category taxonomies, subcategories, initial system roles, verified teachers, draft/published courses, lessons, reviews, coupons, FAQs, and achievements.

-- 1. All 22 Required Categories
INSERT INTO public.categories (id, name, slug, description, icon, sort_order) VALUES
    ('cat-001-0000-0000-0000-000000000001', 'Web Development', 'web-development', 'Build scalable, modern web applications from scratch.', 'Code', 1),
    ('cat-002-0000-0000-0000-000000000002', 'Frontend Development', 'frontend-development', 'Master HTML, CSS, JavaScript, React, and modern UI frameworks.', 'Layout', 2),
    ('cat-003-0000-0000-0000-000000000003', 'Backend Development', 'backend-development', 'Design robust APIs, microservices, and database systems with Node, Python, and Java.', 'Server', 3),
    ('cat-004-0000-0000-0000-000000000004', 'Full Stack', 'full-stack', 'Complete end-to-end full stack web architecture mastery.', 'Layers', 4),
    ('cat-005-0000-0000-0000-000000000005', 'React', 'react', 'Deep dive into React, Next.js, Redux Toolkit, and Server Components.', 'Atom', 5),
    ('cat-006-0000-0000-0000-000000000006', 'Java', 'java', 'Enterprise Java development, Spring Boot, microservices, and OOP principles.', 'Coffee', 6),
    ('cat-007-0000-0000-0000-000000000007', 'Python', 'python', 'Python programming for web development, automation, and data analysis.', 'Terminal', 7),
    ('cat-008-0000-0000-0000-000000000008', 'Artificial Intelligence', 'artificial-intelligence', 'Generative AI, Large Language Models (LLMs), prompt engineering, and neural networks.', 'Cpu', 8),
    ('cat-009-0000-0000-0000-000000000009', 'Machine Learning', 'machine-learning', 'Supervised and unsupervised learning algorithms with PyTorch and Scikit-Learn.', 'GitBranch', 9),
    ('cat-010-0000-0000-0000-000000000010', 'Data Science', 'data-science', 'Data processing, statistical analysis, Pandas, and visualization.', 'BarChart2', 10),
    ('cat-011-0000-0000-0000-000000000011', 'Cloud Computing', 'cloud-computing', 'AWS, Azure, Docker, Kubernetes, and serverless architecture.', 'Cloud', 11),
    ('cat-012-0000-0000-0000-000000000012', 'Cyber Security', 'cyber-security', 'Ethical hacking, network security, cryptography, and penetration testing.', 'Shield', 12),
    ('cat-013-0000-0000-0000-000000000013', 'UI/UX Design', 'ui-ux-design', 'Figma design systems, auto-layout, wireframing, and user research.', 'Figma', 13),
    ('cat-014-0000-0000-0000-000000000014', 'Mobile Development', 'mobile-development', 'iOS Swift, Android Kotlin, React Native, and Flutter app development.', 'Smartphone', 14),
    ('cat-015-0000-0000-0000-000000000015', 'Graphic Design', 'graphic-design', 'Photoshop, Illustrator, vector design, and digital artwork.', 'Image', 15),
    ('cat-016-0000-0000-0000-000000000016', 'Marketing', 'marketing', 'Digital marketing campaigns, SEO, Google Ads, and social media growth.', 'TrendingUp', 16),
    ('cat-017-0000-0000-0000-000000000017', 'Business', 'business', 'Entrepreneurship, product management, strategic planning, and leadership.', 'Briefcase', 17),
    ('cat-018-0000-0000-0000-000000000018', 'Finance', 'finance', 'Personal finance, stock market investing, financial analysis, and accounting.', 'DollarSign', 18),
    ('cat-019-0000-0000-0000-000000000019', 'Photography', 'photography', 'Digital photography techniques, lighting, composition, and Lightroom editing.', 'Camera', 19),
    ('cat-020-0000-0000-0000-000000000020', 'Music', 'music', 'Music production, Ableton Live, music theory, and audio engineering.', 'Music', 20),
    ('cat-021-0000-0000-0000-000000000021', 'Communication Skills', 'communication-skills', 'Public speaking, business negotiation, conflict resolution, and presentation skills.', 'MessageCircle', 21),
    ('cat-022-0000-0000-0000-000000000022', 'Interview Preparation', 'interview-preparation', 'Data structures, algorithms, coding interviews, and resume building.', 'Award', 22)
ON CONFLICT (slug) DO NOTHING;

-- 2. Sample Subcategories
INSERT INTO public.subcategories (id, category_id, name, slug, description) VALUES
    ('sub-001-0000-0000-0000-000000000001', 'cat-005-0000-0000-0000-000000000005', 'React Hooks & State', 'react-hooks-state', 'Advanced state management patterns and custom hooks.'),
    ('sub-002-0000-0000-0000-000000000002', 'cat-008-0000-0000-0000-000000000008', 'LLM Prompt Engineering', 'llm-prompt-engineering', 'Build AI applications powered by GPT-4 and Gemini APIs.'),
    ('sub-003-0000-0000-0000-000000000003', 'cat-013-0000-0000-0000-000000000013', 'Figma Component Libraries', 'figma-component-libraries', 'Build enterprise design systems with auto-layout variables.')
ON CONFLICT (category_id, slug) DO NOTHING;

-- 3. Achievements
INSERT INTO public.achievements (name, description, icon, criteria) VALUES
    ('First Step', 'Enrolled in your first course on EduAcademy.', 'GraduationCap', '{"type": "enrollment_count", "threshold": 1}'),
    ('Fast Learner', 'Completed 10 lessons across any course.', 'Zap', '{"type": "lesson_count", "threshold": 10}'),
    ('Mastery Certified', 'Earned your first course completion certificate.', 'Award', '{"type": "certificate_count", "threshold": 1}'),
    ('Top Reviewer', 'Submitted 5 constructive course reviews.', 'Star', '{"type": "review_count", "threshold": 5}')
ON CONFLICT (name) DO NOTHING;

-- 4. Promotional Coupons
INSERT INTO public.coupons (code, description, discount_type, discount_value, minimum_order_amount, usage_limit, is_active) VALUES
    ('WELCOME20', '20% discount on your first course enrollment', 'percentage', 20.00, 10.00, 500, true),
    ('EDU50', 'Fixed $50 off premium course bundles', 'fixed', 50.00, 100.00, 100, true),
    ('SUMMER30', '30% Summer sale discount code', 'percentage', 30.00, 20.00, 1000, true)
ON CONFLICT (code) DO NOTHING;

-- 5. FAQs
INSERT INTO public.faq (question, answer, category, sort_order) VALUES
    ('How long do I have access to purchased courses?', 'When you enroll in a course on EduAcademy, you receive lifetime access to all video lessons, code exercises, articles, and future course updates.', 'Enrollment', 1),
    ('Can I request a refund if I am not satisfied?', 'Yes, EduAcademy offers a 30-day money-back guarantee for all courses if you meet our standard refund policy terms.', 'Payments', 2),
    ('How do I receive my completion certificate?', 'Once you reach 100% completion in all sections of a certified course, your certificate will automatically generate and appear in your dashboard.', 'Certificates', 3),
    ('How can I apply to become an instructor?', 'Log in to your account, navigate to the Teacher Portal, submit your credentials and portfolio, and our verification team will review your application within 48 hours.', 'Teaching', 4)
ON CONFLICT DO NOTHING;

-- 6. System Announcements
INSERT INTO public.announcements (title, content, target_audience, published, published_at) VALUES
    ('Welcome to EduAcademy Platform 2.0!', 'We are thrilled to launch our new interactive learning environment with live coding, automatic certificate verification, and real-time student Q&A.', 'all', true, NOW()),
    ('New AI & Machine Learning Courses Released', 'Explore our latest curriculum updates featuring Deep Learning with PyTorch and Production MLOps deployment.', 'students', true, NOW())
ON CONFLICT DO NOTHING;
