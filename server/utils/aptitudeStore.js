import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const APTITUDE_FILE = path.resolve(DATA_DIR, 'aptitude.json');
const ATTEMPTS_FILE = path.resolve(DATA_DIR, 'studentAptitudeAttempts.json');
const DAILY_PROGRESS_FILE = path.resolve(DATA_DIR, 'studentDailyChallenges.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(ATTEMPTS_FILE)) {
  fs.writeFileSync(ATTEMPTS_FILE, JSON.stringify([], null, 2), 'utf8');
}
if (!fs.existsSync(DAILY_PROGRESS_FILE)) {
  fs.writeFileSync(DAILY_PROGRESS_FILE, JSON.stringify([], null, 2), 'utf8');
}

export const aptitudeStore = {
  getRawData() {
    try {
      if (fs.existsSync(APTITUDE_FILE)) {
        const content = fs.readFileSync(APTITUDE_FILE, 'utf8');
        return JSON.parse(content || '{}');
      }
      return { categories: [], topics: [], questions: [], mockTests: [], dailyChallenge: null, achievements: [] };
    } catch (err) {
      console.error('[aptitudeStore] Failed reading aptitude.json:', err);
      return { categories: [], topics: [], questions: [], mockTests: [], dailyChallenge: null, achievements: [] };
    }
  },

  saveRawData(data) {
    try {
      fs.writeFileSync(APTITUDE_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
      console.error('[aptitudeStore] Failed saving aptitude.json:', err);
    }
  },

  getAttempts() {
    try {
      if (fs.existsSync(ATTEMPTS_FILE)) {
        const content = fs.readFileSync(ATTEMPTS_FILE, 'utf8');
        return JSON.parse(content || '[]');
      }
      return [];
    } catch {
      return [];
    }
  },

  saveAttempts(attempts) {
    try {
      fs.writeFileSync(ATTEMPTS_FILE, JSON.stringify(attempts, null, 2), 'utf8');
    } catch (err) {
      console.error('[aptitudeStore] Failed saving attempts:', err);
    }
  },

  getCategories() {
    const data = this.getRawData();
    const categories = data.categories || [];
    const topics = data.topics || [];
    const questions = data.questions || [];

    return categories.map(cat => {
      const catTopics = topics.filter(t => t.category_id === cat.id);
      const catQuestions = questions.filter(q => q.category_id === cat.id);
      return {
        ...cat,
        topic_count: catTopics.length,
        question_count: catQuestions.length
      };
    }).sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  },

  getCategoryBySlug(slug) {
    const data = this.getRawData();
    const cat = (data.categories || []).find(c => c.slug === slug || c.id === slug);
    if (!cat) return null;

    const topics = (data.topics || [])
      .filter(t => t.category_id === cat.id)
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

    const questions = (data.questions || []).filter(q => q.category_id === cat.id);

    return {
      ...cat,
      topics: topics.map(t => ({
        ...t,
        question_count: questions.filter(q => q.topic_id === t.id).length
      })),
      topic_count: topics.length,
      question_count: questions.length
    };
  },

  getTopics(categoryId = null) {
    const data = this.getRawData();
    let topics = data.topics || [];
    if (categoryId) {
      topics = topics.filter(t => t.category_id === categoryId);
    }
    const questions = data.questions || [];
    return topics.map(t => ({
      ...t,
      question_count: questions.filter(q => q.topic_id === t.id).length
    })).sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  },

  getQuestions({
    categoryId = '',
    topicId = '',
    difficulty = '',
    search = '',
    limit = 20,
    offset = 0,
    shuffle = false,
    excludeAnswer = false
  } = {}) {
    const data = this.getRawData();
    let list = [...(data.questions || [])];

    if (categoryId && categoryId !== 'all') {
      list = list.filter(q => q.category_id === categoryId);
    }

    if (topicId && topicId !== 'all') {
      list = list.filter(q => q.topic_id === topicId);
    }

    if (difficulty && difficulty !== 'all') {
      list = list.filter(q => q.difficulty?.toLowerCase() === difficulty.toLowerCase());
    }

    if (search && search.trim()) {
      const term = search.trim().toLowerCase();
      list = list.filter(q => 
        q.question_text?.toLowerCase().includes(term) ||
        (q.tags && q.tags.some(tag => tag.toLowerCase().includes(term)))
      );
    }

    if (shuffle) {
      list = list.sort(() => Math.random() - 0.5);
    }

    const total = list.length;
    const paginated = list.slice(offset, offset + Number(limit));

    const sanitized = paginated.map(q => {
      const topic = (data.topics || []).find(t => t.id === q.topic_id);
      const category = (data.categories || []).find(c => c.id === q.category_id);

      const base = {
        ...q,
        topic_name: topic?.name || 'General',
        category_name: category?.name || 'Aptitude'
      };

      if (excludeAnswer) {
        const { correct_option, explanation, ...rest } = base;
        return rest;
      }
      return base;
    });

    return {
      questions: sanitized,
      total,
      hasMore: offset + Number(limit) < total
    };
  },

  getQuestionById(id, excludeAnswer = false) {
    const data = this.getRawData();
    const q = (data.questions || []).find(item => item.id === id);
    if (!q) return null;

    const topic = (data.topics || []).find(t => t.id === q.topic_id);
    const category = (data.categories || []).find(c => c.id === q.category_id);

    const base = {
      ...q,
      topic_name: topic?.name || 'General',
      category_name: category?.name || 'Aptitude'
    };

    if (excludeAnswer) {
      const { correct_option, explanation, ...rest } = base;
      return rest;
    }
    return base;
  },

  getMockTests() {
    const data = this.getRawData();
    const tests = data.mockTests || data.mock_tests || [];
    return tests.map(test => {
      const questionsCount = (test.question_ids || []).length;
      return {
        ...test,
        question_count: questionsCount
      };
    });
  },

  getMockTestBySlug(slug, excludeAnswer = true) {
    const data = this.getRawData();
    const tests = data.mockTests || data.mock_tests || [];
    const test = tests.find(t => t.slug === slug || t.id === slug);
    if (!test) return null;

    const allQuestions = data.questions || [];
    const testQuestions = (test.question_ids || []).map(qId => {
      const q = allQuestions.find(item => item.id === qId);
      if (!q) return null;

      const topic = (data.topics || []).find(t => t.id === q.topic_id);
      const category = (data.categories || []).find(c => c.id === q.category_id);

      const base = {
        ...q,
        topic_name: topic?.name || 'General',
        category_name: category?.name || 'Aptitude'
      };

      if (excludeAnswer) {
        const { correct_option, explanation, ...rest } = base;
        return rest;
      }
      return base;
    }).filter(Boolean);

    return {
      ...test,
      questions: testQuestions,
      question_count: testQuestions.length
    };
  },

  getDailyChallenge(targetDate = null, excludeAnswer = true) {
    const data = this.getRawData();
    let challenges = data.daily_challenges || [];
    if (!challenges.length && data.dailyChallenge) {
      challenges = Array.isArray(data.dailyChallenge) ? data.dailyChallenge : [data.dailyChallenge];
    }
    if (!challenges.length) return null;

    const today = targetDate || new Date().toISOString().split('T')[0];
    let ch = challenges.find(c => c.challenge_date === today);
    if (!ch) {
      ch = challenges[0];
    }

    const allQuestions = data.questions || [];
    const questions = (ch.question_ids || []).map(qId => {
      const q = allQuestions.find(item => item.id === qId);
      if (!q) return null;

      const topic = (data.topics || []).find(t => t.id === q.topic_id);
      const category = (data.categories || []).find(c => c.id === q.category_id);

      const base = {
        ...q,
        topic_name: topic?.name || 'General',
        category_name: category?.name || 'Aptitude'
      };

      if (excludeAnswer) {
        const { correct_option, explanation, ...rest } = base;
        return rest;
      }
      return base;
    }).filter(Boolean);

    return {
      ...ch,
      questions,
      question_count: questions.length
    };
  },

  getAchievements(studentId = null) {
    const data = this.getRawData();
    const achievements = data.achievements || [];
    if (!studentId) {
      return achievements.map(a => ({ ...a, unlocked: false, unlocked_at: null }));
    }

    const attempts = this.getAttempts().filter(a => a.student_id === studentId);
    const totalAttempts = attempts.length;
    const totalCorrect = attempts.reduce((acc, a) => acc + (a.correct_count || 0), 0);
    const hasPerfectScore = attempts.some(a => a.accuracy === 100 && a.total_questions >= 5);
    const mockCompleted = attempts.some(a => a.mode === 'mock_test');

    return achievements.map(a => {
      let unlocked = false;
      let unlocked_at = null;

      if (a.id === 'ach-first-step' && totalAttempts >= 1) {
        unlocked = true;
        unlocked_at = attempts[0]?.created_at;
      } else if (a.id === 'ach-speed-demon' && attempts.some(att => att.average_time_seconds <= 45 && att.accuracy >= 80)) {
        unlocked = true;
      } else if (a.id === 'ach-quant-whiz' && totalCorrect >= 20) {
        unlocked = true;
      } else if (a.id === 'ach-logic-master' && totalCorrect >= 20) {
        unlocked = true;
      } else if (a.id === 'ach-verbal-ninja' && totalCorrect >= 20) {
        unlocked = true;
      } else if (a.id === 'ach-di-detective' && totalCorrect >= 20) {
        unlocked = true;
      } else if (a.id === 'ach-mock-champ' && mockCompleted) {
        unlocked = true;
      } else if (a.id === 'ach-perfectionist' && hasPerfectScore) {
        unlocked = true;
      }

      return {
        ...a,
        unlocked,
        unlocked_at
      };
    });
  },

  startAttempt({
    studentId,
    mode = 'practice',
    testId = null,
    categoryId = null,
    topicId = null,
    totalQuestions = 10,
    durationMinutes = 15
  }) {
    const attemptId = 'att-' + crypto.randomUUID();
    const attempts = this.getAttempts();

    const newAttempt = {
      id: attemptId,
      student_id: studentId || 'guest-' + Date.now(),
      mode,
      test_id: testId,
      category_id: categoryId,
      topic_id: topicId,
      total_questions: Number(totalQuestions),
      duration_minutes: Number(durationMinutes),
      score: 0,
      accuracy: 0,
      correct_count: 0,
      incorrect_count: 0,
      unanswered_count: Number(totalQuestions),
      time_spent_seconds: 0,
      average_time_seconds: 0,
      status: 'in_progress',
      answers: [],
      topic_performance: [],
      weak_topics: [],
      created_at: new Date().toISOString(),
      completed_at: null
    };

    attempts.push(newAttempt);
    this.saveAttempts(attempts);

    return newAttempt;
  },

  submitAttempt({
    attemptId,
    studentId,
    answers = [],
    timeSpentSeconds = 0
  }) {
    const attempts = this.getAttempts();
    const index = attempts.findIndex(a => a.id === attemptId);
    let attempt = index >= 0 ? attempts[index] : null;

    if (!attempt) {
      attempt = {
        id: attemptId || 'att-' + crypto.randomUUID(),
        student_id: studentId || 'guest',
        mode: 'practice',
        created_at: new Date().toISOString()
      };
      attempts.push(attempt);
    }

    const data = this.getRawData();
    const allQuestions = data.questions || [];
    const allTopics = data.topics || [];

    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;
    const topicStats = {};

    const detailedAnswers = answers.map(ans => {
      const q = allQuestions.find(item => item.id === ans.questionId);
      if (!q) {
        return {
          question_id: ans.questionId,
          selected_option: ans.selectedOption,
          is_correct: false,
          time_spent_seconds: ans.timeSpentSeconds || 0
        };
      }

      const isAnswered = Boolean(ans.selectedOption);
      const isCorrect = isAnswered && ans.selectedOption === q.correct_option;

      if (!isAnswered) {
        unansweredCount++;
      } else if (isCorrect) {
        correctCount++;
      } else {
        incorrectCount++;
      }

      if (q.topic_id) {
        if (!topicStats[q.topic_id]) {
          const t = allTopics.find(top => top.id === q.topic_id);
          topicStats[q.topic_id] = {
            topic_id: q.topic_id,
            topic_name: t?.name || 'Topic',
            total: 0,
            correct: 0
          };
        }
        topicStats[q.topic_id].total++;
        if (isCorrect) {
          topicStats[q.topic_id].correct++;
        }
      }

      return {
        question_id: q.id,
        question_text: q.question_text,
        options: q.options,
        difficulty: q.difficulty,
        selected_option: ans.selectedOption || null,
        correct_option: q.correct_option,
        is_correct: isCorrect,
        explanation: q.explanation,
        time_spent_seconds: ans.timeSpentSeconds || 0,
        topic_id: q.topic_id,
        category_id: q.category_id
      };
    });

    const totalQuestions = answers.length || attempt.total_questions || 10;
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const avgTime = answers.length > 0 ? Math.round(timeSpentSeconds / answers.length) : 0;

    const topicPerformance = Object.values(topicStats).map(t => ({
      topic_id: t.topic_id,
      topic_name: t.topic_name,
      total: t.total,
      correct: t.correct,
      accuracy: t.total > 0 ? Math.round((t.correct / t.total) * 100) : 0
    }));

    const weakTopics = topicPerformance
      .filter(t => t.accuracy < 60)
      .map(t => ({
        topic_id: t.topic_id,
        topic_name: t.topic_name,
        accuracy: t.accuracy,
        correct: t.correct,
        total: t.total,
        recommendation: 'Strengthen fundamental concepts in ' + t.topic_name + ' with dedicated practice.'
      }));

    attempt.status = 'completed';
    attempt.total_questions = totalQuestions;
    attempt.score = correctCount;
    attempt.correct_count = correctCount;
    attempt.incorrect_count = incorrectCount;
    attempt.unanswered_count = unansweredCount;
    attempt.accuracy = accuracy;
    attempt.time_spent_seconds = Number(timeSpentSeconds);
    attempt.average_time_seconds = avgTime;
    attempt.answers = detailedAnswers;
    attempt.topic_performance = topicPerformance;
    attempt.weak_topics = weakTopics;
    attempt.completed_at = new Date().toISOString();

    this.saveAttempts(attempts);
    return attempt;
  },

  getAttemptById(attemptId, studentId = null) {
    const attempts = this.getAttempts();
    const attempt = attempts.find(a => a.id === attemptId);
    if (!attempt) return null;
    if (studentId && attempt.student_id && attempt.student_id !== studentId) {
      if (!attempt.student_id.startsWith('guest-') && attempt.student_id !== 'guest') {
        return null;
      }
    }
    return attempt;
  },

  getAttemptsByStudent(studentId, { mode = '', categoryId = '', page = 1, limit = 10 } = {}) {
    let list = this.getAttempts().filter(a => a.student_id === studentId || a.student_id === 'guest');

    if (mode && mode !== 'all') {
      list = list.filter(a => a.mode === mode);
    }
    if (categoryId && categoryId !== 'all') {
      list = list.filter(a => a.category_id === categoryId);
    }

    list = list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const total = list.length;
    const offset = (Number(page) - 1) * Number(limit);
    const paginated = list.slice(offset, offset + Number(limit));

    const summarized = paginated.map(a => {
      const { answers, ...rest } = a;
      return rest;
    });

    return {
      attempts: summarized,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    };
  },

  getStudentAnalytics(studentId) {
    const attempts = this.getAttempts()
      .filter(a => a.student_id === studentId || a.student_id === 'guest')
      .filter(a => a.status === 'completed');

    if (!attempts.length) {
      return {
        total_attempts: 0,
        total_questions_solved: 0,
        total_correct: 0,
        overall_accuracy: 0,
        total_time_spent_seconds: 0,
        average_time_per_question: 0,
        weak_topics: [],
        strong_topics: [],
        category_mastery: [],
        trend: []
      };
    }

    let totalQuestionsSolved = 0;
    let totalCorrect = 0;
    let totalTimeSpent = 0;
    const aggregatedTopics = {};
    const aggregatedCategories = {};

    attempts.forEach(att => {
      totalQuestionsSolved += (att.total_questions || 0);
      totalCorrect += (att.correct_count || 0);
      totalTimeSpent += (att.time_spent_seconds || 0);

      (att.topic_performance || []).forEach(tp => {
        if (!aggregatedTopics[tp.topic_id]) {
          aggregatedTopics[tp.topic_id] = {
            topic_id: tp.topic_id,
            topic_name: tp.topic_name,
            total: 0,
            correct: 0
          };
        }
        aggregatedTopics[tp.topic_id].total += tp.total;
        aggregatedTopics[tp.topic_id].correct += tp.correct;
      });

      if (att.category_id) {
        if (!aggregatedCategories[att.category_id]) {
          aggregatedCategories[att.category_id] = {
            category_id: att.category_id,
            total: 0,
            correct: 0
          };
        }
        aggregatedCategories[att.category_id].total += att.total_questions;
        aggregatedCategories[att.category_id].correct += att.correct_count;
      }
    });

    const topicList = Object.values(aggregatedTopics).map(t => ({
      ...t,
      accuracy: t.total > 0 ? Math.round((t.correct / t.total) * 100) : 0
    }));

    const weakTopics = topicList
      .filter(t => t.accuracy < 60)
      .sort((a, b) => a.accuracy - b.accuracy);

    const strongTopics = topicList
      .filter(t => t.accuracy >= 75)
      .sort((a, b) => b.accuracy - a.accuracy);

    const data = this.getRawData();
    const categoryMastery = (data.categories || []).map(cat => {
      const stats = aggregatedCategories[cat.id] || { total: 0, correct: 0 };
      const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
      return {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        total_attempted: stats.total,
        accuracy
      };
    });

    const recentAttempts = [...attempts]
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      .slice(-10);

    const trend = recentAttempts.map((att, idx) => ({
      attempt_number: idx + 1,
      date: att.created_at ? att.created_at.split('T')[0] : ('Test ' + (idx + 1)),
      accuracy: att.accuracy || 0,
      score: att.score || 0,
      mode: att.mode
    }));

    return {
      total_attempts: attempts.length,
      total_questions_solved: totalQuestionsSolved,
      total_correct: totalCorrect,
      overall_accuracy: totalQuestionsSolved > 0 ? Math.round((totalCorrect / totalQuestionsSolved) * 100) : 0,
      total_time_spent_seconds: totalTimeSpent,
      average_time_per_question: totalQuestionsSolved > 0 ? Math.round(totalTimeSpent / totalQuestionsSolved) : 0,
      weak_topics: weakTopics,
      strong_topics: strongTopics,
      category_mastery: categoryMastery,
      trend
    };
  },

  createQuestion(questionData) {
    const data = this.getRawData();
    const questions = data.questions || [];

    const newQuestion = {
      id: 'q-' + Date.now(),
      ...questionData,
      created_at: new Date().toISOString()
    };

    questions.push(newQuestion);
    data.questions = questions;
    this.saveRawData(data);
    return newQuestion;
  },

  updateQuestion(id, updates) {
    const data = this.getRawData();
    const questions = data.questions || [];
    const index = questions.findIndex(q => q.id === id);
    if (index === -1) return null;

    questions[index] = {
      ...questions[index],
      ...updates,
      updated_at: new Date().toISOString()
    };

    data.questions = questions;
    this.saveRawData(data);
    return questions[index];
  },

  deleteQuestion(id) {
    const data = this.getRawData();
    const questions = data.questions || [];
    const index = questions.findIndex(q => q.id === id);
    if (index === -1) return false;

    questions.splice(index, 1);
    data.questions = questions;
    this.saveRawData(data);
    return true;
  },

  createMockTest(testData) {
    const data = this.getRawData();
    const tests = data.mockTests || data.mock_tests || [];

    const newTest = {
      id: 'mt-' + Date.now(),
      slug: (testData.title || 'mock-test').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      ...testData,
      created_at: new Date().toISOString()
    };

    tests.push(newTest);
    data.mockTests = tests;
    this.saveRawData(data);
    return newTest;
  },

  updateMockTest(id, updates) {
    const data = this.getRawData();
    const tests = data.mockTests || data.mock_tests || [];
    const index = tests.findIndex(t => t.id === id);
    if (index === -1) return null;

    tests[index] = {
      ...tests[index],
      ...updates,
      updated_at: new Date().toISOString()
    };

    data.mockTests = tests;
    this.saveRawData(data);
    return tests[index];
  },

  deleteMockTest(id) {
    const data = this.getRawData();
    const tests = data.mockTests || data.mock_tests || [];
    const index = tests.findIndex(t => t.id === id);
    if (index === -1) return false;

    tests.splice(index, 1);
    data.mockTests = tests;
    this.saveRawData(data);
    return true;
  }
};