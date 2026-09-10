import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const base = 'inline-flex items-center font-bold tracking-wide rounded-full uppercase';

  const variants = {
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    primary: 'bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400 border border-primary-100 dark:border-primary-900/50',
    secondary: 'bg-secondary-50 text-secondary-600 dark:bg-secondary-950/40 dark:text-secondary-400 border border-secondary-100 dark:border-secondary-900/50',
    bestseller: 'bg-amber-500 text-white shadow-sm shadow-amber-500/30',
    trending: 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50',
    danger: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50',
    accent: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-xs',
  };

  return (
    <span className={`${base} ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}>
      {children}
    </span>
  );
};
