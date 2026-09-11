import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, Send, Sparkles, Compass, Target, ArrowRight, 
  ExternalLink, User, CheckCircle2, RotateCcw 
} from 'lucide-react';
import { aiCareerService } from '../../services/aiCareer.service';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const AiCareerAssistant = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      content: "Hello! I'm your EduAcademy AI Career & Technical Mentor. I have real-time visibility into your course completions, CodeLab accuracy, portfolio projects, and interview drills. How can I help propel your career today?",
      actionLinks: [
        { label: 'Analyze My Career Readiness', url: '/career' },
        { label: 'Recommend Next Project Blueprint', url: '/projects' },
        { label: 'Prepare for Tech Interviews', url: '/interview' }
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    "What should I learn next to become a Full Stack Developer?",
    "Recommend a portfolio project for my resume based on my skills",
    "What are top interview questions asked for React & Node.js?",
    "How do I improve my EduAcademy Career Readiness Score?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim() || loading) return;

    const userMsg = {
      sender: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.sender === 'assistant' ? 'assistant' : 'user',
        content: m.content
      }));

      const res = await aiCareerService.sendMessage(query, history);

      const aiMsg = {
        sender: 'assistant',
        content: res.reply || "I've analyzed your platform metrics. Keep strengthening your CodeLab accuracy and complete your active project blueprint to maximize hiring interest.",
        actionLinks: res.actionLinks || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Failed to get AI mentor response:', err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          content: "I ran into a temporary hiccup communicating with the model, but here's a quick recommendation: focus on practicing DSA in CodeLab and submitting your verified portfolio blueprint in Projects Hub.",
          actionLinks: [
            { label: 'Go to CodeLab', url: '/codelab' },
            { label: 'Browse Projects', url: '/projects' }
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  AI Career & Technical Mentor
                </h1>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Trained on your real metrics: 68/100 Career Readiness • Stage: Build
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/career">
              <Button variant="outline" size="sm" icon={Compass}>
                Readiness Score
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Prompts */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-primary-500 hover:text-primary-600 whitespace-nowrap transition-colors shadow-sm"
            >
              ✨ {p}
            </button>
          ))}
        </div>

        {/* Chat Thread Container */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm min-h-[480px] max-h-[600px] overflow-y-auto flex flex-col space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                m.sender === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800'
              }`}>
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[82%] sm:max-w-[75%] space-y-2.5 ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-primary-600 text-white rounded-tr-none'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 rounded-tl-none'
                }`}>
                  {m.content}
                </div>

                {/* AI Action Links Chips */}
                {m.actionLinks && m.actionLinks.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {m.actionLinks.map((link, lIdx) => (
                      <Link
                        key={lIdx}
                        to={link.url}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/80 text-xs font-bold hover:bg-purple-100 transition-colors"
                      >
                        <span>{link.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    ))}
                  </div>
                )}

                <span className="text-[10px] text-slate-400 block px-1">
                  {m.timestamp}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700/60 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2.5 shadow-sm flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask your mentor about skills, roadmaps, interview prep, or projects..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-4 py-2 bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400"
          />

          <Button
            onClick={() => handleSend()}
            loading={loading}
            icon={Send}
            size="md"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AiCareerAssistant;
