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
  }
};
