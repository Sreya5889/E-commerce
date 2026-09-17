import { codelabStore } from '../utils/codelabStore.js';
import { executeCodeSafely } from '../utils/codeRunner.js';
import { gamificationStore } from '../utils/gamificationStore.js';

export const codelabController = {
  getLanguages(req, res) {
    const data = codelabStore.getLanguages();
    res.json({ success: true, data });
  },

  getCategories(req, res) {
    const data = codelabStore.getCategories();
    res.json({ success: true, data });
  },

  getProblems(req, res) {
    const { category, difficulty, search } = req.query;
    const data = codelabStore.getProblems({ category, difficulty, search });
    res.json({ success: true, data, total: data.length });
  },

  getProblemBySlug(req, res) {
    const { slug } = req.params;
    const problem = codelabStore.getProblemBySlug(slug);
    if (!problem) return res.status(404).json({ success: false, message: 'Problem not found' });
    res.json({ success: true, data: problem });
  },

  getDailyChallenge(req, res) {
    const data = codelabStore.getDailyChallenge();
    res.json({ success: true, data });
  },

  async runCode(req, res) {
    try {
      let { language, code, testCases, problemId, problem_id } = req.body;
      if (!code) return res.status(400).json({ success: false, message: 'Code is required' });

      if ((!testCases || testCases.length === 0) && (problemId || problem_id)) {
        const prob = codelabStore.getProblemById(problemId || problem_id);
        if (prob?.test_cases) {
          testCases = prob.test_cases;
        }
      }

      const result = await executeCodeSafely({ language, code, testCases });
      res.json({ success: true, data: result });
    } catch (err) {
      console.error('[CodeLab Error]:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async submitCode(req, res) {
    try {
      let { problemId, problemTitle, problemSlug, language, code, testCases, problem_id } = req.body;
      const pid = problemId || problem_id;
      const userId = req.user?.id || 'guest-user';

      if ((!testCases || testCases.length === 0) && pid) {
        const prob = codelabStore.getProblemById(pid);
        if (prob?.test_cases) {
          testCases = prob.test_cases;
        }
      }

      const result = await executeCodeSafely({ language, code, testCases });

      // Check if user already had an Accepted submission for this problem to prevent duplicate XP farming
      const existingUserSubs = codelabStore.getUserSubmissions(userId);
      const alreadySolved = existingUserSubs.some(s => (s.problem_id === pid || s.problem_slug === problemSlug) && s.status === 'Accepted');

      const submission = codelabStore.addSubmission({
        userId,
        problemId: pid,
        problemTitle,
        problemSlug,
        language,
        code,
        status: result.status,
        runtimeMs: result.runtimeMs,
        memoryKb: result.memoryKb,
        passedCount: result.passedCount,
        totalCount: result.totalCount
      });

      // Award XP once if accepted
      if (result.status === 'Accepted' && userId !== 'guest-user' && !alreadySolved) {
        gamificationStore.awardXp(userId, 30, `Solved ${problemTitle || 'CodeLab Problem'}`);
      }

      res.json({ success: true, data: { ...submission, execution: result } });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  getSubmissions(req, res) {
    const userId = req.user?.id || null;
    const data = codelabStore.getUserSubmissions(userId);
    res.json({ success: true, data });
  },

  getLeaderboard(req, res) {
    const { timeframe } = req.query;
    const data = codelabStore.getLeaderboard(timeframe);
    res.json({ success: true, data });
  },

  getUserStats(req, res) {
    const userId = req.user?.id || 'guest-user';
    const allProblems = codelabStore.getProblems();
    const subs = codelabStore.getUserSubmissions(userId);

    const acceptedSubs = subs.filter(s => s.status === 'Accepted');
    const solvedProblemIds = new Set(acceptedSubs.map(s => s.problem_id || s.problem_slug));

    const totalEasy = allProblems.filter(p => p.difficulty === 'Easy').length;
    const totalMedium = allProblems.filter(p => p.difficulty === 'Medium').length;
    const totalHard = allProblems.filter(p => p.difficulty === 'Hard').length;

    let solvedEasy = 0;
    let solvedMedium = 0;
    let solvedHard = 0;

    allProblems.forEach(p => {
      if (solvedProblemIds.has(p.id) || solvedProblemIds.has(p.slug)) {
        if (p.difficulty === 'Easy') solvedEasy++;
        else if (p.difficulty === 'Medium') solvedMedium++;
        else if (p.difficulty === 'Hard') solvedHard++;
      }
    });

    const totalAttempted = new Set(subs.map(s => s.problem_id || s.problem_slug)).size;
    const totalSolved = solvedEasy + solvedMedium + solvedHard;
    const acceptanceRate = subs.length > 0 ? Math.round((acceptedSubs.length / subs.length) * 100) : 100;

    // Difficulty Progression recommendation
    let recommendedDifficulty = 'Easy';
    if (solvedEasy >= 3 && solvedMedium < 2) {
      recommendedDifficulty = 'Medium';
    } else if (solvedMedium >= 2) {
      recommendedDifficulty = 'Hard';
    }

    const nextProblem = allProblems.find(
      p => p.difficulty === recommendedDifficulty && !solvedProblemIds.has(p.id) && !solvedProblemIds.has(p.slug)
    ) || allProblems[0];

    res.json({
      success: true,
      data: {
        totalSolved,
        totalAttempted,
        totalAvailable: allProblems.length,
        acceptanceRate,
        difficultyStats: {
          easy: { solved: solvedEasy, total: totalEasy, progress: totalEasy > 0 ? Math.round((solvedEasy / totalEasy) * 100) : 0 },
          medium: { solved: solvedMedium, total: totalMedium, progress: totalMedium > 0 ? Math.round((solvedMedium / totalMedium) * 100) : 0 },
          hard: { solved: solvedHard, total: totalHard, progress: totalHard > 0 ? Math.round((solvedHard / totalHard) * 100) : 0 }
        },
        recommendedDifficulty,
        nextRecommendedProblem: nextProblem
      }
    });
  }
};
