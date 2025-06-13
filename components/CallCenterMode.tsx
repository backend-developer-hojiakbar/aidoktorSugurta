import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import AdPlaceholder from '@/components/AdPlaceholder';

const CallCenterMode = ({ onBack }) => {
  const { t, t_noDynamic } = useTranslation();

  const callCenterNumber = "+998732000073";
  const callCenterNumberDisplay = "+998 73 200 00 73";

  return (
    <>
      <div className="max-w-2xl mx-auto p-6 md:p-10 shadow-2xl rounded-lg text-center bg-gradient-to-b from-sky-100/80 to-blue-100/70 backdrop-blur-md text-slate-800">
        <h2 className="text-3xl font-bold mb-6 uppercase text-slate-800">{t_noDynamic('callCenterTitle')}</h2>
        
        <AdPlaceholder 
          adType="banner_468x60" 
          className="max-w-2xl mx-auto mb-6"
          titleText={t_noDynamic('adPlaceholderCallCenter')}
        />

        <p className="mb-8 text-lg leading-relaxed uppercase text-slate-600">
          {t_noDynamic('callCenterDescriptionText')}
        </p>

        <div className="mb-8">
          <a 
            href={`tel:${callCenterNumber}`}
            className="text-4xl md:text-5xl font-bold transition-colors break-all inline-block p-3 border-2 rounded-lg text-sky-600 hover:text-sky-700 border-sky-500/80 hover:border-sky-600"
            aria-label={t('callCenterAriaCallNumber', { number: callCenterNumberDisplay})}
          >
            {callCenterNumberDisplay}
          </a>
        </div>

        <a
          href={`tel:${callCenterNumber}`}
          className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105 text-lg mb-10 uppercase"
          aria-label={t_noDynamic('callCenterAriaCallNow')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
          {t_noDynamic('callCenterCallButton')}
        </a>
        
        <div className="text-sm p-4 border rounded-md text-slate-600 border-slate-300/70 bg-slate-50/50 backdrop-blur-sm">
          <p className="font-semibold mb-2 text-base uppercase text-slate-700">{t_noDynamic('callCenterWorkingHoursTitle')}</p>
          <p className="uppercase">{t_noDynamic('callCenterMonSat')}: <span className="text-slate-800">{t_noDynamic('callCenterTime0900to1800')}</span></p>
          <p className="uppercase">{t_noDynamic('callCenterSun')}: <span className="text-slate-800">{t_noDynamic('callCenterDayOff')}</span></p>
          <hr className="my-3 border-slate-300/70" />
          <p className="mt-3 font-semibold mb-2 text-base uppercase text-amber-600">{t_noDynamic('callCenterEmergencyTitle')}</p>
          <p className="uppercase text-amber-700" dangerouslySetInnerHTML={{ __html: t_noDynamic('callCenterEmergencyText') }} />
        </div>
      </div>
      <button
        onClick={onBack}
        className="flex items-center justify-center mx-auto space-x-2 text-base py-3 px-5 rounded-lg transition-colors uppercase text-sky-600 hover:text-sky-700 hover:bg-sky-100/70 backdrop-blur-sm mt-2 border border-sky-500 hover:border-sky-600 w-full max-w-xs"  
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

export default CallCenterMode;