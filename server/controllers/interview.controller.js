import { interviewStore } from '../utils/interviewStore.js';

export const interviewController = {
  getCategories(req, res) {
    const data = interviewStore.getCategories();
    res.json({ success: true, data });
  },

  getQuestions(req, res) {
    const { category, difficulty, search } = req.query;
    const data = interviewStore.getQuestions({ category, difficulty, search });
    res.json({ success: true, data, total: data.length });
  },

  getQuestionById(req, res) {
    const { id } = req.params;
    const question = interviewStore.getQuestionById(id);
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });
    res.json({ success: true, data: question });
  },

  getPlans(req, res) {
    const data = interviewStore.getPlans();
    res.json({ success: true, data });
  }
};
