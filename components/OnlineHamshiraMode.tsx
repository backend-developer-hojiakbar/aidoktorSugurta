import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import PlayStoreIcon from '@/assets/icons/PlayStoreIcon';
import AppStoreIcon from '@/assets/icons/AppStoreIcon';
import QrCodePlaceholderIcon from '@/assets/icons/QrCodePlaceholderIcon';
import AdPlaceholder from '@/components/AdPlaceholder';
import StethoscopeIcon from '@/assets/icons/StethoscopeIcon'; // Use the new icon

const OnlineHamshiraMode = ({ onBack }) => {
  const { t, t_noDynamic } = useTranslation();

  const callCenterNumber = "+998732000073"; // Using the same call center for now
  const callCenterNumberDisplay = "+998 73 200 00 73";

  const playStoreLink = "#"; // Placeholder
  const appStoreLink = "#"; // Placeholder

  return (
    <>
      <div className="max-w-3xl mx-auto p-6 md:p-10 shadow-2xl rounded-lg bg-gradient-to-b from-cyan-50/80 to-sky-50/70 backdrop-blur-md text-slate-800">
        <div className="flex justify-center mb-4">
            <StethoscopeIcon className="w-16 h-16 text-sky-600" title={t_noDynamic('onlineHamshiraIconStethoscopeAlt')} />
        </div>
        <h2 className="text-3xl font-bold text-center mb-2 uppercase text-sky-700">{t_noDynamic('onlineHamshiraModeTitle')}</h2>
        <h3 className="text-xl font-semibold text-center mb-6 uppercase text-slate-700">{t_noDynamic('onlineHamshiraModeInfoTitle')}</h3>
        
        <AdPlaceholder 
            adType="banner_468x60" 
            className="max-w-2xl mx-auto mb-6"
            titleText={t_noDynamic('adPlaceholderOnlineHamshira')}
        />

        <p className="mb-8 text-md leading-relaxed text-center text-slate-600">
          {t_noDynamic('onlineHamshiraModeDescription')}
        </p>

        <div className="mb-10 text-center">
          <p className="text-lg mb-2 text-slate-600">{t_noDynamic('onlineHamshiraCallToAction')}</p>
          <a 
            href={`tel:${callCenterNumber}`}
            className="text-3xl md:text-4xl font-bold transition-colors break-all inline-block p-3 border-2 rounded-lg text-teal-600 hover:text-teal-700 border-teal-500/80 hover:border-teal-600"
            aria-label={t('callCenterAriaCallNumber', { number: callCenterNumberDisplay})}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 inline-block mr-3 align-middle">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            {callCenterNumberDisplay}
          </a>
        </div>
        
        <div className="mb-8 text-center">
            <h4 className="text-xl font-semibold mb-4 text-slate-700">{t_noDynamic('onlineHamshiraDownloadTitle')}</h4>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
                <a href={playStoreLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-slate-100/80 hover:bg-slate-200/90 text-slate-700 font-medium py-3 px-5 rounded-lg transition-colors w-full sm:w-auto border border-slate-300/80">
                    <PlayStoreIcon className="w-6 h-6 mr-2 text-green-500" title={t_noDynamic('playStoreIconAlt')} />
                    {t_noDynamic('onlineHamshiraPlayStoreLinkText')}
                </a>
                <a href={appStoreLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-slate-100/80 hover:bg-slate-200/90 text-slate-700 font-medium py-3 px-5 rounded-lg transition-colors w-full sm:w-auto border border-slate-300/80">
                    <AppStoreIcon className="w-6 h-6 mr-2 text-blue-500" title={t_noDynamic('appStoreIconAlt')} />
                    {t_noDynamic('onlineHamshiraAppStoreLinkText')}
                </a>
            </div>
             <p className="text-sm text-slate-500 mb-2">{t_noDynamic('onlineHamshiraQrCodeText')}:</p>
             <div className="flex justify-center">
                <QrCodePlaceholderIcon className="w-32 h-32 text-slate-700 bg-white/80 p-1 rounded-md border border-slate-300/70" title={t_noDynamic('qrCodeAlt')} />
             </div>
        </div>

      </div>
      <button
        onClick={onBack}
        className="flex items-center justify-center mx-auto space-x-2 text-base py-3 px-5 rounded-lg transition-colors uppercase text-sky-600 hover:text-sky-700 hover:bg-sky-100/70 backdrop-blur-sm mt-8 border border-sky-500 hover:border-sky-600 w-full max-w-xs"
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

export default OnlineHamshiraMode;