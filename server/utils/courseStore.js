import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const COURSES_FILE = path.resolve(DATA_DIR, 'courses.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure courses file exists
if (!fs.existsSync(COURSES_FILE)) {
  fs.writeFileSync(COURSES_FILE, JSON.stringify([]), 'utf8');
}

export const courseStore = {
  getAll() {
    try {
      const content = fs.readFileSync(COURSES_FILE, 'utf8');
      return JSON.parse(content || '[]');
    } catch {
      return [];
    }
  },

  saveAll(courses) {
    fs.writeFileSync(COURSES_FILE, JSON.stringify(courses, null, 2), 'utf8');
  },

  findAll({
    search = '',
    category = '',
    level = '',
    minPrice,
    maxPrice,
    isFree,
    sort = 'popular',
    page = 1,
    limit = 12
  } = {}) {
    let list = this.getAll();

    // Multi-field search
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(c => {
        const titleMatch = c.title?.toLowerCase().includes(q);
        const subtitleMatch = c.subtitle?.toLowerCase().includes(q);
        const descMatch = c.description?.toLowerCase().includes(q);
        const catNameMatch = c.categories?.name?.toLowerCase().includes(q) || c.category?.toLowerCase().includes(q);
        const catSlugMatch = c.categories?.slug?.toLowerCase().includes(q);
        const teacherName = c.teachers?.profiles?.display_name ||
          `${c.teachers?.profiles?.first_name || ''} ${c.teachers?.profiles?.last_name || ''}`.trim();
        const teacherMatch = teacherName?.toLowerCase().includes(q);
        const tagMatch = Array.isArray(c.tags) && c.tags.some(t => t.toLowerCase().includes(q));
        const learnMatch = Array.isArray(c.what_you_will_learn) && c.what_you_will_learn.some(item => item.toLowerCase().includes(q));

        return titleMatch || subtitleMatch || descMatch || catNameMatch || catSlugMatch || teacherMatch || tagMatch || learnMatch;
      });
    }

    // Category filter
    if (category && category !== 'all') {
      const catNorm = category.toLowerCase().trim();
      list = list.filter(c =>
        c.category_id === category ||
        c.categories?.slug === catNorm ||
        c.categories?.name?.toLowerCase().replace(/\s+/g, '-') === catNorm ||
        c.category?.toLowerCase().replace(/\s+/g, '-') === catNorm ||
        c.category?.toLowerCase() === catNorm
      );
    }

    // Level filter
    if (level && level !== 'all') {
      const lvlNorm = level.toLowerCase().trim();
      list = list.filter(c => (c.level || '').toLowerCase().trim() === lvlNorm);
    }

    // Price filter
    if (isFree === 'true' || isFree === true) {
      list = list.filter(c => c.is_free === true || Number(c.discount_price ?? c.price ?? 0) === 0);
    } else {
      if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
        const min = parseFloat(minPrice);
        list = list.filter(c => Number(c.discount_price ?? c.price ?? 0) >= min);
      }
      if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
        const max = parseFloat(maxPrice);
        list = list.filter(c => Number(c.discount_price ?? c.price ?? 0) <= max);
      }
    }

    // Sorting
    if (sort === 'highest-rated' || sort === 'rating') {
      list.sort((a, b) => Number(b.avg_rating ?? b.rating ?? 0) - Number(a.avg_rating ?? a.rating ?? 0));
    } else if (sort === 'newest' || sort === 'latest') {
      list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    } else if (sort === 'price-low' || sort === 'price_low') {
      list.sort((a, b) => Number(a.discount_price ?? a.price ?? 0) - Number(b.discount_price ?? b.price ?? 0));
    } else if (sort === 'price-high' || sort === 'price_high') {
      list.sort((a, b) => Number(b.discount_price ?? b.price ?? 0) - Number(a.discount_price ?? a.price ?? 0));
    } else {
      // Default: popular
      list.sort((a, b) => Number(b.student_count ?? b.studentCount ?? 0) - Number(a.student_count ?? a.studentCount ?? 0));
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
    return list.find(c => c.id === idOrSlug || c.slug === idOrSlug) || null;
  },

  create(courseData) {
    const list = this.getAll();
    const id = courseData.id || crypto.randomUUID();
    const slug = courseData.slug || (courseData.title || 'course')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newCourse = {
      id,
      title: courseData.title,
      slug,
      subtitle: courseData.subtitle || '',
      description: courseData.description || '',
      category_id: courseData.category_id || courseData.categoryId || null,
      category: courseData.category || courseData.categories?.name || 'Development',
      categories: courseData.categories || {
        id: courseData.category_id || courseData.categoryId || 'cat-1',
        name: courseData.category || 'Web Development',
        slug: (courseData.category || 'web-development').toLowerCase().replace(/\s+/g, '-')
      },
      instructor_id: courseData.instructor_id || courseData.teacher_id || 'inst-1',
      teacher_id: courseData.instructor_id || courseData.teacher_id || 'inst-1',
      teachers: courseData.teachers || {
        id: 'inst-1',
        avg_rating: 4.8,
        total_students: 1240500,
        total_courses: 15,
        profiles: {
          display_name: 'Dr. Angela Steele',
          first_name: 'Angela',
          last_name: 'Steele',
          avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&q=80'
        }
      },
      level: courseData.level || 'all_levels',
      language: courseData.language || 'English',
      price: Number(courseData.price ?? 0),
      discount_price: courseData.discount_price !== undefined ? Number(courseData.discount_price) : (courseData.discountPrice !== undefined ? Number(courseData.discountPrice) : null),
      is_free: Boolean(courseData.is_free ?? courseData.isFree),
      duration_hours: Number(courseData.duration_hours || courseData.durationHours || 10),
      thumbnail_url: courseData.thumbnail_url || courseData.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
      banner_url: courseData.banner_url || courseData.bannerUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600',
      preview_video_url: courseData.preview_video_url || courseData.previewVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      status: courseData.status || 'published',
      badge: courseData.badge || null,
      is_bestseller: Boolean(courseData.badge === 'Bestseller' || courseData.is_bestseller),
      avg_rating: Number(courseData.avg_rating ?? courseData.rating ?? 4.8),
      rating: Number(courseData.avg_rating ?? courseData.rating ?? 4.8),
      student_count: Number(courseData.student_count ?? courseData.studentCount ?? 0),
      studentCount: Number(courseData.student_count ?? courseData.studentCount ?? 0),
      tags: Array.isArray(courseData.tags) ? courseData.tags : (courseData.tags ? String(courseData.tags).split(',').map(s => s.trim()) : []),
      what_you_will_learn: Array.isArray(courseData.what_you_will_learn) ? courseData.what_you_will_learn : (courseData.what_you_will_learn ? String(courseData.what_you_will_learn).split('\n').map(s => s.trim()).filter(Boolean) : []),
      requirements: Array.isArray(courseData.requirements) ? courseData.requirements : ['Basic computer skills', 'Internet connection'],
      target_audience: Array.isArray(courseData.target_audience) ? courseData.target_audience : ['Beginners and aspiring professionals'],
      course_sections: courseData.course_sections || [
        {
          id: `sec-${Date.now()}-1`,
          title: 'Section 1: Course Overview & Introduction',
          sort_order: 1,
          course_lessons: [
            {
              id: `les-${Date.now()}-1`,
              title: 'Welcome to the Course',
              duration_minutes: 8,
              video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
              is_preview: true,
              sort_order: 1
            }
          ]
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    list.unshift(newCourse);
    this.saveAll(list);
    return newCourse;
  },

  update(id, updates) {
    const list = this.getAll();
    const idx = list.findIndex(c => c.id === id || c.slug === id);
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
    const filtered = list.filter(c => c.id !== id && c.slug !== id);
    if (filtered.length === initialLen) return false;
    this.saveAll(filtered);
    return true;
  }
};
