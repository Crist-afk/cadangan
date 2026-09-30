import React, { useEffect, useState } from 'react';

interface AnimatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Additional className for the modal content */
  contentClassName?: string;
  /** Additional className for the overlay */
  overlayClassName?: string;
}

/**
 * AnimatedModal - Modal with smooth enter/exit animations.
 * Overlay: Opacity 0→1 (200ms)
 * Content: Opacity 0→1, Scale 0.98→1 (220ms)
 */
export const AnimatedModal: React.FC<AnimatedModalProps> = ({
  isOpen,
  onClose,
  children,
  contentClassName = '',
  overlayClassName = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Small delay to ensure initial state is rendered before animating
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      setIsVisible(false);
      // Remove from DOM after exit animation completes
      const timeout = setTimeout(() => {
        setShouldRender(false);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 ${overlayClassName}`}
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Content */}
      <div
        className={`relative transition-all duration-200 ${
          isVisible
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-98 translate-y-1'
        } ${contentClassName}`}
      >
        {children}
      </div>
    </div>
  );
};
