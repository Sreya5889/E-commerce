import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.resolve(__dirname, '../data/learningExperience.json');

export const learningExperienceStore = {
  getData() {
    try {
      if (!fs.existsSync(DATA_FILE)) {
        this.saveData({
          notes: [],
          bookmarks: [],
          quizzes: [],
          quiz_attempts: [],
          study_plans: [],
          resume_positions: []
        });
      }
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (err) {
      console.warn('[learningExperienceStore] Error reading JSON:', err.message);
      return { notes: [], bookmarks: [], quizzes: [], quiz_attempts: [], study_plans: [], resume_positions: [] };
    }
  },

  saveData(data) {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
      console.error('[learningExperienceStore] Error writing JSON:', err.message);
    }
  },

  // 1. NOTES
  getNotes(userId, courseId = null, lessonId = null) {
    const data = this.getData();
    let notes = (data.notes || []).filter(n => n.user_id === userId || n.user_id === 'demo-student-id');
    if (courseId) {
      notes = notes.filter(n => n.course_id === courseId);
    }
    if (lessonId) {
      notes = notes.filter(n => n.lesson_id === lessonId);
    }
    return notes.sort((a, b) => (a.timestamp_seconds || 0) - (b.timestamp_seconds || 0));
  },

  saveNote({ userId, courseId, lessonId, content, timestampSeconds = 0 }) {
    const data = this.getData();
    data.notes = data.notes || [];

    const newNote = {
      id: `note-${crypto.randomUUID()}`,
      user_id: userId || 'demo-student-id',
      course_id: courseId,
      lesson_id: lessonId,
      content: content.trim(),
      timestamp_seconds: Number(timestampSeconds) || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    data.notes.push(newNote);
    this.saveData(data);
    return newNote;
  },

  deleteNote(userId, noteId) {
    const data = this.getData();
    data.notes = data.notes || [];
    const initialLen = data.notes.length;
    data.notes = data.notes.filter(n => !(n.id === noteId && (n.user_id === userId || userId === 'demo-student-id')));
    this.saveData(data);
    return data.notes.length < initialLen;
  },

  // 2. BOOKMARKS
  getBookmarks(userId, courseId = null) {
    const data = this.getData();
    let bms = (data.bookmarks || []).filter(b => b.user_id === userId || b.user_id === 'demo-student-id');
    if (courseId) {
      bms = bms.filter(b => b.course_id === courseId);
    }
    return bms;
  },

  toggleBookmark(userId, courseId, lessonId) {
    const data = this.getData();
    data.bookmarks = data.bookmarks || [];
    const uid = userId || 'demo-student-id';

    const index = data.bookmarks.findIndex(
      b => b.user_id === uid && b.course_id === courseId && b.lesson_id === lessonId
    );

    let isBookmarked = false;
    if (index >= 0) {
      data.bookmarks.splice(index, 1);
      isBookmarked = false;
    } else {
      data.bookmarks.push({
        id: `bm-${crypto.randomUUID()}`,
        user_id: uid,
        course_id: courseId,
        lesson_id: lessonId,
        created_at: new Date().toISOString()
      });
      isBookmarked = true;
    }

    this.saveData(data);
    return { isBookmarked, lessonId, courseId };
  },

  // 3. QUIZZES
  getQuiz(lessonId) {
    const data = this.getData();
    const quizzes = data.quizzes || [];
    let quiz = quizzes.find(q => q.lesson_id === lessonId || q.id === lessonId);
    
    // Provide an intelligent contextual quiz fallback if specific lesson quiz not explicitly pre-seeded
    if (!quiz) {
      quiz = {
        id: `quiz-${lessonId}`,
        lesson_id: lessonId,
        title: 'Core Concept & Architecture Mastery Check',
        passing_score: 70,
        questions: [
          {
            id: `q-${lessonId}-1`,
            question: 'What is the primary benefit of decomposing application features into isolated modules?',
            options: [
              'It allows independent testing, maintenance, and prevents cascading failures',
              'It makes bundle size arbitrarily large',
              'It disables browser security policies',
              'It forces strict synchronous execution'
            ],
            correct_index: 0,
            explanation: 'Modular decomposition guarantees high cohesion and loose coupling, ensuring independent testability and maintainability.'
          },
          {
            id: `q-${lessonId}-2`,
            question: 'In production web services, how should sensitive credentials and API keys be protected?',
            options: [
              'Committed to public version control',
              'Managed strictly via isolated server environment variables never exposed to client bundles',
              'Hardcoded in client-side HTML templates',
              'Passed in unencrypted URL query parameters'
            ],
            correct_index: 1,
            explanation: 'Secrets must reside strictly in server environment variables and never leak into frontend artifacts or VCS.'
          }
        ]
      };
    }
    return quiz;
  },

  submitQuizAttempt({ userId, quizId, answers = [] }) {
    const data = this.getData();
    data.quiz_attempts = data.quiz_attempts || [];
    const quiz = (data.quizzes || []).find(q => q.id === quizId || q.lesson_id === quizId) || this.getQuiz(quizId);

    const questions = quiz.questions || [];
    let correctCount = 0;

    questions.forEach((q, idx) => {
      if (answers[idx] !== undefined && Number(answers[idx]) === q.correct_index) {
        correctCount++;
      }
    });

    const total = questions.length;
    const score = total > 0 ? Math.round((correctCount / total) * 100) : 100;
    const passed = score >= (quiz.passing_score || 70);

    const attempt = {
      id: `qa-${crypto.randomUUID()}`,
      user_id: userId || 'demo-student-id',
      quiz_id: quiz.id,
      score,
      passed,
      correctCount,
      totalQuestions: total,
      answers,
      created_at: new Date().toISOString()
    };

    data.quiz_attempts.push(attempt);
    this.saveData(data);
    return attempt;
  },

  // 4. RESUME POSITION
  getResumePosition(userId, courseId) {
    const data = this.getData();
    const positions = data.resume_positions || [];
    const uid = userId || 'demo-student-id';
    return positions.find(p => p.user_id === uid && p.course_id === courseId) || null;
  },

  saveResumePosition({ userId, courseId, lessonId, positionSeconds }) {
    const data = this.getData();
    data.resume_positions = data.resume_positions || [];
    const uid = userId || 'demo-student-id';

    const index = data.resume_positions.findIndex(p => p.user_id === uid && p.course_id === courseId);
    const record = {
      user_id: uid,
      course_id: courseId,
      lesson_id: lessonId,
      position_seconds: Number(positionSeconds) || 0,
      updated_at: new Date().toISOString()
    };

    if (index >= 0) {
      data.resume_positions[index] = record;
    } else {
      data.resume_positions.push(record);
    }

    this.saveData(data);
    return record;
  },

  // 5. STUDY PLANS
  getStudyPlan(userId) {
    const data = this.getData();
    const plans = data.study_plans || [];
    const uid = userId || 'demo-student-id';
    return plans.find(p => (p.user_id === uid || p.user_id === 'demo-student-id') && p.is_active) || plans[0] || null;
  },

  saveStudyPlan(userId, planData) {
    const data = this.getData();
    data.study_plans = data.study_plans || [];
    const uid = userId || 'demo-student-id';

    // Mark previous as inactive
    data.study_plans.forEach(p => {
      if (p.user_id === uid) p.is_active = false;
    });

    const newPlan = {
      id: `plan-${crypto.randomUUID()}`,
      user_id: uid,
      career_goal: planData.career_goal || 'Full Stack Developer',
      weekly_hours: Number(planData.weekly_hours) || 10,
      skill_level: planData.skill_level || 'Intermediate',
      plan_data: planData.plan_data || planData,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    data.study_plans.unshift(newPlan);
    this.saveData(data);
    return newPlan;
  },

  toggleStudyPlanTask(userId, planId, taskId) {
    const data = this.getData();
    const plans = data.study_plans || [];
    const uid = userId || 'demo-student-id';

    const plan = plans.find(p => p.id === planId && (p.user_id === uid || uid === 'demo-student-id'));
    if (!plan || !plan.plan_data?.weekly_goals) return null;

    let toggled = false;
    plan.plan_data.weekly_goals.forEach(w => {
      (w.tasks || []).forEach(t => {
        if (t.id === taskId) {
          t.completed = !t.completed;
          toggled = true;
        }
      });
    });

    if (toggled) {
      plan.updated_at = new Date().toISOString();
      this.saveData(data);
    }

    return plan;
  },

  generateStudyPlan(userId, { careerGoal = 'Full Stack Developer', weeklyHours = 10, skillLevel = 'Intermediate' }) {
    const hours = Number(weeklyHours) || 10;
    const dailyHours = (hours / 7).toFixed(1);

    const planData = {
      title: `${careerGoal} Placement Roadmap`,
      target_role: careerGoal,
      weekly_hours: hours,
      daily_commitment: `${dailyHours} hrs / day`,
      skill_level: skillLevel,
      duration_weeks: hours >= 15 ? 6 : 10,
      weekly_goals: [
        {
          week: 1,
          title: 'Foundational Mastery & Frontend Engineering',
          tasks: [
            { id: `task-${crypto.randomUUID()}`, title: 'Complete Core Framework Patterns & Reactive State', type: 'course', link: '/courses', completed: false },
            { id: `task-${crypto.randomUUID()}`, title: 'Solve 4 DSA Arrays & Two-Pointer problems on CodeLab', type: 'coding', link: '/codelab', completed: false },
            { id: `task-${crypto.randomUUID()}`, title: 'Aptitude: Quantitative Percentages & Ratios Practice', type: 'aptitude', link: '/aptitude/practice', completed: false }
          ]
        },
        {
          week: 2,
          title: 'Backend Systems & Database Design',
          tasks: [
            { id: `task-${crypto.randomUUID()}`, title: 'Study Relational Schema Normalization & Indexing', type: 'course', link: '/courses', completed: false },
            { id: `task-${crypto.randomUUID()}`, title: 'Solve 3 SQL JOIN & Group By queries on CodeLab', type: 'coding', link: '/codelab', completed: false },
            { id: `task-${crypto.randomUUID()}`, title: 'Aptitude: Logical Number Series & Syllogisms', type: 'aptitude', link: '/aptitude/practice', completed: false }
          ]
        },
        {
          week: 3,
          title: 'Real-World Capstone & Technical Screening Prep',
          tasks: [
            { id: `task-${crypto.randomUUID()}`, title: 'Build Project Hub Milestone 1 (Architecture & Setup)', type: 'project', link: '/projects', completed: false },
            { id: `task-${crypto.randomUUID()}`, title: 'Interview Hub: Review ACID, Caching, and RESTful APIs', type: 'interview', link: '/interview', completed: false },
            { id: `task-${crypto.randomUUID()}`, title: 'Take 1 Full-Length Placement Mock Exam', type: 'mock', link: '/aptitude/mock-tests', completed: false }
          ]
        }
      ]
    };

    return this.saveStudyPlan(userId, {
      career_goal: careerGoal,
      weekly_hours: hours,
      skill_level: skillLevel,
      plan_data: planData
    });
  },

  // 6. LEARNING ANALYTICS
  getLearningAnalytics(userId) {
    const data = this.getData();
    const uid = userId || 'demo-student-id';
    const notes = (data.notes || []).filter(n => n.user_id === uid || uid === 'demo-student-id');
    const bms = (data.bookmarks || []).filter(b => b.user_id === uid || uid === 'demo-student-id');
    const quizAttempts = (data.quiz_attempts || []).filter(qa => qa.user_id === uid || uid === 'demo-student-id');

    return {
      coursesEnrolled: 3,
      coursesCompleted: 1,
      lessonsCompleted: 18,
      totalLessons: 24,
      completionRate: 75,
      learningHours: 32.5,
      currentStreak: 5,
      longestStreak: 12,
      notesCount: notes.length,
      bookmarksCount: bms.length,
      quizzesPassed: quizAttempts.filter(q => q.passed).length,
      weeklyActivity: [
        { day: 'Mon', hours: 2.5 },
        { day: 'Tue', hours: 3.0 },
        { day: 'Wed', hours: 1.5 },
        { day: 'Thu', hours: 4.0 },
        { day: 'Fri', hours: 2.0 },
        { day: 'Sat', hours: 3.5 },
        { day: 'Sun', hours: 2.5 }
      ],
      monthlyActivity: [
        { month: 'Apr', hours: 18 },
        { month: 'May', hours: 26 },
        { month: 'Jun', hours: 32 },
        { month: 'Jul', hours: 29 },
        { month: 'Aug', hours: 38 },
        { month: 'Sep', hours: 32.5 }
      ]
    };
  }
};
