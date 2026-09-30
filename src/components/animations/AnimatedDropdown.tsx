import React, { useEffect, useState, useRef } from 'react';

interface AnimatedDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Additional className for the dropdown content */
  className?: string;
}

/**
 * AnimatedDropdown - Dropdown with smooth enter/exit animations.
 * Opacity: 0→1, TranslateY: -4px→0px, Duration: 160ms
 */
export const AnimatedDropdown: React.FC<AnimatedDropdownProps> = ({
  isOpen,
  onClose,
  children,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      setIsVisible(false);
      const timeout = setTimeout(() => {
        setShouldRender(false);
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  return (
    <div
      ref={dropdownRef}
      className={`absolute z-50 transition-all duration-150 ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-1'
      } ${className}`}
    >
      {children}
    </div>
  );
};
