import React, { useState } from 'react';
import { PageTransition } from '../../components/layout/PageTransition';
import { Mail, Phone, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { db } from '../../services/db';

export const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      await db.submitContactForm(formData.name, formData.email, formData.subject, formData.message);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="px-3 py-1 bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 font-bold rounded-full text-xs uppercase tracking-wider">
            Contact Us
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Get in Touch with Support</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            We generally respond to all support tickets and questions within 12-24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Contact details & Mock Map */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-6">
              <h3 className="font-bold text-lg">Support Headquarters</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Have pre-sales questions about billing or enterprise licensing? Reach out directly using our contact logs below.
              </p>
            </div>

            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-350">
              <div className="flex items-center space-x-3.5">
                <MapPin className="w-5 h-5 text-primary-600" />
                <span>100 Tech Boulevard, Suite 500, San Francisco, CA 94107</span>
              </div>
              <div className="flex items-center space-x-3.5">
                <Phone className="w-5 h-5 text-primary-600" />
                <span>+1 (555) 839-2910 (Mon-Fri, 9am - 6pm PST)</span>
              </div>
              <div className="flex items-center space-x-3.5">
                <Mail className="w-5 h-5 text-primary-600" />
                <span>support@eduacademy.com</span>
              </div>
            </div>

            {/* Mock Map */}
            <div className="w-full h-56 rounded-premium bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-600 text-xs">
              <div className="text-center space-y-2">
                <MapPin className="w-8 h-8 mx-auto" />
                <p className="font-bold">San Francisco, CA</p>
                <p className="text-[10px] text-slate-400">Map rendering fallback</p>
              </div>
            </div>
          </div>

          {/* Right Column: Contact form */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Send a Message</h3>
              
              {success && (
                <div className="p-4 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-200 rounded-premium flex items-center space-x-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Message sent successfully! Our team will contact you shortly.</span>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-200 rounded-premium flex items-center space-x-2 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 text-xs">
                  <label className="font-semibold text-slate-700 dark:text-slate-350">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Jane Doe"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-premium focus:outline-none focus:ring-1 focus:ring-primary-500 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div className="space-y-2 text-xs">
                  <label className="font-semibold text-slate-700 dark:text-slate-350">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="jane@example.com"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-premium focus:outline-none focus:ring-1 focus:ring-primary-500 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <label className="font-semibold text-slate-700 dark:text-slate-350">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Enquiry regarding course access"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-premium focus:outline-none focus:ring-1 focus:ring-primary-500 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="space-y-2 text-xs">
                <label className="font-semibold text-slate-700 dark:text-slate-350">Message Body</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Write your support request details here..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-premium focus:outline-none focus:ring-1 focus:ring-primary-500 text-slate-800 dark:text-slate-200"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-premium shadow-md shadow-primary-500/10 transition-colors"
              >
                {loading ? 'Submitting...' : 'Submit Support Request'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
