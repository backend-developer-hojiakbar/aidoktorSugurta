import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import AdPlaceholder from '@/components/AdPlaceholder';

interface SpeakerPlayIconProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
}

const SpeakerPlayIcon: React.FC<SpeakerPlayIconProps> = ({ title, ...restProps }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" {...restProps}>
    {title && <title>{title}</title>}
    <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
  </svg>
);


interface FirstAidModeProps {
  onBack: () => void;
}

interface AccordionItemProps {
  id: string;
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  onSpeechIconClick: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  id,
  title,
  children,
  isOpen,
  onToggle,
  onSpeechIconClick
}) => {
  const { t_noDynamic } = useTranslation();
  return (
    <div className="border border-sky-300/70 rounded-lg overflow-hidden bg-sky-50/60 backdrop-blur-xs">
      <div className="flex items-center p-4 text-left hover:bg-sky-100/70 transition-colors">
        <button
          onClick={onToggle}
          className="flex-grow flex justify-between items-center font-semibold text-lg text-sky-700"
          aria-expanded={isOpen}
          aria-controls={`content-${id}`}
        >
          <span>{title}</span>
          <svg
            className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} text-sky-600`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        <button
            onClick={onSpeechIconClick}
            className="ml-3 p-1.5 text-sky-600 hover:text-sky-700"
            aria-label={t_noDynamic('firstAidPlaySpeechComingSoon')}
            title={t_noDynamic('firstAidPlaySpeechComingSoon')}
          >
            <SpeakerPlayIcon title={t_noDynamic('firstAidPlaySpeechComingSoon')} />
        </button>
      </div>
      <div 
        id={`content-${id}`} 
        className={`accordion-content border-t border-sky-300/70 text-slate-700 prose prose-sm max-w-none prose-slate article-content ${isOpen ? 'open' : ''}`}
      >
        {children}
      </div>
    </div>
  );
};


export const FirstAidMode: React.FC<FirstAidModeProps> = ({ onBack }) => {
  const { t_noDynamic } = useTranslation();
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [geolocationStatus, setGeolocationStatus] = useState('');


  const callEmergencyNumber = "103";
  const callEmergencyNumberDisplay = "103";

  const toggleAccordion = (id: string) => {
    setOpenAccordion(prevOpenAccordion => (prevOpenAccordion === id ? null : id));
  };

  const handleSpeechPlaceholderClick = () => {
    alert(t_noDynamic('voiceInputComingSoon'));
  };

  const handleFindClinic = () => {
    setGeolocationStatus(t_noDynamic('geolocationSearching'));
    if (!navigator.geolocation) {
      setGeolocationStatus(t_noDynamic('geolocationNotSupported'));
      alert(t_noDynamic('geolocationNotSupported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeolocationStatus('');
        const { latitude, longitude } = position.coords;
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=hospital+or+pharmacy+near+${latitude},${longitude}`;
        
        if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.openLink(googleMapsUrl);
        } else {
            window.open(googleMapsUrl, '_blank');
        }
      },
      (error) => {
        let errorMsg = t_noDynamic('geolocationError');
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = t_noDynamic('geolocationPermissionDenied');
        }
        setGeolocationStatus(errorMsg);
        alert(errorMsg);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };


  const firstAidTopics = [
    { id: 'bleeding', titleKey: 'firstAidTopicTitleBleeding', contentKey: 'firstAidBleedingContent' },
    { id: 'burns', titleKey: 'firstAidTopicTitleBurns', contentKey: 'firstAidBurnsContent' },
    { id: 'poisoning', titleKey: 'firstAidTopicTitlePoisoning', contentKey: 'firstAidContentComingSoon' }, 
    { id: 'choking', titleKey: 'firstAidTopicTitleChoking', contentKey: 'firstAidContentComingSoon' }, 
    { id: 'heartAttackStroke', titleKey: 'firstAidTopicTitleHeartAttackStroke', contentKey: 'firstAidContentComingSoon' }, 
    { id: 'fractures', titleKey: 'firstAidTopicTitleFractures', contentKey: 'firstAidContentComingSoon' }, 
    { id: 'fainting', titleKey: 'firstAidTopicTitleFainting', contentKey: 'firstAidContentComingSoon' }, 
    { id: 'allergicReaction', titleKey: 'firstAidTopicTitleAllergicReaction', contentKey: 'firstAidContentComingSoon' }, 
    { id: 'nosebleed', titleKey: 'firstAidTopicTitleNosebleed', contentKey: 'firstAidContentComingSoon' }, 
    { id: 'heatstroke', titleKey: 'firstAidTopicTitleHeatstroke', contentKey: 'firstAidContentComingSoon' }, 
    { id: 'frostbite', titleKey: 'firstAidTopicTitleFrostbite', contentKey: 'firstAidContentComingSoon' }, 
    { id: 'seizures', titleKey: 'firstAidTopicTitleSeizures', contentKey: 'firstAidContentComingSoon' }, 
    { id: 'eyeInjuries', titleKey: 'firstAidTopicTitleEyeInjuries', contentKey: 'firstAidContentComingSoon' }, 
    { id: 'kit', titleKey: 'firstAidTopicTitleKit', contentKey: 'firstAidContentComingSoon' }, 
  ];


  return (
    <>
      <div className="max-w-4xl mx-auto p-4 md:p-8 shadow-2xl rounded-lg bg-gradient-to-b from-red-50/80 to-orange-50/70 backdrop-blur-md text-slate-800">
        <h2 className="text-3xl font-bold text-center mb-2 uppercase text-slate-800">{t_noDynamic('firstAidModeTitle')}</h2>
        <p className="text-center mb-6 text-md text-slate-600">{t_noDynamic('firstAidModeSubtitle')}</p>
        
        <AdPlaceholder
            adType="banner_728x90"
            className="w-full mb-6"
            titleText={t_noDynamic('adPlaceholderFirstAid')}
        />

        <div className="mb-8 p-4 border-2 border-red-400/80 rounded-lg bg-rose-100/70 backdrop-blur-sm text-center">
          <p className="text-md font-semibold text-red-600 uppercase">{t_noDynamic('attentionTitle')}</p>
          <p className="text-sm text-red-700">{t_noDynamic('firstAidDisclaimer')}</p>
        </div>

        <div className="mb-8 text-center space-y-4 sm:space-y-0 sm:flex sm:justify-center sm:space-x-4">
          <a
            href={`tel:${callEmergencyNumber}`}
            className="inline-flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105 text-lg uppercase w-full sm:w-auto"
            aria-label={t_noDynamic('firstAidCall103AriaLabel')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            {t_noDynamic('firstAidCall103Button')} ({callEmergencyNumberDisplay})
          </a>
          <button
            onClick={handleFindClinic}
            className="inline-flex items-center justify-center bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105 text-lg uppercase w-full sm:w-auto"
            aria-label={t_noDynamic('firstAidFindClinicAriaLabel')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            {t_noDynamic('firstAidFindClinicButton')}
          </button>
        </div>
        {geolocationStatus && <p className="text-center text-sm text-amber-600 mb-4">{geolocationStatus}</p>}


        <div className="space-y-4">
          {firstAidTopics.map(topic => {
            const contentHtml = t_noDynamic(topic.contentKey) || t_noDynamic('firstAidContentComingSoon');
            return (
              <AccordionItem
                key={topic.id}
                id={topic.id}
                title={t_noDynamic(topic.titleKey) || t_noDynamic('firstAidSectionGenericTitle')}
                isOpen={openAccordion === topic.id}
                onToggle={() => toggleAccordion(topic.id)}
                onSpeechIconClick={handleSpeechPlaceholderClick}
              >
                <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
              </AccordionItem>
            );
          })}
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