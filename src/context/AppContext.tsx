'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, LawTerm } from '@/types';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  activeTerm: LawTerm | null;
  openTermModal: (term: LawTerm) => void;
  closeTermModal: () => void;
  isBriefOpen: boolean;
  openBriefModal: () => void;
  closeBriefModal: () => void;
  // Bookmark state
  bookmarkedSlugs: string[];
  toggleBookmark: (slug: string) => void;
  isBookmarked: (slug: string) => boolean;
  // User Judge Decisions state
  userDecisions: Record<string, string>;
  setUserDecision: (caseSlug: string, optionId: string) => void;
  // Toast notifications
  toastMessage: string | null;
  showToast: (msg: string) => void;
  // Audio Speech Synthesis Narration
  isPlayingAudio: boolean;
  activeNarrationText: string | null;
  playAudio: (text: string, lang?: Language) => void;
  stopAudio: () => void;
  toggleAudio: (text: string, lang?: Language) => void;
  // Share Sheet
  isShareOpen: boolean;
  shareData: { title: string; url: string; citation: string } | null;
  openShareModal: (data: { title: string; url: string; citation: string }) => void;
  closeShareModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [activeTerm, setActiveTerm] = useState<LawTerm | null>(null);
  const [isBriefOpen, setIsBriefOpen] = useState<boolean>(false);
  const [bookmarkedSlugs, setBookmarkedSlugs] = useState<string[]>([]);
  const [userDecisions, setUserDecisions] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [activeNarrationText, setActiveNarrationText] = useState<string | null>(null);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [shareData, setShareData] = useState<{ title: string; url: string; citation: string } | null>(null);

  // Load persisted state from localStorage on mount
  useEffect(() => {
    try {
      const savedBookmarks = localStorage.getItem('pleadings_bookmarks');
      if (savedBookmarks) {
        setBookmarkedSlugs(JSON.parse(savedBookmarks));
      }
      const savedDecisions = localStorage.getItem('pleadings_decisions');
      if (savedDecisions) {
        setUserDecisions(JSON.parse(savedDecisions));
      }
      const savedLang = (localStorage.getItem('pleadings:lang') || localStorage.getItem('pleadings_lang')) as Language;
      if (savedLang === 'en' || savedLang === 'hi') {
        setLanguage(savedLang);
        if (typeof document !== 'undefined') {
          document.documentElement.lang = savedLang;
        }
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    try {
      localStorage.setItem('pleadings:lang', lang);
      localStorage.setItem('pleadings_lang', lang);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = lang;
        document.cookie = `lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
      }
    } catch {
      // ignore
    }
    // Stop audio if language changes
    if (isPlayingAudio) {
      stopAudio();
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const toggleBookmark = (slug: string) => {
    setBookmarkedSlugs((prev) => {
      let updated: string[];
      if (prev.includes(slug)) {
        updated = prev.filter((s) => s !== slug);
        showToast(language === 'en' ? 'Removed from saved cases' : 'सहेजे गए मामलों से हटाया गया');
      } else {
        updated = [...prev, slug];
        showToast(language === 'en' ? 'Case bookmarked to your library' : 'मामला आपकी लाइब्रेरी में सहेजा गया');
      }
      try {
        localStorage.setItem('pleadings_bookmarks', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const isBookmarked = (slug: string) => bookmarkedSlugs.includes(slug);

  const setUserDecision = (caseSlug: string, optionId: string) => {
    setUserDecisions((prev) => {
      const updated = { ...prev, [caseSlug]: optionId };
      try {
        localStorage.setItem('pleadings_decisions', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    showToast(language === 'en' ? 'Judicial verdict cast!' : 'न्यायिक फैसला दर्ज हुआ!');
  };

  const openTermModal = (term: LawTerm) => {
    setActiveTerm(term);
  };

  const closeTermModal = () => {
    setActiveTerm(null);
  };

  const openBriefModal = () => {
    setIsBriefOpen(true);
  };

  const closeBriefModal = () => {
    setIsBriefOpen(false);
  };

  const openShareModal = (data: { title: string; url: string; citation: string }) => {
    setShareData(data);
    setIsShareOpen(true);
  };

  const closeShareModal = () => {
    setIsShareOpen(false);
  };

  // Audio Speech Synthesis
  const stopAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setActiveNarrationText(null);
  };

  const playAudio = (text: string, lang: Language = language) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      showToast(language === 'en' ? 'Audio not supported in this browser' : 'इस ब्राउज़र में ऑडियो समर्थित नहीं है');
      return;
    }

    window.speechSynthesis.cancel();

    // Strip markdown formatting brackets [term](term:id) or **bold**
    const plainText = text.replace(/\[([^\]]+)\]\(term:[^)]+\)/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1');

    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';

    utterance.onstart = () => {
      setIsPlayingAudio(true);
      setActiveNarrationText(plainText);
    };

    utterance.onend = () => {
      setIsPlayingAudio(false);
      setActiveNarrationText(null);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setActiveNarrationText(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const toggleAudio = (text: string, lang: Language = language) => {
    if (isPlayingAudio) {
      stopAudio();
    } else {
      playAudio(text, lang);
    }
  };

  // Stop audio on unmount or navigation
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        activeTerm,
        openTermModal,
        closeTermModal,
        isBriefOpen,
        openBriefModal,
        closeBriefModal,
        bookmarkedSlugs,
        toggleBookmark,
        isBookmarked,
        userDecisions,
        setUserDecision,
        toastMessage,
        showToast,
        isPlayingAudio,
        activeNarrationText,
        playAudio,
        stopAudio,
        toggleAudio,
        isShareOpen,
        shareData,
        openShareModal,
        closeShareModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppContextProvider');
  }
  return context;
}
