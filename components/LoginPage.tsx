
import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import LockIcon from '@/assets/icons/LockIcon';
import AdPlaceholder from '@/components/AdPlaceholder';

const LoginPage = ({ onLoginSuccess, onNavigateToRegister, onBack }) => {
  const { t, t_noDynamic } = useTranslation();
  const [username, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPasswordInfo, setShowForgotPasswordInfo] = useState(false);

  useEffect(() => {
    try {
      const rememberedUser = localStorage.getItem('aidoktorRememberedUser');
      if (rememberedUser) {
        setUsernameInput(rememberedUser);
        setRememberMe(true);
      }
    } catch (e) {
      console.warn("Could not access localStorage for 'aidoktorRememberedUser':", e);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError(t_noDynamic('fieldRequired'));
      return;
    }

    console.log('Mock Login Attempt:', { username, password, rememberMe });

    try {
      if (rememberMe) {
        localStorage.setItem('aidoktorRememberedUser', username);
      } else {
        localStorage.removeItem('aidoktorRememberedUser');
      }
    } catch (e) {
       console.warn("Could not update 'aidoktorRememberedUser' in localStorage:", e);
    }
    
    const capitalizedUsername = username.charAt(0).toUpperCase() + username.slice(1);

    onLoginSuccess({
      username: capitalizedUsername,
      email: undefined, 
      hasInsurance: false,
      insuranceNumber: null
    });
  };

  const toggleForgotPasswordInfo = () => {
    setShowForgotPasswordInfo(!showForgotPasswordInfo);
  };

  return (
    <>
      <div className="max-w-md mx-auto p-6 md:p-10 shadow-2xl rounded-lg bg-gradient-to-br from-sky-100/80 via-indigo-100/70 to-purple-100/60 backdrop-blur-md text-slate-800">
        <div className="text-center mb-8">
          <LockIcon className="w-16 h-16 mx-auto mb-4 text-sky-500" title={t_noDynamic('loginLockIconTitle')} />
          <h2 className="text-3xl font-bold uppercase text-slate-800">{t_noDynamic('loginTitle')}</h2>
        </div>
        
        <AdPlaceholder 
            adType="banner_320x50" 
            className="w-full mb-6" 
            titleText={t_noDynamic('adPlaceholderLogin')}
        />

        {!showForgotPasswordInfo ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-600 mb-1">
                {t_noDynamic('loginUsernameLabel')}
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder={t_noDynamic('loginUsernamePlaceholder')}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none border-slate-300/80 bg-white/90 text-slate-800 placeholder-slate-500"
                required
                aria-label={t_noDynamic('loginUsernameLabel')}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-600 mb-1">
                {t_noDynamic('loginPasswordLabel')}
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t_noDynamic('loginPasswordPlaceholder')}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none border-slate-300/80 bg-white/90 text-slate-800 placeholder-slate-500"
                required
                aria-label={t_noDynamic('loginPasswordLabel')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-slate-300/80 rounded bg-white/80"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                  {t_noDynamic('loginRememberMe')}
                </label>
              </div>
              <div className="text-sm">
                <button
                  type="button"
                  onClick={toggleForgotPasswordInfo}
                  className="font-medium text-sky-600 hover:text-sky-700 underline"
                >
                  {t_noDynamic('loginForgotPassword')}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-500 text-center" role="alert">{error}</p>}

            <button
              type="submit"
              className="w-full p-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition-colors uppercase"
            >
              {t_noDynamic('loginButton')}
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <p 
              className="text-sm text-slate-700 p-3 bg-sky-100/70 border border-sky-300/70 rounded-md"
              dangerouslySetInnerHTML={{ __html: t_noDynamic('loginForgotPasswordInfo')}}
            >
            </p>
            <button
              type="button"
              onClick={toggleForgotPasswordInfo}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-md transition-colors uppercase"
            >
              {t_noDynamic('closeButton')}
            </button>
          </div>
        )}
        
        <p className="text-center mt-6 text-sm text-slate-500">
          {t_noDynamic('loginNoAccount')}{' '}
          <button onClick={onNavigateToRegister} className="font-medium text-sky-600 hover:text-sky-700 underline">
            {t_noDynamic('loginRegisterNow')}
          </button>
        </p>
      </div>
      {/* Removed the "Back to Main Menu" button as per previous request, keeping onBack for potential future use if needed.
          The current logic in App.tsx handles navigation based on login state.
          If onBack is specifically for non-logged-in users to exit login flow, that can be re-evaluated.
      */}
    </>
  );
};

export default LoginPage;