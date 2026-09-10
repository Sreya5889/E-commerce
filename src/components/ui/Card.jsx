import React from 'react';

export const Card = ({
  children,
  variant = 'elevated',
  interactive = false,
  className = '',
  ...props
}) => {
  const base = 'rounded-2xl transition-all duration-300';
  
  const variants = {
    elevated: 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm shadow-slate-200/50 dark:shadow-none',
    outlined: 'bg-transparent border border-slate-200 dark:border-slate-800',
    glass: 'glass shadow-sm',
    flat: 'bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800/60',
  };

  const hoverStyle = interactive ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : '';

  return (
    <div className={`${base} ${variants[variant] || variants.elevated} ${hoverStyle} ${className}`} {...props}>
      {children}
    </div>
  );
};
