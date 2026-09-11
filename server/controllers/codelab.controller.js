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

      const submission = codelabStore.addSubmission({
        userId,
        problemId,
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

      // Award XP if accepted
      if (result.status === 'Accepted' && userId !== 'guest-user') {
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
  }
};
