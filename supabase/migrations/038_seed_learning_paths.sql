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
