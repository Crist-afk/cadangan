import React, { useEffect, useState, useRef } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  /** Unique key to trigger transition on change */
  transitionKey: string;
  /** Duration in ms for the enter animation */
  duration?: number;
}

/**
 * PageTransition - Wraps content with a smooth fade + slide transition
 * when the transitionKey changes.
 * 
 * Pattern: Opacity 0→1, Y: 6px→0px, Duration: ~220ms, Ease: ease-out
 */
export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  transitionKey,
  duration = 220,
}) => {
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState<'enter' | 'exit'>('enter');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevKeyRef = useRef(transitionKey);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (prevKeyRef.current !== transitionKey) {
      // Start exit animation
      setIsTransitioning(true);
      setTransitionStage('exit');

      // After exit completes, swap content and enter
      timeoutRef.current = setTimeout(() => {
        setDisplayChildren(children);
        setTransitionStage('enter');
        prevKeyRef.current = transitionKey;

        // Reset transitioning state after enter completes
        timeoutRef.current = setTimeout(() => {
          setIsTransitioning(false);
        }, duration);
      }, 180); // Exit duration
    } else {
      setDisplayChildren(children);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [transitionKey, children, duration]);

  const style: React.CSSProperties = isTransitioning
    ? transitionStage === 'exit'
      ? {
          opacity: 0,
          transform: 'translateY(-4px)',
          transition: `opacity 180ms ease-in, transform 180ms ease-in`,
        }
      : {
          opacity: 1,
          transform: 'translateY(0)',
          transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
        }
    : {};

  return <div style={style}>{displayChildren}</div>;
};
