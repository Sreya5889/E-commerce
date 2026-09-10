import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionText,
  actionLink,
  onAction,
  className = '',
}) => {
  return (
    <div className={`text-center py-16 px-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-5 max-w-lg mx-auto ${className}`}>
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 flex items-center justify-center mx-auto shadow-inner">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
            {description}
          </p>
        )}
      </div>
      {(actionText && (actionLink || onAction)) && (
        <div className="pt-2">
          {actionLink ? (
            <Link to={actionLink}>
              <Button size="md">{actionText}</Button>
            </Link>
          ) : (
            <Button size="md" onClick={onAction}>{actionText}</Button>
          )}
        </div>
      )}
    </div>
  );
};
