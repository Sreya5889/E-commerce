import React from 'react';

export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-xl ${className}`}
      {...props}
    />
  );
};

export const CourseCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden p-0 flex flex-col shadow-sm">
      <Skeleton className="w-full aspect-video rounded-none" />
      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20 rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-3/4 rounded-md" />
        </div>
        <div className="space-y-3 pt-2">
          <div className="flex items-center space-x-2">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="h-3 w-24 rounded-md" />
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <Skeleton className="h-5 w-16 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const InstructorCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 text-center space-y-4">
      <Skeleton className="w-24 h-24 rounded-full mx-auto" />
      <Skeleton className="h-5 w-32 mx-auto rounded-md" />
      <Skeleton className="h-3 w-44 mx-auto rounded-md" />
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <Skeleton className="h-8 w-full rounded-lg" />
        <Skeleton className="h-8 w-full rounded-lg" />
      </div>
    </div>
  );
};
