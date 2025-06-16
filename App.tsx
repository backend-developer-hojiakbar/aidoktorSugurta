import React, { useState, useEffect, useCallback } from 'react';
import { AppMode, User } from '@/types';
import QuickDiagnosisMode from '@/components/QuickDiagnosisMode';
import ComprehensiveAnalysisMode from '@/components/ComprehensiveAnalysisMode';
import HealthLibraryMode from '@/components/HealthLibraryMode';
import PhysiotherapyMode from '@/components/PhysiotherapyMode';
import CallCenterMode from '@/components/CallCenterMode';
import OnLabMode from '@/components/OnLabMode';
import OnlineHamshiraMode from '@/components/OnlineHamshiraMode';
import MobileLaboratoryMode from '@/components/MobileLaboratoryMode';
import { DrugIdentifierMode } from '@/components/DrugIdentifierMode';
import { FirstAidMode } from '@/components/FirstAidMode';
import LoginPage from '@/components/LoginPage';
import { RegisterPage } from '@/components/RegisterPage';
import UserCabinetPage from '@/components/UserCabinetPage';
import GetInsuranceMode from '@/components/GetInsuranceMode';
import HealthTrackerMode from '@/components/HealthTrackerMode';
import Header from '@/components/Header';
import { useTranslation } from '@/hooks/useTranslation';
import AdPlaceholder from '@/components/AdPlaceholder';
import FeatureRequiresAuthModal from '@/components/FeatureRequiresAuthModal';
import FeatureRequiresInsuranceModal from '@/components/FeatureRequiresInsuranceModal';
import FeatureComingSoonModal from '@/components/FeatureComingSoonModal';
import axios from 'axios';

import MicroscopeIcon from '@/assets/icons/MicroscopeIcon';
import PillIcon from '@/assets/icons/PillIcon';
import FirstAidIcon from '@/assets/icons/FirstAidIcon';
import IdleTimerIcon from '@/assets/icons/IdleTimerIcon';
import LockIcon from '@/assets/icons/LockIcon';
import ShareIcon from '@/assets/icons/ShareIcon';
import FeedbackIcon from '@/assets/icons/FeedbackIcon';
import StartIcon from '@/assets/icons/StartIcon';
import StethoscopeIcon from '@/assets/icons/StethoscopeIcon';
import MobileLabIcon from '@/assets/icons/MobileLabIcon';
import InsuranceCardIcon from '@/assets/icons/InsuranceCardIcon';
import HealthTrackerIcon from '@/assets/icons/HealthTrackerIcon';

// --- Global declaration for Telegram WebApp ---
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        MainButton: { text: string; color: string; textColor: string; isVisible: boolean; isProgressVisible: boolean; isActive: boolean; show: () => void; hide: () => void; enable: () => void; disable: () => void; showProgress: (disable?: boolean) => void; hideProgress: () => void; onClick: (callback: () => void) => void; offClick: (callback: () => void) => void; setText: (text: string) => void; setParams: (params: { text?: string; color?: string; text_color?: string; is_active?: boolean; is_visible?: boolean }) => void; };
        BackButton: { isVisible: boolean; onClick: (callback: () => void) => void; offClick: (callback: () => void) => void; show: () => void; hide: () => void; };
        HapticFeedback: { impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void; notificationOccurred: (type: 'error' | 'success' | 'warning') => void; selectionChanged: () => void; };
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        headerColor: string;
        backgroundColor: string;
        themeParams: { bg_color?: string; text_color?: string; hint_color?: string; link_color?: string; button_color?: string; button_text_color?: string; secondary_bg_color?: string; [key: string]: string | undefined; };
        initData: string;
        initDataUnsafe: { query_id?: string; user?: { id: number; first_name: string; last_name?: string; username?: string; language_code?: string; is_premium?: boolean; photo_url?: string; }; receiver?: { id: number; first_name: string; last_name?: string; username?: string; photo_url?: string; }; chat?: { id: number; type: 'group' | 'supergroup' | 'channel'; title: string; username?: string; photo_url?: string; }; start_param?: string; can_send_after?: number; auth_date: number; hash: string; };
        version: string;
        platform: string;
        colorScheme: 'light' | 'dark';
        sendData: (data: string) => void;
        openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
        openTelegramLink: (url: string) => void;
        close: () => void;
        setHeaderColor: (colorKey: string) => void;
        setBackgroundColor: (color: string) => void;
        enableClosingConfirmation: () => void;
        disableClosingConfirmation: () => void;
        onEvent: (eventType: string, eventHandler: (...args: any[]) => void) => void;
        offEvent: (eventType: string, eventHandler: (...args: any[]) => void) => void;
        requestWriteAccess: (callback?: (access: boolean) => void) => void;
        requestContact: (callback?: (access: boolean) => void) => void;
        [key: string]: any;
      }
    }
  }
}

interface MainMenuButtonConfig {
  mode: number;
  titleKey: string;
  descKey: string;
  icon: JSX.Element;
  bgColor: string;
  textColor: string;
  descColor: string;
  glowColor: string;
  borderColor?: string;
  row?: number;
  requiresAuth?: boolean;
  requiresInsurance?: boolean;
  isComingSoon?: boolean;
  insuranceIndicatorTextKey?: string;
}

// --- Sub-components defined within App.jsx for brevity ---

const PrivacyPolicyModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t_noDynamic } = useTranslation();
  const effectiveDate = "2024-07-28";
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeInScaleUp" role="dialog" aria-modal="true" aria-labelledby="privacyPolicyTitle">
      <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar text-slate-800">
        <div className="flex justify-between items-center mb-4">
          <h2 id="privacyPolicyTitle" className="text-xl font-bold text-sky-600 uppercase">{t_noDynamic('privacyPolicyTitle')}</h2>
          <button onClick={onClose} className="text-slate-600 hover:text-slate-900" aria-label={t_noDynamic('closePrivacyPolicyPopup')}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-slate-500 mb-4">{t_noDynamic('effectiveDateLabel')}: {effectiveDate}</p>
        <div className="space-y-4 text-sm text-slate-700 prose prose-sm max-w-none prose-slate">
          <p>{t_noDynamic('privacyPolicyP1')}</p>
          <h3 className="text-md font-semibold text-sky-700 pt-2">{t_noDynamic('privacyPolicyH1')}</h3>
          <ul className="list-disc list-inside space-y-1 pl-4" dangerouslySetInnerHTML={{ __html: t_noDynamic('privacyPolicyL1') }}></ul>
          <h3 className="text-md font-semibold text-sky-700 pt-2">{t_noDynamic('privacyPolicyH2')}</h3>
          <p>{t_noDynamic('privacyPolicyP2')}</p>
          <ul className="list-disc list-inside space-y-1 pl-4" dangerouslySetInnerHTML={{ __html: t_noDynamic('privacyPolicyL2') }}></ul>
          <p>{t_noDynamic('privacyPolicyP3')}</p>
          <h3 className="text-md font-semibold text-sky-700 pt-2">{t_noDynamic('privacyPolicyH3')}</h3>
          <p>{t_noDynamic('privacyPolicyP4')}</p>
          <h3 className="text-md font-semibold text-sky-700 pt-2">{t_noDynamic('privacyPolicyH4')}</h3>
          <p>{t_noDynamic('privacyPolicyP5')}</p>
          <h3 className="text-md font-semibold text-sky-700 pt-2">{t_noDynamic('privacyPolicyH5')}</h3>
          <p>{t_noDynamic('privacyPolicyP6')}</p>
          <h3 className="text-md font-semibold text-sky-700 pt-2">{t_noDynamic('privacyPolicyH6')}</h3>
          <p>{t_noDynamic('privacyPolicyP7')}</p>
          <h3 className="text-md font-semibold text-sky-700 pt-2">{t_noDynamic('privacyPolicyH7')}</h3>
          <p>{t_noDynamic('privacyPolicyP8')}</p>
          <h3 className="text-md font-semibold text-sky-700 pt-2">{t_noDynamic('privacyPolicyH8')}</h3>
          <p>{t_noDynamic('privacyPolicyP9')}</p>
        </div>
        <button onClick={onClose} className="mt-6 w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors uppercase" aria-label={t_noDynamic('closePrivacyPolicyPopup')}>
          {t_noDynamic('understoodButton')}
        </button>
      </div>
    </div>
  );
};

const TermsOfUseModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t_noDynamic } = useTranslation();
  const effectiveDate = "2024-07-28";
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeInScaleUp" role="dialog" aria-modal="true" aria-labelledby="termsOfUseTitleModal">
      <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar text-slate-800">
        <div className="flex justify-between items-center mb-4">
          <h2 id="termsOfUseTitleModal" className="text-xl font-bold text-sky-600 uppercase">{t_noDynamic('termsOfUseTitle')}</h2>
          <button onClick={onClose} className="text-slate-600 hover:text-slate-900" aria-label={t_noDynamic('closeTermsOfUsePopup')}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-slate-500 mb-4">{t_noDynamic('effectiveDateLabel')}: {effectiveDate}</p>
        <div className="space-y-4 text-sm text-slate-700 prose prose-sm max-w-none prose-slate">
          <p>{t_noDynamic('termsP1')}</p>
          <h3 className="text-md font-semibold text-sky-700 pt-2">{t_noDynamic('termsH1')}</h3>
          <p>{t_noDynamic('termsP2')}</p>
          <h3 className="text-md font-semibold text-sky-700 pt-2">{t_noDynamic('termsH2')}</h3>
          <ul className="list-disc list-inside space-y-1 pl-4" dangerouslySetInnerHTML={{ __html: t_noDynamic('termsL1') }}></ul>
          <h3 className="text-md font-semibold text-sky-700 pt-2">{t_noDynamic('termsH3')}</h3>
          <p>{t_noDynamic('termsP3')}</p>
          <h3 className="text-md font-semibold text-sky-700 pt-2">{t_noDynamic('termsH4')}</h3>
          <p>{t_noDynamic('termsP4')}</p>
          <h3 className="text-md font-semibold text-sky-700 pt-2">{t_noDynamic('termsH5')}</h3>
          <p>{t_noDynamic('termsP5')}</p>
          <h3 className="text-md font-semibold text-sky-700 pt-2">{t_noDynamic('termsH6')}</h3>
          <p>{t_noDynamic('termsP6')}</p>
          <h3 className="text-md font-semibold text-sky-700 pt-2">{t_noDynamic('termsH7')}</h3>
          <p>{t_noDynamic('termsP7')}</p>
          <h3 className="text-md font-semibold text-sky-700 pt-2">{t_noDynamic('termsH8')}</h3>
          <p>{t_noDynamic('termsP8')}</p>
          <h3 className="text-md font-semibold text-sky-700 pt-2">{t_noDynamic('termsH9')}</h3>
          <p>{t_noDynamic('termsP9')}</p>
        </div>
        <button onClick={onClose} className="mt-6 w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors uppercase" aria-label={t_noDynamic('closeTermsOfUsePopup')}>
          {t_noDynamic('understoodButton')}
        </button>
      </div>
    </div>
  );
};

const WarningModal: React.FC<{ onAgree: () => void; onShowPrivacy: () => void; onShowTerms: () => void }> = ({ onAgree, onShowPrivacy, onShowTerms }) => {
  const { t_noDynamic } = useTranslation();
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-50 p-4 animate-fadeInScaleUp" role="dialog" aria-modal="true" aria-labelledby="warningTitleModal">
      <div className="bg-gradient-to-br from-rose-100 via-orange-50 to-amber-100/90 p-6 rounded-xl shadow-2xl max-w-xl w-full backdrop-blur-sm max-h-[90vh] overflow-y-auto custom-scrollbar">
        <h2 id="warningTitleModal" className="text-2xl font-bold text-red-600 mb-4 text-center uppercase">{t_noDynamic('warningTitle')}</h2>
        <div className="text-slate-700 mb-3 text-sm prose prose-sm max-w-none prose-slate" dangerouslySetInnerHTML={{ __html: t_noDynamic('warningP1') }} />
        <p className="text-slate-700 mb-6 text-sm">
          {t_noDynamic('warningP2preLink')}{' '}
          <button onClick={onShowTerms} className="underline text-sky-600 hover:text-sky-700">{t_noDynamic('termsOfUseLink')}</button>{' '}
          {t_noDynamic('warningP2midLink')}{' '}
          <button onClick={onShowPrivacy} className="underline text-sky-600 hover:text-sky-700">{t_noDynamic('privacyPolicyLink')}</button>{' '}
          {t_noDynamic('warningP2postLink')}
        </p>
        <button onClick={onAgree} className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-5 rounded-lg transition-colors uppercase">
          {t_noDynamic('warningAgreeButton')}
        </button>
      </div>
    </div>
  );
};

const AppFooter: React.FC = () => {
  const { t_noDynamic } = useTranslation();
  const currentYear = new Date().getFullYear();

  const handleShareApp = () => {
    if (window.Telegram && window.Telegram.WebApp) {
      const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(t_noDynamic('shareAppTextToFriend'))}`;
      window.Telegram.WebApp.openTelegramLink(shareUrl);
    } else {
      alert(t_noDynamic('shareFunctionNotAvailable'));
    }
  };

  return (
    <footer className="p-5 mt-auto text-center border-t border-sky-200/70 bg-sky-50/50 backdrop-blur-sm">
      <div className="flex justify-center items-center space-x-4 mb-3">
        <button onClick={handleShareApp} className="flex items-center space-x-1.5 text-xs text-sky-600 hover:text-sky-700 transition-colors" aria-label={t_noDynamic('shareAppButtonAriaLabel')}>
          <ShareIcon className="w-4 h-4" />
          <span>{t_noDynamic('shareAppButton')}</span>
        </button>
        <a href="mailto:aidoktor.uz@gmail.com" className="flex items-center space-x-1.5 text-xs text-sky-600 hover:text-sky-700 transition-colors" aria-label={t_noDynamic('feedbackButtonAriaLabel')}>
          <FeedbackIcon className="w-4 h-4" />
          <span>{t_noDynamic('feedbackButton')}</span>
        </a>
      </div>
      <p className="text-xs text-slate-500 mb-1">
        © {currentYear} AiDoktor.uz. {t_noDynamic('footerRights')}
      </p>
      <p className="text-xs font-semibold text-sky-700 uppercase">
        {t_noDynamic('footerSlogan')}
      </p>
    </footer>
  );
};

// --- Main App Component ---
export const App: React.FC = () => {
  const { t, t_noDynamic } = useTranslation();
  const [currentMode, setCurrentMode] = useState<number>(AppMode.None);
  const [showWarning, setShowWarning] = useState<boolean>(true);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState<boolean>(false);
  const [showTermsOfUse, setShowTermsOfUse] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [lastActivityTime, setLastActivityTime] = useState<number>(Date.now());
  const [isIdleModalOpen, setIsIdleModalOpen] = useState<boolean>(false);
  const [adData, setAdData] = useState<{ image: string; link: string } | null>(null);

  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showInsuranceModal, setShowInsuranceModal] = useState<boolean>(false);
  const [_targetModeForModal, setTargetModeForModal] = useState<number | null>(null);
  const [isFeatureComingSoonModalOpen, setIsFeatureComingSoonModalOpen] = useState(false);

  const IDLE_TIMEOUT: number = 15 * 60 * 1000;

  const handleBackToMain = useCallback(() => {
    setCurrentMode(AppMode.None);
  }, []);

  useEffect(() => {
    let agreedToWarning = false;
    try {
      agreedToWarning = localStorage.getItem('warningAgreed') === 'true';
    } catch (e) {
      console.warn("Could not access localStorage for 'warningAgreed':", e);
    }

    let userFromStorage: User | null = null;
    try {
      const storedUserJson = localStorage.getItem('aidoktorUser');
      if (storedUserJson) {
        userFromStorage = JSON.parse(storedUserJson) as User;
      }
    } catch (e) {
      console.error("Error parsing stored user:", e);
      try { localStorage.removeItem('aidoktorUser'); } catch (removeError) { console.warn("Could not remove 'aidoktorUser' from localStorage:", removeError); }
    }

    if (userFromStorage) {
      setCurrentUser(userFromStorage);
      setIsLoggedIn(true);
      setShowWarning(false);
    } else {
      setCurrentUser(null);
      setIsLoggedIn(false);
      setShowWarning(!agreedToWarning);
      if (agreedToWarning) {
        setCurrentMode(AppMode.Login);
      }
    }

    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      try {
        tg.ready();
        tg.expand();
        if (typeof tg.setBackgroundColor === 'function') {
          tg.setBackgroundColor('#f0f8ff');
        }
        if (typeof tg.setHeaderColor === 'function') {
          tg.setHeaderColor('#e0f2fe');
        }
      } catch (tgError) {
        console.error("Error initializing Telegram WebApp features:", tgError);
      }
    } else {
      console.warn("Telegram WebApp SDK not found. Some features might be unavailable.");
    }

    const fetchAd = async () => {
      try {
        const response = await axios.get('https://aidoktor.pythonanywhere.com/advertisements/', {
          params: { category: 'main', size: '728x90', is_active: true },
        });
        if (Array.isArray(response.data) && response.data.length > 0) {
          const ad = response.data.find(ad => ad.category === 'main' && ad.size === '728x90' && ad.is_active);
          if (ad) {
            const fullImageUrl = `http://127.0.0.1:8000${ad.image}`;
            setAdData({ image: fullImageUrl, link: ad.link });
          }
        }
      } catch (error) {
        console.error('Failed to fetch ad:', error.response ? error.response.data : error.message);
      }
    };
    fetchAd();
  }, []);

  useEffect(() => {
    let idleTimerRef: ReturnType<typeof setTimeout>;
    const resetTimer = () => {
      setLastActivityTime(Date.now());
      setIsIdleModalOpen(false);
      clearTimeout(idleTimerRef);
      idleTimerRef = setTimeout(() => {
        setIsIdleModalOpen(true);
      }, IDLE_TIMEOUT);
    };

    const handleActivity = () => resetTimer();

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('click', handleActivity);

    resetTimer();

    return () => {
      clearTimeout(idleTimerRef);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [IDLE_TIMEOUT, isLoggedIn]);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg || !tg.BackButton) {
      return;
    }

    const tgBackButton = tg.BackButton;
    const onTgBackClick = handleBackToMain;

    const shouldShowBackButton = currentMode !== AppMode.None &&
                               currentMode !== AppMode.Login &&
                               currentMode !== AppMode.Register &&
                               !showWarning;

    if (shouldShowBackButton) {
      tgBackButton.onClick(onTgBackClick);
      tgBackButton.show();
    } else {
      tgBackButton.hide();
    }

    return () => {
      if (tg && tg.BackButton) {
        tgBackButton.offClick(onTgBackClick);
        tgBackButton.hide();
      }
    };
  }, [currentMode, handleBackToMain, showWarning]);

  const handleContinueSession = () => {
    setIsIdleModalOpen(false);
    setLastActivityTime(Date.now());
  };

  const handleEndSession = () => {
    setIsIdleModalOpen(false);
    handleLogout();
  };

  const handleAgreeWarning = () => {
    try {
      localStorage.setItem('warningAgreed', 'true');
    } catch (e) {
      console.warn("Could not set 'warningAgreed' in localStorage:", e);
    }
    setShowWarning(false);
    if (!isLoggedIn) {
      setCurrentMode(AppMode.Login);
    } else {
      setCurrentMode(AppMode.None);
    }
  };

  const handleModeSelect = (item: MainMenuButtonConfig) => {
    if (showWarning) return;

    if (item.isComingSoon) {
      setIsFeatureComingSoonModalOpen(true);
      return;
    }

    if (item.requiresAuth && !isLoggedIn && item.mode !== AppMode.GetInsurance) {
      setTargetModeForModal(item.mode);
      setShowAuthModal(true);
      return;
    }

    if (item.requiresInsurance && isLoggedIn && currentUser && !currentUser.insurance_id) {
      setTargetModeForModal(item.mode);
      setShowInsuranceModal(true);
      return;
    }

    setCurrentMode(item.mode);
  };

  const handleLoginSuccess = (user: User) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
    try {
      localStorage.setItem('aidoktorUser', JSON.stringify(user));
    } catch (e) {
      console.warn("Could not set 'aidoktorUser' in localStorage:", e);
    }
    setCurrentMode(AppMode.None);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    try {
      localStorage.removeItem('aidoktorUser');
    } catch (e) {
      console.warn("Could not remove 'aidoktorUser' from localStorage:", e);
    }
    setCurrentMode(AppMode.Login);
  };

  const renderCurrentMode = () => {
    if (showWarning) return null;

    switch (currentMode) {
      case AppMode.QuickDiagnosis:
        return <QuickDiagnosisMode onBack={handleBackToMain} />;
      case AppMode.ComprehensiveAnalysis:
        return <ComprehensiveAnalysisMode onBack={handleBackToMain} />;
      case AppMode.HealthLibrary:
        return <HealthLibraryMode onBack={handleBackToMain} />;
      case AppMode.Physiotherapy:
        return <PhysiotherapyMode onBack={handleBackToMain} />;
      case AppMode.CallCenter:
        return <CallCenterMode onBack={handleBackToMain} />;
      case AppMode.OnLab:
        return <OnLabMode onBack={handleBackToMain} />;
      case AppMode.OnlineHamshira:
        return <OnlineHamshiraMode onBack={handleBackToMain} />;
      case AppMode.MobileLaboratory:
        return <MobileLaboratoryMode onBack={handleBackToMain} />;
      case AppMode.DrugIdentifier:
        return <DrugIdentifierMode onBack={handleBackToMain} />;
      case AppMode.FirstAid:
        return <FirstAidMode onBack={handleBackToMain} />;
      case AppMode.GetInsurance:
        return <GetInsuranceMode onBack={handleBackToMain} />;
      case AppMode.HealthTracker:
        return <HealthTrackerMode onBack={handleBackToMain} />;
      case AppMode.Login:
        return <LoginPage onLoginSuccess={handleLoginSuccess} onNavigateToRegister={() => setCurrentMode(AppMode.Register)} onBack={isLoggedIn ? handleBackToMain : undefined} />;
      case AppMode.Register:
        return <RegisterPage onRegisterSuccess={handleLoginSuccess} onNavigateToLogin={() => setCurrentMode(AppMode.Login)} onBack={() => setCurrentMode(AppMode.Login)} />;
      case AppMode.UserCabinet:
        return <UserCabinetPage currentUser={currentUser} onLogout={handleLogout} onBack={handleBackToMain} onNavigateToGetInsurance={() => setCurrentMode(AppMode.GetInsurance)} />;
      case AppMode.None:
      default:
        const mainMenuItems: MainMenuButtonConfig[] = [
          { mode: AppMode.OnLab, titleKey: 'onLabButton', descKey: 'onLabDescription', icon: <MicroscopeIcon className="w-10 h-10 md:w-12 md:h-12 mb-2.5 md:mb-3 text-orange-500" title={t_noDynamic('onLabIconMicroscopeAlt')} />, bgColor: 'bg-orange-100/70 hover:bg-orange-200/80', borderColor: 'border-orange-300/70', textColor: 'text-orange-700', descColor: 'text-orange-600', glowColor: 'rgba(249, 115, 22, 0.35)', row: 1, requiresAuth: true, requiresInsurance: true, insuranceIndicatorTextKey: 'insuranceIndicatorText' },
          { mode: AppMode.OnlineHamshira, titleKey: 'onlineHamshiraButton', descKey: 'onlineHamshiraDescription', icon: <StethoscopeIcon className="w-10 h-10 md:w-12 md:h-12 mb-2.5 md:mb-3 text-sky-500" title={t_noDynamic('onlineHamshiraIconStethoscopeAlt')} />, bgColor: 'bg-sky-100/70 hover:bg-sky-200/80', borderColor: 'border-sky-300/70', textColor: 'text-sky-700', descColor: 'text-sky-600', glowColor: 'rgba(14, 165, 233, 0.35)', row: 1, requiresAuth: true, requiresInsurance: true, insuranceIndicatorTextKey: 'insuranceIndicatorText' },
          { mode: AppMode.MobileLaboratory, titleKey: 'mobilLaboratoriyaButton', descKey: 'mobilLaboratoriyaDescription', icon: <MobileLabIcon className="w-10 h-10 md:w-12 md:h-12 mb-2.5 md:mb-3 text-purple-500" title={t_noDynamic('mobilLaboratoriyaIconAlt')} />, bgColor: 'bg-purple-100/70 hover:bg-purple-200/80', borderColor: 'border-purple-300/70', textColor: 'text-purple-700', descColor: 'text-purple-600', glowColor: 'rgba(168, 85, 247, 0.35)', row: 1, requiresAuth: true, requiresInsurance: true, insuranceIndicatorTextKey: 'insuranceIndicatorText' },
          { mode: AppMode.FirstAid, titleKey: 'firstAidButton', descKey: 'firstAidDescription', icon: <FirstAidIcon className="w-7 h-7 md:w-8 md:h-8 mb-1.5 text-red-500" title={t_noDynamic('firstAidIconAlt')} />, bgColor: 'bg-red-100/70 hover:bg-red-200/80', textColor: 'text-red-700', descColor: 'text-red-600', glowColor: 'rgba(239, 68, 68, 0.35)', row: 2, requiresAuth: true, requiresInsurance: false },
          { mode: AppMode.DrugIdentifier, titleKey: 'drugIdentifierButton', descKey: 'drugIdentifierDescription', icon: <PillIcon className="w-7 h-7 md:w-8 md:h-8 mb-1.5 text-emerald-500" title={t_noDynamic('attentionTitle')} />, bgColor: 'bg-emerald-100/70 hover:bg-emerald-200/80', textColor: 'text-emerald-700', descColor: 'text-emerald-600', glowColor: 'rgba(16, 185, 129, 0.35)', row: 2, requiresAuth: true, requiresInsurance: true, insuranceIndicatorTextKey: 'insuranceIndicatorText' },
          { mode: AppMode.HealthLibrary, titleKey: 'healthLibraryButton', descKey: 'healthLibraryDescription', icon: <LockIcon className="w-7 h-7 md:w-8 md:h-8 mb-1.5 text-slate-500" title={t_noDynamic('featureLockedIconTitle')} />, bgColor: 'bg-slate-100/80 hover:bg-slate-200/90', textColor: 'text-slate-700', descColor: 'text-slate-500', glowColor: 'rgba(107, 114, 128, 0.2)', row: 2, requiresAuth: false, isComingSoon: true },
          { mode: AppMode.Physiotherapy, titleKey: 'physiotherapyButton', descKey: 'physiotherapyDescription', icon: <LockIcon className="w-7 h-7 md:w-8 md:h-8 mb-1.5 text-slate-500" title={t_noDynamic('featureLockedIconTitle')} />, bgColor: 'bg-slate-100/80 hover:bg-slate-200/90', textColor: 'text-slate-700', descColor: 'text-slate-500', glowColor: 'rgba(236, 72, 153, 0.2)', row: 2, requiresAuth: false, isComingSoon: true }
        ];

        const comprehensiveAnalysisData: MainMenuButtonConfig = {
          mode: AppMode.ComprehensiveAnalysis,
          titleKey: 'comprehensiveAnalysisButton',
          descKey: 'comprehensiveAnalysisDescription',
          icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-9 h-9 md:w-10 md:h-10 mb-2 sm:mb-0 sm:mr-4 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
          bgColor: 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600',
          textColor: 'text-white',
          descColor: 'text-purple-100',
          glowColor: 'rgba(168, 85, 247, 0.45)',
          requiresAuth: true,
          requiresInsurance: true,
          insuranceIndicatorTextKey: 'insuranceIndicatorText'
        };

        const callMarkazFullWidthData: MainMenuButtonConfig = {
          mode: AppMode.CallCenter,
          titleKey: 'callCenterButton',
          descKey: 'callCenterDescription',
          icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-9 h-9 md:w-10 md:h-10 mb-2 sm:mb-0 sm:mr-4 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>,
          bgColor: 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600',
          textColor: 'text-white',
          descColor: 'text-green-100',
          glowColor: 'rgba(16, 185, 129, 0.45)'
        };

        const startDiagnosisButtonData: MainMenuButtonConfig = {
          mode: AppMode.QuickDiagnosis,
          titleKey: 'startDiagnosisButton',
          descKey: 'startDiagnosisButtonDescription',
          icon: <StartIcon className="w-8 h-8 md:w-9 md:h-9 mb-2 text-white" title={t_noDynamic('startDiagnosisButton')} />,
          bgColor: 'bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600',
          textColor: 'text-white',
          descColor: 'text-sky-100',
          glowColor: 'rgba(14, 165, 233, 0.45)',
        };

        const healthTrackerButtonData: MainMenuButtonConfig = {
          mode: AppMode.HealthTracker,
          titleKey: 'healthTrackerButton',
          descKey: 'healthTrackerDescription',
          icon: <HealthTrackerIcon className="w-9 h-9 md:w-10 md:h-10 mb-2 sm:mb-0 sm:mr-4 text-white" title={t_noDynamic('healthTrackerIconAlt')} />,
          bgColor: 'bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600',
          textColor: 'text-white',
          descColor: 'text-green-100',
          glowColor: 'rgba(52, 211, 153, 0.45)',
          requiresAuth: true,
          isComingSoon: true
        };

        const renderMenuItem = (item: MainMenuButtonConfig, index: number, isFullWidth: boolean = false) => {
          const titleText = item.isComingSoon ? `${t_noDynamic(item.titleKey)} (${t_noDynamic('featureComingSoonShort')})` : t_noDynamic(item.titleKey);
          let buttonGlowColor = item.glowColor || 'rgba(96, 165, 250, 0.3)';
          if (item.row === 1) buttonGlowColor = item.glowColor || 'rgba(236, 72, 153, 0.35)';
          else if (item.row === 2) buttonGlowColor = item.glowColor || 'rgba(234, 179, 8, 0.35)';
          if (isFullWidth) buttonGlowColor = item.glowColor || 'rgba(20, 184, 166, 0.4)';

          const buttonStyle = { '--glow-color': buttonGlowColor } as React.CSSProperties;

          const showInsuranceIndicator = item.requiresInsurance && item.insuranceIndicatorTextKey && isLoggedIn && currentUser && !currentUser.insurance_id;

          if (isFullWidth) {
            return (
              <button
                key={item.titleKey || index}
                onClick={() => handleModeSelect(item)}
                className={`relative main-menu-button w-full ${item.bgColor} ${item.textColor} rounded-xl p-5 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col sm:flex-row items-center text-left`}
                style={buttonStyle}
                aria-label={t_noDynamic(item.titleKey)}
                disabled={item.isComingSoon && item.mode === AppMode.HealthTracker}
              >
                {showInsuranceIndicator && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-md animate-pulse z-10">
                    {t_noDynamic(item.insuranceIndicatorTextKey!)}
                  </span>
                )}
                {item.icon}
                <div className="flex-1 mt-2 sm:mt-0">
                  <h3 className="text-lg sm:text-xl font-bold uppercase">{titleText}</h3>
                  <p className={`text-xs sm:text-sm ${item.descColor} opacity-90 mt-1`}>{t_noDynamic(item.descKey)}</p>
                </div>
              </button>
            );
          }

          return (
            <button
              key={item.titleKey || index}
              onClick={() => handleModeSelect(item)}
              className={`relative main-menu-button ${item.bgColor} ${item.textColor} rounded-xl p-4 md:p-5 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center h-full border ${item.borderColor || 'border-transparent'}`}
              style={buttonStyle}
              aria-label={t_noDynamic(item.titleKey)}
            >
              {showInsuranceIndicator && (
                <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-md animate-pulse z-10">
                  {t_noDynamic(item.insuranceIndicatorTextKey!)}
                </span>
              )}
              {item.icon}
              <h3 className="text-sm md:text-base font-semibold mt-1.5 uppercase">{titleText}</h3>
              <p className={`text-xs ${item.descColor} opacity-80 mt-1`}>{t_noDynamic(item.descKey)}</p>
            </button>
          );
        };

        return (
          <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-center text-slate-800 uppercase">{t_noDynamic('appTitle')}</h1>
            <p className="text-sm sm:text-base text-center mb-8 text-slate-600">{t_noDynamic('appSubtitle')}</p>
            
            {adData ? (
              <a href={adData.link} target="_blank" rel="noopener noreferrer" className="w-full mx-auto mb-6 md:mb-8 block">
                <img src={adData.image} alt="Advertisement" className="w-full h-auto" style={{ maxHeight: '90px' }} onError={(e) => console.error('Image failed to load:', e)} />
              </a>
            ) : (
              <AdPlaceholder adType="banner_728x90" className="w-full mx-auto mb-6 md:mb-8" titleText={t_noDynamic('adPlaceholderMainMenu')} />
            )}
            
            <div className="mb-6 md:mb-8 w-full">
              {renderMenuItem(startDiagnosisButtonData, -1, true)}
            </div>

            <div className="my-6 md:my-8 w-full">
              {renderMenuItem(callMarkazFullWidthData, -2, true)}
            </div>

            <div className="my-6 md:my-8 w-full">
              {renderMenuItem(comprehensiveAnalysisData, -3, true)}
            </div>
            
            <div className="my-6 md:my-8 w-full">
              {renderMenuItem(healthTrackerButtonData, -4, true)}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
              {mainMenuItems.filter(item => item.row === 1).map((item, index) => renderMenuItem(item, index))}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mb-6 md:mb-8">
              {mainMenuItems.filter(item => item.row === 2).map((item, index) => renderMenuItem(item, index))}
            </div>
            
            {adData ? (
              <a href={adData.link} target="_blank" rel="noopener noreferrer" className="w-full mx-auto mt-6 md:mt-8 block">
                <img src={adData.image} alt="Advertisement" className="w-full h-auto" style={{ maxHeight: '90px' }} onError={(e) => console.error('Image failed to load:', e)} />
              </a>
            ) : (
              <AdPlaceholder adType="banner_728x90" className="w-full mx-auto mt-6 md:mt-8" titleText={t_noDynamic('adPlaceholderMainMenu')} />
            )}
          </div>
        );
    }
  };

  const showHeaderAndFooter = currentMode === AppMode.None && !showWarning;

  return (
    <div className="flex flex-col min-h-screen">
      {showHeaderAndFooter && (
        <Header 
          currentMode={currentMode}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          onLoginClick={() => setCurrentMode(AppMode.Login)}
          onLogoutClick={handleLogout}
          onUserCabinetClick={() => setCurrentMode(AppMode.UserCabinet)}
          onNavigateToGetInsurance={() => setCurrentMode(AppMode.GetInsurance)}
        />
      )}
      <main className="flex-grow">
        {renderCurrentMode()}
      </main>
      {showHeaderAndFooter && <AppFooter />}

      {showWarning && (
        <WarningModal onAgree={handleAgreeWarning} onShowPrivacy={() => setShowPrivacyPolicy(true)} onShowTerms={() => setShowTermsOfUse(true)} />
      )}
      {showPrivacyPolicy && <PrivacyPolicyModal onClose={() => setShowPrivacyPolicy(false)} />}
      {showTermsOfUse && <TermsOfUseModal onClose={() => setShowTermsOfUse(false)} />}
      
      {isIdleModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[60] p-4 animate-fadeInScaleUp" role="dialog" aria-modal="true" aria-labelledby="idleTitle">
          <div className="bg-white/95 p-6 rounded-xl shadow-2xl max-w-sm w-full text-center">
            <IdleTimerIcon className="w-12 h-12 text-amber-500 mx-auto mb-3" title={t_noDynamic('attentionTitle')} />
            <h2 id="idleTitle" className="text-lg font-semibold text-slate-700 mb-3">{t_noDynamic('attentionTitle')}</h2>
            <p className="text-slate-600 mb-6 text-sm">{t_noDynamic('idleSessionPrompt')}</p>
            <div className="flex justify-around">
              <button onClick={handleContinueSession} className="py-2 px-4 bg-sky-500 hover:bg-sky-600 text-white rounded-md text-sm uppercase">{t_noDynamic('idleContinueButton')}</button>
              <button onClick={handleEndSession} className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm uppercase">{t_noDynamic('idleEndButton')}</button>
            </div>
          </div>
        </div>
      )}
      {isFeatureComingSoonModalOpen && (
        <FeatureComingSoonModal isOpen={isFeatureComingSoonModalOpen} onClose={() => setIsFeatureComingSoonModalOpen(false)} />
      )}
      {showAuthModal && (
        <FeatureRequiresAuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={() => { setShowAuthModal(false); setCurrentMode(AppMode.Login); }}
          onRegister={() => { setShowAuthModal(false); setCurrentMode(AppMode.Register); }}
        />
      )}
      {showInsuranceModal && (
        <FeatureRequiresInsuranceModal
          isOpen={showInsuranceModal}
          onClose={() => setShowInsuranceModal(false)}
          onAddInsurance={() => { setShowInsuranceModal(false); setCurrentMode(AppMode.UserCabinet);}}
          onGetInsurance={() => { setShowInsuranceModal(false); setCurrentMode(AppMode.GetInsurance);}}
        />
      )}
    </div>
  );
};