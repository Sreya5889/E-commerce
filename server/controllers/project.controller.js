import { projectStore } from '../utils/projectStore.js';
import { gamificationStore } from '../utils/gamificationStore.js';

export const projectController = {
  getAll(req, res) {
    const { category, difficulty, search } = req.query;
    const data = projectStore.getAll({ category, difficulty, search });
    res.json({ success: true, data, total: data.length });
  },

  getBySlug(req, res) {
    const { slug } = req.params;
    const project = projectStore.findBySlug(slug);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: project });
  },

  getUserProjects(req, res) {
    const userId = req.user?.id || 'demo-student-id';
    const data = projectStore.getUserProjects(userId);
    res.json({ success: true, data });
  },

  updateProjectProgress(req, res) {
    const { id } = req.params;
    const userId = req.user?.id || 'demo-student-id';
    const updated = projectStore.updateUserProject(userId, id, req.body);

    if (req.body.status === 'completed') {
      gamificationStore.awardXp(userId, 200, 'Completed Portfolio Project');
    }

    res.json({ success: true, data: updated });
  }
};
