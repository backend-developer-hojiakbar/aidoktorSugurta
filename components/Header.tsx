import React, { useState, useEffect } from 'react';
import AiDoktorLogoIcon from '@/assets/icons/AiDoktorLogoIcon';
import LoginIcon from '@/assets/icons/LoginIcon';
import LogoutIcon from '@/assets/icons/LogoutIcon';
import UserIcon from '@/assets/icons/UserIcon';
import InsuranceCardIcon from '@/assets/icons/InsuranceCardIcon'; // Yangi ikona importi
import { useTranslation } from '@/hooks/useTranslation';
import { User } from '@/types'; // User turini import qilish

interface HeaderProps {
  currentMode: number;
  isLoggedIn: boolean;
  currentUser: User | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onUserCabinetClick: () => void;
  onNavigateToGetInsurance: () => void; // Yangi prop
}

const Header: React.FC<HeaderProps> = ({ 
  currentMode, 
  isLoggedIn, 
  currentUser, 
  onLoginClick, 
  onLogoutClick, 
  onUserCabinetClick,
  onNavigateToGetInsurance // Yangi prop
}) => {
  const { t, t_noDynamic } = useTranslation();
  const [userCount, setUserCount] = useState(1299); 

  useEffect(() => {
    const interval = setInterval(() => {
      const change = Math.floor(Math.random() * 15) - 7; 
      setUserCount(prevCount => Math.max(1000, prevCount + change)); 
    }, 3000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="p-4 shadow-md flex justify-between items-center sticky top-0 z-40 bg-sky-50/70 backdrop-blur-lg border-b border-sky-200/60">
      <div className="flex items-center space-x-3">
        <AiDoktorLogoIcon className="w-7 h-7 text-sky-500" title="AiDoktor.uz Logo" />
        <span className="text-xl font-semibold text-slate-700">{/* AiDoktor.uz */}</span>
      </div>
      
      <div className="hidden md:block text-sm text-slate-700">
        <span>{t_noDynamic('activeUsersPart1')} </span>
        <span className="font-bold text-emerald-600">{userCount}</span>
        <span> {t_noDynamic('activeUsersPart2')}</span>
      </div>

      <div className="flex items-center space-x-3">
        {isLoggedIn && currentUser && !currentUser.hasInsurance && (
          <button
            onClick={onNavigateToGetInsurance}
            className="animate-fadeInOut flex items-center space-x-2 py-2 px-4 text-sm font-semibold rounded-lg bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-500 hover:to-emerald-600 text-white transition-all shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            aria-label={t_noDynamic('headerGetInsuranceAnimatedButtonAriaLabel')}
          >
            <InsuranceCardIcon className="w-5 h-5" />
            <span className="uppercase">{t_noDynamic('headerGetInsuranceAnimatedButton')}</span>
          </button>
        )}
        {isLoggedIn && currentUser ? (
          <>
            <div className="hidden sm:flex items-center space-x-1 text-sm text-slate-700">
                <UserIcon className="w-5 h-5 text-sky-500" />
                <span>{t('headerWelcomeUser', { username: currentUser.username })}</span>
            </div>
            <button
              onClick={onUserCabinetClick}
              className="flex items-center space-x-1.5 py-2 px-3 text-sm rounded-md bg-purple-500 hover:bg-purple-600 text-white transition-colors"
              aria-label={t_noDynamic('headerUserCabinetButtonAriaLabel')}
            >
              <UserIcon className="w-4 h-4" />
              <span className="hidden sm:inline">{t_noDynamic('headerUserCabinetButtonLabel')}</span>
            </button>
            <button
              onClick={onLogoutClick}
              className="flex items-center space-x-1.5 py-2 px-3 text-sm rounded-md bg-red-500 hover:bg-red-600 text-white transition-colors"
              aria-label={t_noDynamic('headerLogoutButtonAriaLabel')}
            >
              <LogoutIcon className="w-4 h-4" />
              <span className="hidden sm:inline">{t_noDynamic('headerLogoutButtonLabel')}</span>
            </button>
          </>
        ) : (
          <button
            onClick={onLoginClick}
            className="flex items-center space-x-1.5 py-2 px-3 text-sm rounded-md bg-sky-500 hover:bg-sky-600 text-white transition-colors"
            aria-label={t_noDynamic('headerLoginButtonAriaLabel')}
          >
            <LoginIcon className="w-4 h-4" />
            <span>{t_noDynamic('headerLoginButtonLabel')}</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;