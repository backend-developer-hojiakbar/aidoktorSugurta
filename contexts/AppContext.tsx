import React, { createContext, useState, useContext, useEffect } from 'react';
import { Language } from '@/types';
import { uzTranslationData } from '@/translations/uz'; 

const AppContext = createContext(undefined);

export const AppContextProvider = ({ children }) => {
  
  const [currentTranslations, setCurrentTranslations] = useState({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = Language.UZ;
      document.documentElement.className = 'light'; // Set light class for html element
       const body = document.getElementById('theme-body');
        if (body) {
            body.className = 'light-theme'; // Set light-theme class for body
        }
    }
    setCurrentTranslations(uzTranslationData || {});
  }, []);

  return (
    <AppContext.Provider value={{ translations: currentTranslations, language: Language.UZ }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};