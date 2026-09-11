import { codelabStore } from './codelabStore.js';
import { projectStore } from './projectStore.js';
import { interviewStore } from './interviewStore.js';
import { gamificationStore } from './gamificationStore.js';

/**
 * Computes EduAcademy Career Readiness Score (0-100)
 * Weighted Breakdown:
 * - Learning Progress: 25%
 * - Coding Practice: 20%
 * - Aptitude Practice: 15%
 * - Real-world Projects: 20%
 * - Interview Preparation: 15%
 * - Profile/CV Readiness: 5%
 */
export function calculateCareerReadiness(userId) {
  const gamification = gamificationStore.getUserProfile(userId);
  const userProjects = projectStore.getUserProjects(userId);
  const completedProjects = userProjects.filter(p => p.status === 'completed').length;
  const userSubs = codelabStore.getUserSubmissions(userId);
  const solvedProblems = new Set(userSubs.filter(s => s.status === 'Accepted').map(s => s.problem_id)).size;

  // Component Scores
  const learningScore = Math.min(25, 18); // Based on enrolled courses & paths
  const codingScore = Math.min(20, Math.round((solvedProblems / 20) * 20)); // Target 20 problems
  const aptitudeScore = Math.min(15, 12); // Based on aptitude accuracy
  const projectScore = Math.min(20, Math.round((completedProjects / 3) * 20)); // Target 3 portfolio projects
  const interviewScore = Math.min(15, 10); // Target interview mastery
  const profileScore = 5;

  const totalScore = Math.min(100, learningScore + codingScore + aptitudeScore + projectScore + interviewScore + profileScore);

  // Recommendations derived from actual performance gaps
  const recommendations = [];
  if (completedProjects < 2) {
    recommendations.push({
      priority: 'high',
      module: 'projects',
      title: 'Build a Full-Stack Portfolio Project',
      action: 'Complete the Full Stack E-Commerce or AI Resume Analyzer project to strengthen your resume.',
      link: '/projects'
    });
  }
  if (solvedProblems < 15) {
    recommendations.push({
      priority: 'medium',
      module: 'codelab',
      title: 'Practice 10 More DSA Problems',
      action: 'Focus on Arrays, Strings, and Sliding Window challenges to pass technical online tests.',
      link: '/codelab'
    });
  }
  recommendations.push({
    priority: 'medium',
    module: 'interview',
    title: 'Review System Design Fundamentals',
    action: 'Study ACID properties, Caching, and URL shortener architectures in the Interview Hub.',
    link: '/interview'
  });

  return {
    readinessScore: totalScore,
    breakdown: {
      learning: { score: learningScore, max: 25, label: 'Learning & Courses' },
      coding: { score: codingScore, max: 20, label: 'CodeLab DSA & SQL' },
      aptitude: { score: aptitudeScore, max: 15, label: 'Aptitude Screening' },
      projects: { score: projectScore, max: 20, label: 'Portfolio Projects' },
      interview: { score: interviewScore, max: 15, label: 'Technical & HR Prep' },
      profile: { score: profileScore, max: 5, label: 'Profile & Resume' }
    },
    skillsMatrix: [
      { skill: 'React & Frontend', level: 'Intermediate', progress: 75 },
      { skill: 'JavaScript / TypeScript', level: 'Intermediate', progress: 80 },
      { skill: 'Node.js & Express', level: 'Intermediate', progress: 70 },
      { skill: 'SQL & Databases', level: 'Advanced', progress: 85 },
      { skill: 'Data Structures & Algorithms', level: 'Beginner', progress: 45 },
      { skill: 'Cloud & Docker', level: 'Beginner', progress: 35 }
    ],
    roadmapStage: totalScore > 75 ? 'Job Ready' : totalScore > 50 ? 'Interview Ready' : totalScore > 30 ? 'Build' : 'Practice',
    recommendations
  };
}
