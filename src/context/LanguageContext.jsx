import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../locales/en';
import ru from '../locales/ru';

const translations = { en, ru };

const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key
});

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem('netspecture_lang') || 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('netspecture_lang', lang);
    } catch {}
  };

  const t = (key, params = {}) => {
    const dict = translations[language] || translations.en;
    let str = dict[key] || translations.en[key] || key;
    if (params && typeof params === 'object') {
      for (const [k, v] of Object.entries(params)) {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
      }
    }
    return str;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
