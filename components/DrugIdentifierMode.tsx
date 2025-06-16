import React, { useState, useCallback, useEffect } from 'react';
import { identifyDrugFromImage } from '@/services/aiService'; 
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useTranslation } from '@/hooks/useTranslation';

const MAX_IMAGE_SIZE_MB = 5;

export const DrugIdentifierMode = ({ onBack }) => {
  const { t, t_noDynamic } = useTranslation();

  const [uploadedImageFile, setUploadedImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [adDataUpload, setAdDataUpload] = useState<{ image: string; link: string } | null>(null);
  const [adDataLoading, setAdDataLoading] = useState<{ image: string; link: string } | null>(null);
  const [adDataResult, setAdDataResult] = useState<{ image: string; link: string } | null>(null);
  const [adDataError, setAdDataError] = useState<{ image: string; link: string } | null>(null);
  const [adErrorUpload, setAdErrorUpload] = useState<string | null>(null);
  const [adErrorLoading, setAdErrorLoading] = useState<string | null>(null);
  const [adErrorResult, setAdErrorResult] = useState<string | null>(null);
  const [adErrorError, setAdErrorError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    setError(null);
    setAnalysisResult(null); 

    if (fileRejections.length > 0) {
      const firstRejection = fileRejections[0];
      const firstError = firstRejection.errors[0];
      if (firstError.code === "file-too-large") {
        setError(t('drugIdentifierImageSizeError', { maxSize: MAX_IMAGE_SIZE_MB }));
      } else if (firstError.code === "file-invalid-type") {
        setError(t_noDynamic('drugIdentifierImageTypeErr'));
      } else {
        setError(t('compAnalysisFileGenericError', { fileName: firstRejection.file.name, message: firstError.message }));
      }
      setUploadedImageFile(null);
      setImagePreviewUrl(null);
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadedImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.onerror = () => {
        setError(t_noDynamic('quickDiagnosisImageProcessError')); 
        setUploadedImageFile(null);
        setImagePreviewUrl(null);
      };
      reader.readAsDataURL(file);
      setError(null); 
    }
  }, [t, t_noDynamic]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/heic': ['.heic'],
      'image/webp': ['.webp'],
      'image/bmp': ['.bmp'],
    },
    maxSize: MAX_IMAGE_SIZE_MB * 1024 * 1024,
    multiple: false,
  });

  const removeImage = () => {
    setUploadedImageFile(null);
    setImagePreviewUrl(null);
    setAnalysisResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!uploadedImageFile) {
      setError(t_noDynamic('drugIdentifierNoImageError'));
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    try {
      const result = await identifyDrugFromImage(uploadedImageFile);
      setAnalysisResult(result); 
    } catch (err) {
      setError(t_noDynamic('drugIdentifierAiError') + (err.message ? `: ${err.message}` : ''));
      setAnalysisResult(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNewAnalysis = () => {
    removeImage();
  };

  // Reklama ma'lumotlarini yuklash
  const fetchAd = useCallback(async (size: string, setAdData: (data: { image: string; link: string } | null) => void, setAdError: (error: string | null) => void) => {
    try {
      const response = await axios.get('https://aidoktor.pythonanywhere.com/advertisements/', {
        params: {
          category: 'medicine',
          size: '468x60',
          is_active: true,
        },
      });
      if (Array.isArray(response.data) && response.data.length > 0) {
        const ad = response.data.find(ad => ad.category === 'medicine' && ad.is_active);
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
      console.error(`Failed to fetch ad for size ${size}:`, error.response ? error.response.data : error.message);
      setAdError(t_noDynamic('adFetchFailed'));
    }
  }, [t_noDynamic]);

  useEffect(() => {
    fetchAd('banner_320x100', setAdDataUpload, setAdErrorUpload);
    fetchAd('banner_320x50', setAdDataLoading, setAdErrorLoading);
    fetchAd('banner_468x60', setAdDataResult, setAdErrorResult);
    fetchAd('banner_320x50', setAdDataError, setAdErrorError);
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [fetchAd, imagePreviewUrl]);

  const formatDrugInfo = (text) => {
    const lines = text.split('\n');
    const formattedElements = [];

    lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        if (trimmedLine === '') return;

        const disclaimerKey = "**DISCLAIMER (MAJBURIY!)**:";
        if (trimmedLine.toUpperCase().startsWith(disclaimerKey.toUpperCase())) {
            const content = trimmedLine.substring(disclaimerKey.length).trim();
            formattedElements.push(
                <div key={`line-${index}`} className="mt-4 pt-3 border-t border-slate-300/80">
                    <strong className="block text-amber-600 uppercase">DISCLAIMER (MAJBURIY!):</strong>
                    <span className="block text-amber-700 whitespace-pre-wrap">{content}</span>
                </div>
            );
            return;
        }
        
        const boldTitleContentMatch = trimmedLine.match(/^(?:\d+\.\s*)?\*\*(.+?)\*\*:\s*(.*)$/);
        if (boldTitleContentMatch && boldTitleContentMatch[1]) {
            const title = boldTitleContentMatch[1].trim();
            const content = boldTitleContentMatch[2] ? boldTitleContentMatch[2].trim() : "";
            formattedElements.push(
                <div key={`line-${index}`} className="mt-2">
                    <strong className="block text-sky-700">{title}:</strong>
                    {content && <span className="block ml-2 text-slate-700 whitespace-pre-wrap">{content}</span>}
                </div>
            );
            return;
        }

        const uppercaseTitleContentMatch = trimmedLine.match(/^([A-Z0-9\s()'-_.,]+?):\s*(.*)$/);
        if (uppercaseTitleContentMatch && uppercaseTitleContentMatch[1]) {
            const title = uppercaseTitleContentMatch[1].trim();
            const content = uppercaseTitleContentMatch[2] ? uppercaseTitleContentMatch[2].trim() : "";
            if (title.toUpperCase().includes('DISCLAIMER')) {
                 formattedElements.push(
                    <div key={`line-${index}`} className="mt-4 pt-3 border-t border-slate-300/80">
                        <strong className="block text-amber-600 uppercase">{title}:</strong>
                        {content && <span className="block text-amber-700 whitespace-pre-wrap">{content}</span>}
                    </div>
                );
            } else {
                formattedElements.push(
                    <div key={`line-${index}`} className="mt-2">
                        <strong className="block text-sky-700">{title}:</strong>
                        {content && <span className="block ml-2 text-slate-700 whitespace-pre-wrap">{content}</span>}
                    </div>
                );
            }
            return;
        }
        
        formattedElements.push(<span key={`line-${index}`} className="block ml-2 text-slate-700 whitespace-pre-wrap">{trimmedLine}</span>);
    });
    return formattedElements;
  };

  return (
    <>
      <div className="max-w-3xl mx-auto p-4 md:p-8 shadow-2xl rounded-lg bg-gradient-to-b from-emerald-50/80 to-teal-50/70 backdrop-blur-md text-slate-800">
        <h2 className="text-3xl font-bold text-center mb-2 uppercase text-slate-800">{t_noDynamic('drugIdentifierTitle')}</h2>
        <p className="text-center mb-8 text-sm uppercase text-slate-500">{t_noDynamic('drugIdentifierSubTitle')}</p>

        <div className="space-y-6">
          {!analysisResult && !isLoading && (
            <>
              {adDataUpload ? (
                <a href={adDataUpload.link} target="_blank" rel="noopener noreferrer">
                  <img
                    src={adDataUpload.image}
                    alt="Advertisement"
                    className="w-full"
                    style={{ maxHeight: '100px' }}
                    onError={(e) => {
                      console.error('Image failed to load:', e);
                      setAdErrorUpload(t_noDynamic('adImageFailed'));
                    }}
                  />
                </a>
              ) : adErrorUpload && (
                <p className="text-sm text-red-500 text-center mb-6" role="alert">{adErrorUpload}</p>
              )}
              <div
                {...getRootProps()}
                className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
                            ${isDragActive ? 'border-green-500 bg-green-100/80' : 'border-green-300/70 hover:border-green-400/80 bg-green-100/50'}`}
              >
                <input {...getInputProps()} aria-label={t_noDynamic('drugIdentifierUploadAreaLabel')} />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto mb-4 text-slate-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
                {isDragActive ?
                  <p className="text-green-600">{t_noDynamic('drugIdentifierDropImageHere')}</p> :
                  <p className="text-slate-500 uppercase">{t_noDynamic('drugIdentifierDragOrClick')}</p>
                }
                <p className="text-xs mt-2 uppercase text-slate-400">{t('drugIdentifierImageConstraints', { maxSize: MAX_IMAGE_SIZE_MB })}</p>
              </div>

              {error && (
                <div className="border px-4 py-3 rounded-md bg-red-100/70 border-red-300 text-red-700 backdrop-blur-sm" role="alert">
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {imagePreviewUrl && uploadedImageFile && (
                <div className="p-3 rounded-lg bg-white/70 backdrop-blur-xs border border-slate-200/80">
                  <h3 className="text-lg font-medium uppercase text-slate-700 mb-2">{t_noDynamic('drugIdentifierImagePreviewAlt')}</h3>
                  <div className="relative group">
                    <img src={imagePreviewUrl} alt={t_noDynamic('drugIdentifierImagePreviewAlt')} className="w-full max-w-sm mx-auto h-auto object-contain rounded border border-slate-300/70" />
                    <button 
                      onClick={removeImage} 
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-md opacity-50 group-hover:opacity-100 transition-opacity"
                      title={t_noDynamic('drugIdentifierRemoveImageAlt')}
                      aria-label={t_noDynamic('drugIdentifierRemoveImageAlt')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
              
              <button
                onClick={handleAnalyze}
                disabled={!uploadedImageFile || isLoading}
                className="w-full p-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:bg-green-300/70 transition-colors uppercase"
              >
                {isLoading ? t_noDynamic('drugIdentifierButtonAnalyzing') : t_noDynamic('drugIdentifierButtonAnalyze')}
              </button>
            </>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="heartbeat-loader blue mb-3"> 
                <span></span><span></span><span></span>
              </div>
              <p className="text-lg uppercase text-slate-600 mb-3">{t_noDynamic('drugIdentifierButtonAnalyzing')}</p>
              {adDataLoading ? (
                <a href={adDataLoading.link} target="_blank" rel="noopener noreferrer">
                  <img
                    src={adDataLoading.image}
                    alt="Advertisement"
                    className="max-w-md mx-auto"
                    style={{ maxHeight: '50px' }}
                    onError={(e) => {
                      console.error('Image failed to load:', e);
                      setAdErrorLoading(t_noDynamic('adImageFailed'));
                    }}
                  />
                </a>
              ) : adErrorLoading && (
                <p className="text-sm text-red-500 text-center mb-6" role="alert">{adErrorLoading}</p>
              )}
            </div>
          )}

          {analysisResult && !isLoading && (
            <div className="mt-6 p-4 border rounded-lg bg-green-50/60 backdrop-blur-xs border-green-200/70">
              <h3 className={`text-xl font-semibold mb-3 uppercase ${analysisResult.wasIdentified ? 'text-green-700' : 'text-red-700'}`}>
                {analysisResult.wasIdentified ? t_noDynamic('drugInfoResultsTitle') : t_noDynamic('drugInfoErrorTitle')}
              </h3>
              {adDataResult ? (
                <a href={adDataResult.link} target="_blank" rel="noopener noreferrer">
                  <img
                    src={adDataResult.image}
                    alt="Advertisement"
                    className="w-full mb-4"
                    style={{ maxHeight: '60px' }}
                    onError={(e) => {
                      console.error('Image failed to load:', e);
                      setAdErrorResult(t_noDynamic('adImageFailed'));
                    }}
                  />
                </a>
              ) : adErrorResult && (
                <p className="text-sm text-red-500 text-center mb-6" role="alert">{adErrorResult}</p>
              )}
              <div className="text-sm text-slate-700 leading-relaxed">
                {formatDrugInfo(analysisResult.responseText)}
              </div>
            </div>
          )}
          
          {analysisResult && !isLoading && (
            <div className="mt-6 text-center">
              <button
                onClick={handleNewAnalysis}
                className="py-2 px-4 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition-colors uppercase text-sm shadow-md hover:shadow-lg transform hover:scale-105"
              >
                {t_noDynamic('drugIdentifierButtonNewAnalysis')}
              </button>
            </div>
          )}

          {error && !isLoading && !analysisResult && ( 
            <div className="border px-4 py-3 rounded-md bg-red-100/70 border-red-300 text-red-700 backdrop-blur-sm mt-4" role="alert">
              <p className="text-sm mb-2">{error}</p>
              {adDataError ? (
                <a href={adDataError.link} target="_blank" rel="noopener noreferrer">
                  <img
                    src={adDataError.image}
                    alt="Advertisement"
                    className="max-w-md mx-auto mt-2"
                    style={{ maxHeight: '50px' }}
                    onError={(e) => {
                      console.error('Image failed to load:', e);
                      setAdErrorError(t_noDynamic('adImageFailed'));
                    }}
                  />
                </a>
              ) : adErrorError && (
                <p className="text-sm text-red-500 text-center mb-6" role="alert">{adErrorError}</p>
              )}
            </div>
          )}
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