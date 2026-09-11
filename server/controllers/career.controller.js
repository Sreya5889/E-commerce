import { calculateCareerReadiness } from '../utils/careerEngine.js';

export const careerController = {
  getReadiness(req, res) {
    const userId = req.user?.id || 'demo-student-id';
    const data = calculateCareerReadiness(userId);
    res.json({ success: true, data });
  }
};
