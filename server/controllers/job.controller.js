import { jobStore } from '../utils/jobStore.js';

export const jobController = {
  getAll(req, res) {
    const { category, workMode, employmentType, search } = req.query;
    const data = jobStore.getAll({ category, workMode, employmentType, search });
    res.json({ success: true, data, total: data.length });
  },

  getBySlug(req, res) {
    const { slug } = req.params;
    const job = jobStore.getBySlug(slug);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, data: job });
  },

  toggleBookmark(req, res) {
    const { id } = req.params;
    const userId = req.user?.id || 'demo-student-id';
    const result = jobStore.toggleBookmark(userId, id);
    res.json({ success: true, data: result });
  },

  getBookmarks(req, res) {
    const userId = req.user?.id || 'demo-student-id';
    const data = jobStore.getUserBookmarks(userId);
    res.json({ success: true, data });
  },

  apply(req, res) {
    const { id } = req.params;
    const userId = req.user?.id || 'demo-student-id';
    const application = jobStore.applyJob(userId, id, req.body.notes);
    res.json({ success: true, data: application });
  },

  getApplications(req, res) {
    const userId = req.user?.id || 'demo-student-id';
    const data = jobStore.getUserApplications(userId);
    res.json({ success: true, data });
  }
};
