import React from 'react';

interface StaggerContainerProps {
  children: React.ReactNode;
  /** Delay between each child in ms */
  staggerDelay?: number;
  /** Additional className for the container */
  className?: string;
}

/**
 * StaggerContainer - Applies staggered fade-up animation to children.
 * Each child gets an incremental delay for a natural entrance sequence.
 */
export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  staggerDelay = 50,
  className = '',
}) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className="stagger-item"
          style={{ animationDelay: `${index * staggerDelay}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};
