import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 h-6 rounded w-3/4 mb-3"></div>
      <div className="bg-gray-200 h-4 rounded w-full mb-2"></div>
      <div className="bg-gray-200 h-4 rounded w-5/6"></div>
    </div>
  );
};

export const TaskCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="bg-gray-200 h-6 rounded w-3/4"></div>
        <div className="bg-gray-200 h-6 w-16 rounded-full"></div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="bg-gray-200 h-4 rounded w-full"></div>
        <div className="bg-gray-200 h-4 rounded w-5/6"></div>
      </div>
      <div className="flex items-center justify-between">
        <div className="bg-gray-200 h-8 w-20 rounded"></div>
        <div className="bg-gray-200 h-8 w-24 rounded"></div>
      </div>
    </div>
  );
};