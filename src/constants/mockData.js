export const CATEGORIES = [
  { id: 'cat-1', name: 'Web Development', slug: 'web-development', icon: 'Code', count: 124 },
  { id: 'cat-2', name: 'Artificial Intelligence', slug: 'artificial-intelligence', icon: 'Cpu', count: 85 },
  { id: 'cat-3', name: 'UI/UX Design', slug: 'ui-ux-design', icon: 'Figma', count: 62 },
  { id: 'cat-4', name: 'Mobile Development', slug: 'mobile-development', icon: 'Smartphone', count: 48 },
  { id: 'cat-5', name: 'Marketing', slug: 'marketing', icon: 'TrendingUp', count: 93 },
  { id: 'cat-6', name: 'Business & Finance', slug: 'business-finance', icon: 'DollarSign', count: 110 },
  { id: 'cat-7', name: 'Photography', slug: 'photography', icon: 'Camera', count: 35 },
  { id: 'cat-8', name: 'Interview Preparation', slug: 'interview-prep', icon: 'Briefcase', count: 54 },
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

export const COURSES = [
  {
    id: 'course-1',
    title: 'The Complete Web Development Bootcamp',
    subtitle: 'Learn HTML, CSS, JavaScript, React, Node.js, and build 25+ real-world projects.',
    description: 'Become a full-stack web developer from scratch. This course covers everything from absolute basics to advanced system deployments. We cover semantic HTML5, CSS Flexbox & Grid, ES6+ Javascript, React, database design, REST APIs, and authentication. By the end, you will be coding professional applications ready for deployment.',
    thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=1600&auto=format&fit=crop&q=80',
    price: 99.99,
    discountPrice: 19.99,
    rating: 4.8,
    studentCount: 84320,
    durationHours: 64.5,
    level: 'Beginner',
    language: 'English',
    hasCertificate: true,
    lifetimeAccess: true,
    badge: 'Bestseller',
    category: 'Web Development',
    teacherId: 'inst-1',
    curriculum: [
      {
        title: 'Section 1: Getting Started with Web Development',
        lessons: [
          { id: 'les-1-1', title: 'Welcome to the Bootcamp!', duration: 5, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', isPreview: true },
          { id: 'les-1-2', title: 'How the Web Works: Clients & Servers', duration: 12, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', isPreview: false },
          { id: 'les-1-3', title: 'Setting Up Your Environment (VS Code & Git)', duration: 18, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', isPreview: false }
        ]
      },
      {
        title: 'Section 2: React.js Essentials',
        lessons: [
          { id: 'les-1-4', title: 'Introduction to React & JSX', duration: 15, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', isPreview: true },
          { id: 'les-1-5', title: 'State & Props: The Core of React', duration: 25, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', isPreview: false }
        ]
      }
    ]
  },
  {
    id: 'course-2',
    title: 'Figma UI/UX Design Masterclass: Figma to Production',
    subtitle: 'Master Figma, Design Systems, UX Research, Wireframing, and interactive prototyping.',
    description: 'Learn modern UI/UX principles and apply them inside Figma. Master vector tools, auto layout 5.0, components, variables, styles, and interactive prototypes. Transition your designs seamlessly into production formats and build a professional portfolio.',
    thumbnail: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1600&auto=format&fit=crop&q=80',
    price: 79.99,
    discountPrice: 14.99,
    rating: 4.9,
    studentCount: 28410,
    durationHours: 32.0,
    level: 'All Levels',
    language: 'English',
    hasCertificate: true,
    lifetimeAccess: true,
    badge: 'Trending',
    category: 'UI/UX Design',
    teacherId: 'inst-2',
    curriculum: [
      {
        title: 'Section 1: Fundamentals of Great UI/UX',
        lessons: [
          { id: 'les-2-1', title: 'Course Overview & Figma Essentials', duration: 8, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', isPreview: true },
          { id: 'les-2-2', title: 'UX Laws Every Designer Must Know', duration: 15, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', isPreview: false }
        ]
      }
    ]
  },
  {
    id: 'course-3',
    title: 'Machine Learning A-Z: Hands-On Python',
    subtitle: 'Learn ML algorithms, Neural Networks, Deep Learning, and data analysis using Python.',
    description: 'Enter the world of Artificial Intelligence. This course teaches regression, classification, clustering, association rules, deep learning, NLP, and model evaluation techniques using Python libraries like TensorFlow, PyTorch, and Scikit-Learn.',
    thumbnail: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=800&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=1600&auto=format&fit=crop&q=80',
    price: 129.99,
    discountPrice: 24.99,
    rating: 4.7,
    studentCount: 45290,
    durationHours: 48.0,
    level: 'Intermediate',
    language: 'English',
    hasCertificate: true,
    lifetimeAccess: true,
    badge: 'Premium',
    category: 'Artificial Intelligence',
    teacherId: 'inst-3',
    curriculum: [
      {
        title: 'Section 1: Data Preprocessing in Python',
        lessons: [
          { id: 'les-3-1', title: 'Introduction to Machine Learning', duration: 10, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', isPreview: true },
          { id: 'les-3-2', title: 'Cleaning Data and Handling Missing Values', duration: 20, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', isPreview: false }
        ]
      }
    ]
  }
];

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
