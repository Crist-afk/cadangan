import React from 'react';

interface SkeletonLoaderProps {
  /** Number of skeleton lines to show */
  lines?: number;
  /** Height of each line */
  height?: string;
  /** Additional className */
  className?: string;
  /** Width of the skeleton */
  width?: string;
}

/**
 * SkeletonLoader - Simple, subtle skeleton loading state.
 * Uses a gentle shimmer animation.
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  lines = 3,
  height = 'h-4',
  className = '',
  width = 'w-full',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`${height} ${width} rounded skeleton-shimmer`}
          style={{
            animationDelay: `${i * 100}ms`,
          }}
        />
      ))}
    </div>
  );
};

/**
 * SkeletonCard - Skeleton loader for card components.
 */
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`p-4 border border-[#d0d7de] rounded-md bg-white ${className}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full skeleton-shimmer" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-3/4 rounded skeleton-shimmer" />
          <div className="h-2 w-1/2 rounded skeleton-shimmer" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-2 w-full rounded skeleton-shimmer" />
        <div className="h-2 w-5/6 rounded skeleton-shimmer" />
      </div>
    </div>
  );
};

/**
 * SkeletonTable - Skeleton loader for table components.
 */
export const SkeletonTable: React.FC<{ rows?: number; className?: string }> = ({
  rows = 5,
  className = '',
}) => {
  return (
    <div className={`border border-[#d0d7de] rounded-md overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-[#f6f8fa] border-b border-[#d0d7de] p-3">
        <div className="flex gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-3 flex-1 rounded skeleton-shimmer" />
          ))}
        </div>
      </div>
      {/* Rows */}
      <div className="divide-y divide-[#d0d7de]">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-3 flex gap-4">
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="h-3 flex-1 rounded skeleton-shimmer" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
