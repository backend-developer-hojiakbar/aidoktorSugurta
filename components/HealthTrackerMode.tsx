import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import AdPlaceholder from '@/components/AdPlaceholder';
import HealthTrackerIcon from '@/assets/icons/HealthTrackerIcon';

const HealthTrackerMode = ({ onBack }) => {
  const { t_noDynamic } = useTranslation();

  return (
    <>
      <div className="max-w-3xl mx-auto p-6 md:p-10 shadow-2xl rounded-lg text-center bg-slate-800 text-gray-200">
        <HealthTrackerIcon className="w-20 h-20 mx-auto mb-6 text-green-400" title={t_noDynamic('healthTrackerIconAlt')} />
        <h2 className="text-3xl font-bold mb-4 uppercase text-white">{t_noDynamic('healthTrackerTitle')}</h2>
        
        <AdPlaceholder 
            adType="banner_468x60" 
            className="w-full mb-6"
            titleText={t_noDynamic('featureComingSoonTitle')}
        />
        
        <p className="mb-8 text-lg leading-relaxed text-gray-300">
          {t_noDynamic('featureComingSoonMessage')}
        </p>
        <p className="text-sm text-gray-400">
            {t_noDynamic('healthTrackerDescription')}
        </p>
      </div>
      <button
        onClick={onBack}
        className="flex items-center justify-center mx-auto space-x-2 text-base py-3 px-5 rounded-lg transition-colors uppercase text-sky-400 hover:text-sky-300 hover:bg-slate-700/50 mt-8 border border-sky-500 hover:border-sky-400 w-full max-w-xs"
        aria-label={t_noDynamic('backToMainMenuButton')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        <span>{t_noDynamic('mainMenuButton')}</span>
      </button>
    </>
  );
};

export default HealthTrackerMode;