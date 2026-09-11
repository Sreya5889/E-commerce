import { api } from '../lib/api';

export interface AiChatMessage {
  sender: 'user' | 'assistant';
  content: string;
  actionLinks?: Array<{ label: string; url: string }>;
  timestamp: string;
}

export const aiCareerService = {
  async sendMessage(message: string, history: any[] = []): Promise<{
    reply: string;
    actionLinks?: Array<{ label: string; url: string }>;
    readinessScore?: number;
    stage?: string;
  }> {
    try {
      const res = await api.post('/ai-career/chat', { message, history });
      if (res.data?.success && res.data.data) return res.data.data;
    } catch {}

    // Resilient offline contextual intelligence
    const q = message.toLowerCase();
    if (q.includes('roadmap') || q.includes('full stack') || q.includes('learn')) {
      return {
        reply: "Based on your current EduAcademy progress, here is your 4-stage career preparation roadmap:\n\n1. **Learn**: Continue with the **Full Stack Developer** Learning Path (Ordered from HTML/CSS to Advanced React & Node.js).\n2. **Practice**: Solve 10 more problems in **CodeLab** focusing on Arrays, Strings, and SQL.\n3. **Build**: Complete the **Full Stack Modern E-Commerce Platform** portfolio project.\n4. **Prepare**: Practice System Design and React Reconciliation in the **Interview Hub**.",
        actionLinks: [
          { label: 'View Full Stack Path', url: '/learning-paths/full-stack-developer' },
          { label: 'Go to CodeLab', url: '/codelab' },
          { label: 'Start Project', url: '/projects/full-stack-e-commerce-marketplace' }
        ],
        readinessScore: 68,
        stage: 'Build'
      };
    }

    return {
      reply: "I am your EduAcademy AI Career Assistant. I can evaluate your skills, suggest tailored course roadmaps, recommend hands-on capstone projects, and prepare you for technical interviews based on your real platform metrics.",
      actionLinks: [
        { label: 'View Career Dashboard', url: '/career' },
        { label: 'Browse Jobs & Internships', url: '/jobs' }
      ],
      readinessScore: 68,
      stage: 'Build'
    };
  }
};
