import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface AnimatedToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
  /** Duration in ms before auto-closing */
  duration?: number;
}

/**
 * AnimatedToast - Toast notification with smooth enter/exit animations.
 * Enter: Opacity 0→1, TranslateY: 8px→0px (200ms)
 * Exit: Opacity 1→0, TranslateY: 0→-4px (150ms)
 */
export const AnimatedToast: React.FC<AnimatedToastProps> = ({
  message,
  type,
  isVisible,
  onClose,
  duration = 3500,
}) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimatingIn(true);
        });
      });

      const timeout = setTimeout(() => {
        setIsAnimatingIn(false);
        setTimeout(() => {
          setShouldRender(false);
          onClose();
        }, 150);
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [isVisible, duration, onClose]);

  if (!shouldRender) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-[#2da44e]" />,
    error: <AlertCircle className="w-4 h-4 text-[#cf222e]" />,
    warning: <AlertTriangle className="w-4 h-4 text-[#d29922]" />,
    info: <Info className="w-4 h-4 text-[#0969da]" />,
  };

  const backgrounds = {
    success: 'bg-[#dafbe1] border-[#4ac26b]/50 text-[#1a7f37]',
    error: 'bg-[#ffebe9] border-[#ff8182]/60 text-[#cf222e]',
    warning: 'bg-[#fff8c5] border-[#d29922]/60 text-[#9a6700]',
    info: 'bg-[#ddf4ff] border-[#54aeff]/60 text-[#0969da]',
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-3.5 py-2.5 rounded-md border shadow-lg text-xs font-medium transition-all duration-200 ${
        isAnimatingIn
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-2 scale-98'
      } ${backgrounds[type]}`}
    >
      {icons[type]}
      <span>{message}</span>
    </div>
  );
};
