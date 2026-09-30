import React, { useEffect, useState } from 'react';

interface AnimatedChartProps {
  children: React.ReactNode;
  /** Animation type */
  type?: 'bar' | 'line' | 'fade';
  /** Duration in ms */
  duration?: number;
  /** Additional className */
  className?: string;
  /** Whether the chart has data (triggers animation) */
  hasData?: boolean;
}

/**
 * AnimatedChart - Wrapper for charts with entrance animations.
 * Bar: scaleY(0)→scaleY(1), Line: stroke-dashoffset animation, Fade: opacity 0→1
 */
export const AnimatedChart: React.FC<AnimatedChartProps> = ({
  children,
  type = 'fade',
  duration = 500,
  className = '',
  hasData = true,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasData && !hasAnimated) {
      setIsAnimating(true);
      const timeout = setTimeout(() => {
        setIsAnimating(false);
        setHasAnimated(true);
      }, duration);
      return () => clearTimeout(timeout);
    }
  }, [hasData, duration, hasAnimated]);

  const getAnimationStyle = (): React.CSSProperties => {
    if (!isAnimating) return {};

    switch (type) {
      case 'bar':
        return {
          transform: 'scaleY(1)',
          transformOrigin: 'bottom',
          transition: `transform ${duration}ms ease-out`,
        };
      case 'line':
        return {
          strokeDasharray: 1000,
          strokeDashoffset: 0,
          transition: `stroke-dashoffset ${duration}ms ease-out`,
        };
      case 'fade':
      default:
        return {
          opacity: 1,
          transition: `opacity ${duration}ms ease-out`,
        };
    }
  };

  const getInitialStyle = (): React.CSSProperties => {
    if (hasAnimated || !hasData) return {};

    switch (type) {
      case 'bar':
        return { transform: 'scaleY(0)', transformOrigin: 'bottom' };
      case 'line':
        return { strokeDasharray: 1000, strokeDashoffset: 1000 };
      case 'fade':
      default:
        return { opacity: 0 };
    }
  };

  return (
    <div className={className} style={getInitialStyle()}>
      <div style={getAnimationStyle()}>
        {children}
      </div>
    </div>
  );
};
