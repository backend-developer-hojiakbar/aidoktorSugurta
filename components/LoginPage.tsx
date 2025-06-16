import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from '@/hooks/useTranslation';
import LockIcon from '@/assets/icons/LockIcon';

const LoginPage = ({ onLoginSuccess, onNavigateToRegister, onBack }) => {
  const { t, t_noDynamic } = useTranslation();
  const [username, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPasswordInfo, setShowForgotPasswordInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [adData, setAdData] = useState<{ image: string; link: string } | null>(null);
  const [adError, setAdError] = useState<string | null>(null);

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

    const fetchAd = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/advertisements/', {
          params: { category: 'login', size: '320x50', is_active: true },
        });
        if (Array.isArray(response.data) && response.data.length > 0) {
          const ad = response.data.find(ad => ad.category === 'login' && ad.size === '320x50' && ad.is_active);
          if (ad) {
            const fullImageUrl = `http://127.0.0.1:8000${ad.image}`;
            setAdData({ image: fullImageUrl, link: ad.link });
          } else {
            setAdError(t_noDynamic('adNotFound'));
          }
        } else {
          setAdError(t_noDynamic('adNotFound'));
        }
      } catch (error) {
        console.error('Failed to fetch ad:', error.response ? error.response.data : error.message);
        setAdError(t_noDynamic('adFetchFailed'));
      }
    };
    fetchAd();
  }, [t_noDynamic]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError(t_noDynamic('fieldRequired'));
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/login/', {
        username,
        password,
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Login response:', response.data);

      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      if (rememberMe) {
        localStorage.setItem('aidoktorRememberedUser', username);
      } else {
        localStorage.removeItem('aidoktorRememberedUser');
      }

      // Foydalanuvchi ma'lumotlarini olish uchun users/ endpointidan foydalanamiz
      const userResponse = await axios.get('http://127.0.0.1:8000/users/', {
        headers: { 'Authorization': `Bearer ${access}` }
      });
      console.log('User data response:', userResponse.data);

      const userData = userResponse.data[0]; // ViewSet bir nechta obyektdan foydalanadi, shuning uchun [0] ishlatamiz
      const capitalizedUsername = username.charAt(0).toUpperCase() + username.slice(1);
      const fullUser = {
        username: capitalizedUsername,
        insurance_id: userData.insurance_id || null,
        hasInsurance: !!userData.insurance_id,
      };
      onLoginSuccess(fullUser);
    } catch (error) {
      console.error('Login or user data error details:', error.response ? error.response.data : error.message);
      setError(error.response?.data?.error || t_noDynamic('loginFailed'));
    } finally {
      setIsLoading(false);
    }
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

        {adData ? (
          <a href={adData.link} target="_blank" rel="noopener noreferrer">
            <img
              src={adData.image}
              alt="Advertisement"
              className="w-full h-auto mb-6"
              style={{ maxHeight: '50px' }}
              onError={(e) => {
                console.error('Image failed to load:', e);
                setAdError(t_noDynamic('adImageFailed'));
              }}
            />
          </a>
        ) : adError && (
          <p className="text-sm text-red-500 text-center mb-6" role="alert">{adError}</p>
        )}

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
                disabled={isLoading}
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
                disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                >
                  {t_noDynamic('loginForgotPassword')}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-500 text-center" role="alert">{error}</p>}

            <button
              type="submit"
              className={`w-full p-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition-colors uppercase ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? t_noDynamic('loginLoading') : t_noDynamic('loginButton')}
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <p
              className="text-sm text-slate-700 p-3 bg-sky-100/70 border border-sky-300/70 rounded-md"
              dangerouslySetInnerHTML={{ __html: t_noDynamic('loginForgotPasswordInfo')}}
            />
            <button
              type="button"
              onClick={toggleForgotPasswordInfo}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-md transition-colors uppercase"
              disabled={isLoading}
            >
              {t_noDynamic('closeButton')}
            </button>
          </div>
        )}

        <p className="text-center mt-6 text-sm text-slate-500">
          {t_noDynamic('loginNoAccount')}{' '}
          <button onClick={onNavigateToRegister} className="font-medium text-sky-600 hover:text-sky-700 underline" disabled={isLoading}>
            {t_noDynamic('loginRegisterNow')}
          </button>
        </p>
      </div>
      <button
        onClick={onBack}
        className="flex items-center justify-center mx-auto space-x-2 text-base py-3 px-5 rounded-lg transition-colors uppercase text-sky-600 hover:text-sky-700 hover:bg-sky-100/70 backdrop-blur-sm mt-8 border border-sky-500 hover:border-sky-600 w-full max-w-xs"
        aria-label={t_noDynamic('backToMainMenuButton')}
        disabled={isLoading}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        <span>{t_noDynamic('mainMenuButton')}</span>
      </button>
    </>
  );
};

export default LoginPage;