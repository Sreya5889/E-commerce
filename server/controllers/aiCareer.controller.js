import { calculateCareerReadiness } from '../utils/careerEngine.js';
import { codelabStore } from '../utils/codelabStore.js';
import { projectStore } from '../utils/projectStore.js';

export const aiCareerController = {
  async chat(req, res) {
    try {
      const { message, history = [] } = req.body;
      const userId = req.user?.id || 'demo-student-id';

      if (!message || !message.trim()) {
        return res.status(400).json({ success: false, message: 'Message is required' });
      }

      // Context ingestion
      const readiness = calculateCareerReadiness(userId);
      const q = message.toLowerCase();

      let reply = '';
      let actionLinks = [];

      if (q.includes('roadmap') || q.includes('full stack') || q.includes('career')) {
        reply = `Based on your current EduAcademy profile, you are currently at the **${readiness.roadmapStage}** stage with a **Career Readiness Score of ${readiness.readinessScore}/100**.

Here is your tailored 4-step roadmap:
1. **Learn**: Continue with the **Full Stack Developer** Learning Path (Ordered from HTML/CSS to Advanced React & Node.js).
2. **Practice**: Solve 10 more problems in **CodeLab** focusing on Arrays, Strings, and SQL.
3. **Build**: Complete the **Full Stack Modern E-Commerce Platform** portfolio project.
4. **Prepare**: Practice System Design and React Reconciliation in the **Interview Hub**.`;
        actionLinks = [
          { label: 'View Full Stack Path', url: '/learning-paths/full-stack-developer' },
          { label: 'Go to CodeLab', url: '/codelab' },
          { label: 'Start Project', url: '/projects/full-stack-e-commerce-marketplace' }
        ];
      } else if (q.includes('sql') || q.includes('database')) {
        reply = `Your SQL & Database proficiency is currently estimated at **${readiness.skillsMatrix.find(s => s.skill.includes('SQL'))?.progress || 80}%**.

To advance to senior level, practice window functions and subqueries in CodeLab, specifically:
- Second Highest Salary (Subquery)
- Employees Earning More Than Managers (Self-Join)

These queries match real interview technical screenings for backend and analyst roles.`;
        actionLinks = [
          { label: 'Practice SQL Problems', url: '/codelab?category=sql-queries' },
          { label: 'Review ACID Questions', url: '/interview' }
        ];
      } else if (q.includes('interview') || q.includes('prepare')) {
        reply = `For technical interview preparation, EduAcademy provides curated question banks with model STAR answers. Focus on:
1. **React Virtual DOM & Reconciliation** (Web & Frontend)
2. **ACID Properties & Database Isolation Levels** (DBMS)
3. **URL Shortener High-Level Architecture** (System Design)
4. **Behavioral STAR questions** for HR rounds`;
        actionLinks = [
          { label: 'Open Interview Hub', url: '/interview' },
          { label: 'Try Technical Mock Test', url: '/interview/mock-tests' }
        ];
      } else {
        reply = `Hello! I'm your EduAcademy AI Career Assistant. I can help you with:
- **Skill-Gap Analysis**: Evaluate what skills you need for your target job.
- **Roadmaps**: Step-by-step career path recommendations.
- **Project Ideas**: Real-world capstones that impress tech recruiters.
- **Interview Coaching**: Technical and behavioral preparation with sample answers.

What career goal would you like to discuss today?`;
        actionLinks = [
          { label: 'View Career Dashboard', url: '/career' },
          { label: 'Browse Jobs & Internships', url: '/jobs' }
        ];
      }

      res.json({
        success: true,
        data: {
          reply,
          actionLinks,
          readinessScore: readiness.readinessScore,
          stage: readiness.roadmapStage
        }
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};
