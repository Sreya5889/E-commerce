import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import { courseStore } from './courseStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const PATHS_FILE = path.resolve(DATA_DIR, 'learningPaths.json');
const STUDENT_PATHS_FILE = path.resolve(DATA_DIR, 'studentLearningPaths.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure files exist
if (!fs.existsSync(PATHS_FILE)) {
  fs.writeFileSync(PATHS_FILE, JSON.stringify([]), 'utf8');
}
if (!fs.existsSync(STUDENT_PATHS_FILE)) {
  fs.writeFileSync(STUDENT_PATHS_FILE, JSON.stringify([]), 'utf8');
}

export const learningPathStore = {
  getAll() {
    try {
      const content = fs.readFileSync(PATHS_FILE, 'utf8');
      return JSON.parse(content || '[]');
    } catch {
      return [];
    }
  },

  saveAll(paths) {
    fs.writeFileSync(PATHS_FILE, JSON.stringify(paths, null, 2), 'utf8');
  },

  getStudentAll() {
    try {
      const content = fs.readFileSync(STUDENT_PATHS_FILE, 'utf8');
      return JSON.parse(content || '[]');
    } catch {
      return [];
    }
  },

  saveStudentAll(studentPaths) {
    fs.writeFileSync(STUDENT_PATHS_FILE, JSON.stringify(studentPaths, null, 2), 'utf8');
  },

  findAll({
    search = '',
    category = '',
    difficulty = '',
    sort = 'popular',
    page = 1,
    limit = 12
  } = {}) {
    let list = this.getAll();

    // Multi-field search
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(p => {
        const titleMatch = p.title?.toLowerCase().includes(q);
        const descMatch = p.description?.toLowerCase().includes(q);
        const catMatch = p.category?.toLowerCase().includes(q);
        const skillsMatch = Array.isArray(p.key_skills) && p.key_skills.some(s => s.toLowerCase().includes(q));
        const toolsMatch = Array.isArray(p.tools_and_technologies) && p.tools_and_technologies.some(t => t.toLowerCase().includes(q));
        const outcomesMatch = Array.isArray(p.career_outcomes) && p.career_outcomes.some(o => o.toLowerCase().includes(q));
        const prereqMatch = Array.isArray(p.prerequisites) && p.prerequisites.some(item => item.toLowerCase().includes(q));
        
        // Also check if any courses in stages match
        const courseMatch = Array.isArray(p.stages) && p.stages.some(stg => 
          Array.isArray(stg.courses) && stg.courses.some(c => c.title?.toLowerCase().includes(q))
        );

        return titleMatch || descMatch || catMatch || skillsMatch || toolsMatch || outcomesMatch || prereqMatch || courseMatch;
      });
    }

    // Category filter
    if (category && category !== 'all') {
      const catNorm = category.toLowerCase().trim();
      list = list.filter(p => {
        const pathCat = (p.category || '').toLowerCase().trim();
        const pathCatSlug = pathCat.replace(/\s+/g, '-');
        return pathCat === catNorm || pathCatSlug === catNorm;
      });
    }

    // Difficulty filter
    if (difficulty && difficulty !== 'all') {
      const diffNorm = difficulty.toLowerCase().trim();
      list = list.filter(p => (p.difficulty || '').toLowerCase().trim() === diffNorm);
    }

    // Sorting
    if (sort === 'rating' || sort === 'highest-rated') {
      list.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    } else if (sort === 'newest' || sort === 'latest') {
      list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    } else if (sort === 'courses') {
      list.sort((a, b) => Number(b.total_courses || 0) - Number(a.total_courses || 0));
    } else if (sort === 'duration') {
      list.sort((a, b) => Number(b.duration_weeks || 0) - Number(a.duration_weeks || 0));
    } else {
      // Default: popular (by enrolled_count)
      list.sort((a, b) => Number(b.enrolled_count || 0) - Number(a.enrolled_count || 0));
    }

    const total = list.length;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 12);
    const offset = (pageNum - 1) * limitNum;
    const paginated = list.slice(offset, offset + limitNum);

    return {
      data: paginated,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1
      }
    };
  },

  findById(idOrSlug) {
    if (!idOrSlug) return null;
    const list = this.getAll();
    const pathItem = list.find(p => p.id === idOrSlug || p.slug === idOrSlug);
    if (!pathItem) return null;

    // Hydrate course metadata from courseStore
    const hydrated = JSON.parse(JSON.stringify(pathItem));
    if (Array.isArray(hydrated.stages)) {
      hydrated.stages.forEach(stage => {
        if (Array.isArray(stage.courses)) {
          stage.courses = stage.courses.map(c => {
            const fullCourse = courseStore.findById(c.course_id || c.id);
            if (fullCourse) {
              return {
                ...c,
                thumbnail_url: fullCourse.thumbnail_url || c.thumbnail_url,
                duration_hours: fullCourse.duration_hours || c.duration_hours,
                avg_rating: fullCourse.avg_rating || c.avg_rating,
                student_count: fullCourse.student_count || c.student_count,
                price: fullCourse.price,
                discount_price: fullCourse.discount_price,
                level: fullCourse.level || c.level,
                slug: fullCourse.slug || c.slug
              };
            }
            return c;
          });
        }
      });
    }

    return hydrated;
  },

  create(pathData) {
    const list = this.getAll();
    const id = pathData.id || `lp-${crypto.randomUUID()}`;
    const slug = pathData.slug || (pathData.title || 'learning-path')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Calculate total courses and hours from stages if provided
    let totalCourses = pathData.total_courses || 0;
    let estimatedHours = pathData.estimated_hours || 0;

    if (Array.isArray(pathData.stages)) {
      totalCourses = pathData.stages.reduce((sum, stg) => sum + (stg.courses?.length || 0), 0);
      estimatedHours = pathData.stages.reduce((sum, stg) => {
        return sum + (stg.courses || []).reduce((cSum, c) => cSum + (Number(c.duration_hours) || 10), 0);
      }, 0);
    }

    const newPath = {
      id,
      slug,
      title: pathData.title,
      description: pathData.description || '',
      category: pathData.category || 'Development',
      difficulty: pathData.difficulty || 'all_levels',
      duration_weeks: Number(pathData.duration_weeks || 12),
      estimated_hours: Number(estimatedHours || pathData.estimated_hours || 60),
      total_courses: Number(totalCourses || pathData.total_courses || 3),
      rating: Number(pathData.rating || 4.8),
      enrolled_count: Number(pathData.enrolled_count || 0),
      is_published: pathData.is_published !== undefined ? Boolean(pathData.is_published) : true,
      banner_url: pathData.banner_url || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600',
      key_skills: Array.isArray(pathData.key_skills) ? pathData.key_skills : [],
      tools_and_technologies: Array.isArray(pathData.tools_and_technologies) ? pathData.tools_and_technologies : [],
      career_outcomes: Array.isArray(pathData.career_outcomes) ? pathData.career_outcomes : [],
      prerequisites: Array.isArray(pathData.prerequisites) ? pathData.prerequisites : [],
      capstone_project: pathData.capstone_project || {
        title: `${pathData.title} Portfolio Project`,
        description: `Build and showcase a production-grade application for your career portfolio.`
      },
      stages: Array.isArray(pathData.stages) ? pathData.stages : [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    list.unshift(newPath);
    this.saveAll(list);
    return newPath;
  },

  update(id, updates) {
    const list = this.getAll();
    const idx = list.findIndex(p => p.id === id || p.slug === id);
    if (idx === -1) return null;

    list[idx] = {
      ...list[idx],
      ...updates,
      updated_at: new Date().toISOString()
    };

    this.saveAll(list);
    return list[idx];
  },

  delete(id) {
    const list = this.getAll();
    const initialLen = list.length;
    const filtered = list.filter(p => p.id !== id && p.slug !== id);
    if (filtered.length === initialLen) return false;
    this.saveAll(filtered);
    return true;
  },

  // ================= STUDENT ENROLLMENTS =================
  getStudentPaths(userId) {
    if (!userId) return [];
    const studentList = this.getStudentAll();
    const userEnrollments = studentList.filter(e => e.user_id === userId);
    
    // Join with path data
    const allPaths = this.getAll();
    return userEnrollments.map(e => {
      const pathData = allPaths.find(p => p.id === e.learning_path_id);
      return {
        ...e,
        learning_paths: pathData || null
      };
    });
  },

  getStudentPath(userId, pathId) {
    if (!userId || !pathId) return null;
    const studentList = this.getStudentAll();
    return studentList.find(e => e.user_id === userId && (e.learning_path_id === pathId || e.id === pathId)) || null;
  },

  enrollStudent(userId, pathId) {
    if (!userId || !pathId) throw new Error('User ID and Learning Path ID are required');
    
    const pathItem = this.findById(pathId);
    if (!pathItem) throw new Error('Learning path not found');

    const studentList = this.getStudentAll();
    const existing = studentList.find(e => e.user_id === userId && e.learning_path_id === pathItem.id);
    if (existing) {
      return { ...existing, learning_paths: pathItem };
    }

    const firstCourseId = pathItem.stages?.[0]?.courses?.[0]?.course_id || null;

    const newEnrollment = {
      id: `slp-${crypto.randomUUID()}`,
      user_id: userId,
      learning_path_id: pathItem.id,
      progress_pct: 0,
      completed_courses: [],
      current_stage: 1,
      last_accessed_course_id: firstCourseId,
      status: 'in_progress',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    studentList.unshift(newEnrollment);
    this.saveStudentAll(studentList);

    // Increment enrolled_count on learning path
    this.update(pathItem.id, {
      enrolled_count: Number(pathItem.enrolled_count || 0) + 1
    });

    return { ...newEnrollment, learning_paths: pathItem };
  },

  updateStudentProgress(userId, pathId, { completed_courses, last_accessed_course_id, current_stage }) {
    const studentList = this.getStudentAll();
    const pathItem = this.findById(pathId);
    if (!pathItem) return null;

    const idx = studentList.findIndex(e => e.user_id === userId && e.learning_path_id === pathItem.id);
    if (idx === -1) return null;

    const current = studentList[idx];
    const updatedCompleted = completed_courses !== undefined ? completed_courses : current.completed_courses;
    
    // Calculate progress pct based on total courses in path
    const totalCourses = pathItem.total_courses || 1;
    const progress_pct = Math.min(100, Math.round((updatedCompleted.length / totalCourses) * 100));
    const status = progress_pct >= 100 ? 'completed' : 'in_progress';

    studentList[idx] = {
      ...current,
      completed_courses: updatedCompleted,
      progress_pct,
      status,
      current_stage: current_stage !== undefined ? current_stage : current.current_stage,
      last_accessed_course_id: last_accessed_course_id || current.last_accessed_course_id,
      updated_at: new Date().toISOString()
    };

    this.saveStudentAll(studentList);
    return { ...studentList[idx], learning_paths: pathItem };
  }
};
