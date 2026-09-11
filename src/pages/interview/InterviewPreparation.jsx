import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, CheckCircle2, ArrowLeft, BookOpen, Clock, 
  Sparkles, Layers, ArrowRight, Target 
} from 'lucide-react';
import { interviewService } from '../../services/interview.service';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const InterviewPreparation = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const data = await interviewService.getPlans();
        setPlans(data || []);
      } catch (err) {
        console.error('Failed to load interview plans:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPlans();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Link to="/interview" className="hover:text-primary-600 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Interview Hub
            </Link>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">Preparation Tracks</span>
          </div>

          <Link to="/interview/mock-tests">
            <Button size="sm">Mock Simulation</Button>
          </Link>
        </div>

        {/* Hero Title */}
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Target className="w-8 h-8 text-primary-600" />
            Interview Preparation Roadmaps
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Structured daily milestone schedules to get interview-ready in 7, 14, or 30 days.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400">
                  <Calendar className="w-3.5 h-3.5" />
                  {plan.duration_days} Days Track
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {plan.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Category: <span className="font-semibold text-slate-700 dark:text-slate-300">{plan.category}</span>
                </p>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <BookOpen className="w-3.5 h-3.5 text-primary-500" />
                  <span>{plan.questions_count} High-Yield Questions</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link to="/interview">
                  <Button variant="outline" className="w-full justify-between" size="sm">
                    <span>Study This Track</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterviewPreparation;
