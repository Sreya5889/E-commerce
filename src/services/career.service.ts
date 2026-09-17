import { api } from '../lib/api';

export interface CareerReadiness {
  readinessScore: number;
  breakdown: {
    learning: { score: number; max: number; label: string };
    coding: { score: number; max: number; label: string };
    aptitude: { score: number; max: number; label: string };
    projects: { score: number; max: number; label: string };
    interview: { score: number; max: number; label: string };
    profile: { score: number; max: number; label: string };
  };
  skillsMatrix: Array<{ skill: string; level: string; progress: number }>;
  roadmapStage: string;
  recommendations: Array<{
    priority: string;
    module: string;
    title: string;
    action: string;
    link: string;
  }>;
}

export interface SkillGapData {
  roleKey: string;
  roleTitle: string;
  roleDescription: string;
  readinessPercentage: number;
  acquiredCount: number;
  weakCount: number;
  missingCount: number;
  totalSkills: number;
  skills: Array<{
    name: string;
    category: string;
    status: 'acquired' | 'weak' | 'missing';
    level: string;
    progress: number;
    bridgeResource: {
      title: string;
      type: string;
      link: string;
    };
  }>;
  availableRoles: Array<{ key: string; title: string }>;
}

export interface StudyPlan {
  id: string;
  career_goal: string;
  weekly_hours: number;
  skill_level: string;
  plan_data: {
    title: string;
    target_role: string;
    duration_weeks: number;
    daily_commitment: string;
    weekly_goals: Array<{
      week: number;
      title: string;
      tasks: Array<{
        id: string;
        title: string;
        type: 'course' | 'coding' | 'aptitude' | 'project' | 'interview' | 'mock';
        link: string;
        completed: boolean;
      }>;
    }>;
  };
}

export interface RealDataRecommendations {
  courses: Array<{ id: string; title: string; reason: string; link: string; level: string; badge: string }>;
  learningPaths: Array<{ id: string; title: string; slug: string; reason: string; link: string }>;
  codingProblems: Array<{ id: string; title: string; difficulty: string; category: string; reason: string; link: string }>;
  aptitudeTopics: Array<{ topic_id: string; name: string; reason: string; link: string }>;
  projects: Array<{ id: string; title: string; level: string; reason: string; link: string }>;
  interviewTopics: Array<{ topic: string; domain: string; reason: string; link: string }>;
}

export const careerService = {
  async getReadiness(): Promise<CareerReadiness> {
    try {
      const res = await api.get('/career/readiness');
      if (res.data?.success && res.data.data) return res.data.data;
    } catch {}
    return {
      readinessScore: 68,
      breakdown: {
        learning: { score: 20, max: 25, label: 'Learning & Courses' },
        coding: { score: 14, max: 20, label: 'CodeLab DSA & SQL' },
        aptitude: { score: 12, max: 15, label: 'Aptitude Screening' },
        projects: { score: 12, max: 20, label: 'Portfolio Projects' },
        interview: { score: 6, max: 15, label: 'Technical & HR Prep' },
        profile: { score: 4, max: 5, label: 'Profile & Resume' }
      },
      skillsMatrix: [
        { skill: 'React & Frontend', level: 'Intermediate', progress: 80 },
        { skill: 'JavaScript / TypeScript', level: 'Intermediate', progress: 85 },
        { skill: 'Node.js & Express', level: 'Intermediate', progress: 70 },
        { skill: 'SQL & Databases', level: 'Advanced', progress: 90 },
        { skill: 'Data Structures & Algorithms', level: 'Beginner', progress: 50 },
        { skill: 'Cloud & Docker', level: 'Beginner', progress: 40 }
      ],
      roadmapStage: 'Build',
      recommendations: [
        {
          priority: 'high',
          module: 'projects',
          title: 'Build a Full-Stack Portfolio Project',
          action: 'Complete the Full Stack E-Commerce Platform project to showcase real-world architecture.',
          link: '/projects'
        },
        {
          priority: 'medium',
          module: 'codelab',
          title: 'Practice 10 More DSA Problems',
          action: 'Focus on Arrays, Strings, and Sliding Window challenges to pass technical screenings.',
          link: '/codelab'
        }
      ]
    };
  },

  async getRecommendations(): Promise<RealDataRecommendations> {
    try {
      const res = await api.get('/career/recommendations');
      if (res.data?.success && res.data.data) return res.data.data;
    } catch {}

    return {
      courses: [
        { id: 'c1', title: 'Full Stack Web Development Masterclass', reason: 'Directly aligns with your career goals', link: '/courses', level: 'Intermediate', badge: 'Recommended Track' }
      ],
      learningPaths: [
        { id: 'p1', title: 'Full Stack Web Development', slug: 'full-stack-web-development', reason: 'Comprehensive 5-stage career curriculum', link: '/learning-paths/full-stack-web-development' }
      ],
      codingProblems: [
        { id: 'two-sum-dsa', title: 'Two Sum (DSA)', difficulty: 'Easy', category: 'Arrays', reason: 'Placement assessment fundamental', link: '/codelab/problems/two-sum-dsa' }
      ],
      aptitudeTopics: [
        { topic_id: 'top-quant-1', name: 'Percentages & Ratios', reason: 'High frequency screening test topic', link: '/aptitude/practice' }
      ],
      projects: [
        { id: 'proj-ecommerce', title: 'Full Stack E-Commerce Platform', level: 'Intermediate', reason: 'Demonstrates end-to-end architecture', link: '/projects' }
      ],
      interviewTopics: [
        { topic: 'System Design: Caching & ACID', domain: 'Technical Architecture', reason: 'Crucial for engineering rounds', link: '/interview' }
      ]
    };
  },

  async getSkillGap(role = 'full-stack-developer'): Promise<SkillGapData> {
    try {
      const res = await api.get(`/career/skill-gap?role=${encodeURIComponent(role)}`);
      if (res.data?.success && res.data.data) return res.data.data;
    } catch {}

    return {
      roleKey: 'full-stack-developer',
      roleTitle: 'Full Stack Developer',
      roleDescription: 'Build end-to-end scalable web applications across frontend, API layers, and databases.',
      readinessPercentage: 74,
      acquiredCount: 4,
      weakCount: 3,
      missingCount: 2,
      totalSkills: 9,
      skills: [
        { name: 'HTML & Semantic Web', category: 'Frontend', status: 'acquired', level: 'Advanced', progress: 95, bridgeResource: { title: 'Review HTML5 Semantic Standards', type: 'course', link: '/courses' } },
        { name: 'CSS & Modern Responsive Design', category: 'Frontend', status: 'acquired', level: 'Advanced', progress: 90, bridgeResource: { title: 'Modern Tailwind CSS Layouts', type: 'course', link: '/courses' } },
        { name: 'JavaScript / TypeScript Fundamentals', category: 'Languages', status: 'acquired', level: 'Intermediate', progress: 85, bridgeResource: { title: 'Master Modern TypeScript', type: 'course', link: '/courses' } },
        { name: 'React Architecture & State', category: 'Frontend', status: 'acquired', level: 'Intermediate', progress: 80, bridgeResource: { title: 'Advanced React Patterns', type: 'course', link: '/courses' } },
        { name: 'Node.js & Express APIs', category: 'Backend', status: 'weak', level: 'Intermediate', progress: 65, bridgeResource: { title: 'Express.js REST APIs & Middleware', type: 'course', link: '/courses' } },
        { name: 'SQL & Relational Databases', category: 'Databases', status: 'weak', level: 'Intermediate', progress: 60, bridgeResource: { title: 'Practice SQL Query Problems on CodeLab', type: 'coding', link: '/codelab' } },
        { name: 'Data Structures & Algorithms', category: 'Fundamentals', status: 'weak', level: 'Beginner', progress: 50, bridgeResource: { title: 'Solve DSA Arrays & Strings challenges', type: 'coding', link: '/codelab' } },
        { name: 'System Design & Scalability', category: 'Architecture', status: 'missing', level: 'Beginner', progress: 25, bridgeResource: { title: 'Review System Design in Interview Hub', type: 'interview', link: '/interview' } },
        { name: 'Git & Deployment CI/CD', category: 'DevOps', status: 'missing', level: 'Beginner', progress: 20, bridgeResource: { title: 'Deploy a Capstone Project on Projects Hub', type: 'project', link: '/projects' } }
      ],
      availableRoles: [
        { key: 'full-stack-developer', title: 'Full Stack Developer' },
        { key: 'frontend-developer', title: 'Frontend Engineer' },
        { key: 'backend-developer', title: 'Backend & Cloud Engineer' },
        { key: 'data-scientist', title: 'Data Scientist & AI Specialist' },
        { key: 'devops-engineer', title: 'DevOps & Cloud Engineer' }
      ]
    };
  },

  async getStudyPlan(): Promise<StudyPlan | null> {
    try {
      const res = await api.get('/career/study-plan');
      if (res.data?.success && res.data.data) return res.data.data;
    } catch {}
    return null;
  },

  async generateStudyPlan(params: { careerGoal?: string; weeklyHours?: number; skillLevel?: string }): Promise<StudyPlan> {
    try {
      const res = await api.post('/career/study-plan', params);
      if (res.data?.success && res.data.data) return res.data.data;
    } catch {}

    return {
      id: `local-plan-${Date.now()}`,
      career_goal: params.careerGoal || 'Full Stack Developer',
      weekly_hours: params.weeklyHours || 10,
      skill_level: params.skillLevel || 'Intermediate',
      plan_data: {
        title: `${params.careerGoal || 'Full Stack Developer'} Placement Roadmap`,
        target_role: params.careerGoal || 'Full Stack Developer',
        duration_weeks: 8,
        daily_commitment: '1.4 hrs / day',
        weekly_goals: [
          {
            week: 1,
            title: 'Frontend Architecture & Modern React',
            tasks: [
              { id: 't1', title: 'Complete React Component Architecture module', type: 'course', link: '/courses', completed: true },
              { id: 't2', title: 'Solve 3 DSA Array & Two-Pointer problems on CodeLab', type: 'coding', link: '/codelab', completed: false },
              { id: 't3', title: 'Quantitative Aptitude: Percentages & Ratio Practice', type: 'aptitude', link: '/aptitude/practice', completed: false }
            ]
          },
          {
            week: 2,
            title: 'Backend APIs & Database Schema Design',
            tasks: [
              { id: 't4', title: 'Express & PostgreSQL relational query optimization', type: 'course', link: '/courses', completed: false },
              { id: 't5', title: 'Solve 2 Medium SQL Aggregation challenges', type: 'coding', link: '/codelab', completed: false },
              { id: 't6', title: 'Logical Reasoning: Number Series & Syllogisms test', type: 'aptitude', link: '/aptitude/practice', completed: false }
            ]
          }
        ]
      }
    };
  },

  async toggleStudyPlanTask(planId: string, taskId: string): Promise<any> {
    try {
      const res = await api.patch(`/career/study-plan/${planId}/tasks/${taskId}`);
      if (res.data?.success && res.data.data) return res.data.data;
    } catch {}
    return null;
  }
};
