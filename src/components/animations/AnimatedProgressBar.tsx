import React, { useEffect, useState } from 'react';

interface AnimatedProgressBarProps {
  /** Current progress value (0-100) */
  value: number;
  /** Additional className */
  className?: string;
  /** Bar color */
  barColor?: string;
  /** Background color */
  bgColor?: string;
  /** Height of the bar */
  height?: string;
  /** Show percentage label */
  showLabel?: boolean;
  /** Duration of the transition in ms */
  duration?: number;
}

/**
 * AnimatedProgressBar - Smooth animated progress bar.
 * Transition: width 400ms ease-out
 */
export const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({
  value,
  className = '',
  barColor = 'bg-[#1a7f37]',
  bgColor = 'bg-[#f6f8fa]',
  height = 'h-2.5',
  showLabel = false,
  duration = 400,
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Animate to new value
    const timeout = setTimeout(() => {
      setDisplayValue(value);
    }, 50);
    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`w-full ${bgColor} border border-[#d0d7de] rounded-full ${height} overflow-hidden`}>
        <div
          className={`${barColor} ${height} rounded-full`}
          style={{
            width: `${displayValue}%`,
            transition: `width ${duration}ms ease-out`,
          }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-mono font-semibold text-[#1f2328] w-12 text-right tabular-nums">
          {Math.round(displayValue)}%
        </span>
      )}
    </div>
  );
};
