import React, { createContext, useState, useContext, useEffect } from 'react';
import { Language, AppModeValues } from '@/types';
import { uzTranslationData } from '@/translations/uz';

type AppContextType = {
  translations: typeof uzTranslationData;
  language: typeof Language;
  appMode: keyof typeof AppModeValues;
  setAppMode: (mode: keyof typeof AppModeValues) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  
  const [currentTranslations, setCurrentTranslations] = useState<Record<string, string>>({});
  const [appMode, setAppMode] = useState<keyof typeof AppModeValues>('Login');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = Language.UZ;
      document.documentElement.className = 'light'; 
      const body = document.getElementById('theme-body');
      if (body) {
        body.className = 'light-theme'; 
      }
    }
    setCurrentTranslations(uzTranslationData || {});
  }, []);

  return (
    <AppContext.Provider value={{ 
      translations: currentTranslations, 
      language: Language,
      appMode,
      setAppMode
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};