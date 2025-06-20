import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getChatResponse } from '@/services/aiService';
import AdPlaceholder from '@/components/AdPlaceholder';
import { useTranslation } from '@/hooks/useTranslation';
import axios from 'axios';

// Tokenni saqlash va boshqarish uchun custom hook
const useAuthToken = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('access_token')); // Key nomini moslashtirdim

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    if (storedToken) {
      setToken(storedToken);
    } else {
      console.warn("No token found in localStorage. Please ensure login is completed.");
      setToken(null);
    }
  }, []);

  return token;
};

const formatAiMessageWithPhoneNumber = (text: string, t: any) => {
  const phoneNumberRegex = /(\+998\s?73\s?200\s?00\s?73)/g;
  const telLinkNumber = "+998732000073";
  const displayPhoneNumber = "+998 73 200 00 73";

  if (!phoneNumberRegex.test(text)) {
    return text;
  }

  const parts = text.split(phoneNumberRegex);

  return parts.map((part, index) => {
    if (part.match(phoneNumberRegex)) {
      return (
        <a 
          key={`tel-${index}`} 
          href={`tel:${telLinkNumber}`}
          className="font-bold text-sky-600 hover:text-sky-700 text-base md:text-lg underline"
          aria-label={t('callCenterAriaCallNumber', { number: displayPhoneNumber })}
        >
          {displayPhoneNumber}
        </a>
      );
    }
    return part;
  });
};

const QuickDiagnosisMode = ({ onBack }: { onBack: () => void }) => {
  const { t, t_noDynamic } = useTranslation();
  const token = useAuthToken();
  const [userId] = useState<number | null>(1);
  const [messages, setMessages] = useState<any[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [adData, setAdData] = useState<{ image: string; link: string } | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const makeAuthenticatedRequest = async (config: any) => {
    const instance = axios.create({
      headers: token ? { 'Authorization': `Bearer ${encodeURIComponent(token)}` } : {}, // Tokenni encode qilish
    });
    try {
      const response = await instance(config);
      return response;
    } catch (error) {
      console.error("Request error:", error);
      throw error;
    }
  };

  useEffect(() => {
    const initializeChat = async () => {
      if (!userId || !token) return;

      if (messages.length === 0 && !isLoading) {
        setIsLoading(true);
        try {
          const response = await makeAuthenticatedRequest({
            method: 'get',
            url: `https://aidoktor.pythonanywhere.com/chat-messages/?user_id=${userId}&session_type=quick`,
          });
          const savedMessages = response.data.map((msg: any) => ({
            id: msg.id.toString(),
            sender: msg.sender,
            text: msg.text,
            timestamp: new Date(msg.timestamp),
            userImagePreviewUrl: msg.image_data ? `data:image/jpeg;base64,${msg.image_data}` : undefined,
          }));
          setMessages(savedMessages);

          if (savedMessages.length === 0) {
            const greeting = t_noDynamic('quickDiagnosisAiGreeting');
            const aiGreetingResponse = await getChatResponse(greeting, [], undefined);
            setMessages([aiGreetingResponse]);
            await saveMessage(aiGreetingResponse);
          }
        } catch (error) {
          console.error("Error initializing chat or fetching history:", error);
          const errorText = t_noDynamic('quickDiagnosisAiInitError');
          const errorResponse = {
            id: Date.now().toString() + '_init_error',
            sender: 'ai',
            text: errorText,
            timestamp: new Date(),
          };
          setMessages([errorResponse]);
        } finally {
          setIsLoading(false);
        }
      }
    };
    initializeChat();

    const fetchAd = async () => {
      if (!token) return;
      try {
        const response = await makeAuthenticatedRequest({
          method: 'get',
          url: 'https://aidoktor.pythonanywhere.com/advertisements/',
          params: { category: 'chat', size: '320x50', is_active: true },
        });
        if (Array.isArray(response.data) && response.data.length > 0) {
          const ad = response.data.find((ad: any) => ad.category === 'chat' && ad.size === '320x50' && ad.is_active);
          if (ad) {
            const fullImageUrl = `http://127.0.0.1:8000${ad.image}`;
            setAdData({ image: fullImageUrl, link: ad.link });
          }
        }
      } catch (error) {
        console.error('Failed to fetch ad:', error);
      }
    };
    fetchAd();
  }, [t_noDynamic, messages.length, isLoading, userId, token]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setImageError(t_noDynamic('quickDiagnosisImageSizeError'));
        setUploadedImageFile(null);
        setImagePreviewUrl(null);
        return;
      }
      if (!file.type.startsWith('image/')) {
        setImageError(t_noDynamic('quickDiagnosisImageTypeErr'));
        setUploadedImageFile(null);
        setImagePreviewUrl(null);
        return;
      }
      setImageError(null);
      setUploadedImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setUploadedImageFile(null);
    setImagePreviewUrl(null);
    setImageError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const saveMessage = async (message: any) => {
    if (!userId || !token) return;
    try {
      await makeAuthenticatedRequest({
        method: 'post',
        url: 'https://aidoktor.pythonanywhere.com/chat-messages/',
        data: {
          user: userId,
          sender: message.sender,
          text: message.text,
          image_data: message.userImagePreviewUrl ? message.userImagePreviewUrl.split(',')[1] : null,
          session_type: 'quick',
        },
      });
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

  const handleSendMessage = async () => {
    if ((userInput.trim() === '' && !uploadedImageFile) || isLoading || !userId || !token) return;

    setIsLoading(true);
    let imageDetailPayload: { data: string; mimeType: string } | undefined;
    let currentImagePreviewForMessage = imagePreviewUrl;

    const newUserMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userInput,
      timestamp: new Date(),
      userImagePreviewUrl: currentImagePreviewForMessage || undefined,
    };
    setMessages(prev => [...prev, newUserMessage]);
    await saveMessage(newUserMessage);

    if (uploadedImageFile) {
      try {
        const base64Data = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (typeof reader.result === 'string') {
              resolve(reader.result.split(',')[1]);
            } else {
              reject(new Error("FileReader result is not a string."));
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(uploadedImageFile);
        });
        imageDetailPayload = { data: base64Data as string, mimeType: uploadedImageFile.type };
      } catch (error) {
        console.error("Error converting image to base64:", error);
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_img_error',
          sender: 'ai',
          text: t_noDynamic('quickDiagnosisImageProcessError'),
          timestamp: new Date(),
        }]);
      }
    }

    setUserInput('');
    removeImage();

    try {
      const aiResponse = await getChatResponse(newUserMessage.text, messages, imageDetailPayload);
      setMessages(prev => [...prev, aiResponse]);
      await saveMessage(aiResponse);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorResponse = {
        id: Date.now().toString() + '_error',
        sender: 'ai',
        text: t_noDynamic('quickDiagnosisAiError'),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponse]);
      await saveMessage(errorResponse);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full max-w-3xl mx-auto">
      <div className="flex flex-col flex-1 shadow-2xl rounded-lg overflow-hidden bg-sky-50/70 backdrop-blur-sm border border-sky-200/50 min-h-0">
        <div className="p-4 border-b border-sky-200/70 bg-white/50 backdrop-blur-sm flex justify-between items-center">
          <h2 className="text-2xl font-semibold uppercase text-slate-700">{t_noDynamic('quickDiagnosisTitle')}</h2>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm uppercase transition-colors"
            aria-label={t_noDynamic('showHistoryButtonAriaLabel')}
            disabled={!userId}
          >
            {showHistory ? t_noDynamic('hideHistoryButton') : t_noDynamic('showHistoryButton')}
          </button>
        </div>

        {adData ? (
          <a href={adData.link} target="_blank" rel="noopener noreferrer" className="max-w-md mx-auto my-2 px-2 block">
            <img
              src={adData.image}
              alt="Chat Advertisement"
              className="w-full h-auto"
              style={{ maxHeight: '50px' }}
              onError={(e) => console.error('Ad image failed to load:', e)}
            />
          </a>
        ) : (
          <AdPlaceholder
            adType="banner_320x50"
            className="max-w-md mx-auto my-2 px-2"
            titleText={t_noDynamic('adPlaceholderChat')}
          />
        )}

        <div className="flex-grow p-4 sm:p-6 space-y-4 overflow-y-auto custom-scrollbar bg-sky-100/30">
          {messages.map((msg: any) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl shadow-md ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                  : 'bg-gradient-to-r from-sky-100 to-blue-100 text-slate-800'
              }`}
              >
                {msg.sender === 'user' && msg.userImagePreviewUrl && (
                  <img src={msg.userImagePreviewUrl} alt={t_noDynamic('quickDiagnosisUserImageAlt')} className="rounded-md mb-2 max-h-48 w-auto" />
                )}
                {msg.text && msg.sender === 'ai' ? (
                  <p className="text-sm whitespace-pre-wrap">
                    {formatAiMessageWithPhoneNumber(msg.text, t)}
                  </p>
                ) : msg.text && (
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                )}
                <p className={`text-xs mt-1 opacity-70 text-right ${msg.sender === 'user' ? 'text-blue-100' : 'text-slate-500'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
          {isLoading && messages.length > 0 && (
            <div className="flex justify-start">
              <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-xl shadow-md bg-gradient-to-r from-sky-100 to-blue-100 text-slate-800">
                <div className="flex items-center space-x-2">
                  <div className="heartbeat-loader">
                    <span></span><span></span><span></span>
                  </div>
                  <span className="text-sm ml-2">{t_noDynamic('quickDiagnosisAiAnalyzing')}</span>
                </div>
              </div>
            </div>
          )}
          {isLoading && messages.length === 0 && (
            <div className="flex justify-center items-center h-full">
              <div className="flex flex-col items-center text-slate-500">
                <div className="heartbeat-loader blue mb-2">
                  <span></span><span></span><span></span>
                </div>
                <p className="text-sm">{t_noDynamic('quickDiagnosisAiConnecting')}</p>
              </div>
            </div>
          )}
        </div>

        {showHistory && userId && (
          <div className="p-4 border-t border-sky-200/70 bg-white/60 backdrop-blur-sm max-h-60 overflow-y-auto custom-scrollbar">
            <h3 className="text-lg font-semibold mb-2 text-slate-700">{t_noDynamic('chatHistoryTitle')}</h3>
            {messages.length > 0 ? (
              messages.map((msg: any) => (
                <div key={msg.id} className={`mb-2 p-2 rounded-md ${msg.sender === 'user' ? 'bg-blue-100' : 'bg-sky-100'}`}>
                  <p className="text-sm">{msg.text || t_noDynamic('noTextMessage')}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">{t_noDynamic('noHistoryAvailable')}</p>
            )}
          </div>
        )}

        <div className="p-4 border-t border-sky-200/70 bg-white/60 backdrop-blur-sm">
          {imagePreviewUrl && (
            <div className="mb-2 p-2 border rounded-md flex items-center justify-between border-slate-300/70 bg-slate-100/70">
              <img src={imagePreviewUrl} alt={t_noDynamic('quickDiagnosisUploadedImagePreviewAlt')} className="h-16 w-auto rounded-md" />
              <button onClick={removeImage} className="text-red-500 hover:text-red-600 p-1" title={t_noDynamic('quickDiagnosisRemoveImageTitle')}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          {imageError && <p className="text-xs text-red-500 mb-1">{imageError}</p>}
          <p className="text-xs mb-2 text-slate-500">
            {t_noDynamic('quickDiagnosisImageUploadNote')}
          </p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t_noDynamic('quickDiagnosisInputPlaceholder')}
              className="flex-grow p-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none border-slate-300/80 bg-white/90 text-slate-800 placeholder-slate-500"
              disabled={isLoading && messages.length === 0 || !userId || !token}
              aria-label={t_noDynamic('quickDiagnosisInputAriaLabel')}
            />
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="imageUpload"
              disabled={isLoading && messages.length === 0 || !userId || !token}
              aria-label={t_noDynamic('quickDiagnosisImageUploadAriaLabel')}
            />
            <label
              htmlFor="imageUpload"
              className={`p-3 rounded-lg text-white transition-colors cursor-pointer ${ (isLoading && messages.length === 0) || !userId || !token ? 'bg-slate-400 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600'}`}
              title={t_noDynamic('quickDiagnosisImageUploadTitle')}
              aria-disabled={(isLoading && messages.length === 0) || !userId || !token}
              role="button"
              tabIndex={(isLoading && messages.length === 0) || !userId || !token ? -1 : 0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { if (!(isLoading && messages.length === 0) && userId && token && fileInputRef.current) fileInputRef.current.click();}}}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
            </label>
            <button
              onClick={handleSendMessage}
              disabled={isLoading || (userInput.trim() === '' && !uploadedImageFile) || !userId || !token}
              className="p-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg disabled:opacity-50 transition-colors"
              title={t_noDynamic('sendMessageButtonTitle')}
              aria-label={t_noDynamic('sendMessageButtonAriaLabel')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
          <p className="text-xs mt-2 text-center uppercase text-slate-500">
            {t_noDynamic('quickDiagnosisDisclaimer')}
          </p>
        </div>
      </div>

      <button
        onClick={onBack}
        className="flex items-center justify-center mx-auto space-x-2 text-base py-3 px-5 rounded-lg transition-colors uppercase text-sky-600 hover:text-sky-700 hover:bg-sky-100/70 backdrop-blur-sm mt-4 border border-sky-500 hover:border-sky-600 w-full max-w-xs"
        aria-label={t_noDynamic('backToMainMenuButton')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        <span>{t_noDynamic('mainMenuButton')}</span>
      </button>
    </div>
  );
};

export default QuickDiagnosisMode;