-- ====================================================================
-- SUPABASE DATABASE SCHEMA FOR E-LEARNING E-COMMERCE PLATFORM
-- ====================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Roles table
create table public.roles (
    id uuid default uuid_generate_v4() primary key,
    name text not null unique, -- 'admin', 'teacher', 'student'
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Users table (custom user profile mapping to auth.users)
create table public.users (
    id uuid references auth.users on delete cascade primary key,
    email text not null unique,
    role_id uuid references public.roles(id) on delete set null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Profiles table
create table public.profiles (
    id uuid references public.users(id) on delete cascade primary key,
    full_name text,
    avatar_url text,
    bio text,
    phone text,
    website text,
    linkedin_url text,
    github_url text,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Teachers table
create table public.teachers (
    id uuid references public.users(id) on delete cascade primary key,
    qualification text,
    designation text,
    experience text,
    specialization text,
    total_courses integer default 0,
    students_count integer default 0,
    rating decimal(3,2) default 5.00,
    is_verified boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Categories table
create table public.categories (
    id uuid default uuid_generate_v4() primary key,
    name text not null unique,
    slug text not null unique,
    icon_name text, -- Lucide icon name
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Subcategories table
create table public.subcategories (
    id uuid default uuid_generate_v4() primary key,
    category_id uuid references public.categories(id) on delete cascade not null,
    name text not null,
    slug text not null unique,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Courses table
create table public.courses (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    subtitle text,
    description text,
    thumbnail_url text,
    banner_url text,
    price decimal(10,2) not null,
    discount_price decimal(10,2),
    rating decimal(3,2) default 0.00,
    student_count integer default 0,
    duration_hours decimal(5,1) default 0.0,
    level text not null default 'All Levels', -- 'Beginner', 'Intermediate', 'Expert', 'All Levels'
    language text default 'English',
    has_certificate boolean default true,
    lifetime_access boolean default true,
    badge text, -- 'Bestseller', 'New', 'Free', 'Premium', 'Trending'
    teacher_id uuid references public.teachers(id) on delete cascade not null,
    subcategory_id uuid references public.subcategories(id) on delete set null,
    is_published boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Course Sections table
create table public.course_sections (
    id uuid default uuid_generate_v4() primary key,
    course_id uuid references public.courses(id) on delete cascade not null,
    title text not null,
    sort_order integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Course Lessons table
create table public.course_lessons (
    id uuid default uuid_generate_v4() primary key,
    section_id uuid references public.course_sections(id) on delete cascade not null,
    title text not null,
    video_url text,
    pdf_url text,
    duration_minutes integer default 0,
    is_preview boolean default false,
    sort_order integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. Enrollments table (Course progress tracking)
create table public.enrollments (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    course_id uuid references public.courses(id) on delete cascade not null,
    progress_percent integer default 0,
    completed_lessons jsonb default '[]'::jsonb, -- Array of lesson_ids completed
    enrolled_at timestamp with time zone default timezone('utc'::text, now()) not null,
    completed_at timestamp with time zone,
    unique(user_id, course_id)
);

-- 11. Orders table
create table public.orders (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    coupon_code text,
    subtotal decimal(10,2) not null,
    discount_amount decimal(10,2) default 0.00,
    tax_amount decimal(10,2) default 0.00,
    grand_total decimal(10,2) not null,
    status text not null default 'pending', -- 'pending', 'completed', 'failed'
    billing_details jsonb, -- address, name, country
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 12. Payments table
create table public.payments (
    id uuid default uuid_generate_v4() primary key,
    order_id uuid references public.orders(id) on delete cascade not null,
    payment_method text not null, -- 'credit_card', 'paypal', etc.
    transaction_id text,
    amount decimal(10,2) not null,
    status text not null, -- 'success', 'failed'
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 13. Wishlist table
create table public.wishlist (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    course_id uuid references public.courses(id) on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, course_id)
);

-- 14. Cart table
create table public.cart (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    course_id uuid references public.courses(id) on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, course_id)
);

-- 15. Reviews table
create table public.reviews (
    id uuid default uuid_generate_v4() primary key,
    course_id uuid references public.courses(id) on delete cascade not null,
    user_id uuid references public.users(id) on delete cascade not null,
    rating integer not null check (rating >= 1 and rating <= 5),
    comment text,
    reply_comment text,
    is_verified_purchase boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(course_id, user_id)
);

-- 16. Notifications table
create table public.notifications (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    title text not null,
    content text not null,
    type text not null, -- 'purchase', 'lesson', 'assignment', 'certificate', 'message', 'announcement'
    is_read boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 17. Messages table
create table public.messages (
    id uuid default uuid_generate_v4() primary key,
    sender_id uuid references public.users(id) on delete cascade not null,
    receiver_id uuid references public.users(id) on delete cascade not null,
    message_text text not null,
    is_read boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 18. Certificates table
create table public.certificates (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    course_id uuid references public.courses(id) on delete cascade not null,
    certificate_code text not null unique,
    issued_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 19. Analytics table
create table public.analytics (
    id uuid default uuid_generate_v4() primary key,
    event_type text not null,
    metadata jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 20. Coupons table
create table public.coupons (
    id uuid default uuid_generate_v4() primary key,
    code text not null unique,
    discount_percent integer not null,
    expiry_date timestamp with time zone not null,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 21. Announcements table
create table public.announcements (
    id uuid default uuid_generate_v4() primary key,
    course_id uuid references public.courses(id) on delete cascade, -- null means global
    title text not null,
    content text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 22. FAQ table
create table public.faq (
    id uuid default uuid_generate_v4() primary key,
    question text not null,
    answer text not null,
    sort_order integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 23. Contact Messages table
create table public.contact_messages (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    email text not null,
    subject text,
    message text not null,
    is_resolved boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.teachers enable row level security;
alter table public.courses enable row level security;
alter table public.course_sections enable row level security;
alter table public.course_lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.orders enable row level security;
alter table public.payments enable row level security;
alter table public.wishlist enable row level security;
alter table public.cart enable row level security;
alter table public.reviews enable row level security;
alter table public.notifications enable row level security;
alter table public.messages enable row level security;
alter table public.certificates enable row level security;
alter table public.coupons enable row level security;
alter table public.announcements enable row level security;
alter table public.faq enable row level security;
alter table public.contact_messages enable row level security;

-- Example Policies
-- Profiles: Users can read all profiles but only update their own
create policy "Allow public read on profiles" on public.profiles for select using (true);
create policy "Allow users to update own profile" on public.profiles for update using (auth.uid() = id);

-- Courses: Anyone can read published courses
create policy "Allow public read on published courses" on public.courses for select using (is_published = true);
create policy "Allow teachers to manage own courses" on public.courses for all using (auth.uid() = teacher_id);

-- Enrollments: Users can only see their own enrollments
create policy "Allow users to see own enrollments" on public.enrollments for select using (auth.uid() = user_id);

-- Review policy
create policy "Allow public read on reviews" on public.reviews for select using (true);
create policy "Allow enrolled users to review" on public.reviews for insert with check (auth.uid() = user_id);
create policy "Allow users to update own reviews" on public.reviews for update using (auth.uid() = user_id);
create policy "Allow users to delete own reviews" on public.reviews for delete using (auth.uid() = user_id);

-- FAQ policy
create policy "Allow public read on FAQ" on public.faq for select using (true);
