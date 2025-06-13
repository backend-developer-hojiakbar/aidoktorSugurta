import { useAppContext } from '@/contexts/AppContext';
import { Language } from '@/types';
import { useCallback } from 'react';

export const useTranslation = () => {
  const { translations, language } = useAppContext();

  const t = useCallback((key, params) => {
    let translation = translations[key] || key;
    if (params) {
      Object.keys(params).forEach(paramKey => {
        const value = params[paramKey];
        if (value !== undefined) {
            translation = translation.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(value));
        }
      });
    }
    return translation;
  }, [translations]);

  const t_noDynamic = useCallback((key) => {
     return translations[key] || key;
  }, [translations]);

  return { t, t_noDynamic, language: language || Language.UZ };
};