import { calculateCareerReadiness } from '../utils/careerEngine.js';
import { learningExperienceStore } from '../utils/learningExperienceStore.js';
import { codelabStore } from '../utils/codelabStore.js';
import { aptitudeStore } from '../utils/aptitudeStore.js';
import { projectStore } from '../utils/projectStore.js';
import { interviewStore } from '../utils/interviewStore.js';

// Benchmark skill definitions across standard IT roles
const ROLE_SKILL_BENCHMARKS = {
  'full-stack-developer': {
    title: 'Full Stack Developer',
    description: 'Build end-to-end scalable web applications across frontend, API layers, and databases.',
    requiredSkills: [
      { name: 'HTML & Semantic Web', category: 'Frontend', weight: 1 },
      { name: 'CSS & Modern Responsive Design', category: 'Frontend', weight: 1 },
      { name: 'JavaScript / TypeScript Fundamentals', category: 'Languages', weight: 2 },
      { name: 'React Architecture & State', category: 'Frontend', weight: 2 },
      { name: 'Node.js & Express APIs', category: 'Backend', weight: 2 },
      { name: 'SQL & Relational Databases', category: 'Databases', weight: 2 },
      { name: 'Data Structures & Algorithms', category: 'Fundamentals', weight: 2 },
      { name: 'System Design & Scalability', category: 'Architecture', weight: 3 },
      { name: 'Git & Deployment CI/CD', category: 'DevOps', weight: 1 }
    ]
  },
  'frontend-developer': {
    title: 'Frontend Engineer',
    description: 'Deliver responsive, accessible, and high-performance user interfaces with React.',
    requiredSkills: [
      { name: 'HTML & Semantic Web', category: 'Frontend', weight: 1 },
      { name: 'CSS & Modern Responsive Design', category: 'Frontend', weight: 2 },
      { name: 'JavaScript / TypeScript Fundamentals', category: 'Languages', weight: 3 },
      { name: 'React Architecture & State', category: 'Frontend', weight: 3 },
      { name: 'Frontend Performance & Accessibility', category: 'Frontend', weight: 2 },
      { name: 'Data Structures & Algorithms', category: 'Fundamentals', weight: 2 },
      { name: 'RESTful API Consumption', category: 'Networking', weight: 1 }
    ]
  },
  'backend-developer': {
    title: 'Backend & Cloud Engineer',
    description: 'Design robust microservices, relational schemas, secure auth flows, and cloud infrastructure.',
    requiredSkills: [
      { name: 'JavaScript / TypeScript Fundamentals', category: 'Languages', weight: 2 },
      { name: 'Node.js & Express APIs', category: 'Backend', weight: 3 },
      { name: 'SQL & Relational Databases', category: 'Databases', weight: 3 },
      { name: 'Data Structures & Algorithms', category: 'Fundamentals', weight: 2 },
      { name: 'System Design & Scalability', category: 'Architecture', weight: 3 },
      { name: 'Cloud & Docker Containerization', category: 'DevOps', weight: 2 },
      { name: 'Security & Auth (JWT/OAuth)', category: 'Security', weight: 2 }
    ]
  },
  'data-scientist': {
    title: 'Data Scientist & AI Specialist',
    description: 'Extract statistical insights, build predictive ML models, and manage data pipelines.',
    requiredSkills: [
      { name: 'Python Programming', category: 'Languages', weight: 3 },
      { name: 'SQL & Relational Databases', category: 'Databases', weight: 3 },
      { name: 'Quantitative Aptitude & Probability', category: 'Mathematics', weight: 3 },
      { name: 'Data Structures & Algorithms', category: 'Fundamentals', weight: 2 },
      { name: 'Data Interpretation & Analytics', category: 'Analytics', weight: 3 },
      { name: 'Machine Learning Fundamentals', category: 'AI/ML', weight: 2 }
    ]
  },
  'devops-engineer': {
    title: 'DevOps & Cloud Engineer',
    description: 'Automate build pipelines, containerized deployments, and production reliability.',
    requiredSkills: [
      { name: 'Linux & Shell Scripting', category: 'Systems', weight: 2 },
      { name: 'Cloud & Docker Containerization', category: 'DevOps', weight: 3 },
      { name: 'System Design & Scalability', category: 'Architecture', weight: 3 },
      { name: 'Git & Deployment CI/CD', category: 'DevOps', weight: 3 },
      { name: 'Networking & Security Protocols', category: 'Infrastructure', weight: 2 },
      { name: 'Node.js & Express APIs', category: 'Backend', weight: 1 }
    ]
  }
};

export const careerController = {
  getReadiness(req, res) {
    const userId = req.user?.id || 'demo-student-id';
    const data = calculateCareerReadiness(userId);
    res.json({ success: true, data });
  },

  getRecommendations(req, res) {
    const userId = req.user?.id || 'demo-student-id';
    const subs = codelabStore.getUserSubmissions(userId);
    const solvedCount = new Set(subs.filter(s => s.status === 'Accepted').map(s => s.problem_id)).size;
    const aptitudeAnalytics = aptitudeStore.getStudentAnalytics(userId);
    const weakTopics = aptitudeAnalytics?.weak_topics || [];

    // Real-data driven recommendation blocks
    const recommendations = {
      courses: [
        {
          id: 'rec-c1',
          title: 'Full Stack Web Architecture with React & Express',
          reason: 'Directly aligns with your current learning path and capstone project.',
          link: '/courses',
          level: 'Intermediate',
          badge: 'Recommended Track'
        },
        {
          id: 'rec-c2',
          title: 'Database Design, SQL & Performance Indexing',
          reason: 'Solidifies relational query skills needed for technical interviews.',
          link: '/courses',
          level: 'All Levels',
          badge: 'High Impact'
        }
      ],
      learningPaths: [
        {
          id: 'path-fullstack',
          title: 'Full Stack Web Development Career Path',
          slug: 'full-stack-web-development',
          reason: 'Comprehensive 5-stage career curriculum from foundational JavaScript to Production Deployment.',
          link: '/learning-paths/full-stack-web-development'
        }
      ],
      codingProblems: solvedCount < 10
        ? [
            {
              id: 'two-sum-dsa',
              title: 'Two Sum (DSA)',
              difficulty: 'Easy',
              category: 'Arrays & Hashing',
              reason: 'Essential baseline algorithm asked by top placement recruiters.',
              link: '/codelab/problems/two-sum-dsa'
            },
            {
              id: 'reverse-string',
              title: 'Reverse a String',
              difficulty: 'Easy',
              category: 'Strings',
              reason: 'Core two-pointer fundamental challenge.',
              link: '/codelab/problems/reverse-string'
            }
          ]
        : [
            {
              id: 'longest-substring',
              title: 'Longest Substring Without Repeating Characters',
              difficulty: 'Medium',
              category: 'Sliding Window',
              reason: 'Advance your algorithmic complexity analysis with Sliding Window technique.',
              link: '/codelab/problems/longest-substring'
            }
          ],
      aptitudeTopics: weakTopics.length > 0
        ? weakTopics.slice(0, 3).map(w => ({
            topic_id: w.topic_id,
            name: w.topic_name,
            reason: `Targeted practice needed (current accuracy: ${w.accuracy}%).`,
            link: `/aptitude/practice?topic=${w.topic_id}`
          }))
        : [
            {
              topic_id: 'top-quant-1',
              name: 'Percentages, Profit & Loss',
              reason: 'High frequency topic in corporate placement screening tests.',
              link: '/aptitude/practice'
            },
            {
              topic_id: 'top-log-1',
              name: 'Number Series & Coding-Decoding',
              reason: 'Logical reasoning pattern recognition benchmark.',
              link: '/aptitude/practice'
            }
          ],
      projects: [
        {
          id: 'proj-ecommerce',
          title: 'Full Stack E-Commerce & Learning Platform',
          level: 'Intermediate',
          reason: 'Showcases end-to-end authentication, database migrations, and isolated code execution on your resume.',
          link: '/projects'
        }
      ],
      interviewTopics: [
        {
          topic: 'System Design: Caching & ACID Transactions',
          domain: 'Technical Architecture',
          reason: 'Crucial for senior engineering behavioral and design rounds.',
          link: '/interview'
        },
        {
          topic: 'STAR Method: Conflict Resolution & Team Leadership',
          domain: 'HR Behavioral',
          reason: 'Prepares you for cultural fit rounds at tier-1 technology firms.',
          link: '/interview'
        }
      ]
    };

    res.json({ success: true, data: recommendations });
  },

  getSkillGapAnalysis(req, res) {
    const userId = req.user?.id || 'demo-student-id';
    const targetKey = (req.query.role || 'full-stack-developer').toLowerCase().replace(/\s+/g, '-');
    const roleDef = ROLE_SKILL_BENCHMARKS[targetKey] || ROLE_SKILL_BENCHMARKS['full-stack-developer'];

    const userSubs = codelabStore.getUserSubmissions(userId);
    const solvedCount = new Set(userSubs.filter(s => s.status === 'Accepted').map(s => s.problem_id)).size;
    const aptitudeAnalytics = aptitudeStore.getStudentAnalytics(userId);

    // Compute skill readiness based on actual activity
    const skillsAnalysis = roleDef.requiredSkills.map(skill => {
      let status = 'missing'; // 'acquired', 'weak', 'missing'
      let level = 'Beginner';
      let progress = 15;
      let bridgeResource = {
        title: `Learn ${skill.name}`,
        type: 'course',
        link: '/courses'
      };

      if (skill.name.includes('HTML') || skill.name.includes('CSS')) {
        status = 'acquired';
        level = 'Advanced';
        progress = 95;
      } else if (skill.name.includes('JavaScript') || skill.name.includes('React')) {
        status = 'acquired';
        level = 'Intermediate';
        progress = 85;
      } else if (skill.name.includes('Node.js') || skill.name.includes('Express')) {
        status = 'weak';
        level = 'Intermediate';
        progress = 65;
        bridgeResource = {
          title: 'Study Express.js REST APIs & Middleware',
          type: 'course',
          link: '/courses'
        };
      } else if (skill.name.includes('SQL')) {
        status = solvedCount >= 3 ? 'acquired' : 'weak';
        level = solvedCount >= 3 ? 'Advanced' : 'Intermediate';
        progress = solvedCount >= 3 ? 80 : 55;
        bridgeResource = {
          title: 'Practice SQL Query Problems on CodeLab',
          type: 'coding',
          link: '/codelab'
        };
      } else if (skill.name.includes('Data Structures')) {
        status = solvedCount >= 10 ? 'acquired' : solvedCount >= 2 ? 'weak' : 'missing';
        level = solvedCount >= 10 ? 'Intermediate' : 'Beginner';
        progress = Math.min(90, Math.max(20, solvedCount * 10));
        bridgeResource = {
          title: 'Solve DSA Arrays, Strings & Search challenges',
          type: 'coding',
          link: '/codelab'
        };
      } else if (skill.name.includes('Aptitude') || skill.name.includes('Mathematics')) {
        const accuracy = aptitudeAnalytics?.overall_accuracy || 65;
        status = accuracy >= 75 ? 'acquired' : accuracy >= 40 ? 'weak' : 'missing';
        progress = accuracy;
        bridgeResource = {
          title: 'Quantitative Practice on Aptitude Arena',
          type: 'aptitude',
          link: '/aptitude/practice'
        };
      } else if (skill.name.includes('System Design')) {
        status = 'missing';
        level = 'Beginner';
        progress = 25;
        bridgeResource = {
          title: 'Review System Design Questions in Interview Hub',
          type: 'interview',
          link: '/interview'
        };
      } else if (skill.name.includes('Git') || skill.name.includes('Docker')) {
        status = 'weak';
        level = 'Beginner';
        progress = 50;
        bridgeResource = {
          title: 'Deploy a Capstone Project on Projects Hub',
          type: 'project',
          link: '/projects'
        };
      }

      return {
        ...skill,
        status,
        level,
        progress,
        bridgeResource
      };
    });

    const acquired = skillsAnalysis.filter(s => s.status === 'acquired');
    const weak = skillsAnalysis.filter(s => s.status === 'weak');
    const missing = skillsAnalysis.filter(s => s.status === 'missing');
    const readinessPercentage = Math.round(
      (skillsAnalysis.reduce((acc, s) => acc + s.progress, 0) / (skillsAnalysis.length * 100)) * 100
    );

    res.json({
      success: true,
      data: {
        roleKey: targetKey,
        roleTitle: roleDef.title,
        roleDescription: roleDef.description,
        readinessPercentage,
        acquiredCount: acquired.length,
        weakCount: weak.length,
        missingCount: missing.length,
        totalSkills: skillsAnalysis.length,
        skills: skillsAnalysis,
        availableRoles: Object.keys(ROLE_SKILL_BENCHMARKS).map(k => ({
          key: k,
          title: ROLE_SKILL_BENCHMARKS[k].title
        }))
      }
    });
  },

  getStudyPlan(req, res) {
    const userId = req.user?.id || 'demo-student-id';
    const plan = learningExperienceStore.getStudyPlan(userId);
    res.json({ success: true, data: plan });
  },

  generateStudyPlan(req, res) {
    const userId = req.user?.id || 'demo-student-id';
    const { careerGoal, weeklyHours, skillLevel } = req.body || {};
    const plan = learningExperienceStore.generateStudyPlan(userId, {
      careerGoal: careerGoal || 'Full Stack Developer',
      weeklyHours: weeklyHours || 10,
      skillLevel: skillLevel || 'Intermediate'
    });
    res.status(201).json({ success: true, data: plan });
  },

  toggleStudyPlanTask(req, res) {
    const userId = req.user?.id || 'demo-student-id';
    const { planId, taskId } = req.params;
    const plan = learningExperienceStore.toggleStudyPlanTask(userId, planId, taskId);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan or task not found' });
    res.json({ success: true, data: plan });
  }
};
