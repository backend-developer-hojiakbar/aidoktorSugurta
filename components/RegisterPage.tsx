import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import UserIcon from '@/assets/icons/UserIcon'; 
import AdPlaceholder from '@/components/AdPlaceholder';

export const RegisterPage = ({ onRegisterSuccess, onNavigateToLogin, onBack }) => {
  const { t, t_noDynamic } = useTranslation();
  const [username, setUsername] = useState('');
  // Removed email state: const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [registrationType, setRegistrationType] = useState(null); 
  const [insuranceNumber, setInsuranceNumber] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');

    if (!registrationType) {
        setError("Iltimos, ro'yxatdan o'tish turini tanlang."); 
        return;
    }

    if (!username || !password || !confirmPassword) { // Removed email from this check
      setError(t_noDynamic('fieldRequired')); 
      return;
    }
    if (registrationType === 'withInsurance' && !insuranceNumber) {
      setError("Sug'urta raqamini kiritish shart."); 
      return;
    }
    if (password !== confirmPassword) {
      setError(t_noDynamic('registerPasswordsDoNotMatch'));
      return;
    }
    if (password.length < 8) {
      setError(t('passwordMinLength', {minLength: 8})); 
      return;
    }

    console.log('Mock Registration Attempt:', { 
        username, 
        // email, // Removed email
        password, 
        hasInsurance: registrationType === 'withInsurance',
        insuranceNumber: registrationType === 'withInsurance' ? insuranceNumber : null 
    });
    
    const capitalizedUsername = username.charAt(0).toUpperCase() + username.slice(1);
    onRegisterSuccess({ 
        username: capitalizedUsername, 
        email: undefined, // Email is no longer collected
        hasInsurance: registrationType === 'withInsurance',
        insuranceNumber: registrationType === 'withInsurance' ? insuranceNumber : null
    });
  };

  const selectRegistrationType = (type) => {
    setRegistrationType(type);
    setError(''); 
  };

  return (
    <>
      <div className="max-w-md mx-auto p-6 md:p-10 shadow-2xl rounded-lg bg-gradient-to-b from-green-50/80 to-emerald-50/70 backdrop-blur-md text-slate-800">
        <div className="text-center mb-8">
          <UserIcon className="w-16 h-16 mx-auto mb-4 text-green-500" title={t_noDynamic('registerUserIconTitle')} />
          <h2 className="text-3xl font-bold uppercase text-slate-800">{t_noDynamic('registerTitle')}</h2>
        </div>
        
        <AdPlaceholder 
            adType="banner_320x50" 
            className="w-full mb-6" 
            titleText={t_noDynamic('adPlaceholderRegister')}
        />

        {!registrationType ? (
            <div className="space-y-4 mb-6">
                 <button 
                    onClick={() => selectRegistrationType('withInsurance')}
                    className="w-full p-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition-colors uppercase"
                >
                    {t_noDynamic('registerWithInsuranceButton')}
                </button>
                <button 
                    onClick={() => selectRegistrationType('withoutInsurance')}
                    className="w-full p-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors uppercase"
                >
                    {t_noDynamic('registerWithoutInsuranceButton')}
                </button>
                {error && <p className="text-sm text-red-500 text-center mt-2" role="alert">{error}</p>}
            </div>
        ) : (
            <form onSubmit={handleRegister} className="space-y-5">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-slate-600 mb-1">
                    {t_noDynamic('registerUsernameLabel')}
                    </label>
                    <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t_noDynamic('registerUsernamePlaceholder')}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none border-slate-300/80 bg-white/90 text-slate-800 placeholder-slate-500"
                    required
                    aria-label={t_noDynamic('registerUsernameLabel')}
                    />
                </div>
                {/* Removed Email Field */}
                {registrationType === 'withInsurance' && (
                    <div>
                        <label htmlFor="insuranceNumber" className="block text-sm font-medium text-slate-600 mb-1">
                        {t_noDynamic('registerInsuranceNumberLabel')}
                        </label>
                        <input
                        type="text"
                        id="insuranceNumber"
                        value={insuranceNumber}
                        onChange={(e) => setInsuranceNumber(e.target.value)}
                        placeholder={t_noDynamic('registerInsuranceNumberPlaceholder')}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none border-slate-300/80 bg-white/90 text-slate-800 placeholder-slate-500"
                        aria-label={t_noDynamic('registerInsuranceNumberLabel')}
                        />
                    </div>
                )}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-600 mb-1">
                    {t_noDynamic('registerPasswordLabel')}
                    </label>
                    <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('registerPasswordPlaceholder', {minLength: 8})}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none border-slate-300/80 bg-white/90 text-slate-800 placeholder-slate-500"
                    required
                    aria-label={t_noDynamic('registerPasswordLabel')}
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-600 mb-1">
                    {t_noDynamic('registerConfirmPasswordLabel')}
                    </label>
                    <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t_noDynamic('registerConfirmPasswordPlaceholder')}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none border-slate-300/80 bg-white/90 text-slate-800 placeholder-slate-500"
                    required
                    aria-label={t_noDynamic('registerConfirmPasswordLabel')}
                    />
                </div>

                {error && <p className="text-sm text-red-500 text-center" role="alert">{error}</p>}

                <button
                    type="submit"
                    className="w-full p-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors uppercase"
                >
                    {t_noDynamic('registerButton')}
                </button>
                <button 
                    type="button"
                    onClick={() => setRegistrationType(null)}
                    className="w-full p-2 mt-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors uppercase text-sm"
                >
                    {t_noDynamic('registerChangeRegistrationType')}
                </button>
            </form>
        )}
        
        <p className="text-center mt-6 text-sm text-slate-500">
          {t_noDynamic('registerHasAccount')}{' '}
          <button onClick={onNavigateToLogin} className="font-medium text-sky-600 hover:text-sky-700 underline">
            {t_noDynamic('registerLoginNow')}
          </button>
        </p>
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