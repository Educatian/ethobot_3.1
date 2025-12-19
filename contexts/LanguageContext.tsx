import React, { createContext, useState, useContext, ReactNode } from 'react';
import { t as translate, Language as LangType, TranslationKey } from '../utils/i18n';

export type Language = LangType;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const getInitialLanguage = (): Language => {
    const savedLang = localStorage.getItem('ethobot_language');
    if (savedLang === 'ko' || savedLang === 'en') {
      return savedLang;
    }
    return 'en';
  };

  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (lang: Language) => {
      setLanguageState(lang);
      localStorage.setItem('ethobot_language', lang);
  };

  const t = (key: TranslationKey): string => {
      return translate(key, language);
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
