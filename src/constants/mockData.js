import coursesCatalog from '../../server/data/courses.json';

export const CATEGORIES = [
  { id: 'cat-001-0000-0000-0000-000000000001', name: 'Web Development', slug: 'web-development', icon: 'Code', count: 124 },
  { id: 'cat-002-0000-0000-0000-000000000002', name: 'Frontend Development', slug: 'frontend-development', icon: 'Layout', count: 86 },
  { id: 'cat-003-0000-0000-0000-000000000003', name: 'Backend Development', slug: 'backend-development', icon: 'Server', count: 72 },
  { id: 'cat-004-0000-0000-0000-000000000004', name: 'Full Stack', slug: 'full-stack', icon: 'Layers', count: 95 },
  { id: 'cat-005-0000-0000-0000-000000000005', name: 'React', slug: 'react', icon: 'Atom', count: 88 },
  { id: 'cat-006-0000-0000-0000-000000000006', name: 'Java', slug: 'java', icon: 'Coffee', count: 54 },
  { id: 'cat-007-0000-0000-0000-000000000007', name: 'Python', slug: 'python', icon: 'Terminal', count: 110 },
  { id: 'cat-008-0000-0000-0000-000000000008', name: 'Artificial Intelligence', slug: 'artificial-intelligence', icon: 'Cpu', count: 85 },
  { id: 'cat-009-0000-0000-0000-000000000009', name: 'Machine Learning', slug: 'machine-learning', icon: 'GitBranch', count: 76 },
  { id: 'cat-010-0000-0000-0000-000000000010', name: 'Data Science', slug: 'data-science', icon: 'BarChart2', count: 68 },
  { id: 'cat-011-0000-0000-0000-000000000011', name: 'Cloud Computing', slug: 'cloud-computing', icon: 'Cloud', count: 59 },
  { id: 'cat-012-0000-0000-0000-000000000012', name: 'Cyber Security', slug: 'cyber-security', icon: 'Shield', count: 47 },
  { id: 'cat-013-0000-0000-0000-000000000013', name: 'UI/UX Design', slug: 'ui-ux-design', icon: 'Figma', count: 62 },
  { id: 'cat-014-0000-0000-0000-000000000014', name: 'Mobile Development', slug: 'mobile-development', icon: 'Smartphone', count: 48 },
  { id: 'cat-015-0000-0000-0000-000000000015', name: 'Graphic Design', slug: 'graphic-design', icon: 'Image', count: 42 },
  { id: 'cat-016-0000-0000-0000-000000000016', name: 'Marketing', slug: 'marketing', icon: 'TrendingUp', count: 93 },
  { id: 'cat-017-0000-0000-0000-000000000017', name: 'Business', slug: 'business', icon: 'Briefcase', count: 64 },
  { id: 'cat-018-0000-0000-0000-000000000018', name: 'Finance', slug: 'finance', icon: 'DollarSign', count: 52 },
  { id: 'cat-019-0000-0000-0000-000000000019', name: 'Photography', slug: 'photography', icon: 'Camera', count: 35 },
  { id: 'cat-020-0000-0000-0000-000000000020', name: 'Music', slug: 'music', icon: 'Music', count: 29 },
  { id: 'cat-021-0000-0000-0000-000000000021', name: 'Communication Skills', slug: 'communication-skills', icon: 'MessageCircle', count: 41 },
  { id: 'cat-022-0000-0000-0000-000000000022', name: 'Interview Preparation', slug: 'interview-prep', icon: 'Award', count: 54 },
];

export const INSTRUCTORS = [
  {
    id: 'inst-1',
    name: 'Dr. Angela Steele',
    qualification: 'Ph.D. in Computer Science',
    designation: 'Senior Full-Stack Engineer & Educator',
    biography: 'Angela is a former tech lead at Google and has helped over 1,000,000 students worldwide learn to code. Her teaching methodology focuses on building real-world projects and learning by doing.',
    experience: '12+ Years in Software Engineering, 8+ Years in Teaching',
    skills: ['React', 'Node.js', 'Python', 'System Design', 'SQL', 'TypeScript'],
    specialization: 'Full Stack Web Development & Software Engineering',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    website: 'https://angelasteele.io',
    email: 'angela@eduacademy.com',
    phone: '+1 (555) 382-9102',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&q=80',
    totalCourses: 15,
    students: 1240500,
    rating: 4.8,
    reviewsCount: 184300,
    isVerified: true,
    achievements: ['Google Developer Expert', 'Top Udemy Instructor 2025', 'Best Curriculum Award']
  },
  {
    id: 'inst-2',
    name: 'Sarah Chen',
    qualification: 'M.S. in Human-Computer Interaction',
    designation: 'Design Lead at Meta',
    biography: 'Sarah is an award-winning UI/UX designer who believes that design should be both functional and beautiful. She has designed interfaces used by billions of users globally and loves teaching design thinking.',
    experience: '10+ Years in Product Design, 4+ Years Teaching',
    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Interaction Design'],
    specialization: 'UI/UX Design, Design Systems & Interaction Design',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    website: 'https://sarahchendesign.com',
    email: 'sarah.chen@eduacademy.com',
    phone: '+1 (555) 728-1934',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&q=80',
    totalCourses: 6,
    students: 320400,
    rating: 4.9,
    reviewsCount: 43200,
    isVerified: true,
    achievements: ['Red Dot Design Award Winner', 'Speaker at Figma Config']
  },
  {
    id: 'inst-3',
    name: 'David Miller',
    qualification: 'M.S. in Machine Learning',
    designation: 'AI Architect & Data Scientist',
    biography: 'David specializes in deep neural networks and NLP models. He works with tech startups to integrate state-of-the-art AI features. He simplifies complex mathematical models into easy-to-understand explanations.',
    experience: '8+ Years in AI Research & Machine Learning Engineering',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-Learn', 'Pandas', 'Deep Learning'],
    specialization: 'Machine Learning, Deep Learning, & Generative AI',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    website: 'https://davidmiller.ai',
    email: 'david.miller@eduacademy.com',
    phone: '+1 (555) 910-2345',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&q=80',
    totalCourses: 8,
    students: 450100,
    rating: 4.7,
    reviewsCount: 52100,
    isVerified: true,
    achievements: ['Author of AI Handbook', 'NVIDIA Certified Instructor']
  }
];

export const COURSES = coursesCatalog;

export const REVIEWS = [
  {
    id: 'rev-1',
    courseId: 'course-1',
    userName: 'John Doe',
    rating: 5,
    comment: 'Absolutely amazing bootcamp. Angela explains every concept step-by-step with real projects. I got a junior dev job after this course!',
    replyComment: 'Thank you John! I am so happy to hear that. Best of luck in your new career!',
    isVerifiedPurchase: true,
    createdAt: '2026-06-15T09:00:00Z'
  },
  {
    id: 'rev-2',
    courseId: 'course-1',
    userName: 'Alice Smith',
    rating: 4,
    comment: 'Excellent content! The React section is solid. I just wish the Node database section had a bit more explanation on custom joins.',
    isVerifiedPurchase: true,
    createdAt: '2026-07-02T14:30:00Z'
  },
  {
    id: 'rev-3',
    courseId: 'course-2',
    userName: 'Mark Wilson',
    rating: 5,
    comment: 'Sarah is the best design teacher. Her Metas design secrets were worth the price alone. Essential for frontend developers too!',
    isVerifiedPurchase: true,
    createdAt: '2026-07-10T11:15:00Z'
  }
];

export const COUPONS = [
  { code: 'UDEMY50', discountPercent: 50, isActive: true },
  { code: 'WELCOME10', discountPercent: 10, isActive: true },
  { code: 'EDUFREE', discountPercent: 100, isActive: true }
];

export const FAQS = [
  {
    question: 'How do I access my certificates?',
    answer: 'Once you complete 100% of a course curriculum (all lessons are checked), a certificate is generated automatically in your User Dashboard. You can view, share, or download it as a PDF.'
  },
  {
    question: 'Is there a time limit to complete courses?',
    answer: 'No. Every course you purchase includes lifetime access. You can learn at your own pace, on any device (desktop, tablet, or phone), and resume whenever you want.'
  },
  {
    question: 'Can I get a refund if I do not like a course?',
    answer: 'Yes. We offer a 30-day money-back guarantee for all purchases. Simply request a refund through your purchase history dashboard.'
  },
  {
    question: 'Can I teach a course on this platform?',
    answer: 'Yes! We are always looking for industry specialists. You can register as an instructor, apply for verification, and publish your courses after admin review.'
  }
];
