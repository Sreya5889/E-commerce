import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, Facebook, Twitter, Linkedin, Youtube, Github, ShieldCheck, Award } from 'lucide-react';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Col 1: Brand & Mission */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-primary-500/20">
                E
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Edu<span className="text-primary-500">Academy</span>
              </span>
            </Link>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              EduAcademy is an industry-leading online learning marketplace empowering 1.2M+ global learners with verified tech skills, expert mentorship, and hands-on coding bootcamps.
            </p>

            <div className="flex items-center space-x-3 pt-1">
              <a
                href="#"
                aria-label="Facebook"
                className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-primary-600 hover:text-white flex items-center justify-center text-slate-400 transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-primary-600 hover:text-white flex items-center justify-center text-slate-400 transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-primary-600 hover:text-white flex items-center justify-center text-slate-400 transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="GitHub"
                className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-primary-600 hover:text-white flex items-center justify-center text-slate-400 transition-all"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Top Categories</h4>
            <ul className="space-y-2.5 text-xs">
              {['Web Development', 'Cloud & DevOps', 'Data Science & AI', 'Mobile Apps', 'Cybersecurity'].map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/courses?category=${encodeURIComponent(cat.toLowerCase().replace(/\s+/g, '-'))}`}
                    className="hover:text-primary-400 transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Platform</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/courses" className="hover:text-primary-400 transition-colors">All Courses</Link></li>
              <li><Link to="/pricing" className="hover:text-primary-400 transition-colors">Membership Plans</Link></li>
              <li><Link to="/teachers" className="hover:text-primary-400 transition-colors">Instructor Directory</Link></li>
              <li><Link to="/about" className="hover:text-primary-400 transition-colors">About EduAcademy</Link></li>
              <li><Link to="/contact" className="hover:text-primary-400 transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Col 4: Teach & Newsletter */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Stay Updated</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Subscribe to get free weekly coding roadmaps and discount coupons.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-3 pr-10 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg flex items-center justify-center transition-colors"
                  aria-label="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] text-emerald-400 font-semibold">Thank you for subscribing!</p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} EduAcademy Inc. All rights reserved.</p>
          <div className="flex items-center space-x-6 text-slate-400">
            <Link to="/about" className="hover:text-slate-200 transition-colors">Privacy Policy</Link>
            <Link to="/about" className="hover:text-slate-200 transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-slate-200 transition-colors">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
