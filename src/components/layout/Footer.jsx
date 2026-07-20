import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, Facebook, Twitter, Linkedin, Youtube, Github } from 'lucide-react';

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
    <footer className="bg-slate-900 text-slate-300 dark:bg-slate-950 border-t border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-premium bg-gradient-to-tr from-primary-500 to-secondary-500 flex items-center justify-center text-white font-extrabold text-xl">
                E
              </div>
              <span className="text-2xl font-bold text-white">
                EduAcademy
              </span>
            </Link>
            <p className="text-slate-400 text-sm max-w-sm">
              We empower learners to advance their careers, acquire premium tech skills, and master industry tools through hands-on development bootcamps.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-slate-800 hover:bg-primary-600 rounded-premium hover:text-white transition-all duration-200">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-primary-600 rounded-premium hover:text-white transition-all duration-200">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-primary-600 rounded-premium hover:text-white transition-all duration-200">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-primary-600 rounded-premium hover:text-white transition-all duration-200">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-primary-600 rounded-premium hover:text-white transition-all duration-200">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Popular Categories */}
          <div className="space-y-4">
            <h4 className="text-white text-base font-semibold">Categories</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/courses?category=web-development" className="hover:text-primary-400 transition-colors">Web Development</Link>
              </li>
              <li>
                <Link to="/courses?category=artificial-intelligence" className="hover:text-primary-400 transition-colors">Artificial Intelligence</Link>
              </li>
              <li>
                <Link to="/courses?category=ui-ux-design" className="hover:text-primary-400 transition-colors">UI/UX Product Design</Link>
              </li>
              <li>
                <Link to="/courses?category=mobile-development" className="hover:text-primary-400 transition-colors">Mobile Engineering</Link>
              </li>
              <li>
                <Link to="/courses?category=marketing" className="hover:text-primary-400 transition-colors">Digital Marketing</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div className="space-y-4">
            <h4 className="text-white text-base font-semibold">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-primary-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-primary-400 transition-colors">Membership Pricing</Link>
              </li>
              <li>
                <Link to="/teachers" className="hover:text-primary-400 transition-colors">Instructors</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-400 transition-colors">Support Contact</Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">Careers</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="space-y-4">
            <h4 className="text-white text-base font-semibold">Newsletter</h4>
            <p className="text-slate-400 text-sm">
              Subscribe to get updates on course launches and discount campaigns.
            </p>
            <form onSubmit={handleSubscribe} className="relative mt-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-premium text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 p-1.5 bg-primary-600 hover:bg-primary-500 text-white rounded-md transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
            {subscribed && (
              <p className="text-xs text-green-400 font-medium animate-pulse">
                Successfully subscribed! Check your inbox.
              </p>
            )}
          </div>

        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 space-y-4 md:space-y-0">
          <p>© 2026 EduAcademy Inc. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-300">Cookie Preferences</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
