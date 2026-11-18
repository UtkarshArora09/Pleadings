'use client';

import { useEffect, useState } from 'react';

/**
 * Shared accessibility hook for modal dialogs & bottom sheets:
 * - Safe client-mount flag for React createPortal
 * - Escape key to dismiss
 * - Body scroll lock while open
 * - Restores focus to the triggering element on close
 */
export function useAccessibleModal(isOpen: boolean, onClose: () => void): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.body.style.overflow = origOverflow;
      document.removeEventListener('keydown', handleKeyDown, true);
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    };
  }, [isOpen, onClose]);

  return mounted;
}
