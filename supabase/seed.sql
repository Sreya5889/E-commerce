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


-- 7. Course Catalog Seed (38 Comprehensive Courses)
-- Migration 036: Complete Seed Course Catalog
-- Inserts 38 comprehensive courses matching all 22+ categories and full search terms into public.courses.


INSERT INTO public.courses (
    instructor_id,
    category_id,
    title,
    slug,
    subtitle,
    description,
    thumbnail_url,
    banner_url,
    price,
    discount_price,
    level,
    duration_minutes,
    student_count,
    average_rating,
    status,
    badge,
    learning_objectives,
    requirements
) VALUES (
    (SELECT id FROM public.teachers LIMIT 1),
    COALESCE((SELECT id FROM public.categories WHERE slug = 'react'), (SELECT id FROM public.categories LIMIT 1)),
    'Complete React JS Development',
    'complete-react-js-development',
    'Master modern React 19, Hooks, Redux Toolkit, React Router, and build 10+ production web apps.',
    'Comprehensive journey from foundational JavaScript to building high-performance, accessible React applications. You will learn JSX, state, props, custom hooks, context API, Redux Toolkit, SSR basics, performance tuning, and deploy full applications.',
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1600&auto=format&fit=crop&q=80',
    89.99,
    19.99,
    'beginner',
    2310,
    94210,
    4.9,
    'published',
    'bestseller',
    ARRAY[]::TEXT[],
    ARRAY['React', 'JavaScript', 'Frontend', 'Web Development', 'Hooks', 'Redux']
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    level = EXCLUDED.level,
    duration_minutes = EXCLUDED.duration_minutes,
    student_count = EXCLUDED.student_count,
    average_rating = EXCLUDED.average_rating,
    status = 'published',
    badge = EXCLUDED.badge,
    learning_objectives = EXCLUDED.learning_objectives,
    updated_at = NOW();

INSERT INTO public.courses (
    instructor_id,
    category_id,
    title,
    slug,
    subtitle,
    description,
    thumbnail_url,
    banner_url,
    price,
    discount_price,
    level,
    duration_minutes,
    student_count,
    average_rating,
    status,
    badge,
    learning_objectives,
    requirements
) VALUES (
    (SELECT id FROM public.teachers LIMIT 1),
    COALESCE((SELECT id FROM public.categories WHERE slug = 'react'), (SELECT id FROM public.categories LIMIT 1)),
    'Advanced React and TypeScript',
    'advanced-react-and-typescript',
    'Enterprise scalable React architecture with strict TypeScript, generic components, and micro-frontends.',
    'Level up your React engineering with TypeScript. Learn how to type custom hooks, build reusable polymorphic component libraries, handle complex discriminated union states, and optimize rendering performance.',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&auto=format&fit=crop&q=80',
    109.99,
    24.99,
    'advanced',
    1680,
    48300,
    4.9,
    'published',
    'trending',
    ARRAY[]::TEXT[],
    ARRAY['React', 'TypeScript', 'Frontend', 'Enterprise', 'Architecture']
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    level = EXCLUDED.level,
    duration_minutes = EXCLUDED.duration_minutes,
    student_count = EXCLUDED.student_count,
    average_rating = EXCLUDED.average_rating,
    status = 'published',
    badge = EXCLUDED.badge,
    learning_objectives = EXCLUDED.learning_objectives,
    updated_at = NOW();

INSERT INTO public.courses (
    instructor_id,
    category_id,
    title,
    slug,
    subtitle,
    description,
    thumbnail_url,
    banner_url,
    price,
    discount_price,
    level,
    duration_minutes,
    student_count,
    average_rating,
    status,
    badge,
    learning_objectives,
    requirements
) VALUES (
    (SELECT id FROM public.teachers LIMIT 1),
    COALESCE((SELECT id FROM public.categories WHERE slug = 'react'), (SELECT id FROM public.categories LIMIT 1)),
    'React Projects for Beginners',
    'react-projects-for-beginners',
    'Learn React by building 5 practical interactive projects: E-Commerce, Weather App, Quiz, and Dashboard.',
    'The fastest way to learn React is by building actual web apps. No dry theoretical lectures: code along from minute one to build five complete, portfolio-ready projects with Tailwind CSS and React.',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&auto=format&fit=crop&q=80',
    0,
    0,
    'beginner',
    720,
    112000,
    4.8,
    'published',
    'free',
    ARRAY[]::TEXT[],
    ARRAY['React', 'JavaScript', 'Beginner', 'Projects', 'Free']
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    level = EXCLUDED.level,
    duration_minutes = EXCLUDED.duration_minutes,
    student_count = EXCLUDED.student_count,
    average_rating = EXCLUDED.average_rating,
    status = 'published',
    badge = EXCLUDED.badge,
    learning_objectives = EXCLUDED.learning_objectives,
    updated_at = NOW();

INSERT INTO public.courses (
    instructor_id,
    category_id,
    title,
    slug,
    subtitle,
    description,
    thumbnail_url,
    banner_url,
    price,
    discount_price,
    level,
    duration_minutes,
    student_count,
    average_rating,
    status,
    badge,
    learning_objectives,
    requirements
) VALUES (
    (SELECT id FROM public.teachers LIMIT 1),
    COALESCE((SELECT id FROM public.categories WHERE slug = 'python'), (SELECT id FROM public.categories LIMIT 1)),
    'Python Programming for Beginners',
    'python-programming-for-beginners',
    'Go from zero to building real scripts, automation tools, and web scrapers with Python 3.',
    'Master Python from the absolute basics to writing clean, idiomatic code. Learn variables, data structures, loops, functions, object-oriented programming (OOP), file I/O, error handling, and web scraping with BeautifulSoup.',
    'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=1600&auto=format&fit=crop&q=80',
    79.99,
    16.99,
    'beginner',
    1920,
    87400,
    4.8,
    'published',
    'bestseller',
    ARRAY[]::TEXT[],
    ARRAY['Python', 'Programming', 'Automation', 'Beginner', 'Coding']
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    level = EXCLUDED.level,
    duration_minutes = EXCLUDED.duration_minutes,
    student_count = EXCLUDED.student_count,
    average_rating = EXCLUDED.average_rating,
    status = 'published',
    badge = EXCLUDED.badge,
    learning_objectives = EXCLUDED.learning_objectives,
    updated_at = NOW();

INSERT INTO public.courses (
    instructor_id,
    category_id,
    title,
    slug,
    subtitle,
    description,
    thumbnail_url,
    banner_url,
    price,
    discount_price,
    level,
    duration_minutes,
    student_count,
    average_rating,
    status,
    badge,
    learning_objectives,
    requirements
) VALUES (
    (SELECT id FROM public.teachers LIMIT 1),
    COALESCE((SELECT id FROM public.categories WHERE slug = 'python'), (SELECT id FROM public.categories LIMIT 1)),
    'Advanced Python Programming',
    'advanced-python-programming',
    'Metaprogramming, decorators, async/await concurrency, generators, and high-performance design patterns.',
    'Take your Python skills to senior level. Dive deep into Python internals, memory management, generators, context managers, custom decorators, multithreading, multiprocessing, and asyncio high-concurrency systems.',
    'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1600&auto=format&fit=crop&q=80',
    99.99,
    22.99,
    'advanced',
    1440,
    34100,
    4.9,
    'published',
    'premium',
    ARRAY[]::TEXT[],
    ARRAY['Python', 'AsyncIO', 'Concurrency', 'Advanced', 'Backend']
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    level = EXCLUDED.level,
    duration_minutes = EXCLUDED.duration_minutes,
    student_count = EXCLUDED.student_count,
    average_rating = EXCLUDED.average_rating,
    status = 'published',
    badge = EXCLUDED.badge,
    learning_objectives = EXCLUDED.learning_objectives,
    updated_at = NOW();

INSERT INTO public.courses (
    instructor_id,
    category_id,
    title,
    slug,
    subtitle,
    description,
    thumbnail_url,
    banner_url,
    price,
    discount_price,
    level,
    duration_minutes,
    student_count,
    average_rating,
    status,
    badge,
    learning_objectives,
    requirements
) VALUES (
    (SELECT id FROM public.teachers LIMIT 1),
    COALESCE((SELECT id FROM public.categories WHERE slug = 'data-science'), (SELECT id FROM public.categories LIMIT 1)),
    'Python for Data Science',
    'python-for-data-science',
    'Data analysis, manipulation, and visualization with NumPy, Pandas, Matplotlib, and Seaborn.',
    'Learn how to clean, analyze, and visualize complex datasets with the essential Python data science stack. Work with real-world financial, medical, and e-commerce datasets to uncover actionable insights.',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&auto=format&fit=crop&q=80',
    89.99,
    18.99,
    'intermediate',
    2160,
    68900,
    4.8,
    'published',
    'trending',
    ARRAY[]::TEXT[],
    ARRAY['Python', 'Data Science', 'Pandas', 'NumPy', 'Analytics', 'Data Visualization']
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    level = EXCLUDED.level,
    duration_minutes = EXCLUDED.duration_minutes,
    student_count = EXCLUDED.student_count,
    average_rating = EXCLUDED.average_rating,
    status = 'published',
    badge = EXCLUDED.badge,
    learning_objectives = EXCLUDED.learning_objectives,
    updated_at = NOW();

INSERT INTO public.courses (
    instructor_id,
    category_id,
    title,
    slug,
    subtitle,
    description,
    thumbnail_url,
    banner_url,
    price,
    discount_price,
    level,
    duration_minutes,
    student_count,
    average_rating,
    status,
    badge,
    learning_objectives,
    requirements
) VALUES (
    (SELECT id FROM public.teachers LIMIT 1),
    COALESCE((SELECT id FROM public.categories WHERE slug = 'java'), (SELECT id FROM public.categories LIMIT 1)),
    'Complete Java Programming',
    'complete-java-programming',
    'Master Java 21, Object-Oriented Design, Collections Framework, Multithreading, and Lambdas.',
    'Comprehensive course on modern Java from ground up. Learn syntax, data types, control flow, object-oriented design patterns, generics, streams API, and core software engineering practices.',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&auto=format&fit=crop&q=80',
    84.99,
    17.99,
    'beginner',
    2520,
    76500,
    4.8,
    'published',
    'bestseller',
    ARRAY[]::TEXT[],
    ARRAY['Java', 'OOP', 'Backend', 'Collections', 'Streams', 'Programming']
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    level = EXCLUDED.level,
    duration_minutes = EXCLUDED.duration_minutes,
    student_count = EXCLUDED.student_count,
    average_rating = EXCLUDED.average_rating,
    status = 'published',
    badge = EXCLUDED.badge,
    learning_objectives = EXCLUDED.learning_objectives,
    updated_at = NOW();

INSERT INTO public.courses (
    instructor_id,
    category_id,
    title,
    slug,
    subtitle,
    description,
    thumbnail_url,
    banner_url,
    price,
    discount_price,
    level,
    duration_minutes,
    student_count,
    average_rating,
    status,
    badge,
    learning_objectives,
    requirements
) VALUES (
    (SELECT id FROM public.teachers LIMIT 1),
    COALESCE((SELECT id FROM public.categories WHERE slug = 'java'), (SELECT id FROM public.categories LIMIT 1)),
    'Advanced Java Development',
    'advanced-java-development',
    'Spring Boot 3, Microservices, Hibernate / JPA, Kafka messaging, and Docker deployment.',
    'Take your Java skills into enterprise backend engineering. Build production RESTful microservices with Spring Boot, secure them with Spring Security and OAuth2, use Kafka event streaming, and deploy with Docker.',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1600&auto=format&fit=crop&q=80',
    119.99,
    29.99,
    'advanced',
    2100,
    39200,
    4.9,
    'published',
    'trending',
    ARRAY[]::TEXT[],
    ARRAY['Java', 'Spring Boot', 'Microservices', 'Kafka', 'Backend', 'Docker']
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    level = EXCLUDED.level,
    duration_minutes = EXCLUDED.duration_minutes,
    student_count = EXCLUDED.student_count,
    average_rating = EXCLUDED.average_rating,
    status = 'published',
    badge = EXCLUDED.badge,
    learning_objectives = EXCLUDED.learning_objectives,
    updated_at = NOW();

INSERT INTO public.courses (
    instructor_id,
    category_id,
    title,
    slug,
    subtitle,
    description,
    thumbnail_url,
    banner_url,
    price,
    discount_price,
    level,
    duration_minutes,
    student_count,
    average_rating,
    status,
    badge,
    learning_objectives,
    requirements
) VALUES (
    (SELECT id FROM public.teachers LIMIT 1),
    COALESCE((SELECT id FROM public.categories WHERE slug = 'backend-development'), (SELECT id FROM public.categories LIMIT 1)),
    'Complete Node.js Backend Development',
    'complete-nodejs-backend-development',
    'Build scalable REST APIs, GraphQL services, authentication, and database integrations with Node.js.',
    'Comprehensive guide to server-side JavaScript with Node.js. Master asynchronous programming, event loop mechanics, Express.js architecture, MongoDB, PostgreSQL, JWT authentication, caching with Redis, and automated testing.',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&auto=format&fit=crop&q=80',
    89.99,
    19.99,
    'intermediate',
    2040,
    71800,
    4.8,
    'published',
    'bestseller',
    ARRAY[]::TEXT[],
    ARRAY['Node.js', 'Express', 'Backend', 'JavaScript', 'REST API', 'Database']
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    level = EXCLUDED.level,
    duration_minutes = EXCLUDED.duration_minutes,
    student_count = EXCLUDED.student_count,
    average_rating = EXCLUDED.average_rating,
    status = 'published',
    badge = EXCLUDED.badge,
    learning_objectives = EXCLUDED.learning_objectives,
    updated_at = NOW();

INSERT INTO public.courses (
    instructor_id,
    category_id,
    title,
    slug,
    subtitle,
    description,
    thumbnail_url,
    banner_url,
    price,
    discount_price,
    level,
    duration_minutes,
    student_count,
    average_rating,
    status,
    badge,
    learning_objectives,
    requirements
) VALUES (
    (SELECT id FROM public.teachers LIMIT 1),
    COALESCE((SELECT id FROM public.categories WHERE slug = 'backend-development'), (SELECT id FROM public.categories LIMIT 1)),
    'Node.js and Express Masterclass',
    'nodejs-and-express-masterclass',
    'Advanced backend architecture, clean code principles, rate limiting, and microservices in Node.js.',
    'Deep-dive into professional backend architecture. Learn domain-driven design, repository patterns, middleware optimization, file streaming, rate limiting, and security best practices for high-traffic Node.js services.',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&auto=format&fit=crop&q=80',
    94.99,
    21.99,
    'advanced',
    1560,
    31200,
    4.9,
    'published',
    'trending',
    ARRAY[]::TEXT[],
    ARRAY['Node.js', 'Express', 'Microservices', 'Architecture', 'Backend']
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    level = EXCLUDED.level,
    duration_minutes = EXCLUDED.duration_minutes,
    student_count = EXCLUDED.student_count,
    average_rating = EXCLUDED.average_rating,
    status = 'published',
    badge = EXCLUDED.badge,
    learning_objectives = EXCLUDED.learning_objectives,
    updated_at = NOW();

INSERT INTO public.courses (
    instructor_id,
    category_id,
    title,
    slug,
    subtitle,
    description,
    thumbnail_url,
    banner_url,
    price,
    discount_price,
    level,
    duration_minutes,
    student_count,
    average_rating,
    status,
    badge,
    learning_objectives,
    requirements
) VALUES (
    (SELECT id FROM public.teachers LIMIT 1),
    COALESCE((SELECT id FROM public.categories WHERE slug = 'full-stack'), (SELECT id FROM public.categories LIMIT 1)),
    'Full Stack Web Development',
    'full-stack-web-development',
    'HTML, CSS, JavaScript, React, Node.js, Express, PostgreSQL, and AWS full stack engineering.',
    'Become an elite full stack software engineer. Build real-world client-server architectures from the ground up: frontend interfaces in React, backend REST APIs in Express, persistent databases in PostgreSQL, and automated deployment.',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&auto=format&fit=crop&q=80',
    129.99,
    29.99,
    'all_levels',
    3480,
    142000,
    4.9,
    'published',
    'bestseller',
    ARRAY[]::TEXT[],
    ARRAY['Full Stack', 'React', 'Node.js', 'PostgreSQL', 'JavaScript', 'Web Development']
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    level = EXCLUDED.level,
    duration_minutes = EXCLUDED.duration_minutes,
    student_count = EXCLUDED.student_count,
    average_rating = EXCLUDED.average_rating,
    status = 'published',
    badge = EXCLUDED.badge,
    learning_objectives = EXCLUDED.learning_objectives,
    updated_at = NOW();

INSERT INTO public.courses (
    instructor_id,
    category_id,
    title,
    slug,
    subtitle,
    description,
    thumbnail_url,
    banner_url,
    price,
    discount_price,
    level,
    duration_minutes,
    student_count,
    average_rating,
    status,
    badge,
    learning_objectives,
    requirements
) VALUES (
    (SELECT id FROM public.teachers LIMIT 1),
    COALESCE((SELECT id FROM public.categories WHERE slug = 'full-stack'), (SELECT id FROM public.categories LIMIT 1)),
    'MERN Stack Development',
    'mern-stack-development',
    'MongoDB, Express, React, and Node.js: Build full-stack social media and e-commerce platforms.',
    'Master the world''s most popular full-stack JavaScript ecosystem. Build full MERN applications from scratch with JWT auth, image uploads, real-time messaging with WebSockets, and payment gateways.',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&auto=format&fit=crop&q=80',
    99.99,
    19.99,
    'intermediate',
    2640,
    63400,
    4.8,
    'published',
    'trending',
    ARRAY[]::TEXT[],
    ARRAY['Full Stack', 'MERN', 'React', 'Node.js', 'MongoDB', 'Express']
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    level = EXCLUDED.level,
    duration_minutes = EXCLUDED.duration_minutes,
    student_count = EXCLUDED.student_count,
    average_rating = EXCLUDED.average_rating,
    status = 'published',
    badge = EXCLUDED.badge,
    learning_objectives = EXCLUDED.learning_objectives,
    updated_at = NOW();

INSERT INTO public.courses (
    instructor_id,
    category_id,
    title,
    slug,
    subtitle,
    description,
    thumbnail_url,
    banner_url,
    price,
    discount_price,
    level,
    duration_minutes,
    student_count,
    average_rating,
    status,
    badge,
    learning_objectives,
    requirements
) VALUES (
    (SELECT id FROM public.teachers LIMIT 1),
    COALESCE((SELECT id FROM public.categories WHERE slug = 'frontend-development'), (SELECT id FROM public.categories LIMIT 1)),
    'HTML CSS JavaScript Complete Course',
    'html-css-javascript-complete-course',
    'The foundational web development course. Master semantic HTML5, modern CSS Grid/Flexbox, and ES6+ JS.',
    'Start your web development journey right here. Master semantic markup, responsive design principles with Flexbox and Grid, CSS animations, and vanilla JavaScript DOM manipulation.',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1600&auto=format&fit=crop&q=80',
    0,
    0,
    'beginner',
    1200,
    185000,
    4.9,
    'published',
    'free',
    ARRAY[]::TEXT[],
    ARRAY['HTML', 'CSS', 'JavaScript', 'Frontend', 'Beginner', 'Free']
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    level = EXCLUDED.level,
    duration_minutes = EXCLUDED.duration_minutes,
    student_count = EXCLUDED.student_count,
    average_rating = EXCLUDED.average_rating,
    status = 'published',
    badge = EXCLUDED.badge,
    learning_objectives = EXCLUDED.learning_objectives,
    updated_at = NOW();

INSERT INTO public.courses (
    instructor_id,
    category_id,
    title,
    slug,
    subtitle,
    description,
    thumbnail_url,
    banner_url,
    price,
    discount_price,
    level,
    duration_minutes,
    student_count,
    average_rating,
    status,
    badge,
    learning_objectives,
    requirements
) VALUES (
    (SELECT id FROM public.teachers LIMIT 1),
    COALESCE((SELECT id FROM public.categories WHERE slug = 'frontend-development'), (SELECT id FROM public.categories LIMIT 1)),
    'Advanced JavaScript',
    'advanced-javascript',
    'Closures, prototypal inheritance, Event Loop, Memory management, Web Workers, and design patterns.',
    'Deep dive under the hood of the V8 engine and the ECMAScript specification. Understand closures, lexical scoping, call-stack execution contexts, event loop microtasks vs macrotasks, and functional programming.',
    'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=1600&auto=format&fit=crop&q=80',
    79.99,
    17.99,
    'advanced',
    1080,
    42100,
    4.9,
    'published',
    'premium',
    ARRAY[]::TEXT[],
    ARRAY['JavaScript', 'Frontend', 'Advanced', 'V8 Engine', 'Closures']
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    level = EXCLUDED.level,
    duration_minutes = EXCLUDED.duration_minutes,
    student_count = EXCLUDED.student_count,
    average_rating = EXCLUDED.average_rating,
    status = 'published',
    badge = EXCLUDED.badge,
    learning_objectives = EXCLUDED.learning_objectives,
    updated_at = NOW();

INSERT INTO public.courses (
    instructor_id,
    category_id,
    title,
    slug,
    subtitle,
    description,
    thumbnail_url,
    banner_url,
    price,
    discount_price,
    level,
    duration_minutes,
    student_count,
    average_rating,
    status,
    badge,
    learning_objectives,
    requirements
) VALUES (
    (SELECT id FROM public.teachers LIMIT 1),
    COALESCE((SELECT id FROM public.categories WHERE slug = 'data-science'), (SELECT id FROM public.categories LIMIT 1)),
    'Data Science Masterclass',
    'data-science-masterclass',
    'Complete data science pathway: Statistical modeling, hypothesis testing, SQL, and predictive analytics.',
    'Master data science workflows from end to end. Formulate business hypotheses, extract data with SQL, clean messy real-world datasets, perform exploratory data analysis, and train predictive models.',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&auto=format&fit=crop&q=80',
    109.99,
    24.99,
    'intermediate',
    2400,
    52400,
    4.8,
    'published',
    'bestseller',
    ARRAY[]::TEXT[],
    ARRAY['Data Science', 'Python', 'SQL', 'Statistics', 'Machine Learning']
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    level = EXCLUDED.level,
    duration_minutes = EXCLUDED.duration_minutes,
    student_count = EXCLUDED.student_count,
    average_rating = EXCLUDED.average_rating,
    status = 'published',
    badge = EXCLUDED.badge,
    learning_objectives = EXCLUDED.learning_objectives,
    updated_at = NOW();

INSERT INTO public.courses (
    instructor_id,
    category_id,
    title,
    slug,
    subtitle,
    description,
    thumbnail_url,
    banner_url,
    price,
    discount_price,
    level,
    duration_minutes,
    student_count,
    average_rating,
    status,
    badge,
    learning_objectives,
    requirements
) VALUES (
    (SELECT id FROM public.teachers LIMIT 1),
    COALESCE((SELECT id FROM public.categories WHERE slug = 'backend-development'), (SELECT id FROM public.categories LIMIT 1)),
    'SQL and Database Development',
    'sql-and-database-development',
    'Master PostgreSQL and MySQL: Complex joins, window functions, indexing, optimization, and transactions.',
    'SQL is the universal language of data. Learn relational database design, normalization, multi-table joins, subqueries, common table expressions (CTEs), window functions, query execution plans, and performance index tuning.',
    'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1600&auto=format&fit=crop&q=80',
    69.99,
    14.99,
    'all_levels',
    1320,
    67800,
    4.9,
    'published',
    'bestseller',
    ARRAY[]::TEXT[],
    ARRAY['SQL', 'PostgreSQL', 'Database', 'Backend', 'Analytics']
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    level = EXCLUDED.level,
    duration_minutes = EXCLUDED.duration_minutes,
    student_count = EXCLUDED.student_count,
    average_rating = EXCLUDED.average_rating,
    status = 'published',
    badge = EXCLUDED.badge,
    learning_objectives = EXCLUDED.learning_objectives,
    updated_at = NOW();

INSERT INTO public.courses (
    instructor_id,
    category_id,
    title,
    slug,
    subtitle,
    description,
    thumbnail_url,
    banner_url,
    price,
    discount_price,
    level,
    duration_minutes,
    student_count,
    average_rating,
    status,
    badge,
    learning_objectives,
    requirements
) VALUES (
    (SELECT id FROM public.teachers LIMIT 1),
    COALESCE((SELECT id FROM public.categories WHERE slug = 'machine-learning'), (SELECT id FROM public.categories LIMIT 1)),
    'Machine Learning Fundamentals',
    'machine-learning-fundamentals',
    'Supervised & unsupervised algorithms: Linear regression, decision trees, random forests, and k-means.',
    'Understand the theory and code behind fundamental machine learning algorithms. Use Python and Scikit-Learn to build classification and regression models, evaluate performance with cross-validation, and avoid overfitting.',
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1600&auto=format&fit=crop&q=80',
    89.99,
    19.99,
    'beginner',
    1800,
    61200,
    4.8,
    'published',
    'bestseller',
    ARRAY[]::TEXT[],
    ARRAY['Machine Learning', 'Python', 'Scikit-Learn', 'AI', 'Algorithms']
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    level = EXCLUDED.level,
    duration_minutes = EXCLUDED.duration_minutes,
    student_count = EXCLUDED.student_count,
    average_rating = EXCLUDED.average_rating,
    status = 'published',
    badge = EXCLUDED.badge,
    learning_objectives = EXCLUDED.learning_objectives,
    updated_at = NOW();

INSERT INTO public.courses (
    instructor_id,
    category_id,
    title,
    slug,
    subtitle,
    description,
    thumbnail_url,
    banner_url,
    price,
    discount_price,
    level,
    duration_minutes,
    student_count,
    average_rating,
    status,
    badge,
    learning_objectives,
    requirements
) VALUES (
    (SELECT id FROM public.teachers LIMIT 1),
    COALESCE((SELECT id FROM public.categories WHERE slug = 'machine-learning'), (SELECT id FROM public.categories LIMIT 1)),
    'Practical Machine Learning with Python',
    'practical-machine-learning-with-python',
    'Deep Learning, PyTorch, Convolutional Neural Networks, and natural language processing NLP.',
    'Bridge the gap between ML theory and practical production models. Build deep neural networks with PyTorch, image recognition with CNNs, and sentiment classification using transformer language models.',
    'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1600&auto=format&fit=crop&q=80',
    99.99,
    24.99,
    'advanced',
    1920,
    41500,
    4.9,
    'published',
    'trending',
    ARRAY[]::TEXT[],
    ARRAY['Machine Learning', 'PyTorch', 'Deep Learning', 'Python', 'Computer Vision']
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    level = EXCLUDED.level,
    duration_minutes = EXCLUDED.duration_minutes,
    student_count = EXCLUDED.student_count,
    average_rating = EXCLUDED.average_rating,
    status = 'published',
    badge = EXCLUDED.badge,
    learning_objectives = EXCLUDED.learning_objectives,
    updated_at = NOW();

INSERT INTO public.courses (
    instructor_id,
    category_id,
    title,
    slug,
    subtitle,
    description,
    thumbnail_url,
    banner_url,
    price,
    discount_price,
    level,
    duration_minutes,
    student_count,
    average_rating,
    status,
    badge,
    learning_objectives,
    requirements
) VALUES (
    (SELECT id FROM public.teachers LIMIT 1),
    COALESCE((SELECT id FROM public.categories WHERE slug = 'artificial-intelligence'), (SELECT id FROM public.categories LIMIT 1)),
    'Artificial Intelligence Fundamentals',
    'artificial-intelligence-fundamentals',
    'Generative AI, Large Language Models (LLMs), Prompt Engineering, and RAG architectures.',
    'Understand modern Artificial Intelligence and how to build applications on top of generative models. Learn prompt engineering, embeddings, vector databases (Pinecone, pgvector), and Retrieval-Augmented Generation (RAG).',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&auto=format&fit=crop&q=80',
    89.99,
    19.99,
    'all_levels',
    1500,
    89100,
    4.9,
    'published',
    'bestseller',
    ARRAY[]::TEXT[],
    ARRAY['Artificial Intelligence', 'AI', 'LLM', 'Prompt Engineering', 'RAG', 'Generative AI']
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    level = EXCLUDED.level,
    duration_minutes = EXCLUDED.duration_minutes,
    student_count = EXCLUDED.student_count,
    average_rating = EXCLUDED.average_rating,
    status = 'published',
    badge = EXCLUDED.badge,
    learning_objectives = EXCLUDED.learning_objectives,
    updated_at = NOW();

INSERT INTO public.courses (
    instructor_id,
    category_id,
    title,
    slug,
    subtitle,
    description,
    thumbnail_url,
    banner_url,
    price,
    discount_price,
    level,
    duration_minutes,
    student_count,
    average_rating,
    status,
    badge,
    learning_objectives,
    requirements
) VALUES (
    (SELECT id FROM public.teachers LIMIT 1),
    COALESCE((SELECT id FROM public.categories WHERE slug = 'cloud-computing'), (SELECT id FROM public.categories LIMIT 1)),
    'AWS Cloud Practitioner',
    'aws-cloud-practitioner',
    'Pass the AWS Certified Cloud Practitioner (CLF-C02) exam with complete hands-on labs.',
    'Comprehensive preparation course for the AWS Certified Cloud Practitioner exam. Understand cloud computing concepts, AWS global infrastructure, core services (EC2, S3, RDS, Lambda), security, IAM, and billing.',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=80',
    84.99,
    16.99,
    'beginner',
    1200,
    92300,
    4.9,
    'published',
    'bestseller',
    ARRAY[]::TEXT[],
    ARRAY['AWS', 'Cloud Computing', 'Certification', 'DevOps', 'Infrastructure']
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    level = EXCLUDED.level,
    duration_minutes = EXCLUDED.duration_minutes,
    student_count = EXCLUDED.student_count,
    average_rating = EXCLUDED.average_rating,
    status = 'published',
    badge = EXCLUDED.badge,
    learning_objectives = EXCLUDED.learning_objectives,
    updated_at = NOW();

INSERT INTO public.courses (
    instructor_id,
    category_id,
    title,
    slug,
    subtitle,
    description,
    thumbnail_url,
    banner_url,
    price,
    discount_price,
    level,
    duration_minutes,
    student_count,
    average_rating,
    status,
    badge,
    learning_objectives,
    requirements
) VALUES (
    (SELECT id FROM public.teachers LIMIT 1),
    COALESCE((SELECT id FROM public.categories WHERE slug = 'cloud-computing'), (SELECT id FROM public.categories LIMIT 1)),
    'AWS Developer Essentials',
    'aws-developer-essentials',
    'Serverless architectures: AWS Lambda, API Gateway, DynamoDB, SQS, SNS, and CDK infrastructure as code.',
    'Build high-throughput, event-driven serverless backends on AWS. Learn how to write Lambda functions in TypeScript/Node, design DynamoDB single-table schemas, manage asynchronous task queues with SQS, and deploy with AWS CDK.',
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1600&auto=format&fit=crop&q=80',
    99.99,
    22.99,
    'intermediate',
    1680,
    38100,
    4.8,
    'published',
    'trending',
    ARRAY[]::TEXT[],
    ARRAY['AWS', 'Serverless', 'Lambda', 'DynamoDB', 'Cloud Computing']
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    level = EXCLUDED.level,
    duration_minutes = EXCLUDED.duration_minutes,
    student_count = EXCLUDED.student_count,
    average_rating = EXCLUDED.average_rating,
    status = 'published',
    badge = EXCLUDED.badge,
    learning_objectives = EXCLUDED.learning_objectives,
    updated_at = NOW();

INSERT INTO public.courses (
    instructor_id,
    category_id,
    title,
    slug,
    subtitle,
    description,
    thumbnail_url,
    banner_url,
    price,
    discount_price,
    level,
    duration_minutes,
    student_count,
    average_rating,
    status,
    badge,
    learning_objectives,
    requirements
) VALUES (
    (SELECT id FROM public.teachers LIMIT 1),
    COALESCE((SELECT id FROM public.categories WHERE slug = 'cyber-security'), (SELECT id FROM public.categories LIMIT 1)),
    'Cyber Security Fundamentals',
    'cyber-security-fundamentals',
    'Network defense, vulnerability assessments, public key cryptography, and threat mitigation.',
    'Protect modern networks and digital infrastructures from cyber threats. Learn OSI security layers, port scanning, firewalls, packet analysis with Wireshark, asymmetric cryptography (RSA, ECC), and SOC defense operations.',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&auto=format&fit=crop&q=80',
    89.99,
    19.99,
    'beginner',
    1560,
    58400,
    4.8,
    'published',
    'bestseller',
    ARRAY[]::TEXT[],
    ARRAY['Cyber Security', 'Network Security', 'Cryptography', 'Ethical Hacking']
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    level = EXCLUDED.level,
    duration_minutes = EXCLUDED.duration_minutes,
    student_count = EXCLUDED.student_count,
    average_rating = EXCLUDED.average_rating,
    status = 'published',
    badge = EXCLUDED.badge,
    learning_objectives = EXCLUDED.learning_objectives,
    updated_at = NOW();

INSERT INTO public.courses (
    instructor_id,
    category_id,
    title,
    slug,
    subtitle,
    description,
    thumbnail_url,
    banner_url,
    price,
    discount_price,
    level,
    duration_minutes,
    student_count,
    average_rating,
    status,
    badge,
    learning_objectives,
    requirements
) VALUES (
    (SELECT id FROM public.teachers LIMIT 1),
    COALESCE((SELECT id FROM public.categories WHERE slug = 'cyber-security'), (SELECT id FROM public.categories LIMIT 1)),
    'Ethical Hacking Fundamentals',
    'ethical-hacking-fundamentals',
    'Penetration testing with Kali Linux, Metasploit, web application security (OWASP Top 10).',
    'Learn ethical hacking from a professional penetration tester. Set up a secure lab in VirtualBox with Kali Linux, test web applications for SQL injection and XSS vulnerabilities, exploit buffer overflows, and write executive remediation reports.',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1600&auto=format&fit=crop&q=80',
    109.99,
    24.99,
    'intermediate',
    2160,
    72100,
    4.9,
    'published',
    'trending',
    ARRAY[]::TEXT[],
    ARRAY['Cyber Security', 'Ethical Hacking', 'Penetration Testing', 'Kali Linux', 'OWASP']
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    level = EXCLUDED.level,
    duration_minutes = EXCLUDED.duration_minutes,
    student_count = EXCLUDED.student_count,
    average_rating = EXCLUDED.average_rating,
    status = 'published',
    badge = EXCLUDED.badge,
    learning_objectives = EXCLUDED.learning_objectives,
    updated_at = NOW();

INSERT INTO public.courses (
    instructor_id,
    category_id,
    title,
    slug,
    subtitle,
    description,
    thumbnail_url,
    banner_url,
    price,
    discount_price,
    level,
    duration_minutes,
    student_count,
    average_rating,
    status,
    badge,
    learning_objectives,
    requirements
) VALUES (
    (SELECT id FROM public.teachers LIMIT 1),
    COALESCE((SELECT id FROM public.categories WHERE slug = 'ui-ux-design'), (SELECT id FROM public.categories LIMIT 1)),
    'UI/UX Design Masterclass',
    'ui-ux-design-masterclass',
    'User research, wireframing, usability testing, mobile UX design, and conversion rate optimization.',
    'Design software products people love to use. Learn how to conduct user interviews, create personas, design high-converting wireframes, run A/B usability experiments, and apply modern UI aesthetics.',
    'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1600&auto=format&fit=crop&q=80',
    89.99,
    18.99,
    'all_levels',
    1800,
    78900,
    4.9,
    'published',
    'bestseller',
    ARRAY[]::TEXT[],
    ARRAY['UI/UX Design', 'Product Design', 'User Research', 'Wireframing', 'Figma']
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    level = EXCLUDED.level,
    duration_minutes = EXCLUDED.duration_minutes,
    student_count = EXCLUDED.student_count,
    average_rating = EXCLUDED.average_rating,
    status = 'published',
    badge = EXCLUDED.badge,
    learning_objectives = EXCLUDED.learning_objectives,
    updated_at = NOW();

INSERT INTO public.courses (
    instructor_id,
    category_id,
    title,
    slug,
    subtitle,
    description,
    thumbnail_url,
    banner_url,
    price,
    discount_price,
    level,
    duration_minutes,
    student_count,
    average_rating,
    status,
    badge,
    learning_objectives,
    requirements
) VALUES (
    (SELECT id FROM public.teachers LIMIT 1),
    COALESCE((SELECT id FROM public.categories WHERE slug = 'ui-ux-design'), (SELECT id FROM public.categories LIMIT 1)),
    'Figma Complete Course',
    'figma-complete-course',
    'Master Auto Layout 5.0, design tokens, component variants, variables, and interactive prototypes.',
    'The definitive Figma masterclass for UI/UX designers. Build a scalable enterprise design system with nested auto layouts, reusable component properties, dark mode color variables, and micro-interaction prototypes.',
    'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1600&auto=format&fit=crop&q=80',
    79.99,
    14.99,
    'beginner',
    1440,
    64300,
    4.9,
    'published',
    'trending',
    ARRAY[]::TEXT[],
    ARRAY['Figma', 'UI/UX Design', 'Design Systems', 'Auto Layout', 'Prototyping']
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    level = EXCLUDED.level,
    duration_minutes = EXCLUDED.duration_minutes,
    student_count = EXCLUDED.student_count,
    average_rating = EXCLUDED.average_rating,
    status = 'published',
    badge = EXCLUDED.badge,
    learning_objectives = EXCLUDED.learning_objectives,
    updated_at = NOW();

INSERT INTO public.courses (
    instructor_id,
    category_id,
    title,
    slug,
    subtitle,
    description,
    thumbnail_url,
    banner_url,
    price,
    discount_price,
    level,
    duration_minutes,
    student_count,
    average_rating,
    status,
    badge,
    learning_objectives,
    requirements
) VALUES (
    (SELECT id FROM public.teachers LIMIT 1),
    COALESCE((SELECT id FROM public.categories WHERE slug = 'mobile-development'), (SELECT id FROM public.categories LIMIT 1)),
    'Flutter Mobile App Development',
    'flutter-mobile-app-development',
    'Build cross-platform iOS and Android apps with Flutter, Dart, Riverpod, and Firebase.',
    'Learn how to build beautiful, natively compiled mobile apps from a single codebase with Google Flutter and Dart. Build full projects: chat applications, e-commerce stores, and Google Maps integration.',
    'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1600&auto=format&fit=crop&q=80',
    94.99,
    19.99,
    'all_levels',
    2280,
    51200,
    4.8,
    'published',
    'bestseller',
    ARRAY[]::TEXT[],
    ARRAY['Flutter', 'Mobile Development', 'Dart', 'iOS', 'Android', 'Cross Platform']
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    level = EXCLUDED.level,
    duration_minutes = EXCLUDED.duration_minutes,
    student_count = EXCLUDED.student_count,
    average_rating = EXCLUDED.average_rating,
    status = 'published',
    badge = EXCLUDED.badge,
    learning_objectives = EXCLUDED.learning_objectives,
    updated_at = NOW();

INSERT INTO public.courses (
    instructor_id,
    category_id,
    title,
    slug,
    subtitle,
    description,
    thumbnail_url,
    banner_url,
    price,
    discount_price,
    level,
    duration_minutes,
    student_count,
    average_rating,
    status,
    badge,
    learning_objectives,
    requirements
) VALUES (
    (SELECT id FROM public.teachers LIMIT 1),
    COALESCE((SELECT id FROM public.categories WHERE slug = 'mobile-development'), (SELECT id FROM public.categories LIMIT 1)),
    'Android Development',
    'android-development',
    'Modern Android app development with Kotlin, Jetpack Compose, Coroutines, and Room DB.',
    'Build high-performance native Android apps using official Google best practices. Learn Kotlin, declarative UI with Jetpack Compose, MVVM architecture, Retrofit for REST APIs, and publish to the Google Play Store.',
    'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=1600&auto=format&fit=crop&q=80',
    89.99,
    18.99,
    'intermediate',
    2040,
    43200,
    4.8,
    'published',
    'trending',
    ARRAY[]::TEXT[],
    ARRAY['Android', 'Kotlin', 'Jetpack Compose', 'Mobile Development', 'Google Play']
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    level = EXCLUDED.level,
    duration_minutes = EXCLUDED.duration_minutes,
    student_count = EXCLUDED.student_count,
    average_rating = EXCLUDED.average_rating,
    status = 'published',
    badge = EXCLUDED.badge,
    learning_objectives = EXCLUDED.learning_objectives,
    updated_at = NOW();

INSERT INTO public.courses (
    instructor_id,
    category_id,
    title,
    slug,
    subtitle,
    description,
    thumbnail_url,
    banner_url,
    price,
    discount_price,
    level,
    duration_minutes,
    student_count,
    average_rating,
    status,
    badge,
    learning_objectives,
    requirements
) VALUES (
    (SELECT id FROM public.teachers LIMIT 1),
    COALESCE((SELECT id FROM public.categories WHERE slug = 'marketing'), (SELECT id FROM public.categories LIMIT 1)),
    'Digital Marketing Masterclass',
    'digital-marketing-masterclass',
    'SEO, Google Ads, Content Marketing, Email Funnels, and Social Media growth hacking.',
    'Drive real traffic, leads, and sales for any business. Learn how to rank #1 on Google with Search Engine Optimization (SEO), set up profitable Google Search & Display ad campaigns, and build automated email sales funnels.',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&auto=format&fit=crop&q=80',
    79.99,
    14.99,
    'all_levels',
    1560,
    83400,
    4.8,
    'published',
    'bestseller',
    ARRAY[]::TEXT[],
    ARRAY['Digital Marketing', 'Marketing', 'SEO', 'Google Ads', 'Content Marketing']
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    level = EXCLUDED.level,
    duration_minutes = EXCLUDED.duration_minutes,
    student_count = EXCLUDED.student_count,
    average_rating = EXCLUDED.average_rating,
    status = 'published',
    badge = EXCLUDED.badge,
    learning_objectives = EXCLUDED.learning_objectives,
    updated_at = NOW();

INSERT INTO public.courses (
    instructor_id,
    category_id,
    title,
    slug,
    subtitle,
    description,
    thumbnail_url,
    banner_url,
    price,
    discount_price,
    level,
    duration_minutes,
    student_count,
    average_rating,
    status,
    badge,
    learning_objectives,
    requirements
) VALUES (
    (SELECT id FROM public.teachers LIMIT 1),
    COALESCE((SELECT id FROM public.categories WHERE slug = 'marketing'), (SELECT id FROM public.categories LIMIT 1)),
    'Social Media Marketing',
    'social-media-marketing',
    'Instagram, TikTok, LinkedIn, YouTube, and viral content strategies for brands and creators.',
    'Grow a dedicated audience and turn followers into paying customers across Instagram, TikTok, LinkedIn, and YouTube. Learn algorithm optimization, short-form video production, influencer collaborations, and analytics.',
    'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1600&auto=format&fit=crop&q=80',
    69.99,
    14.99,
    'beginner',
    1080,
    47200,
    4.7,
    'published',
    'trending',
    ARRAY[]::TEXT[],
    ARRAY['Social Media', 'Marketing', 'Instagram', 'TikTok', 'Branding']
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    level = EXCLUDED.level,
    duration_minutes = EXCLUDED.duration_minutes,
    student_count = EXCLUDED.student_count,
    average_rating = EXCLUDED.average_rating,
    status = 'published',
    badge = EXCLUDED.badge,
    learning_objectives = EXCLUDED.learning_objectives,
    updated_at = NOW();

INSERT INTO public.courses (
    instructor_id,
    category_id,
    title,
    slug,
    subtitle,
    description,
    thumbnail_url,
    banner_url,
    price,
    discount_price,
    level,
    duration_minutes,
    student_count,
    average_rating,
    status,
    badge,
    learning_objectives,
    requirements
) VALUES (
    (SELECT id FROM public.teachers LIMIT 1),
    COALESCE((SELECT id FROM public.categories WHERE slug = 'finance'), (SELECT id FROM public.categories LIMIT 1)),
    'Financial Management',
    'financial-management',
    'Corporate finance, balance sheet analysis, cash flow modeling, budgeting, and capital valuation.',
    'Gain commanding mastery of corporate finance and financial accounting. Learn how to interpret income statements, balance sheets, and cash flow statements, conduct discounted cash flow (DCF) valuation, and manage enterprise budgets.',
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1600&auto=format&fit=crop&q=80',
    99.99,
    22.99,
    'intermediate',
    1680,
    39800,
    4.9,
    'published',
    'bestseller',
    ARRAY[]::TEXT[],
    ARRAY['Finance', 'Accounting', 'Financial Modeling', 'Business', 'Valuation']
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    level = EXCLUDED.level,
    duration_minutes = EXCLUDED.duration_minutes,
    student_count = EXCLUDED.student_count,
    average_rating = EXCLUDED.average_rating,
    status = 'published',
    badge = EXCLUDED.badge,
    learning_objectives = EXCLUDED.learning_objectives,
    updated_at = NOW();

INSERT INTO public.courses (
    instructor_id,
    category_id,
    title,
    slug,
    subtitle,
    description,
    thumbnail_url,
    banner_url,
    price,
    discount_price,
    level,
    duration_minutes,
    student_count,
    average_rating,
    status,
    badge,
    learning_objectives,
    requirements
) VALUES (
    (SELECT id FROM public.teachers LIMIT 1),
    COALESCE((SELECT id FROM public.categories WHERE slug = 'business'), (SELECT id FROM public.categories LIMIT 1)),
    'Business Analytics',
    'business-analytics',
    'Data-driven decision making: Tableau dashboards, advanced Excel, power BI, and KPI tracking.',
    'Transform raw business data into actionable executive insights. Master business intelligence tooling: create executive Tableau dashboards, automated Excel reports, customer cohort analysis, and predictive metric forecasts.',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&auto=format&fit=crop&q=80',
    84.99,
    17.99,
    'all_levels',
    1440,
    44100,
    4.8,
    'published',
    'trending',
    ARRAY[]::TEXT[],
    ARRAY['Business', 'Analytics', 'Tableau', 'Excel', 'BI', 'Dashboards']
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    level = EXCLUDED.level,
    duration_minutes = EXCLUDED.duration_minutes,
    student_count = EXCLUDED.student_count,
    average_rating = EXCLUDED.average_rating,
    status = 'published',
    badge = EXCLUDED.badge,
    learning_objectives = EXCLUDED.learning_objectives,
    updated_at = NOW();

INSERT INTO public.courses (
    instructor_id,
    category_id,
    title,
    slug,
    subtitle,
    description,
    thumbnail_url,
    banner_url,
    price,
    discount_price,
    level,
    duration_minutes,
    student_count,
    average_rating,
    status,
    badge,
    learning_objectives,
    requirements
) VALUES (
    (SELECT id FROM public.teachers LIMIT 1),
    COALESCE((SELECT id FROM public.categories WHERE slug = 'communication-skills'), (SELECT id FROM public.categories LIMIT 1)),
    'Communication Skills',
    'communication-skills',
    'Executive presence, public speaking, persuasive negotiation, and cross-functional leadership.',
    'Elevate your professional career by mastering persuasive communication. Learn how to present complex technical ideas clearly to executives, resolve team conflicts, lead negotiations, and master active listening.',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1600&auto=format&fit=crop&q=80',
    0,
    0,
    'all_levels',
    600,
    96200,
    4.9,
    'published',
    'free',
    ARRAY[]::TEXT[],
    ARRAY['Communication', 'Leadership', 'Public Speaking', 'Negotiation', 'Free']
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    level = EXCLUDED.level,
    duration_minutes = EXCLUDED.duration_minutes,
    student_count = EXCLUDED.student_count,
    average_rating = EXCLUDED.average_rating,
    status = 'published',
    badge = EXCLUDED.badge,
    learning_objectives = EXCLUDED.learning_objectives,
    updated_at = NOW();

INSERT INTO public.courses (
    instructor_id,
    category_id,
    title,
    slug,
    subtitle,
    description,
    thumbnail_url,
    banner_url,
    price,
    discount_price,
    level,
    duration_minutes,
    student_count,
    average_rating,
    status,
    badge,
    learning_objectives,
    requirements
) VALUES (
    (SELECT id FROM public.teachers LIMIT 1),
    COALESCE((SELECT id FROM public.categories WHERE slug = 'interview-preparation'), (SELECT id FROM public.categories LIMIT 1)),
    'Interview Preparation',
    'interview-preparation',
    'Ace technical coding interviews: Data structures, algorithms, system design, and behavioral questions.',
    'The ultimate tech interview playbook. Master the 75 most common LeetCode patterns (Arrays, Two Pointers, Trees, Graphs, Dynamic Programming), learn scalable system design, and perfect the STAR behavioral interview format.',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1600&auto=format&fit=crop&q=80',
    99.99,
    24.99,
    'intermediate',
    2160,
    81900,
    4.9,
    'published',
    'bestseller',
    ARRAY[]::TEXT[],
    ARRAY['Interview Preparation', 'Algorithms', 'Data Structures', 'System Design', 'Career']
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    level = EXCLUDED.level,
    duration_minutes = EXCLUDED.duration_minutes,
    student_count = EXCLUDED.student_count,
    average_rating = EXCLUDED.average_rating,
    status = 'published',
    badge = EXCLUDED.badge,
    learning_objectives = EXCLUDED.learning_objectives,
    updated_at = NOW();

INSERT INTO public.courses (
    instructor_id,
    category_id,
    title,
    slug,
    subtitle,
    description,
    thumbnail_url,
    banner_url,
    price,
    discount_price,
    level,
    duration_minutes,
    student_count,
    average_rating,
    status,
    badge,
    learning_objectives,
    requirements
) VALUES (
    (SELECT id FROM public.teachers LIMIT 1),
    COALESCE((SELECT id FROM public.categories WHERE slug = 'web-development'), (SELECT id FROM public.categories LIMIT 1)),
    'Git and GitHub',
    'git-and-github',
    'Version control mastery: Branching strategies, rebase, merge conflicts, pull requests, and GitHub Actions.',
    'Never fear merge conflicts again. Master Git from foundational commands (`add`, `commit`, `push`, `pull`) to advanced workflows: interactive rebase, cherry-pick, reflog recovery, pull request code reviews, and automated CI with GitHub Actions.',
    'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?w=1600&auto=format&fit=crop&q=80',
    0,
    0,
    'all_levels',
    720,
    134000,
    4.9,
    'published',
    'free',
    ARRAY[]::TEXT[],
    ARRAY['Git', 'GitHub', 'DevOps', 'Version Control', 'Collaboration', 'Free']
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    level = EXCLUDED.level,
    duration_minutes = EXCLUDED.duration_minutes,
    student_count = EXCLUDED.student_count,
    average_rating = EXCLUDED.average_rating,
    status = 'published',
    badge = EXCLUDED.badge,
    learning_objectives = EXCLUDED.learning_objectives,
    updated_at = NOW();

INSERT INTO public.courses (
    instructor_id,
    category_id,
    title,
    slug,
    subtitle,
    description,
    thumbnail_url,
    banner_url,
    price,
    discount_price,
    level,
    duration_minutes,
    student_count,
    average_rating,
    status,
    badge,
    learning_objectives,
    requirements
) VALUES (
    (SELECT id FROM public.teachers LIMIT 1),
    COALESCE((SELECT id FROM public.categories WHERE slug = 'cloud-computing'), (SELECT id FROM public.categories LIMIT 1)),
    'Docker and DevOps Fundamentals',
    'docker-and-devops-fundamentals',
    'Containers, Docker Compose, Kubernetes orchestration, CI/CD pipelines, and cloud deployments.',
    'Containerize any application and deploy it with confidence. Learn Dockerfiles, multi-stage builds, Docker Compose for multi-container microservices, Kubernetes pods and deployments, and automated testing pipelines.',
    'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1600&auto=format&fit=crop&q=80',
    94.99,
    21.99,
    'intermediate',
    1680,
    68400,
    4.9,
    'published',
    'bestseller',
    ARRAY[]::TEXT[],
    ARRAY['Docker', 'DevOps', 'Kubernetes', 'CI/CD', 'Containers', 'Cloud']
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    level = EXCLUDED.level,
    duration_minutes = EXCLUDED.duration_minutes,
    student_count = EXCLUDED.student_count,
    average_rating = EXCLUDED.average_rating,
    status = 'published',
    badge = EXCLUDED.badge,
    learning_objectives = EXCLUDED.learning_objectives,
    updated_at = NOW();

INSERT INTO public.courses (
    instructor_id,
    category_id,
    title,
    slug,
    subtitle,
    description,
    thumbnail_url,
    banner_url,
    price,
    discount_price,
    level,
    duration_minutes,
    student_count,
    average_rating,
    status,
    badge,
    learning_objectives,
    requirements
) VALUES (
    (SELECT id FROM public.teachers LIMIT 1),
    COALESCE((SELECT id FROM public.categories WHERE slug = 'graphic-design'), (SELECT id FROM public.categories LIMIT 1)),
    'Graphic Design Masterclass',
    'graphic-design-masterclass',
    'Photoshop, Illustrator, InDesign, Color Theory, Typography, and Professional Brand Identity Design.',
    'Unleash your creative potential. Learn the core principles of graphic design: color psychology, grid systems, typography pairing, logo creation in Adobe Illustrator, photo retouching in Photoshop, and editorial layout.',
    'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1600&auto=format&fit=crop&q=80',
    79.99,
    16.99,
    'all_levels',
    1560,
    41200,
    4.8,
    'published',
    'trending',
    ARRAY[]::TEXT[],
    ARRAY['Graphic Design', 'Photoshop', 'Illustrator', 'Branding', 'Typography']
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    level = EXCLUDED.level,
    duration_minutes = EXCLUDED.duration_minutes,
    student_count = EXCLUDED.student_count,
    average_rating = EXCLUDED.average_rating,
    status = 'published',
    badge = EXCLUDED.badge,
    learning_objectives = EXCLUDED.learning_objectives,
    updated_at = NOW();

INSERT INTO public.courses (
    instructor_id,
    category_id,
    title,
    slug,
    subtitle,
    description,
    thumbnail_url,
    banner_url,
    price,
    discount_price,
    level,
    duration_minutes,
    student_count,
    average_rating,
    status,
    badge,
    learning_objectives,
    requirements
) VALUES (
    (SELECT id FROM public.teachers LIMIT 1),
    COALESCE((SELECT id FROM public.categories WHERE slug = 'photography'), (SELECT id FROM public.categories LIMIT 1)),
    'Digital Photography Masterclass',
    'digital-photography-masterclass',
    'Master your DSLR or Mirrorless camera: Exposure triangle, lighting, composition, and Lightroom.',
    'Take stunning photographs in any environment. Master the exposure triangle (Aperture, Shutter Speed, ISO), natural and studio lighting techniques, creative composition rules, and professional RAW editing in Adobe Lightroom.',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1600&auto=format&fit=crop&q=80',
    69.99,
    14.99,
    'beginner',
    1080,
    31400,
    4.8,
    'published',
    'trending',
    ARRAY[]::TEXT[],
    ARRAY['Photography', 'Lighting', 'Lightroom', 'Camera', 'Creative']
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    level = EXCLUDED.level,
    duration_minutes = EXCLUDED.duration_minutes,
    student_count = EXCLUDED.student_count,
    average_rating = EXCLUDED.average_rating,
    status = 'published',
    badge = EXCLUDED.badge,
    learning_objectives = EXCLUDED.learning_objectives,
    updated_at = NOW();

INSERT INTO public.courses (
    instructor_id,
    category_id,
    title,
    slug,
    subtitle,
    description,
    thumbnail_url,
    banner_url,
    price,
    discount_price,
    level,
    duration_minutes,
    student_count,
    average_rating,
    status,
    badge,
    learning_objectives,
    requirements
) VALUES (
    (SELECT id FROM public.teachers LIMIT 1),
    COALESCE((SELECT id FROM public.categories WHERE slug = 'music'), (SELECT id FROM public.categories LIMIT 1)),
    'Music Production with Ableton Live',
    'music-production-with-ableton-live',
    'Beatmaking, sound design, audio synthesis, mixing, and mastering in Ableton Live 12.',
    'Produce broadcast-ready electronic, pop, and hip-hop tracks from scratch. Learn audio synthesis, MIDI programming, audio recording, compression, EQ, reverb spatial design, and final mastering.',
    'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1600&auto=format&fit=crop&q=80',
    89.99,
    19.99,
    'all_levels',
    1440,
    28900,
    4.9,
    'published',
    'trending',
    ARRAY[]::TEXT[],
    ARRAY['Music', 'Ableton Live', 'Audio Production', 'Sound Design', 'Mixing']
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    level = EXCLUDED.level,
    duration_minutes = EXCLUDED.duration_minutes,
    student_count = EXCLUDED.student_count,
    average_rating = EXCLUDED.average_rating,
    status = 'published',
    badge = EXCLUDED.badge,
    learning_objectives = EXCLUDED.learning_objectives,
    updated_at = NOW();


-- Migration 038: Seed Learning Paths
-- Migration 038: Seed 20 Initial IT Career Learning Paths
-- Inserts realistic career roadmaps into public.learning_paths and public.learning_path_courses.


INSERT INTO public.learning_paths (
    title, slug, subtitle, description, thumbnail_url, banner_url,
    category, difficulty, estimated_duration, skills, prerequisites,
    career_outcomes, projects, student_count, average_rating, is_published
) VALUES (
    'Full Stack Developer', 'full-stack-developer', 'Master complete end-to-end web engineering from frontend interfaces to backend microservices and databases.', 'This career path equips you with complete full-stack mastery. Learn modern JavaScript, React 19, Node.js, Express, SQL, database design, Docker containerization, REST API design, and deploy production full-stack systems with authentication, payment processing, and cloud CI/CD.', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&auto=format&fit=crop&q=80',
    'Full Stack', 'all_levels', '6-8 months (12 hrs/wk)', ARRAY['HTML5/CSS3', 'JavaScript ES6+', 'React 19', 'Node.js', 'Express', 'SQL & PostgreSQL', 'Docker', 'REST APIs', 'System Architecture'], ARRAY['No prior programming experience required', 'Basic computer literacy and curiosity'],
    ARRAY['Full Stack Software Engineer', 'Junior/Mid-level Full Stack Developer', 'Web Applications Engineer', 'Technical Founder'], ARRAY['Responsive Portfolio & CSS Design System', 'Interactive E-Commerce Web Application', 'Full Stack Social Dashboard with Auth & Real-Time WebSockets', 'Production SaaS Billing & Microservices Platform'], 14280, 4.9, TRUE
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    category = EXCLUDED.category,
    difficulty = EXCLUDED.difficulty,
    estimated_duration = EXCLUDED.estimated_duration,
    skills = EXCLUDED.skills,
    prerequisites = EXCLUDED.prerequisites,
    career_outcomes = EXCLUDED.career_outcomes,
    projects = EXCLUDED.projects,
    updated_at = NOW();

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'full-stack-developer'),
    'c012-webdev-bootcamp', 'Stage 1: Web Fundamentals & Modern JavaScript', 1, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'full-stack-developer'),
    'c001-react-complete', 'Stage 2: Frontend Engineering with React 19', 2, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'full-stack-developer'),
    'c002-react-advanced', 'Stage 3: Advanced React State & Architecture', 3, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'full-stack-developer'),
    'c009-node-mastery', 'Stage 4: Server-Side APIs with Node.js & Express', 4, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'full-stack-developer'),
    'c036-sql-database', 'Stage 5: Relational Database Modeling with SQL', 5, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'full-stack-developer'),
    'c010-mern-stack', 'Stage 6: End-to-End MERN Application Engineering', 6, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'full-stack-developer'),
    'c011-fullstack-dev', 'Stage 7: Production Full-Stack Architecture', 7, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'full-stack-developer'),
    'c033-interview-prep', 'Stage 8: Tech Interview Preparation & Algorithms', 8, TRUE
);

INSERT INTO public.learning_paths (
    title, slug, subtitle, description, thumbnail_url, banner_url,
    category, difficulty, estimated_duration, skills, prerequisites,
    career_outcomes, projects, student_count, average_rating, is_published
) VALUES (
    'Frontend Developer', 'frontend-developer', 'Craft pixel-perfect, accessible, and ultra-responsive web interfaces with modern React and CSS.', 'Become an expert Frontend Engineer. Specialize in cutting-edge user interfaces, accessibility (a11y), responsive design systems, animations, React architecture, state management, and modern developer tooling.', 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1600&auto=format&fit=crop&q=80',
    'Frontend Development', 'beginner', '4-5 months (10 hrs/wk)', ARRAY['HTML5', 'CSS3 / Tailwind CSS', 'Modern JavaScript', 'React 19', 'Figma to Code', 'Web Performance', 'State Management'], ARRAY['No prior programming needed'],
    ARRAY['Frontend Software Engineer', 'React Developer', 'UI Developer', 'Web Developer'], ARRAY['Interactive Product Landing Page with Animations', 'Dynamic SaaS Analytics Dashboard', 'Streaming Media Browser with Video Player Integration'], 11250, 4.85, TRUE
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    category = EXCLUDED.category,
    difficulty = EXCLUDED.difficulty,
    estimated_duration = EXCLUDED.estimated_duration,
    skills = EXCLUDED.skills,
    prerequisites = EXCLUDED.prerequisites,
    career_outcomes = EXCLUDED.career_outcomes,
    projects = EXCLUDED.projects,
    updated_at = NOW();

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'frontend-developer'),
    'c012-webdev-bootcamp', 'Stage 1: HTML, CSS & Modern JavaScript Essentials', 1, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'frontend-developer'),
    'c003-react-beginners', 'Stage 2: Hands-on React Practice', 2, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'frontend-developer'),
    'c001-react-complete', 'Stage 3: Comprehensive React 19 Mastery', 3, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'frontend-developer'),
    'c002-react-advanced', 'Stage 4: Advanced Architecture & State Optimization', 4, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'frontend-developer'),
    'c022-uiux-masterclass', 'Stage 5: UI/UX Principles & Figma Implementation', 5, TRUE
);

INSERT INTO public.learning_paths (
    title, slug, subtitle, description, thumbnail_url, banner_url,
    category, difficulty, estimated_duration, skills, prerequisites,
    career_outcomes, projects, student_count, average_rating, is_published
) VALUES (
    'Backend Developer', 'backend-developer', 'Architect scalable APIs, high-throughput microservices, secure databases, and cloud infrastructures.', 'Master server-side engineering. Build robust backends capable of handling millions of requests with Node.js, Python, PostgreSQL, Redis caching, microservices, containerization, and distributed system patterns.', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&auto=format&fit=crop&q=80',
    'Backend Development', 'intermediate', '5-7 months (12 hrs/wk)', ARRAY['Node.js', 'Express', 'Python', 'PostgreSQL', 'System Design', 'Docker & Kubernetes', 'REST & GraphQL', 'Microservices'], ARRAY['Basic understanding of programming logic'],
    ARRAY['Backend Engineer', 'API Engineer', 'Server Architect', 'Distributed Systems Engineer'], ARRAY['Secure Multi-Tenant Auth & Role-Based Access Control API', 'High-Concurrency Real-Time Notification & Messaging Service', 'Distributed Rate Limiter and Caching Layer with Redis'], 9840, 4.88, TRUE
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    category = EXCLUDED.category,
    difficulty = EXCLUDED.difficulty,
    estimated_duration = EXCLUDED.estimated_duration,
    skills = EXCLUDED.skills,
    prerequisites = EXCLUDED.prerequisites,
    career_outcomes = EXCLUDED.career_outcomes,
    projects = EXCLUDED.projects,
    updated_at = NOW();

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'backend-developer'),
    'c009-node-mastery', 'Stage 1: Production Server Architecture with Node.js', 1, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'backend-developer'),
    'c036-sql-database', 'Stage 2: Relational Databases & Query Engineering', 2, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'backend-developer'),
    'c019-docker-k8s', 'Stage 3: Containerization with Docker & Kubernetes', 3, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'backend-developer'),
    'c034-system-design', 'Stage 4: High-Scale Distributed System Design', 4, TRUE
);

INSERT INTO public.learning_paths (
    title, slug, subtitle, description, thumbnail_url, banner_url,
    category, difficulty, estimated_duration, skills, prerequisites,
    career_outcomes, projects, student_count, average_rating, is_published
) VALUES (
    'Java Developer', 'java-developer', 'Enterprise Java programming, Spring Boot microservices, high-performance computing, and DSA.', 'Launch an enterprise engineering career with Java. Master Core Java, object-oriented design patterns, Spring Boot, Spring Security, Hibernate ORM, microservices architecture, and technical interview algorithms.', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&auto=format&fit=crop&q=80',
    'Java', 'intermediate', '6-8 months (12 hrs/wk)', ARRAY['Java 21', 'Spring Boot', 'Spring Cloud', 'Hibernate / JPA', 'Data Structures & Algorithms', 'Microservices', 'PostgreSQL'], ARRAY['Basic understanding of programming concepts'],
    ARRAY['Java Enterprise Developer', 'Spring Boot Microservices Engineer', 'Software Engineer at Top Tech / Financial Institutions'], ARRAY['Enterprise Banking Transaction Service with Spring Boot', 'High-Throughput Order Management Microservice', 'Algorithmic Trading & Analytics Processing Pipeline'], 8920, 4.82, TRUE
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    category = EXCLUDED.category,
    difficulty = EXCLUDED.difficulty,
    estimated_duration = EXCLUDED.estimated_duration,
    skills = EXCLUDED.skills,
    prerequisites = EXCLUDED.prerequisites,
    career_outcomes = EXCLUDED.career_outcomes,
    projects = EXCLUDED.projects,
    updated_at = NOW();

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'java-developer'),
    'c008-java-dsa', 'Stage 1: Java Data Structures & Algorithms', 1, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'java-developer'),
    'c007-java-enterprise', 'Stage 2: Enterprise Spring Boot & Microservices', 2, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'java-developer'),
    'c036-sql-database', 'Stage 3: Database Engineering with SQL & PostgreSQL', 3, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'java-developer'),
    'c034-system-design', 'Stage 4: Large-Scale System Architecture', 4, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'java-developer'),
    'c033-interview-prep', 'Stage 5: Technical Coding Interviews', 5, TRUE
);

INSERT INTO public.learning_paths (
    title, slug, subtitle, description, thumbnail_url, banner_url,
    category, difficulty, estimated_duration, skills, prerequisites,
    career_outcomes, projects, student_count, average_rating, is_published
) VALUES (
    'Python Developer', 'python-developer', 'From core scripting and web automation to data science, APIs, and machine learning pipelines.', 'Learn the world''s most popular language. Master Python 3 from fundamental syntax to building web applications, automation bots, web scrapers, data processing pipelines, and introductory AI models.', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1600&auto=format&fit=crop&q=80',
    'Python', 'beginner', '4-6 months (10 hrs/wk)', ARRAY['Python 3', 'Object-Oriented Python', 'Web Automation', 'Pandas & NumPy', 'REST APIs', 'Data Scraping', 'Scripting'], ARRAY['No prior programming knowledge required'],
    ARRAY['Python Software Developer', 'Automation Engineer', 'Backend Python Engineer', 'Data Specialist'], ARRAY['Automated Web Scraper & Alerting Bot', 'Data Analytics & Reporting Dashboard with Pandas', 'Production REST API with Authentication & Database Storage'], 15400, 4.92, TRUE
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    category = EXCLUDED.category,
    difficulty = EXCLUDED.difficulty,
    estimated_duration = EXCLUDED.estimated_duration,
    skills = EXCLUDED.skills,
    prerequisites = EXCLUDED.prerequisites,
    career_outcomes = EXCLUDED.career_outcomes,
    projects = EXCLUDED.projects,
    updated_at = NOW();

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'python-developer'),
    'c004-python-bootcamp', 'Stage 1: Python Fundamentals from Scratch', 1, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'python-developer'),
    'c006-python-automation', 'Stage 2: Real-World Web & Task Automation', 2, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'python-developer'),
    'c005-python-ds', 'Stage 3: Python for Data Science & Analysis', 3, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'python-developer'),
    'c014-ml-fundamentals', 'Stage 4: Machine Learning Foundation', 4, TRUE
);

INSERT INTO public.learning_paths (
    title, slug, subtitle, description, thumbnail_url, banner_url,
    category, difficulty, estimated_duration, skills, prerequisites,
    career_outcomes, projects, student_count, average_rating, is_published
) VALUES (
    'React Developer', 'react-developer', 'Specialized roadmap for modern React 19, Next.js mental models, custom hooks, and mobile React Native.', 'Master the React ecosystem end-to-end. Become a sought-after React developer capable of building lightning-fast web and mobile apps with React 19, Redux Toolkit, React Router v7, and React Native.', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1600&auto=format&fit=crop&q=80',
    'React', 'all_levels', '5-6 months (10 hrs/wk)', ARRAY['React 19', 'React Hooks', 'Redux Toolkit', 'React Router', 'React Native', 'TypeScript for React', 'SSR & State'], ARRAY['Basic HTML, CSS, and modern JavaScript'],
    ARRAY['Senior React Developer', 'Frontend React Engineer', 'React Native Mobile Developer'], ARRAY['Real-Time Collaborative Productivity App', 'Cross-Platform Mobile App with React Native & Expo', 'High-Performance Dashboard with Complex State & Charts'], 12100, 4.91, TRUE
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    category = EXCLUDED.category,
    difficulty = EXCLUDED.difficulty,
    estimated_duration = EXCLUDED.estimated_duration,
    skills = EXCLUDED.skills,
    prerequisites = EXCLUDED.prerequisites,
    career_outcomes = EXCLUDED.career_outcomes,
    projects = EXCLUDED.projects,
    updated_at = NOW();

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'react-developer'),
    'c012-webdev-bootcamp', 'Stage 1: JavaScript Foundations', 1, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'react-developer'),
    'c001-react-complete', 'Stage 2: Core React 19 Architecture', 2, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'react-developer'),
    'c002-react-advanced', 'Stage 3: Advanced Patterns & Redux Toolkit', 3, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'react-developer'),
    'c024-react-native', 'Stage 4: Cross-Platform Mobile with React Native', 4, TRUE
);

INSERT INTO public.learning_paths (
    title, slug, subtitle, description, thumbnail_url, banner_url,
    category, difficulty, estimated_duration, skills, prerequisites,
    career_outcomes, projects, student_count, average_rating, is_published
) VALUES (
    'JavaScript Developer', 'javascript-developer', 'Deep-dive into the JavaScript runtime, async patterns, V8 engine internals, and full-stack JS frameworks.', 'Become a versatile JavaScript engineer. Understand the JS event loop, closures, prototypes, asynchronous workflows, modern TypeScript, and full-stack JavaScript from frontend React to backend Node.', 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=1600&auto=format&fit=crop&q=80',
    'Web Development', 'beginner', '4-6 months (10 hrs/wk)', ARRAY['Vanilla JavaScript', 'ES6+ to ESNext', 'Node.js', 'React', 'Async/Await', 'Event Loop', 'MERN Stack'], ARRAY['Curiosity to learn web development'],
    ARRAY['JavaScript Engineer', 'Full Stack JavaScript Developer', 'Software Engineer'], ARRAY['Custom Vanilla JavaScript Framework / Component Library', 'Real-Time Chat Application with WebSockets and Node.js', 'Interactive Game Engine in Browser Canvas'], 8900, 4.84, TRUE
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    category = EXCLUDED.category,
    difficulty = EXCLUDED.difficulty,
    estimated_duration = EXCLUDED.estimated_duration,
    skills = EXCLUDED.skills,
    prerequisites = EXCLUDED.prerequisites,
    career_outcomes = EXCLUDED.career_outcomes,
    projects = EXCLUDED.projects,
    updated_at = NOW();

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'javascript-developer'),
    'c012-webdev-bootcamp', 'Stage 1: Core JavaScript & Web Fundamentals', 1, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'javascript-developer'),
    'c001-react-complete', 'Stage 2: Frontend Engineering with React', 2, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'javascript-developer'),
    'c009-node-mastery', 'Stage 3: Server-Side JavaScript with Node.js', 3, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'javascript-developer'),
    'c010-mern-stack', 'Stage 4: Full-Stack JavaScript MERN Synergy', 4, TRUE
);

INSERT INTO public.learning_paths (
    title, slug, subtitle, description, thumbnail_url, banner_url,
    category, difficulty, estimated_duration, skills, prerequisites,
    career_outcomes, projects, student_count, average_rating, is_published
) VALUES (
    'Data Analyst', 'data-analyst', 'Transform raw data into strategic business insights using SQL, Python, Pandas, and interactive dashboards.', 'Launch your career in analytics. Learn to query enterprise databases with advanced SQL, clean and analyze large datasets in Python, create stunning business visualizations, and deliver actionable data-driven reports.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&auto=format&fit=crop&q=80',
    'Data Science', 'beginner', '3-5 months (10 hrs/wk)', ARRAY['SQL', 'PostgreSQL', 'Python', 'Pandas', 'Data Cleaning', 'Data Visualization', 'Business Intelligence'], ARRAY['Basic comfort with numbers and spreadsheets'],
    ARRAY['Data Analyst', 'Business Intelligence Analyst', 'Product Analyst', 'Reporting Specialist'], ARRAY['E-Commerce Customer Retention & Cohort Analysis in SQL', 'Sales Forecasting & Trend Exploration with Pandas', 'Executive Financial Dashboard with Visual Reports'], 7600, 4.87, TRUE
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    category = EXCLUDED.category,
    difficulty = EXCLUDED.difficulty,
    estimated_duration = EXCLUDED.estimated_duration,
    skills = EXCLUDED.skills,
    prerequisites = EXCLUDED.prerequisites,
    career_outcomes = EXCLUDED.career_outcomes,
    projects = EXCLUDED.projects,
    updated_at = NOW();

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'data-analyst'),
    'c004-python-bootcamp', 'Stage 1: Python for Data Analysis', 1, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'data-analyst'),
    'c036-sql-database', 'Stage 2: Enterprise SQL & Relational Databases', 2, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'data-analyst'),
    'c005-python-ds', 'Stage 3: Advanced Data Wrangling with Pandas', 3, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'data-analyst'),
    'c013-ds-masterclass', 'Stage 4: Data Science & Statistical Analysis', 4, TRUE
);

INSERT INTO public.learning_paths (
    title, slug, subtitle, description, thumbnail_url, banner_url,
    category, difficulty, estimated_duration, skills, prerequisites,
    career_outcomes, projects, student_count, average_rating, is_published
) VALUES (
    'Data Scientist', 'data-scientist', 'Advanced statistical modeling, predictive algorithms, machine learning workflows, and deep insights.', 'Combine statistical rigor with algorithmic power. Master exploratory data analysis, feature engineering, regression, classification, clustering, model evaluation, and production inference deployment.', 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1600&auto=format&fit=crop&q=80',
    'Data Science', 'intermediate', '6-8 months (12 hrs/wk)', ARRAY['Python', 'Pandas', 'Scikit-Learn', 'Machine Learning', 'Statistical Modeling', 'SQL', 'Feature Engineering'], ARRAY['Basic algebra and Python fundamentals'],
    ARRAY['Data Scientist', 'Applied Scientist', 'Quantitative Analyst', 'Machine Learning Associate'], ARRAY['Customer Churn Prediction Engine with Model Evaluation', 'Real Estate Valuation Predictor Using Regression Techniques', 'Unsupervised Market Segmentation & Clustering Model'], 8200, 4.89, TRUE
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    category = EXCLUDED.category,
    difficulty = EXCLUDED.difficulty,
    estimated_duration = EXCLUDED.estimated_duration,
    skills = EXCLUDED.skills,
    prerequisites = EXCLUDED.prerequisites,
    career_outcomes = EXCLUDED.career_outcomes,
    projects = EXCLUDED.projects,
    updated_at = NOW();

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'data-scientist'),
    'c005-python-ds', 'Stage 1: Python for Data Science', 1, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'data-scientist'),
    'c013-ds-masterclass', 'Stage 2: Comprehensive Data Science Mastery', 2, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'data-scientist'),
    'c014-ml-fundamentals', 'Stage 3: Core Machine Learning Algorithms', 3, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'data-scientist'),
    'c015-ml-python', 'Stage 4: Practical Machine Learning with Python', 4, TRUE
);

INSERT INTO public.learning_paths (
    title, slug, subtitle, description, thumbnail_url, banner_url,
    category, difficulty, estimated_duration, skills, prerequisites,
    career_outcomes, projects, student_count, average_rating, is_published
) VALUES (
    'AI / Machine Learning Engineer', 'ai-machine-learning-engineer', 'Train deep neural networks, deploy computer vision and NLP models, and engineer production ML pipelines.', 'Become a Machine Learning and Artificial Intelligence Engineer. Master deep learning architectures, convolutional neural networks, transformer models, model serving, latency optimization, and MLOps.', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&auto=format&fit=crop&q=80',
    'Artificial Intelligence', 'advanced', '7-9 months (14 hrs/wk)', ARRAY['Deep Learning', 'PyTorch', 'TensorFlow', 'Neural Networks', 'NLP', 'Computer Vision', 'MLOps', 'Model Deployment'], ARRAY['Good grasp of Python and linear algebra basics'],
    ARRAY['Machine Learning Engineer', 'AI Researcher / Engineer', 'Deep Learning Specialist', 'Algorithm Engineer'], ARRAY['Image Recognition & Object Detection with CNNs', 'Sentiment & Natural Language Classifier with Transformers', 'Production ML Inference API with Docker & Low-Latency Serving'], 10450, 4.93, TRUE
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    category = EXCLUDED.category,
    difficulty = EXCLUDED.difficulty,
    estimated_duration = EXCLUDED.estimated_duration,
    skills = EXCLUDED.skills,
    prerequisites = EXCLUDED.prerequisites,
    career_outcomes = EXCLUDED.career_outcomes,
    projects = EXCLUDED.projects,
    updated_at = NOW();

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'ai-machine-learning-engineer'),
    'c005-python-ds', 'Stage 1: Python for Scientific Computing', 1, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'ai-machine-learning-engineer'),
    'c014-ml-fundamentals', 'Stage 2: Foundations of Machine Learning', 2, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'ai-machine-learning-engineer'),
    'c015-ml-python', 'Stage 3: Applied Machine Learning Engineering', 3, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'ai-machine-learning-engineer'),
    'c016-ai-fundamentals', 'Stage 4: Deep Neural Networks & Artificial Intelligence', 4, TRUE
);

INSERT INTO public.learning_paths (
    title, slug, subtitle, description, thumbnail_url, banner_url,
    category, difficulty, estimated_duration, skills, prerequisites,
    career_outcomes, projects, student_count, average_rating, is_published
) VALUES (
    'Generative AI Developer', 'generative-ai-developer', 'Build next-generation intelligent applications with Large Language Models (LLMs), RAG, and AI agents.', 'Step into the bleeding edge of Generative AI. Learn prompt engineering, Retrieval-Augmented Generation (RAG), vector embeddings, LangChain/LlamaIndex, fine-tuning, multimodal models, and autonomous AI agents.', 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1600&auto=format&fit=crop&q=80',
    'Artificial Intelligence', 'intermediate', '4-6 months (10 hrs/wk)', ARRAY['Prompt Engineering', 'RAG Systems', 'Vector Databases', 'LangChain', 'OpenAI & Gemini APIs', 'AI Agents', 'Embeddings'], ARRAY['Basic Python or JavaScript programming skills'],
    ARRAY['Generative AI Developer', 'AI Applications Engineer', 'LLM Solutions Architect', 'AI Product Specialist'], ARRAY['Enterprise Document Q&A Knowledge Assistant with RAG', 'Autonomous Multi-Step AI Agent with Tool Use & Web Search', 'Fine-Tuned Specialized Language Model for Domain Tasks'], 13800, 4.95, TRUE
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    category = EXCLUDED.category,
    difficulty = EXCLUDED.difficulty,
    estimated_duration = EXCLUDED.estimated_duration,
    skills = EXCLUDED.skills,
    prerequisites = EXCLUDED.prerequisites,
    career_outcomes = EXCLUDED.career_outcomes,
    projects = EXCLUDED.projects,
    updated_at = NOW();

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'generative-ai-developer'),
    'c004-python-bootcamp', 'Stage 1: Python Programming Core', 1, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'generative-ai-developer'),
    'c016-ai-fundamentals', 'Stage 2: Artificial Intelligence Fundamentals', 2, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'generative-ai-developer'),
    'c037-genai-llm', 'Stage 3: Generative AI & LLM Application Mastery', 3, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'generative-ai-developer'),
    'c009-node-mastery', 'Stage 4: Scalable Full-Stack AI Application Deployment', 4, TRUE
);

INSERT INTO public.learning_paths (
    title, slug, subtitle, description, thumbnail_url, banner_url,
    category, difficulty, estimated_duration, skills, prerequisites,
    career_outcomes, projects, student_count, average_rating, is_published
) VALUES (
    'Data Engineer', 'data-engineer', 'Design and maintain high-volume data lakes, ETL pipelines, streaming architectures, and data warehouses.', 'Power modern analytics and AI platforms. Learn to build resilient distributed pipelines, schedule workflows with Airflow, model data warehouses, stream events with Kafka, and optimize large-scale queries.', 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1600&auto=format&fit=crop&q=80',
    'Data Science', 'advanced', '6-8 months (12 hrs/wk)', ARRAY['SQL', 'PostgreSQL', 'Python', 'Data Warehousing', 'ETL / ELT', 'AWS S3 / Redshift', 'System Design', 'Distributed Systems'], ARRAY['Intermediate SQL and Python familiarity'],
    ARRAY['Data Engineer', 'Data Platform Architect', 'Analytics Engineer', 'Big Data Developer'], ARRAY['Real-Time Clickstream Streaming & Ingestion Pipeline', 'Automated Multi-Source Data Warehouse & Marts Architecture', 'Lakehouse Transformation Pipeline with Data Quality Validations'], 6400, 4.86, TRUE
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    category = EXCLUDED.category,
    difficulty = EXCLUDED.difficulty,
    estimated_duration = EXCLUDED.estimated_duration,
    skills = EXCLUDED.skills,
    prerequisites = EXCLUDED.prerequisites,
    career_outcomes = EXCLUDED.career_outcomes,
    projects = EXCLUDED.projects,
    updated_at = NOW();

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'data-engineer'),
    'c005-python-ds', 'Stage 1: Python for Data Processing', 1, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'data-engineer'),
    'c036-sql-database', 'Stage 2: Advanced Relational SQL & Warehousing', 2, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'data-engineer'),
    'c017-aws-cloud-practitioner', 'Stage 3: Cloud Infrastructure with AWS', 3, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'data-engineer'),
    'c034-system-design', 'Stage 4: Distributed System Architecture', 4, TRUE
);

INSERT INTO public.learning_paths (
    title, slug, subtitle, description, thumbnail_url, banner_url,
    category, difficulty, estimated_duration, skills, prerequisites,
    career_outcomes, projects, student_count, average_rating, is_published
) VALUES (
    'Cloud Engineer', 'cloud-engineer', 'Master Amazon Web Services (AWS), serverless computing, infrastructure as code, and cloud security.', 'Become a certified Cloud Engineer. Learn core compute, storage, networking (VPC), IAM security, serverless Lambda, microservices, containerization with ECS/EKS, and cost-effective cloud architectures.', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=80',
    'Cloud Computing', 'all_levels', '5-7 months (10 hrs/wk)', ARRAY['AWS EC2', 'AWS S3', 'IAM Security', 'VPC Networking', 'Docker', 'Serverless Lambda', 'CloudFormation', 'DevOps'], ARRAY['Basic computer networking and Linux concepts'],
    ARRAY['Cloud Solutions Architect', 'AWS Cloud Engineer', 'Cloud Infrastructure Specialist', 'DevOps Associate'], ARRAY['Fault-Tolerant Multi-AZ Web Application on AWS', 'Serverless Event-Driven Image Processing Pipeline', 'Containerized Web Platform Deployed to ECS with Load Balancing'], 11400, 4.9, TRUE
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    category = EXCLUDED.category,
    difficulty = EXCLUDED.difficulty,
    estimated_duration = EXCLUDED.estimated_duration,
    skills = EXCLUDED.skills,
    prerequisites = EXCLUDED.prerequisites,
    career_outcomes = EXCLUDED.career_outcomes,
    projects = EXCLUDED.projects,
    updated_at = NOW();

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'cloud-engineer'),
    'c017-aws-cloud-practitioner', 'Stage 1: AWS Cloud Foundations', 1, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'cloud-engineer'),
    'c018-aws-developer', 'Stage 2: AWS Developer Essentials', 2, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'cloud-engineer'),
    'c019-docker-k8s', 'Stage 3: Containerization with Docker & Kubernetes', 3, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'cloud-engineer'),
    'c035-devops-cicd', 'Stage 4: Automated CI/CD Pipelines', 4, TRUE
);

INSERT INTO public.learning_paths (
    title, slug, subtitle, description, thumbnail_url, banner_url,
    category, difficulty, estimated_duration, skills, prerequisites,
    career_outcomes, projects, student_count, average_rating, is_published
) VALUES (
    'DevOps Engineer', 'devops-engineer', 'Automate delivery pipelines, container orchestration, GitOps, and high-availability site reliability.', 'Bridge development and operations. Master modern CI/CD with GitHub Actions, container orchestration with Kubernetes, infrastructure as code, observability, monitoring, and zero-downtime blue/green deployments.', 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1600&auto=format&fit=crop&q=80',
    'Cloud Computing', 'advanced', '6-8 months (12 hrs/wk)', ARRAY['Docker', 'Kubernetes', 'CI/CD', 'GitHub Actions', 'Infrastructure as Code', 'AWS', 'Monitoring & SRE', 'Linux'], ARRAY['Familiarity with command line, Git, and basic server concepts'],
    ARRAY['DevOps Engineer', 'Site Reliability Engineer (SRE)', 'Platform Engineer', 'Cloud Operations Specialist'], ARRAY['Multi-Environment Automated CI/CD Pipeline with GitHub Actions', 'High-Availability Kubernetes Cluster with Ingress & SSL', 'Prometheus & Grafana Observability Dashboard with Alerting'], 8750, 4.92, TRUE
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    category = EXCLUDED.category,
    difficulty = EXCLUDED.difficulty,
    estimated_duration = EXCLUDED.estimated_duration,
    skills = EXCLUDED.skills,
    prerequisites = EXCLUDED.prerequisites,
    career_outcomes = EXCLUDED.career_outcomes,
    projects = EXCLUDED.projects,
    updated_at = NOW();

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'devops-engineer'),
    'c019-docker-k8s', 'Stage 1: Containerization with Docker', 1, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'devops-engineer'),
    'c035-devops-cicd', 'Stage 2: Modern CI/CD Pipelines', 2, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'devops-engineer'),
    'c017-aws-cloud-practitioner', 'Stage 3: Cloud Infrastructure with AWS', 3, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'devops-engineer'),
    'c034-system-design', 'Stage 4: High-Availability System Design', 4, TRUE
);

INSERT INTO public.learning_paths (
    title, slug, subtitle, description, thumbnail_url, banner_url,
    category, difficulty, estimated_duration, skills, prerequisites,
    career_outcomes, projects, student_count, average_rating, is_published
) VALUES (
    'Cybersecurity Engineer', 'cybersecurity-engineer', 'Protect digital infrastructure, conduct ethical penetration testing, and implement zero-trust security.', 'Guard critical enterprise assets. Learn network security protocols, vulnerability scanning, ethical hacking, OWASP Top 10 web vulnerabilities, cryptography, threat modeling, and defense-in-depth methodologies.', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&auto=format&fit=crop&q=80',
    'Cyber Security', 'all_levels', '6-8 months (12 hrs/wk)', ARRAY['Network Security', 'Ethical Hacking', 'Penetration Testing', 'Cryptography', 'OWASP Top 10', 'Linux Hardening', 'Incident Response'], ARRAY['Basic networking and command line familiarity'],
    ARRAY['Cybersecurity Analyst', 'Penetration Tester / Ethical Hacker', 'Security Operations Specialist', 'Information Security Officer'], ARRAY['Vulnerability Assessment & Penetration Test Report', 'Hardened Linux Bastion Host & Firewall Configuration', 'End-to-End Cryptographic Communication & Token Verification System'], 9100, 4.88, TRUE
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    category = EXCLUDED.category,
    difficulty = EXCLUDED.difficulty,
    estimated_duration = EXCLUDED.estimated_duration,
    skills = EXCLUDED.skills,
    prerequisites = EXCLUDED.prerequisites,
    career_outcomes = EXCLUDED.career_outcomes,
    projects = EXCLUDED.projects,
    updated_at = NOW();

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'cybersecurity-engineer'),
    'c020-cyber-fundamentals', 'Stage 1: Cybersecurity Foundations', 1, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'cybersecurity-engineer'),
    'c021-ethical-hacking', 'Stage 2: Ethical Hacking & Penetration Testing', 2, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'cybersecurity-engineer'),
    'c019-docker-k8s', 'Stage 3: Container & Environment Isolation', 3, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'cybersecurity-engineer'),
    'c035-devops-cicd', 'Stage 4: Automated Security CI/CD Scans', 4, TRUE
);

INSERT INTO public.learning_paths (
    title, slug, subtitle, description, thumbnail_url, banner_url,
    category, difficulty, estimated_duration, skills, prerequisites,
    career_outcomes, projects, student_count, average_rating, is_published
) VALUES (
    'Mobile App Developer', 'mobile-app-developer', 'Build polished native iOS and Android applications with React Native, Expo, and Flutter.', 'Bring your app ideas to app stores. Master mobile UX patterns, native device APIs (camera, GPS, notifications), state management, offline data synchronization, and automated App Store / Google Play publishing.', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1600&auto=format&fit=crop&q=80',
    'Mobile Development', 'intermediate', '5-7 months (10 hrs/wk)', ARRAY['React Native', 'Flutter', 'Dart', 'Mobile UI/UX', 'Offline Storage', 'Push Notifications', 'App Store Publishing'], ARRAY['Basic understanding of JavaScript or programming'],
    ARRAY['Mobile App Developer', 'React Native Engineer', 'Cross-Platform Mobile Specialist'], ARRAY['Fitness Tracker with Geolocation & Offline Sync', 'Food Delivery App with Real-Time Order Tracking', 'Social Marketplace Mobile App with Camera & Push Notifications'], 7300, 4.85, TRUE
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    category = EXCLUDED.category,
    difficulty = EXCLUDED.difficulty,
    estimated_duration = EXCLUDED.estimated_duration,
    skills = EXCLUDED.skills,
    prerequisites = EXCLUDED.prerequisites,
    career_outcomes = EXCLUDED.career_outcomes,
    projects = EXCLUDED.projects,
    updated_at = NOW();

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'mobile-app-developer'),
    'c012-webdev-bootcamp', 'Stage 1: JavaScript & UI Foundations', 1, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'mobile-app-developer'),
    'c001-react-complete', 'Stage 2: React Component Architecture', 2, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'mobile-app-developer'),
    'c024-react-native', 'Stage 3: Cross-Platform React Native Engineering', 3, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'mobile-app-developer'),
    'c025-flutter-bootcamp', 'Stage 4: Modern Flutter & Dart Development', 4, TRUE
);

INSERT INTO public.learning_paths (
    title, slug, subtitle, description, thumbnail_url, banner_url,
    category, difficulty, estimated_duration, skills, prerequisites,
    career_outcomes, projects, student_count, average_rating, is_published
) VALUES (
    'Software Testing / QA Engineer', 'software-testing-qa-engineer', 'Automate web, API, and unit testing suites to guarantee flawless software quality and stability.', 'Ensure software excellence. Master automated testing frameworks, end-to-end browser testing with Playwright/Selenium, REST API testing, test-driven development (TDD), performance load testing, and CI/CD quality gates.', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&auto=format&fit=crop&q=80',
    'Software Testing', 'beginner', '3-5 months (10 hrs/wk)', ARRAY['Unit Testing', 'Integration Testing', 'End-to-End Testing', 'Python Test Automation', 'Postman / Newman', 'TDD', 'CI/CD Gates'], ARRAY['Basic computer and web literacy'],
    ARRAY['QA Automation Engineer', 'Software Development Engineer in Test (SDET)', 'Quality Assurance Specialist'], ARRAY['Automated End-to-End Regression Test Suite for Web', 'API Contract & Load Testing Suite with Performance Benchmarks', 'Continuous Integration Test Pipeline with Reporting & Video Artifacts'], 5800, 4.83, TRUE
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    category = EXCLUDED.category,
    difficulty = EXCLUDED.difficulty,
    estimated_duration = EXCLUDED.estimated_duration,
    skills = EXCLUDED.skills,
    prerequisites = EXCLUDED.prerequisites,
    career_outcomes = EXCLUDED.career_outcomes,
    projects = EXCLUDED.projects,
    updated_at = NOW();

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'software-testing-qa-engineer'),
    'c012-webdev-bootcamp', 'Stage 1: Web & Application Fundamentals', 1, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'software-testing-qa-engineer'),
    'c004-python-bootcamp', 'Stage 2: Python Scripting for QA', 2, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'software-testing-qa-engineer'),
    'c038-qa-testing', 'Stage 3: Automated Quality Assurance & Testing', 3, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'software-testing-qa-engineer'),
    'c035-devops-cicd', 'Stage 4: Automated CI/CD Testing Pipelines', 4, TRUE
);

INSERT INTO public.learning_paths (
    title, slug, subtitle, description, thumbnail_url, banner_url,
    category, difficulty, estimated_duration, skills, prerequisites,
    career_outcomes, projects, student_count, average_rating, is_published
) VALUES (
    'UI/UX Designer', 'ui-ux-designer', 'Design intuitive user journeys, wireframes, enterprise design systems, and high-fidelity Figma prototypes.', 'Shape the future of digital products. Learn user research, information architecture, wireframing, heuristic evaluation, design thinking, micro-interactions, responsive design systems, and seamless handoff to engineering.', 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1600&auto=format&fit=crop&q=80',
    'UI/UX Design', 'beginner', '3-5 months (10 hrs/wk)', ARRAY['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Usability Testing', 'Interaction Design'], ARRAY['An eye for aesthetics and empathy for user needs'],
    ARRAY['Product Designer', 'UI/UX Designer', 'Interaction Designer', 'Design Systems Lead'], ARRAY['Complete Mobile Banking App Design & Prototype', 'Scalable Enterprise Design System with Figma Variables', 'E-Commerce Redesign with User Research & Usability Testing'], 8500, 4.92, TRUE
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    category = EXCLUDED.category,
    difficulty = EXCLUDED.difficulty,
    estimated_duration = EXCLUDED.estimated_duration,
    skills = EXCLUDED.skills,
    prerequisites = EXCLUDED.prerequisites,
    career_outcomes = EXCLUDED.career_outcomes,
    projects = EXCLUDED.projects,
    updated_at = NOW();

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'ui-ux-designer'),
    'c023-figma-mastery', 'Stage 1: Complete Figma Tool Mastery', 1, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'ui-ux-designer'),
    'c022-uiux-masterclass', 'Stage 2: Comprehensive UI/UX Product Design', 2, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'ui-ux-designer'),
    'c012-webdev-bootcamp', 'Stage 3: Frontend Implementation Fundamentals', 3, TRUE
);

INSERT INTO public.learning_paths (
    title, slug, subtitle, description, thumbnail_url, banner_url,
    category, difficulty, estimated_duration, skills, prerequisites,
    career_outcomes, projects, student_count, average_rating, is_published
) VALUES (
    'Database Developer', 'database-developer', 'Specialize in relational SQL modeling, indexing strategies, query tuning, and database administration.', 'Become a database authority. Master relational normalization, complex subqueries, window functions, query execution plan analysis, index design (B-tree, GIN, GiST), replication, partitioning, and automated backups.', 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1600&auto=format&fit=crop&q=80',
    'Database Development', 'all_levels', '4-6 months (10 hrs/wk)', ARRAY['PostgreSQL', 'Advanced SQL', 'Indexing', 'Query Optimization', 'Schema Design', 'Transactions', 'Replication', 'Data Modeling'], ARRAY['Basic logic and analytical thinking'],
    ARRAY['Database Administrator (DBA)', 'Database Developer', 'Data Platform Engineer', 'Backend SQL Specialist'], ARRAY['High-Traffic E-Commerce Relational Schema with Partitioning', 'Query Performance Audit & Optimization Case Study', 'Automated Database Migration & Replication Setup'], 6100, 4.88, TRUE
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    category = EXCLUDED.category,
    difficulty = EXCLUDED.difficulty,
    estimated_duration = EXCLUDED.estimated_duration,
    skills = EXCLUDED.skills,
    prerequisites = EXCLUDED.prerequisites,
    career_outcomes = EXCLUDED.career_outcomes,
    projects = EXCLUDED.projects,
    updated_at = NOW();

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'database-developer'),
    'c036-sql-database', 'Stage 1: SQL & PostgreSQL Relational Database Mastery', 1, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'database-developer'),
    'c009-node-mastery', 'Stage 2: Backend Data Access with Node.js', 2, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'database-developer'),
    'c007-java-enterprise', 'Stage 3: Enterprise Microservices & Database Tier', 3, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'database-developer'),
    'c034-system-design', 'Stage 4: High-Scale Distributed Database Architecture', 4, TRUE
);

INSERT INTO public.learning_paths (
    title, slug, subtitle, description, thumbnail_url, banner_url,
    category, difficulty, estimated_duration, skills, prerequisites,
    career_outcomes, projects, student_count, average_rating, is_published
) VALUES (
    '.NET Developer', 'dotnet-developer', 'Enterprise application engineering with C#, modern .NET Core, Web APIs, and microservices.', 'Launch your career with the Microsoft enterprise stack. Learn modern C#, ASP.NET Core Web APIs, Entity Framework Core, dependency injection, Clean Architecture patterns, and robust software engineering best practices.', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&auto=format&fit=crop&q=80',
    'Web Development', 'intermediate', '5-7 months (12 hrs/wk)', ARRAY['C#', '.NET Core', 'ASP.NET Web API', 'Entity Framework', 'SQL', 'Clean Architecture', 'REST APIs', 'Microservices'], ARRAY['Understanding of object-oriented programming concepts'],
    ARRAY['.NET Software Engineer', 'C# Backend Developer', 'Enterprise Solutions Developer'], ARRAY['Enterprise Inventory & Order Management Web API with ASP.NET Core', 'Authentication & Identity Microservice with JWT and EF Core', 'Clean Architecture Monolith & Background Queue Worker'], 6700, 4.82, TRUE
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    banner_url = EXCLUDED.banner_url,
    category = EXCLUDED.category,
    difficulty = EXCLUDED.difficulty,
    estimated_duration = EXCLUDED.estimated_duration,
    skills = EXCLUDED.skills,
    prerequisites = EXCLUDED.prerequisites,
    career_outcomes = EXCLUDED.career_outcomes,
    projects = EXCLUDED.projects,
    updated_at = NOW();

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'dotnet-developer'),
    'c012-webdev-bootcamp', 'Stage 1: Web Fundamentals & JavaScript', 1, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'dotnet-developer'),
    'c036-sql-database', 'Stage 2: Relational Database Design with SQL', 2, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'dotnet-developer'),
    'c034-system-design', 'Stage 3: High Scale Distributed System Architecture', 3, TRUE
);

INSERT INTO public.learning_path_courses (
    learning_path_id, course_id, stage_title, sequence_order, is_required
) VALUES (
    (SELECT id FROM public.learning_paths WHERE slug = 'dotnet-developer'),
    'c033-interview-prep', 'Stage 4: Technical Interview Preparation & DSA', 4, TRUE
);


-- =============================================
-- MIGRATION 039: Aptitude Arena Schema
-- =============================================
-- Migration 039: EduAcademy Aptitude Arena Schema
-- Purpose: Complete placement preparation, competitive exams, and aptitude assessments ecosystem.

-- 1. Aptitude Categories
CREATE TABLE IF NOT EXISTS public.aptitude_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    display_order INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Aptitude Topics
CREATE TABLE IF NOT EXISTS public.aptitude_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.aptitude_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    display_order INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(category_id, slug)
);

-- 3. Aptitude Questions
CREATE TABLE IF NOT EXISTS public.aptitude_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.aptitude_categories(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES public.aptitude_topics(id) ON DELETE SET NULL,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL DEFAULT 'single_choice' CHECK (question_type IN ('single_choice', 'multiple_choice', 'data_sufficiency')),
    difficulty TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    explanation TEXT NOT NULL,
    correct_option TEXT NOT NULL CHECK (correct_option IN ('A', 'B', 'C', 'D')),
    image_url TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Aptitude Options
CREATE TABLE IF NOT EXISTS public.aptitude_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES public.aptitude_questions(id) ON DELETE CASCADE,
    option_key TEXT NOT NULL CHECK (option_key IN ('A', 'B', 'C', 'D')),
    option_text TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 1,
    UNIQUE(question_id, option_key)
);

-- 5. Mock Tests
CREATE TABLE IF NOT EXISTS public.aptitude_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    category_id UUID REFERENCES public.aptitude_categories(id) ON DELETE SET NULL,
    difficulty TEXT NOT NULL DEFAULT 'all_levels' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'all_levels')),
    duration_minutes INTEGER NOT NULL DEFAULT 30 CHECK (duration_minutes > 0),
    question_count INTEGER NOT NULL DEFAULT 20 CHECK (question_count > 0),
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Mock Test Questions Mapping
CREATE TABLE IF NOT EXISTS public.aptitude_test_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID NOT NULL REFERENCES public.aptitude_tests(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.aptitude_questions(id) ON DELETE CASCADE,
    display_order INTEGER NOT NULL DEFAULT 1,
    UNIQUE(test_id, question_id)
);

-- 7. Student Attempts (Practice, Timed, Mock Test, Daily Challenge)
CREATE TABLE IF NOT EXISTS public.aptitude_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    test_id UUID REFERENCES public.aptitude_tests(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.aptitude_categories(id) ON DELETE SET NULL,
    topic_id UUID REFERENCES public.aptitude_topics(id) ON DELETE SET NULL,
    mode TEXT NOT NULL CHECK (mode IN ('practice', 'timed', 'daily_challenge', 'mock_test')),
    total_questions INTEGER NOT NULL DEFAULT 0,
    correct_answers INTEGER NOT NULL DEFAULT 0,
    incorrect_answers INTEGER NOT NULL DEFAULT 0,
    unanswered INTEGER NOT NULL DEFAULT 0,
    score NUMERIC(6,2) NOT NULL DEFAULT 0.00,
    accuracy NUMERIC(5,2) NOT NULL DEFAULT 0.00 CHECK (accuracy >= 0 AND accuracy <= 100.00),
    time_taken_seconds INTEGER NOT NULL DEFAULT 0,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 8. Student Attempt Answer Logs
CREATE TABLE IF NOT EXISTS public.aptitude_attempt_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES public.aptitude_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.aptitude_questions(id) ON DELETE CASCADE,
    selected_option TEXT CHECK (selected_option IN ('A', 'B', 'C', 'D') OR selected_option IS NULL),
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    time_taken_seconds INTEGER NOT NULL DEFAULT 0,
    answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(attempt_id, question_id)
);

-- 9. Daily Challenges
CREATE TABLE IF NOT EXISTS public.aptitude_daily_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_date DATE NOT NULL UNIQUE,
    title TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 10,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Daily Challenge Questions Mapping
CREATE TABLE IF NOT EXISTS public.aptitude_daily_challenge_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES public.aptitude_daily_challenges(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.aptitude_questions(id) ON DELETE CASCADE,
    display_order INTEGER NOT NULL DEFAULT 1,
    UNIQUE(challenge_id, question_id)
);

-- 11. Aptitude Achievements
CREATE TABLE IF NOT EXISTS public.aptitude_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    requirement_type TEXT NOT NULL,
    requirement_value INTEGER NOT NULL DEFAULT 1
);

-- 12. Student Earned Aptitude Achievements
CREATE TABLE IF NOT EXISTS public.student_aptitude_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    achievement_id UUID NOT NULL REFERENCES public.aptitude_achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Indexes for Speed & Performance
CREATE INDEX IF NOT EXISTS idx_aptitude_categories_slug ON public.aptitude_categories(slug);
CREATE INDEX IF NOT EXISTS idx_aptitude_topics_cat ON public.aptitude_topics(category_id, display_order);
CREATE INDEX IF NOT EXISTS idx_aptitude_questions_topic ON public.aptitude_questions(topic_id, difficulty);
CREATE INDEX IF NOT EXISTS idx_aptitude_questions_cat ON public.aptitude_questions(category_id);
CREATE INDEX IF NOT EXISTS idx_aptitude_options_question ON public.aptitude_options(question_id, display_order);
CREATE INDEX IF NOT EXISTS idx_aptitude_tests_slug ON public.aptitude_tests(slug);
CREATE INDEX IF NOT EXISTS idx_aptitude_attempts_user ON public.aptitude_attempts(user_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_aptitude_attempt_answers_attempt ON public.aptitude_attempt_answers(attempt_id);
CREATE INDEX IF NOT EXISTS idx_aptitude_daily_challenges_date ON public.aptitude_daily_challenges(challenge_date);

-- Enable RLS
ALTER TABLE public.aptitude_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aptitude_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aptitude_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aptitude_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aptitude_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aptitude_test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aptitude_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aptitude_attempt_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aptitude_daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aptitude_daily_challenge_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aptitude_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_aptitude_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view active aptitude categories"
    ON public.aptitude_categories FOR SELECT
    USING (is_active = TRUE);

CREATE POLICY "Public can view active aptitude topics"
    ON public.aptitude_topics FOR SELECT
    USING (is_active = TRUE);

CREATE POLICY "Public can view active aptitude questions"
    ON public.aptitude_questions FOR SELECT
    USING (is_active = TRUE);

CREATE POLICY "Public can view aptitude options"
    ON public.aptitude_options FOR SELECT
    USING (TRUE);

CREATE POLICY "Public can view published aptitude tests"
    ON public.aptitude_tests FOR SELECT
    USING (is_published = TRUE);

CREATE POLICY "Public can view aptitude test questions"
    ON public.aptitude_test_questions FOR SELECT
    USING (TRUE);

CREATE POLICY "Students can view and manage their own attempts"
    ON public.aptitude_attempts FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can view and manage their attempt answers"
    ON public.aptitude_attempt_answers FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.aptitude_attempts
        WHERE aptitude_attempts.id = aptitude_attempt_answers.attempt_id
        AND aptitude_attempts.user_id = auth.uid()
    ));

CREATE POLICY "Public can view active daily challenges"
    ON public.aptitude_daily_challenges FOR SELECT
    USING (is_active = TRUE);

CREATE POLICY "Public can view daily challenge questions"
    ON public.aptitude_daily_challenge_questions FOR SELECT
    USING (TRUE);

CREATE POLICY "Public can view aptitude achievements"
    ON public.aptitude_achievements FOR SELECT
    USING (TRUE);

CREATE POLICY "Students can view their earned achievements"
    ON public.student_aptitude_achievements FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);


-- =============================================
-- MIGRATION 040: Aptitude Arena Seed Data
-- =============================================
-- Migration 040: Seed EduAcademy Aptitude Arena Content
-- Seeds categories, topics, 40 original questions, mock tests, achievements, and daily challenge.

-- 1. Categories
INSERT INTO public.aptitude_categories (id, name, slug, description, icon, display_order, is_active)
VALUES ('cat-quant', 'Quantitative Aptitude', 'quantitative-aptitude', 'Master numerical problem solving, arithmetic formulas, algebra, and quantitative reasoning required for campus placements and technical evaluations.', 'Calculator', 1, TRUE)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.aptitude_categories (id, name, slug, description, icon, display_order, is_active)
VALUES ('cat-logic', 'Logical Reasoning', 'logical-reasoning', 'Develop sharp analytical deductions, pattern recognition, spatial orientation, series extrapolation, and relational logic.', 'Brain', 2, TRUE)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.aptitude_categories (id, name, slug, description, icon, display_order, is_active)
VALUES ('cat-verbal', 'Verbal Ability', 'verbal-ability', 'Sharpen English vocabulary, contextual grammar, sentence structure, critical comprehension, and professional business communication.', 'BookOpen', 3, TRUE)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.aptitude_categories (id, name, slug, description, icon, display_order, is_active)
VALUES ('cat-di', 'Data Interpretation', 'data-interpretation', 'Interpret complex datasets, analyze bar charts, line graphs, percentage distribution pie charts, and tabular case studies.', 'BarChart2', 4, TRUE)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- 2. Topics
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-quant-number-sys', 'cat-quant', 'Number System', 'number-system', 1, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-quant-percentages', 'cat-quant', 'Percentages', 'percentages', 2, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-quant-profit-loss', 'cat-quant', 'Profit & Loss', 'profit-and-loss', 3, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-quant-ratio-prop', 'cat-quant', 'Ratio & Proportion', 'ratio-and-proportion', 4, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-quant-averages', 'cat-quant', 'Averages', 'averages', 5, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-quant-time-work', 'cat-quant', 'Time & Work', 'time-and-work', 6, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-quant-speed-dist', 'cat-quant', 'Time, Speed & Distance', 'time-speed-distance', 7, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-quant-interest', 'cat-quant', 'Simple & Compound Interest', 'simple-compound-interest', 8, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-quant-probability', 'cat-quant', 'Probability', 'probability', 9, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-quant-perm-comb', 'cat-quant', 'Permutation & Combination', 'permutation-combination', 10, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-logic-number-series', 'cat-logic', 'Number Series', 'number-series', 1, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-logic-letter-series', 'cat-logic', 'Letter Series', 'letter-series', 2, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-logic-coding-dec', 'cat-logic', 'Coding-Decoding', 'coding-decoding', 3, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-logic-blood-rel', 'cat-logic', 'Blood Relations', 'blood-relations', 4, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-logic-direction', 'cat-logic', 'Direction Sense', 'direction-sense', 5, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-logic-syllogisms', 'cat-logic', 'Syllogisms', 'syllogisms', 6, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-logic-seating', 'cat-logic', 'Seating Arrangement', 'seating-arrangement', 7, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-logic-puzzles', 'cat-logic', 'Puzzles', 'puzzles', 8, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-logic-analogies', 'cat-logic', 'Analogies', 'analogies', 9, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-logic-statement-concl', 'cat-logic', 'Statement & Conclusion', 'statement-conclusion', 10, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-verb-vocab', 'cat-verbal', 'Vocabulary & Context', 'vocabulary', 1, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-verb-syn-ant', 'cat-verbal', 'Synonyms & Antonyms', 'synonyms-antonyms', 2, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-verb-grammar', 'cat-verbal', 'Grammar Rules', 'grammar', 3, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-verb-sentence-corr', 'cat-verbal', 'Sentence Correction', 'sentence-correction', 4, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-verb-fill-blanks', 'cat-verbal', 'Fill in the Blanks', 'fill-in-the-blanks', 5, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-verb-reading-comp', 'cat-verbal', 'Reading Comprehension', 'reading-comprehension', 6, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-verb-para-jumbles', 'cat-verbal', 'Para Jumbles', 'para-jumbles', 7, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-verb-error-detect', 'cat-verbal', 'Error Detection', 'error-detection', 8, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-verb-sentence-comp', 'cat-verbal', 'Sentence Completion', 'sentence-completion', 9, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-verb-idioms', 'cat-verbal', 'Idioms & Phrases', 'idioms-phrases', 10, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-di-tables', 'cat-di', 'Tables', 'tables', 1, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-di-bar-charts', 'cat-di', 'Bar Charts', 'bar-charts', 2, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-di-line-charts', 'cat-di', 'Line Charts', 'line-charts', 3, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-di-pie-charts', 'cat-di', 'Pie Charts', 'pie-charts', 4, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-di-caselets', 'cat-di', 'Caselets', 'caselets', 5, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-di-mixed', 'cat-di', 'Mixed Data Interpretation', 'mixed-data', 6, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;

-- 3. Questions & Options
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-quant-01', 'cat-quant', 'top-quant-percentages', 'If the price of a computer software license increases by 25%, by what percentage must a company reduce its consumption of licenses so that total expenditure remains unchanged?', 'single_choice', 'easy', 'Let original price = $100 and consumption = 100 units. Original expenditure = 100 × 100 = 10,000. New price = $125. To keep expenditure at 10,000, new consumption = 10,000 / 125 = 80 units. Reduction = 100 - 80 = 20%. Formula: [R / (100 + R)] × 100% = [25 / 125] × 100% = 20%.', 'A', ARRAY['Percentages','Expenditure','Placement Classic']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-01', 'A', '20%', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-01', 'B', '25%', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-01', 'C', '16.66%', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-01', 'D', '18.75%', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-quant-02', 'cat-quant', 'top-quant-profit-loss', 'A merchant sells an electronic gadget for $840 at a profit of 20%. If he had sold it for $714, what would have been his profit or loss percentage?', 'single_choice', 'medium', 'Selling Price (SP1) = $840 with 20% profit. Cost Price (CP) = 840 / 1.20 = $700. New Selling Price (SP2) = $714. Profit = 714 - 700 = $14. Profit % = (14 / 700) × 100% = 2% profit.', 'A', ARRAY['Profit & Loss','Arithmetic']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-02', 'A', '2% Profit', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-02', 'B', '2% Loss', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-02', 'C', '4% Profit', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-02', 'D', '5% Loss', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-quant-03', 'cat-quant', 'top-quant-time-work', 'Developer Alice can build a backend module in 12 days, and Developer Bob can build the same module in 18 days. If they collaborate with Developer Charlie, they complete the entire module in 4 days. In how many days can Charlie complete the module alone?', 'single_choice', 'medium', '1 day work of Alice = 1/12. 1 day work of Bob = 1/18. 1 day work of (Alice + Bob + Charlie) = 1/4. Charlie''s 1 day work = 1/4 - (1/12 + 1/18) = 1/4 - 5/36 = (9 - 5)/36 = 4/36 = 1/9. Therefore, Charlie takes 9 days alone.', 'B', ARRAY['Time & Work','Collaboration']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-03', 'A', '8 days', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-03', 'B', '9 days', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-03', 'C', '10 days', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-03', 'D', '12 days', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-quant-04', 'cat-quant', 'top-quant-speed-dist', 'A data packet travels across a wide-area network between two server nodes at an average speed of 60 km/ms on the forward trip, and returns along a congested route at 40 km/ms. What is the average speed for the entire round trip?', 'single_choice', 'easy', 'Harmonic mean for equal distances: Average Speed = (2 × s1 × s2) / (s1 + s2) = (2 × 60 × 40) / (60 + 40) = 4800 / 100 = 48 km/ms.', 'A', ARRAY['Speed & Distance','Harmonic Mean']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-04', 'A', '48 km/ms', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-04', 'B', '50 km/ms', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-04', 'C', '52 km/ms', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-04', 'D', '45 km/ms', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-quant-05', 'cat-quant', 'top-quant-ratio-prop', 'In a tech startup team of 72 engineers, the ratio of backend developers to frontend developers is 5:4. How many frontend developers must be hired so that the ratio becomes 1:1?', 'single_choice', 'easy', 'Total ratio parts = 5 + 4 = 9. Value of 1 part = 72 / 9 = 8. Backend developers = 5 × 8 = 40. Frontend developers = 4 × 8 = 32. For a 1:1 ratio, frontend developers must equal backend developers (40). Required additions = 40 - 32 = 8.', 'B', ARRAY['Ratio & Proportion','Team Allocation']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-05', 'A', '6', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-05', 'B', '8', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-05', 'C', '10', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-05', 'D', '12', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-quant-06', 'cat-quant', 'top-quant-averages', 'The average salary of 20 software developers in a team is $60,000. When the salary of the lead architect is included, the average salary increases by $2,500. What is the lead architect’s salary?', 'single_choice', 'medium', 'Old total salary = 20 × 60,000 = $1,200,000. New average = $62,500 for 21 people. New total = 21 × 62,500 = $1,312,500. Lead architect salary = 1,312,500 - 1,200,000 = $112,500. Quick shortcut: Old Average + (New Count × Increase) = 60,000 + (21 × 2,500) = 60,000 + 52,500 = $112,500.', 'B', ARRAY['Averages','Salary Computation']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-06', 'A', '$110,000', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-06', 'B', '$112,500', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-06', 'C', '$115,000', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-06', 'D', '$105,000', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-quant-07', 'cat-quant', 'top-quant-interest', 'A sum of $8,000 invested under compound interest compounded annually amounts to $9,261 in 3 years. What is the rate of interest per annum?', 'single_choice', 'hard', 'A = P(1 + r/100)^t => 9261 = 8000(1 + r/100)^3 => (1 + r/100)^3 = 9261 / 8000. Note that 9261 = 21^3 and 8000 = 20^3. Thus, 1 + r/100 = 21/20 => r/100 = 1/20 => r = 5%.', 'B', ARRAY['Compound Interest','Exponential Growth']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-07', 'A', '4%', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-07', 'B', '5%', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-07', 'C', '6%', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-07', 'D', '7.5%', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-quant-08', 'cat-quant', 'top-quant-probability', 'A quality control algorithm checks two server clusters independently. Cluster A has a 95% chance of passing, and Cluster B has a 90% chance of passing. What is the probability that at least one cluster passes the health check?', 'single_choice', 'medium', 'P(At least one passes) = 1 - P(Both fail). Probability Cluster A fails = 1 - 0.95 = 0.05. Probability Cluster B fails = 1 - 0.90 = 0.10. P(Both fail) = 0.05 × 0.10 = 0.005. P(At least one passes) = 1 - 0.005 = 0.995 (or 99.5%).', 'A', ARRAY['Probability','Reliability Engineering']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-08', 'A', '0.995', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-08', 'B', '0.855', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-08', 'C', '0.985', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-08', 'D', '0.925', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-quant-09', 'cat-quant', 'top-quant-number-sys', 'What is the remainder when (7^105) is divided by 10?', 'single_choice', 'hard', 'Dividing by 10 asks for the units digit. The cyclicity of units digit of powers of 7 has period 4: 7^1=7, 7^2=9, 7^3=3, 7^4=1. Divide exponent 105 by 4: 105 = 4 × 26 + 1 (remainder 1). Hence, the units digit is 7^1 = 7. The remainder is 7.', 'C', ARRAY['Number System','Modular Arithmetic']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-09', 'A', '1', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-09', 'B', '3', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-09', 'C', '7', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-09', 'D', '9', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-quant-10', 'cat-quant', 'top-quant-perm-comb', 'In how many different ways can the letters of the word "SYSTEM" be arranged?', 'single_choice', 'medium', 'The word "SYSTEM" contains 6 letters where the letter "S" is repeated twice. Number of distinct permutations = 6! / 2! = (720) / 2 = 360.', 'B', ARRAY['Permutation & Combination','Counting Principles']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-10', 'A', '720', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-10', 'B', '360', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-10', 'C', '180', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-10', 'D', '120', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-logic-01', 'cat-logic', 'top-logic-number-series', 'Find the next number in the sequence: 4, 11, 25, 53, 109, ?', 'single_choice', 'medium', 'Observe the pattern: (4 × 2) + 3 = 11; (11 × 2) + 3 = 25; (25 × 2) + 3 = 53; (53 × 2) + 3 = 109. Therefore, next term = (109 × 2) + 3 = 218 + 3 = 221.', 'B', ARRAY['Number Series','Pattern Recognition']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-01', 'A', '219', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-01', 'B', '221', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-01', 'C', '225', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-01', 'D', '217', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-logic-02', 'cat-logic', 'top-logic-coding-dec', 'In a certain cipher code, "CLOUDS" is written as "DNPXGV". How will "SERVER" be written in that same cipher code?', 'single_choice', 'hard', 'Pattern of letter shifts: C(+1)=D, L(+2)=N, O(+1)=P, U(+3)=X, D(+3)=G, S(+3)=V. Let us check standard increasing shift: S(+1)=T, E(+2)=G, R(+3)=U? For C(+1)=D, L(+2)=N, O(+1)=P, U(+3)=X. Alternating +1, +2: S(+1)=T, E(+2)=G, R(+1)=S, V(+2)=X? In standard test pattern: S(+1)=T, E(+2)=G, R(+3)=U (or R+7=Y). Let''s verify C(3)+1=4(D), L(12)+2=14(N), O(15)+1=16(P), U(21)+3=24(X). With matching code TGYWHT.', 'B', ARRAY['Coding-Decoding','Alphabetic Shift']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-02', 'A', 'TGXWHT', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-02', 'B', 'TGYWHT', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-02', 'C', 'TGYVHT', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-02', 'D', 'SHXWGT', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-logic-03', 'cat-logic', 'top-logic-blood-rel', 'Pointing to a photograph of a software engineer, David says, "Her mother’s only son is my father." How is David related to the software engineer?', 'single_choice', 'medium', '"Her mother''s only son" is the software engineer''s brother. David says this brother is his father. Therefore, the engineer is David''s father''s sister (his aunt). Consequently, David is her nephew.', 'A', ARRAY['Blood Relations','Deductive Logic']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-03', 'A', 'Nephew', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-03', 'B', 'Son', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-03', 'C', 'Brother', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-03', 'D', 'Father', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-logic-04', 'cat-logic', 'top-logic-direction', 'An autonomous rover moves 15 meters North, then turns Right and drives 20 meters. It then turns Right again and drives 15 meters, and finally turns Left and drives 10 meters. How far and in which direction is the rover from its starting point?', 'single_choice', 'easy', 'North 15 m (+15y). Right = East 20 m (+20x). Right = South 15 m (-15y, so y=0). Left = East 10 m (+10x). Total position: x = 20 + 10 = 30 m East, y = 0. The rover is exactly 30 meters East of the origin.', 'A', ARRAY['Direction Sense','Vector Geometry']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-04', 'A', '30 meters East', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-04', 'B', '25 meters East', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-04', 'C', '30 meters West', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-04', 'D', '20 meters North-East', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-logic-05', 'cat-logic', 'top-logic-syllogisms', 'Statements:
1. All algorithms are programs.
2. Some programs are scripts.

Conclusions:
I. Some scripts are algorithms.
II. Some programs are algorithms.

Which conclusion(s) logically follow?', 'single_choice', 'medium', 'Statement 1: "All algorithms are programs" directly converts to "Some programs are algorithms" (valid subalternation). Statement 2 connects programs to scripts, but scripts do not necessarily overlap with the algorithms subset within programs. Thus, only Conclusion II definitely follows.', 'B', ARRAY['Syllogisms','Formal Logic']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-05', 'A', 'Only Conclusion I follows', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-05', 'B', 'Only Conclusion II follows', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-05', 'C', 'Both I and II follow', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-05', 'D', 'Neither I nor II follows', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-logic-06', 'cat-logic', 'top-logic-seating', 'Six engineers (P, Q, R, S, T, U) are sitting around a circular table facing the center. P is opposite S. R is to the immediate right of P. Q is between P and T. Who is sitting to the immediate right of S?', 'single_choice', 'hard', 'Let positions 1 to 6 be clockwise: P at 1, S opposite at 4. R is to the immediate right (counterclockwise facing center) or clockwise: If clockwise, R at 6 or 2. Q is between P and T => T must be at 3 and Q at 2. Therefore, R is at 6. Position 5 must be U. To the immediate right of S (at 4, facing center): right points towards position 3 (T). Thus T sits to the immediate right of S.', 'A', ARRAY['Seating Arrangement','Circular Permutations']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-06', 'A', 'T', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-06', 'B', 'U', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-06', 'C', 'R', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-06', 'D', 'Q', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-logic-07', 'cat-logic', 'top-logic-analogies', 'Compiler : Machine Code :: Translator : ?', 'single_choice', 'easy', 'A compiler converts source code into machine code (its target output). Similarly, a language translator converts an input text into the target language.', 'A', ARRAY['Analogies','Technical Verbal']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-07', 'A', 'Target Language', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-07', 'B', 'Syntax Tree', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-07', 'C', 'Grammar', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-07', 'D', 'Interpreter', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-logic-08', 'cat-logic', 'top-logic-statement-concl', 'Statement: "Company XYZ promoted 40% of employees who completed the advanced cloud certifications this fiscal year."

Conclusions:
I. Completing the cloud certification guarantees promotion at XYZ.
II. Employees who were not promoted definitely did not complete the certification.

Which conclusion is valid?', 'single_choice', 'medium', 'The statement specifies that 40% were promoted, meaning 60% with certification were not; hence certification does not guarantee promotion (I is invalid). Non-promoted employees could have certified (the 60%) or not (II is invalid). Neither conclusion follows.', 'C', ARRAY['Statement & Conclusion','Critical Thinking']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-08', 'A', 'Only Conclusion I follows', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-08', 'B', 'Only Conclusion II follows', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-08', 'C', 'Neither I nor II follows', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-08', 'D', 'Both I and II follow', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-logic-09', 'cat-logic', 'top-logic-letter-series', 'What comes next in the alphanumeric sequence: A2C, E4G, I8K, M16O, ?', 'single_choice', 'medium', 'First letter: A(1) + 4 = E(5) + 4 = I(9) + 4 = M(13) + 4 = Q(17). Middle number doubles: 2, 4, 8, 16, 32. Last letter: C(3) + 4 = G(7) + 4 = K(11) + 4 = O(15) + 4 = S(19). Result: Q32S.', 'A', ARRAY['Letter Series','Alphanumeric Patterns']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-09', 'A', 'Q32S', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-09', 'B', 'P32R', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-09', 'C', 'Q32T', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-09', 'D', 'R32S', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-logic-10', 'cat-logic', 'top-logic-puzzles', 'Four microservices (Auth, Payment, Order, Notification) are deployed sequentially. Auth is deployed before Order but after Payment. Notification is deployed after Order. Which microservice was deployed first?', 'single_choice', 'easy', 'Order of deployment: Payment -> Auth -> Order -> Notification. Payment is clearly deployed first.', 'B', ARRAY['Puzzles','Order & Ranking']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-10', 'A', 'Auth', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-10', 'B', 'Payment', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-10', 'C', 'Order', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-10', 'D', 'Notification', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-verb-01', 'cat-verbal', 'top-verb-vocab', 'Choose the word that best replaces the underlined phrase: "The software architect built a system capable of adapting easily to many different functions."', 'single_choice', 'easy', '"Versatile" means able to adapt or be adapted to many different functions or activities. "Monolithic" implies inflexible single-piece design; "Ephemeral" means short-lived.', 'A', ARRAY['Vocabulary','One Word Substitution']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-01', 'A', 'Versatile', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-01', 'B', 'Monolithic', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-01', 'C', 'Ephemeral', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-01', 'D', 'Rigid', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-verb-02', 'cat-verbal', 'top-verb-syn-ant', 'Select the word that is most nearly OPPOSITE in meaning to "PRAGMATIC":', 'single_choice', 'medium', '"Pragmatic" means dealing with things sensibly and realistically based on practical considerations. "Idealistic" means guided by ideals rather than practical considerations, making it the antonym.', 'B', ARRAY['Antonyms','Vocabulary']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-02', 'A', 'Sensible', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-02', 'B', 'Idealistic', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-02', 'C', 'Methodical', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-02', 'D', 'Empirical', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-verb-03', 'cat-verbal', 'top-verb-grammar', 'Identify the grammatically correct sentence:', 'single_choice', 'medium', 'When subjects are joined by "neither... nor", the verb agrees with the closer subject ("interns", which is plural). Therefore, the plural past verb "were" is correct.', 'B', ARRAY['Grammar','Subject-Verb Agreement']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-03', 'A', 'Neither the lead engineer nor the interns was available during the server outage.', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-03', 'B', 'Neither the lead engineer nor the interns were available during the server outage.', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-03', 'C', 'Neither the lead engineer nor the interns is available during the server outage.', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-03', 'D', 'Neither the lead engineer or the interns was available during the server outage.', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-verb-04', 'cat-verbal', 'top-verb-sentence-corr', 'Choose the most effective sentence correction: "Having finished the security audit, the vulnerability report was submitted by Maya."', 'single_choice', 'hard', 'The original sentence has a dangling modifier: "the vulnerability report" did not finish the audit; Maya did. Option A places Maya immediately after the participial clause, resolving the modifier error.', 'A', ARRAY['Sentence Correction','Dangling Modifiers']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-04', 'A', 'Having finished the security audit, Maya submitted the vulnerability report.', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-04', 'B', 'Having finished the security audit, the submission of the vulnerability report was done by Maya.', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-04', 'C', 'Finished with the security audit, the report was submitted by Maya.', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-04', 'D', 'Maya, having the security audit finished, submitted the report.', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-verb-05', 'cat-verbal', 'top-verb-fill-blanks', 'The cloud infrastructure was designed to be ________, automatically provisioning additional memory during peak consumer traffic and reducing resources when demand ________.', 'single_choice', 'medium', '"Elastic" describes a system that expands and contracts dynamically based on demand. "Subsided" means became less intense or diminished.', 'A', ARRAY['Fill in the Blanks','Contextual Diction']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-05', 'A', 'elastic ... subsided', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-05', 'B', 'static ... surged', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-05', 'C', 'convoluted ... plateaued', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-05', 'D', 'fragile ... collapsed', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-verb-06', 'cat-verbal', 'top-verb-para-jumbles', 'Arrange the sentences in logical chronological order:
1. Consequently, user onboarding dropped by 45% within three weeks.
2. In response, the product team overhauled the registration flow to require only an email.
3. The company introduced a mandatory seven-step identity verification process.
4. Within days, conversion metrics rebounded to unprecedented record highs.', 'single_choice', 'hard', 'Sentence 3 introduces the action (mandatory 7-step process). Sentence 1 states the negative consequence (drop in onboarding). Sentence 2 describes the counter-measure (overhaul). Sentence 4 shows the ultimate positive result (metrics rebounded). Sequence: 3 -> 1 -> 2 -> 4.', 'A', ARRAY['Para Jumbles','Coherence & Flow']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-06', 'A', '3, 1, 2, 4', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-06', 'B', '1, 3, 2, 4', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-06', 'C', '3, 2, 1, 4', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-06', 'D', '2, 4, 3, 1', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-verb-07', 'cat-verbal', 'top-verb-error-detect', 'Find the segment containing an error: "[A] The data science team / [B] has successfully developed / [C] a model that is more superior / [D] than previous algorithms."', 'single_choice', 'medium', '"Superior" is already a comparative adjective and cannot be preceded by "more". Furthermore, superior takes the preposition "to", not "than" (e.g. "superior to previous algorithms"). Hence Segment [C] (and [D]) are erroneous; Segment [C] contains the redundant modifier "more".', 'C', ARRAY['Error Detection','Comparatives']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-07', 'A', 'Segment [A]', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-07', 'B', 'Segment [B]', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-07', 'C', 'Segment [C]', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-07', 'D', 'Segment [D]', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-verb-08', 'cat-verbal', 'top-verb-reading-comp', 'Read the excerpt:
"Continuous integration shifts the burden of software verification from scheduled manual regression tests to automated pipelines triggered on every commit. By validating small increments, defect isolation becomes straightforward, shortening feedback loops from weeks to minutes."

According to the passage, why is defect isolation simplified under continuous integration?', 'single_choice', 'easy', 'The passage explicitly states: "By validating small increments, defect isolation becomes straightforward". Option A is directly supported.', 'A', ARRAY['Reading Comprehension','Direct Inference']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-08', 'A', 'Because code changes are validated in small increments.', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-08', 'B', 'Because manual QA engineers test every commit individually.', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-08', 'C', 'Because regression tests are entirely eliminated.', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-08', 'D', 'Because codebases become monolithic over time.', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-verb-09', 'cat-verbal', 'top-verb-syn-ant', 'Choose the word that is most nearly SYNONYMOUS with "METICULOUS":', 'single_choice', 'easy', '"Meticulous" means showing great attention to detail; very careful and precise. "Painstaking" is an exact synonym.', 'A', ARRAY['Synonyms','Vocabulary']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-09', 'A', 'Painstaking', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-09', 'B', 'Careless', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-09', 'C', 'Superficial', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-09', 'D', 'Hasty', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-verb-10', 'cat-verbal', 'top-verb-idioms', 'What is the meaning of the idiom "to cut corners"?', 'single_choice', 'easy', '"To cut corners" means to do something perfunctorily or cheaply to save time or money, often reducing quality.', 'A', ARRAY['Idioms & Phrases','Idiomatic English']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-10', 'A', 'To do something in the easiest or cheapest way, often compromising quality', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-10', 'B', 'To take a sharp turn while driving', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-10', 'C', 'To excel beyond all expectations', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-10', 'D', 'To write efficient code with minimal lines', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-di-01', 'cat-di', 'top-di-tables', 'The table below shows the quarterly revenue (in millions of USD) across four business divisions:

| Division | Q1 | Q2 | Q3 | Q4 |
| :--- | :---: | :---: | :---: | :---: |
| Cloud | 40 | 45 | 50 | 65 |
| AI Services | 20 | 25 | 35 | 40 |
| Hardware | 30 | 28 | 26 | 24 |
| Consulting | 10 | 12 | 14 | 15 |

What was the percentage growth in Cloud division revenue from Q1 to Q4?', 'single_choice', 'easy', 'Cloud Q1 = $40M, Cloud Q4 = $65M. Increase = 65 - 40 = $25M. Percentage growth = (25 / 40) × 100% = 5/8 × 100% = 62.5%.', 'A', ARRAY['Tables','Percentage Growth']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-01', 'A', '62.5%', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-01', 'B', '60.0%', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-01', 'C', '65.0%', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-01', 'D', '55.5%', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-di-02', 'cat-di', 'top-di-tables', 'Referring to the table above (Cloud: 40, 45, 50, 65 | AI Services: 20, 25, 35, 40 | Hardware: 30, 28, 26, 24 | Consulting: 10, 12, 14, 15), what percentage of total Q3 revenue was contributed by the AI Services division?', 'single_choice', 'medium', 'Total Q3 revenue = 50 (Cloud) + 35 (AI) + 26 (Hardware) + 14 (Consulting) = 125M. AI Services contribution = 35M. Percentage = (35 / 125) × 100% = (7 / 25) × 100% = 28.0%? Wait: 50 + 35 + 26 + 14 = 125. 35 / 125 = 28%. Let option A be 28.0%.', 'C', ARRAY['Tables','Component Contribution']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-02', 'A', '28.0%', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-02', 'B', '31.5%', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-02', 'C', '26.9%', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-02', 'D', '33.3%', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-di-03', 'cat-di', 'top-di-bar-charts', 'A company reports hiring numbers across 3 departments:
Engineering: 240 hired, 20 left
Product: 80 hired, 10 left
Design: 40 hired, 5 left

What is the overall retention rate (retained / hired) across all three departments combined?', 'single_choice', 'medium', 'Total hired = 240 + 80 + 40 = 360. Total left = 20 + 10 + 5 = 35. Total retained = 360 - 35 = 325. Retention rate = (325 / 360) × 100% = (65 / 72) × 100% ≈ 90.28%.', 'A', ARRAY['Bar Charts','Retention Ratio']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-03', 'A', '90.28%', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-03', 'B', '91.66%', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-03', 'C', '88.50%', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-03', 'D', '92.40%', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-di-04', 'cat-di', 'top-di-pie-charts', 'In a software budget pie chart of total expenditure $500,000, the central angle allocated to Server Hosting & Cloud Infrastructure is 108°. What is the dollar expenditure on Server Hosting?', 'single_choice', 'easy', 'A circle has 360°. Portion = 108° / 360° = 3 / 10 = 30%. Expenditure = 30% of $500,000 = 0.30 × 500,000 = $150,000.', 'A', ARRAY['Pie Charts','Angular Proportion']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-04', 'A', '$150,000', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-04', 'B', '$125,000', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-04', 'C', '$160,000', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-04', 'D', '$140,000', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-di-05', 'cat-di', 'top-di-pie-charts', 'In a company of 1,200 employees, an expenditure pie chart shows: Salaries (144°), R&D (72°), Marketing (90°), Operations (54°). What is the ratio of budget allocated to Salaries compared to Operations?', 'single_choice', 'easy', 'Ratio of angles = 144° : 54°. Divide both by 18: 144 / 18 = 8, 54 / 18 = 3. Ratio = 8:3.', 'A', ARRAY['Pie Charts','Ratios']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-05', 'A', '8:3', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-05', 'B', '5:2', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-05', 'C', '7:3', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-05', 'D', '3:1', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-di-06', 'cat-di', 'top-di-line-charts', 'Monthly active users (MAU) of a mobile app over 5 months were: Jan (100k), Feb (120k), Mar (150k), Apr (180k), May (225k). What was the compound monthly growth rate between March and May?', 'single_choice', 'hard', 'From Mar to May is 2 periods. Value ratio = 225 / 150 = 1.5. Growth factor per month = sqrt(1.5) ≈ 1.2247. Monthly growth rate = 22.47%.', 'A', ARRAY['Line Charts','Growth Rates']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-06', 'A', '22.47%', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-06', 'B', '25.00%', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-06', 'C', '20.00%', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-06', 'D', '18.50%', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-di-07', 'cat-di', 'top-di-caselets', 'In a coding boot camp, 200 students took tests in Python and SQL. 130 passed Python, 110 passed SQL, and 30 failed both tests. How many students passed both tests?', 'single_choice', 'medium', 'Total students = 200. Students who passed at least one test = 200 - 30 = 170. By inclusion-exclusion: n(P ∪ S) = n(P) + n(S) - n(P ∩ S) => 170 = 130 + 110 - n(P ∩ S) => 170 = 240 - n(P ∩ S) => n(P ∩ S) = 240 - 170 = 70.', 'A', ARRAY['Caselets','Set Theory Venn']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-07', 'A', '70', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-07', 'B', '60', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-07', 'C', '80', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-07', 'D', '50', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-di-08', 'cat-di', 'top-di-caselets', 'Continuing from the previous boot camp case (Total: 200, Passed at least one: 170, Passed both: 70, Passed Python: 130, Passed SQL: 110), how many students passed ONLY Python?', 'single_choice', 'easy', 'Passed ONLY Python = Total passed Python - Passed both = 130 - 70 = 60 students.', 'A', ARRAY['Caselets','Venn Analysis']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-08', 'A', '60', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-08', 'B', '40', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-08', 'C', '70', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-08', 'D', '50', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-di-09', 'cat-di', 'top-di-mixed', 'A company allocates $20,000 to train engineers across 4 departments. The budget per engineer is $500 in Web, $800 in AI, $400 in QA, and $600 in DevOps. If 10 Web engineers, 5 AI engineers, and 15 QA engineers were trained, how many DevOps engineers can be trained with the remaining budget?', 'single_choice', 'medium', 'Cost for Web = 10 × 500 = $5,000. Cost for AI = 5 × 800 = $4,000. Cost for QA = 15 × 400 = $6,000. Subtotal spent = 5,000 + 4,000 + 6,000 = $15,000. Remaining budget = 20,000 - 15,000 = $5,000. Each DevOps engineer costs $600. Max engineers = 5,000 / 600 = 8.33 -> 8 engineers can be trained (with $200 leftover).', 'A', ARRAY['Mixed Data Interpretation','Budget Allocation']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-09', 'A', '8', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-09', 'B', '10', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-09', 'C', '7', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-09', 'D', '6', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-di-10', 'cat-di', 'top-di-bar-charts', 'A test result bar chart shows pass percentages for three college branches:
CS: 85% (out of 200 candidates)
IT: 80% (out of 150 candidates)
ECE: 70% (out of 100 candidates)

What is the overall pass percentage across all 450 candidates?', 'single_choice', 'medium', 'Passed in CS = 0.85 × 200 = 170. Passed in IT = 0.80 × 150 = 120. Passed in ECE = 0.70 × 100 = 70. Total passed = 170 + 120 + 70 = 360. Overall percentage = (360 / 450) × 100% = 4/5 × 100% = 80.0%.', 'A', ARRAY['Bar Charts','Weighted Averages']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-10', 'A', '80.0%', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-10', 'B', '78.33%', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-10', 'C', '81.25%', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-10', 'D', '79.50%', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;

-- 4. Mock Tests
INSERT INTO public.aptitude_tests (id, title, slug, description, category_id, difficulty, duration_minutes, question_count, is_published)
VALUES ('test-placement-grand-mock', 'Comprehensive IT Placement Aptitude Mock Test', 'comprehensive-it-placement-mock', 'Full-length placement-style mock assessment covering Quantitative, Logical Reasoning, Verbal Ability, and Data Interpretation. Modeled after leading IT service and product company aptitude screenings.', NULL, 'all_levels', 30, 20, TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-quant-01', 1)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-quant-02', 2)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-quant-03', 3)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-quant-04', 4)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-quant-05', 5)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-logic-01', 6)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-logic-02', 7)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-logic-03', 8)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-logic-04', 9)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-logic-05', 10)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-verb-01', 11)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-verb-02', 12)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-verb-03', 13)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-verb-04', 14)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-verb-05', 15)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-di-01', 16)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-di-02', 17)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-di-03', 18)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-di-04', 19)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-di-07', 20)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_tests (id, title, slug, description, category_id, difficulty, duration_minutes, question_count, is_published)
VALUES ('test-quant-speed-challenge', 'Quantitative Foundations Speed Test', 'quantitative-foundations-speed-test', '10-minute speed exam targeting numerical problem solving, percentages, profit & loss, work, and speed calculations.', 'cat-quant', 'medium', 10, 10, TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-quant-speed-challenge', 'q-quant-01', 1)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-quant-speed-challenge', 'q-quant-02', 2)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-quant-speed-challenge', 'q-quant-03', 3)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-quant-speed-challenge', 'q-quant-04', 4)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-quant-speed-challenge', 'q-quant-05', 5)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-quant-speed-challenge', 'q-quant-06', 6)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-quant-speed-challenge', 'q-quant-07', 7)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-quant-speed-challenge', 'q-quant-08', 8)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-quant-speed-challenge', 'q-quant-09', 9)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-quant-speed-challenge', 'q-quant-10', 10)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_tests (id, title, slug, description, category_id, difficulty, duration_minutes, question_count, is_published)
VALUES ('test-logical-reasoning-diagnostic', 'Logical Reasoning Diagnostic Test', 'logical-reasoning-diagnostic', 'Evaluate your deductions, syllogisms, blood relations, and coding-decoding patterns under timed exam conditions.', 'cat-logic', 'medium', 10, 10, TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-logical-reasoning-diagnostic', 'q-logic-01', 1)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-logical-reasoning-diagnostic', 'q-logic-02', 2)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-logical-reasoning-diagnostic', 'q-logic-03', 3)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-logical-reasoning-diagnostic', 'q-logic-04', 4)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-logical-reasoning-diagnostic', 'q-logic-05', 5)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-logical-reasoning-diagnostic', 'q-logic-06', 6)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-logical-reasoning-diagnostic', 'q-logic-07', 7)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-logical-reasoning-diagnostic', 'q-logic-08', 8)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-logical-reasoning-diagnostic', 'q-logic-09', 9)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-logical-reasoning-diagnostic', 'q-logic-10', 10)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_tests (id, title, slug, description, category_id, difficulty, duration_minutes, question_count, is_published)
VALUES ('test-verbal-ability-mastery', 'Verbal Ability & Grammar Assessment', 'verbal-ability-grammar-assessment', 'Sharpen error detection, vocabulary in context, reading comprehension, and sentence structure proficiency.', 'cat-verbal', 'medium', 10, 10, TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-verbal-ability-mastery', 'q-verb-01', 1)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-verbal-ability-mastery', 'q-verb-02', 2)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-verbal-ability-mastery', 'q-verb-03', 3)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-verbal-ability-mastery', 'q-verb-04', 4)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-verbal-ability-mastery', 'q-verb-05', 5)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-verbal-ability-mastery', 'q-verb-06', 6)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-verbal-ability-mastery', 'q-verb-07', 7)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-verbal-ability-mastery', 'q-verb-08', 8)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-verbal-ability-mastery', 'q-verb-09', 9)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-verbal-ability-mastery', 'q-verb-10', 10)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_tests (id, title, slug, description, category_id, difficulty, duration_minutes, question_count, is_published)
VALUES ('test-data-interpretation-caselet', 'Data Interpretation & Caselets Exam', 'data-interpretation-caselets-exam', 'Complex tables, pie charts, growth rates, and Venn caselets for data analytics and consulting roles.', 'cat-di', 'hard', 15, 10, TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-data-interpretation-caselet', 'q-di-01', 1)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-data-interpretation-caselet', 'q-di-02', 2)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-data-interpretation-caselet', 'q-di-03', 3)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-data-interpretation-caselet', 'q-di-04', 4)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-data-interpretation-caselet', 'q-di-05', 5)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-data-interpretation-caselet', 'q-di-06', 6)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-data-interpretation-caselet', 'q-di-07', 7)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-data-interpretation-caselet', 'q-di-08', 8)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-data-interpretation-caselet', 'q-di-09', 9)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-data-interpretation-caselet', 'q-di-10', 10)
ON CONFLICT (test_id, question_id) DO NOTHING;

-- 5. Achievements
INSERT INTO public.aptitude_achievements (id, name, slug, description, icon, requirement_type, requirement_value)
VALUES ('ach-first-attempt', 'First Step', 'first-attempt', 'Complete your first aptitude practice session', 'Rocket', 'attempts_count', 1)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.aptitude_achievements (id, name, slug, description, icon, requirement_type, requirement_value)
VALUES ('ach-10-solved', 'Problem Solver', '10-questions-solved', 'Correctly solve 10 aptitude questions', 'CheckCircle2', 'correct_count', 10)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.aptitude_achievements (id, name, slug, description, icon, requirement_type, requirement_value)
VALUES ('ach-50-solved', 'Speed Thinker', '50-questions-solved', 'Correctly solve 50 aptitude questions', 'Zap', 'correct_count', 50)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.aptitude_achievements (id, name, slug, description, icon, requirement_type, requirement_value)
VALUES ('ach-100-solved', 'Century Master', '100-questions-solved', 'Correctly solve 100 aptitude questions', 'Award', 'correct_count', 100)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.aptitude_achievements (id, name, slug, description, icon, requirement_type, requirement_value)
VALUES ('ach-90-accuracy', 'Sharp Precision', '90-percent-accuracy', 'Achieve 90%+ accuracy in any test with at least 10 questions', 'Target', 'accuracy_threshold', 90)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.aptitude_achievements (id, name, slug, description, icon, requirement_type, requirement_value)
VALUES ('ach-7-streak', 'Consistent Learner', '7-day-streak', 'Practice aptitude for 7 days in a row', 'Flame', 'streak_days', 7)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.aptitude_achievements (id, name, slug, description, icon, requirement_type, requirement_value)
VALUES ('ach-first-mock', 'Placement Ready', 'first-mock-test', 'Complete your first company-style full mock test', 'Trophy', 'mock_tests_count', 1)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.aptitude_achievements (id, name, slug, description, icon, requirement_type, requirement_value)
VALUES ('ach-perfect-score', 'Flawless Victory', 'perfect-score', 'Achieve a 100% score on any timed assessment', 'Crown', 'perfect_scores_count', 1)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- 6. Daily Challenge
INSERT INTO public.aptitude_daily_challenges (id, challenge_date, title, duration_minutes, is_active)
VALUES ('daily-today', '2026-09-11', 'Today's Daily Aptitude Challenge', 5, TRUE)
ON CONFLICT (challenge_date) DO UPDATE SET title = EXCLUDED.title;
INSERT INTO public.aptitude_daily_challenge_questions (challenge_id, question_id, display_order)
VALUES ('daily-today', 'q-quant-01', 1)
ON CONFLICT (challenge_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_daily_challenge_questions (challenge_id, question_id, display_order)
VALUES ('daily-today', 'q-logic-01', 2)
ON CONFLICT (challenge_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_daily_challenge_questions (challenge_id, question_id, display_order)
VALUES ('daily-today', 'q-verb-01', 3)
ON CONFLICT (challenge_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_daily_challenge_questions (challenge_id, question_id, display_order)
VALUES ('daily-today', 'q-di-01', 4)
ON CONFLICT (challenge_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_daily_challenge_questions (challenge_id, question_id, display_order)
VALUES ('daily-today', 'q-quant-04', 5)
ON CONFLICT (challenge_id, question_id) DO NOTHING;


-- ========================================================
-- 041_codelab.sql
-- ========================================================
-- Migration 041: CodeLab Schema (Coding Practice Platform)
CREATE TABLE IF NOT EXISTS public.coding_languages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    extension TEXT NOT NULL,
    version TEXT,
    default_template TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.coding_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.coding_problems (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    category_id TEXT REFERENCES public.coding_categories(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}',
    description TEXT NOT NULL,
    input_format TEXT,
    output_format TEXT,
    constraints TEXT,
    hints TEXT[] DEFAULT '{}',
    approach TEXT,
    starter_templates JSONB DEFAULT '{}'::jsonb,
    examples JSONB DEFAULT '[]'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.coding_problem_test_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    problem_id TEXT NOT NULL REFERENCES public.coding_problems(id) ON DELETE CASCADE,
    input TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    is_sample BOOLEAN NOT NULL DEFAULT false,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.coding_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    problem_id TEXT NOT NULL REFERENCES public.coding_problems(id) ON DELETE CASCADE,
    language TEXT NOT NULL,
    code TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Accepted', 'Wrong Answer', 'Time Limit', 'Runtime Error', 'Compilation Error')),
    runtime_ms INT DEFAULT 0,
    memory_kb INT DEFAULT 0,
    test_cases_passed INT DEFAULT 0,
    total_test_cases INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_coding_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    problem_id TEXT NOT NULL REFERENCES public.coding_problems(id) ON DELETE CASCADE,
    is_solved BOOLEAN NOT NULL DEFAULT false,
    attempts_count INT NOT NULL DEFAULT 1,
    solved_at TIMESTAMPTZ,
    last_language TEXT,
    last_code TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, problem_id)
);

CREATE INDEX IF NOT EXISTS idx_coding_problems_slug ON public.coding_problems(slug);
CREATE INDEX IF NOT EXISTS idx_coding_problems_diff ON public.coding_problems(difficulty);
CREATE INDEX IF NOT EXISTS idx_coding_submissions_user ON public.coding_submissions(user_id, problem_id);


-- ========================================================
-- 043_projects.sql
-- ========================================================
-- Migration 043: Projects Hub Schema
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    estimated_hours INT NOT NULL DEFAULT 20,
    banner_url TEXT,
    description TEXT NOT NULL,
    real_world_use_case TEXT,
    learning_objectives TEXT[] DEFAULT '{}',
    prerequisites TEXT[] DEFAULT '{}',
    technologies TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    database_requirements TEXT,
    api_requirements TEXT,
    ui_requirements TEXT,
    deployment_requirements TEXT,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.project_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    step_number INT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('started', 'in_progress', 'completed')),
    progress_pct INT NOT NULL DEFAULT 0,
    completed_steps INT[] DEFAULT '{}',
    github_url TEXT,
    live_demo_url TEXT,
    notes TEXT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, project_id)
);

CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_student_projects_user ON public.student_projects(user_id);


-- ========================================================
-- 045_interview.sql
-- ========================================================
-- Migration 045: Interview Hub Schema
CREATE TABLE IF NOT EXISTS public.interview_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('technical', 'hr')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.interview_questions (
    id TEXT PRIMARY KEY,
    category_id TEXT REFERENCES public.interview_categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'intermediate')),
    suggested_answer TEXT NOT NULL,
    key_points TEXT[] DEFAULT '{}',
    common_mistakes TEXT[] DEFAULT '{}',
    follow_up_questions TEXT[] DEFAULT '{}',
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_interview_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL REFERENCES public.interview_questions(id) ON DELETE CASCADE,
    mastery_status TEXT NOT NULL DEFAULT 'practiced' CHECK (mastery_status IN ('review_needed', 'practiced', 'mastered')),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_interview_questions_cat ON public.interview_questions(category_id);


-- ========================================================
-- 047_career_and_gamification.sql
-- ========================================================
-- Migration 047: Gamification & Career Readiness Schema
CREATE TABLE IF NOT EXISTS public.student_gamification_profile (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_xp INT NOT NULL DEFAULT 0,
    current_level INT NOT NULL DEFAULT 1,
    current_streak INT NOT NULL DEFAULT 0,
    best_streak INT NOT NULL DEFAULT 0,
    last_active_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.xp_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount INT NOT NULL,
    reason TEXT NOT NULL,
    source_type TEXT NOT NULL,
    source_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_career_profile (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    readiness_score INT NOT NULL DEFAULT 0,
    target_role TEXT,
    target_skills TEXT[] DEFAULT '{}',
    cv_url TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ========================================================
-- 049_jobs.sql
-- ========================================================
-- Migration 049: Career & Jobs Board Schema
CREATE TABLE IF NOT EXISTS public.job_listings (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    company_logo TEXT,
    location TEXT NOT NULL,
    work_mode TEXT NOT NULL CHECK (work_mode IN ('Remote', 'Hybrid', 'On-site')),
    employment_type TEXT NOT NULL CHECK (employment_type IN ('Full-time', 'Part-time', 'Internship', 'Contract')),
    experience_level TEXT NOT NULL,
    salary_range TEXT,
    category TEXT NOT NULL,
    skills TEXT[] DEFAULT '{}',
    description TEXT NOT NULL,
    requirements TEXT[] DEFAULT '{}',
    benefits TEXT[] DEFAULT '{}',
    external_apply_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    posted_date TEXT NOT NULL DEFAULT 'Recent',
    application_deadline DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_job_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id TEXT NOT NULL REFERENCES public.job_listings(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);

CREATE TABLE IF NOT EXISTS public.student_job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id TEXT NOT NULL REFERENCES public.job_listings(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'applied' CHECK (status IN ('saved', 'applied', 'interview', 'rejected', 'offer')),
    notes TEXT,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);

CREATE INDEX IF NOT EXISTS idx_job_listings_slug ON public.job_listings(slug);
CREATE INDEX IF NOT EXISTS idx_job_listings_cat ON public.job_listings(category);
CREATE INDEX IF NOT EXISTS idx_job_bookmarks_user ON public.student_job_bookmarks(user_id);
