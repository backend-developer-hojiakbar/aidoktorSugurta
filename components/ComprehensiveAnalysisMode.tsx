import React, { useState, useCallback, useEffect } from 'react';
import { FileType } from '@/types'; 
import AnalysisChart from '@/components/AnalysisChart'; 
import AdPlaceholder from '@/components/AdPlaceholder';
import { analyzeDocumentsWithAI } from '@/services/aiService';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from '@/hooks/useTranslation';

const MAX_FILE_SIZE_MB = 10;
const MAX_TOTAL_SIZE_MB = 50;
const MAX_FILES_COUNT = 10;

const ComprehensiveAnalysisMode = ({ onBack }) => {
  const { t, t_noDynamic } = useTranslation();

  const getInitialQuestions = useCallback(() => ({
    [t_noDynamic('compAnalysisQ1Key')]: "",
    [t_noDynamic('compAnalysisQ2Key')]: "",
    [t_noDynamic('compAnalysisQ3Key')]: "",
    [t_noDynamic('compAnalysisQ4Key')]: ""
  }), [t_noDynamic]);

  const getQuestionPrompts = useCallback(() => ({
     [t_noDynamic('compAnalysisQ1Key')]: t_noDynamic('compAnalysisQ1Prompt'),
     [t_noDynamic('compAnalysisQ2Key')]: t_noDynamic('compAnalysisQ2Prompt'),
     [t_noDynamic('compAnalysisQ3Key')]: t_noDynamic('compAnalysisQ3Prompt'),
     [t_noDynamic('compAnalysisQ4Key')]: t_noDynamic('compAnalysisQ4Prompt'),
  }), [t_noDynamic]);


  const [uploadedFiles, setUploadedFiles] = useState([]); 
  const [analysisReport, setAnalysisReport] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);
  
  const [clarifyingQuestions, setClarifyingQuestions] = useState(getInitialQuestions()); 
  const [questionPrompts, setQuestionPrompts] = useState(getQuestionPrompts()); 

  useEffect(() => {
    setClarifyingQuestions(getInitialQuestions());
    setQuestionPrompts(getQuestionPrompts());
  }, [getInitialQuestions, getQuestionPrompts]);


  const [currentStep, setCurrentStep] = useState('upload');
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [fileErrors, setFileErrors] = useState([]); 

  const onDrop = useCallback((acceptedFiles, fileRejections) => { 
    setFileErrors([]);
    let currentTotalSize = uploadedFiles.reduce((sum, uf) => sum + uf.file.size, 0);
    const newFiles = [];
    const currentErrors = [];

    fileRejections.forEach(rejection => {
        rejection.errors.forEach((err) => {
            if (err.code === "file-too-large") {
                currentErrors.push(t('compAnalysisFileTooLargeError', { fileName: rejection.file.name, maxSize: MAX_FILE_SIZE_MB }));
            } else if (err.code === "file-invalid-type") {
                currentErrors.push(t('compAnalysisFileInvalidTypeError', { fileName: rejection.file.name }));
            } else {
                currentErrors.push(t('compAnalysisFileGenericError', { fileName: rejection.file.name, message: err.message }));
            }
        });
    });

    acceptedFiles.forEach(file => {
      if (uploadedFiles.length + newFiles.length >= MAX_FILES_COUNT) {
        currentErrors.push(t('compAnalysisMaxFilesError', { maxFiles: MAX_FILES_COUNT }));
        return; 
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        currentErrors.push(t('compAnalysisFileTooLargeError', { fileName: file.name, maxSize: MAX_FILE_SIZE_MB }));
        return; 
      }
      if (currentTotalSize + file.size > MAX_TOTAL_SIZE_MB * 1024 * 1024) {
        currentErrors.push(t('compAnalysisTotalSizeError', { totalSize: MAX_TOTAL_SIZE_MB }));
        return; 
      }
      
      const newFile = { 
        id: `${file.name}-${Date.now()}`,
        file,
        type: FileType.OtherMedicalDocument, 
        previewUrl: undefined
      };
      if (file.type.startsWith('image/')) {
        newFile.previewUrl = URL.createObjectURL(file);
      }
      newFiles.push(newFile);
      currentTotalSize += file.size;
    });
    
    if (newFiles.length > 0) {
       setUploadedFiles(prev => [...prev, ...newFiles]);
    }
    if (currentErrors.length > 0) {
        setFileErrors(currentErrors);
    }
  }, [uploadedFiles, t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/heic': ['.heic'],
      'image/bmp': ['.bmp'],
      'image/webp': ['.webp'],
      'text/plain': ['.txt'] 
    },
    maxSize: MAX_FILE_SIZE_MB * 1024 * 1024,
  });

  const removeFile = (id) => { 
    const removedFile = uploadedFiles.find(f => f.id === id);
    if (removedFile?.previewUrl) {
        URL.revokeObjectURL(removedFile.previewUrl);
    }
    setUploadedFiles(files => files.filter(file => file.id !== id));
  };

  const handleFileTypeChange = (id, type) => { 
    setUploadedFiles(files => files.map(file => file.id === id ? { ...file, type } : file));
  };

  const handleProceedToQuestions = () => {
    if (uploadedFiles.length === 0) {
      setFileErrors([t_noDynamic('compAnalysisUploadAtLeastOneError')]);
      return;
    }
    if (!privacyConsent) {
        setFileErrors([t_noDynamic('compAnalysisConsentError')]);
        return;
    }
    setFileErrors([]);
    setCurrentStep('questions');
  };
  
  const handleQuestionChange = (key, value) => { 
    setClarifyingQuestions(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmitAnalysis = async () => {
    setIsLoading(true);
    setAnalysisReport(null);
    setFileErrors([]); 
    try {
      const report = await analyzeDocumentsWithAI(uploadedFiles, clarifyingQuestions);
      setAnalysisReport(report); 
      setCurrentStep('report');
    } catch (error) {
      console.error("Error analyzing documents:", error);
      setFileErrors(prevErrors => [...prevErrors, t('compAnalysisGenericErrorEncountered', { message: error.message || t_noDynamic('compAnalysisUnknownError') })]);
      setCurrentStep('report'); 
    } finally {
      setIsLoading(false);
    }
  };
  
  const exportToPDF = () => {
      alert(t_noDynamic('exportPdfComingSoon'));
  };

  useEffect(() => {
    return () => {
        uploadedFiles.forEach(file => {
            if (file.previewUrl) {
                URL.revokeObjectURL(file.previewUrl);
            }
        });
    };
  }, [uploadedFiles]);

  const fileTypeOptions = Object.entries(FileType).map(([key, value]) => ({ value: value, label: t_noDynamic(value) || value }));


  return (
    <>
      <div className="max-w-4xl mx-auto p-4 md:p-8 shadow-2xl rounded-lg bg-gradient-to-br from-sky-50/80 via-purple-50/70 to-emerald-50/60 backdrop-blur-md text-slate-800">
        <h2 className="text-3xl font-bold text-center mb-8 uppercase text-slate-800">{t_noDynamic('compAnalysisTitle')}</h2>

        {currentStep === 'upload' && (
          <div className="space-y-6">
            <AdPlaceholder 
              adType="banner_468x60" 
              className="w-full"
              titleText={t_noDynamic('adPlaceholderUploadStep')} 
            />
            <div 
              {...getRootProps()} 
              className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
                          ${isDragActive ? 'border-sky-500 bg-sky-100/80' : 'border-sky-300/70 hover:border-sky-400/80 bg-sky-100/60'}`}
            >
              <input {...getInputProps()} aria-label={t_noDynamic('compAnalysisFileUploadAreaLabel')} />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto mb-4 text-slate-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              {isDragActive ?
                <p className="text-sky-600">{t_noDynamic('compAnalysisDropFilesHere')}</p> :
                <p className="text-slate-500 uppercase">{t_noDynamic('compAnalysisDragOrClick')}</p>
              }
              <p className="text-xs mt-2 uppercase text-slate-400">{t('compAnalysisFileConstraints', {maxSize: MAX_FILE_SIZE_MB, totalSize: MAX_TOTAL_SIZE_MB, maxFiles: MAX_FILES_COUNT })}</p>
            </div>
            
            {fileErrors.length > 0 && (
              <div className="border px-4 py-3 rounded-md space-y-1 bg-red-100/70 border-red-300 text-red-700 backdrop-blur-sm">
                {fileErrors.map((err, idx) => <p key={idx} className="text-sm" role="alert">{err}</p>)}
              </div>
            )}

            {uploadedFiles.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-medium uppercase text-slate-700">{t_noDynamic('compAnalysisUploadedDocsTitle')}</h3>
                {uploadedFiles.map((uploadedFile) => (
                  <div key={uploadedFile.id} className="flex items-center justify-between p-3 rounded-lg gap-2 bg-white/70 backdrop-blur-xs border border-slate-200/80">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      {uploadedFile.previewUrl && (
                          <img src={uploadedFile.previewUrl} alt={t('compAnalysisFilePreviewAlt', {fileName: uploadedFile.file.name})} className="w-12 h-12 object-cover rounded flex-shrink-0 border border-slate-300/70" />
                      )}
                      {!uploadedFile.previewUrl && (
                          <div className="w-12 h-12 rounded flex items-center justify-center flex-shrink-0 bg-slate-200/70 border border-slate-300/70" aria-label={t_noDynamic('compAnalysisFileIconLabel')}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-500">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                          </div>
                      )}
                      <span className="text-sm truncate text-slate-600" title={uploadedFile.file.name}>{uploadedFile.file.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <select 
                          value={uploadedFile.type} 
                          onChange={(e) => handleFileTypeChange(uploadedFile.id, e.target.value)}
                          className="text-xs rounded-lg focus:ring-sky-500 focus:border-sky-500 p-1.5 outline-none w-full max-w-[200px] md:max-w-[250px] bg-white/90 border-slate-300/80 text-slate-700"
                          title={t_noDynamic('compAnalysisFileTypeSelectTitle')}
                          aria-label={t('compAnalysisFileTypeSelectAriaLabel', {fileName: uploadedFile.file.name})}
                      >
                          {fileTypeOptions.map(fto => <option key={fto.value} value={fto.value}>{fto.label}</option>)}
                      </select>
                      <button onClick={() => removeFile(uploadedFile.id)} className="text-red-500 hover:text-red-600 p-1" title={t('compAnalysisRemoveFileTitle', {fileName: uploadedFile.file.name})} aria-label={t('compAnalysisRemoveFileAriaLabel', {fileName: uploadedFile.file.name})}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.24.03 3.22.077m3.908 0l-1.002-1.001M12 4.5M12 4.5l-1.002-1.001M12 4.5M12 4.5l1.002 1.001M7.5 4.5M7.5 4.5l-1.001-1.001M7.5 4.5M7.5 4.5l1.001 1.001m-2.5-2.419A2.25 2.25 0 007.5 2.25h9A2.25 2.25 0 0016.5 4.5v.001" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6">
                  <label htmlFor="privacyConsent" className="flex items-center space-x-2 text-sm cursor-pointer text-slate-600">
                      <input 
                          type="checkbox" 
                          id="privacyConsent"
                          checked={privacyConsent}
                          onChange={(e) => setPrivacyConsent(e.target.checked)}
                          className="h-4 w-4 rounded text-sky-600 focus:ring-sky-500 border-slate-400/80 bg-white/80"
                          aria-describedby="privacyDesc"
                      />
                      <span id="privacyDesc" className="uppercase">{t_noDynamic('compAnalysisConsentText')} (<a href="#" onClick={(e) => {e.preventDefault(); alert(t_noDynamic('privacyPolicyPopupComingSoon'))}} className="underline text-sky-600 hover:text-sky-700">{t_noDynamic('privacyPolicyLink')}</a>).</span>
                  </label>
              </div>

            <button
              onClick={handleProceedToQuestions}
              disabled={uploadedFiles.length === 0 || isLoading || !privacyConsent}
              className="w-full p-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:bg-sky-300/70 transition-colors uppercase"
              aria-live="polite"
            >
              {isLoading ? t_noDynamic('compAnalysisLoadingButton') : t_noDynamic('compAnalysisNextStepButton')}
            </button>
            <p className="text-xs mt-2 text-center uppercase text-slate-500">
              {t_noDynamic('compAnalysisQualityDisclaimer')}
            </p>
          </div>
        )}

        {currentStep === 'questions' && (
          <div className="space-y-6 bg-white/70 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 uppercase text-slate-800">{t_noDynamic('compAnalysisQuestionsTitle')}</h3>
              <AdPlaceholder 
                adType="banner_468x60" 
                className="w-full"
                titleText={t_noDynamic('adPlaceholderQuestionsStep')}
              />
              {Object.entries(questionPrompts).map(([key, promptText]) => (
                  <div key={key} className="mb-4">
                      <label htmlFor={key} className="block text-sm font-medium mb-1 text-slate-600">{promptText}</label>
                      <textarea
                      id={key}
                      rows={3}
                      value={clarifyingQuestions[key] || ''} 
                      onChange={(e) => handleQuestionChange(key, e.target.value)}
                      placeholder={t_noDynamic('compAnalysisAnswerPlaceholder')}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none border-slate-300/80 bg-white/90 text-slate-800 placeholder-slate-400"
                      aria-label={promptText}
                      />
                  </div>
              ))}
              <p className="text-xs uppercase text-slate-500">{t_noDynamic('compAnalysisQuestionsNote')}</p>
              {fileErrors.length > 0 && ( 
                <div className="border px-4 py-3 rounded-md space-y-1 bg-red-100/70 border-red-300 text-red-700 backdrop-blur-sm">
                  {fileErrors.map((err, idx) => <p key={idx} className="text-sm" role="alert">{err}</p>)}
                </div>
              )}
              <button
                  onClick={handleSubmitAnalysis}
                  disabled={isLoading}
                  className="w-full p-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:bg-green-300/70 transition-colors uppercase"
                  aria-live="polite"
              >
                  {isLoading ? t_noDynamic('compAnalysisAnalyzingButton') : t_noDynamic('compAnalysisSubmitButton')}
              </button>
              <button
                  onClick={() => {setCurrentStep('upload'); setFileErrors([]);}}
                  className="w-full mt-2 p-3 font-semibold rounded-lg transition-colors uppercase bg-slate-200/80 hover:bg-slate-300/90 text-slate-700 border border-slate-300/80"
                  aria-label={t_noDynamic('compAnalysisBackToUploadAriaLabel')}
              >
                  {t_noDynamic('compAnalysisBackToUploadButton')}
              </button>
          </div>
        )}

        {currentStep === 'report' && analysisReport && (
          <div className="space-y-6 text-slate-700">
            <h3 className="text-2xl font-bold text-center mb-6 uppercase text-green-600">{t_noDynamic('compAnalysisReportTitle')}</h3>
            <AdPlaceholder 
                adType="banner_728x90" 
                className="w-full"
                titleText={t_noDynamic('adPlaceholderReportStep')}
            />
            <div>
              <h4 className="text-xl font-semibold mb-2 border-b pb-1 uppercase text-sky-600 border-slate-300/80">{t_noDynamic('compAnalysisSummaryTitle')}</h4>
              <p className="p-4 rounded-md whitespace-pre-wrap text-sm bg-sky-50/60 backdrop-blur-xs border border-sky-200/70">{analysisReport.summary}</p>
            </div>

            {analysisReport.keyFindings && analysisReport.keyFindings.length > 0 && (
              <div>
                <h4 className="text-xl font-semibold mb-2 border-b pb-1 uppercase text-amber-600 border-slate-300/80">{t_noDynamic('compAnalysisKeyFindingsTitle')}</h4>
                <ul className="list-disc list-inside space-y-2 p-4 rounded-md bg-amber-50/60 backdrop-blur-xs border border-amber-200/70">
                  {analysisReport.keyFindings.map((finding, index) => (
                    <li key={index} className="whitespace-pre-wrap text-sm">{finding}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysisReport.labResults && analysisReport.labResults.length > 0 && (
              <AnalysisChart data={analysisReport.labResults} />
            )}
            
            {analysisReport.riskFactors && analysisReport.riskFactors.length > 0 && (
            <div>
              <h4 className="text-xl font-semibold mb-2 border-b pb-1 uppercase text-red-600 border-slate-300/80">{t_noDynamic('compAnalysisRiskFactorsTitle')}</h4>
              <ul className="list-disc list-inside space-y-1 p-4 rounded-md bg-red-50/60 backdrop-blur-xs border border-red-200/70">
                {analysisReport.riskFactors.map((factor, index) => (
                  <li key={index} className="whitespace-pre-wrap text-sm">{factor}</li>
                ))}
              </ul>
            </div>
            )}

            {analysisReport.recommendations && analysisReport.recommendations.length > 0 && (
            <div>
              <h4 className="text-xl font-semibold mb-2 border-b pb-1 uppercase text-yellow-600 border-slate-300/80">{t_noDynamic('compAnalysisRecommendationsTitle')}</h4>
              <ul className="list-decimal list-inside space-y-2 p-4 rounded-md bg-yellow-50/60 backdrop-blur-xs border border-yellow-200/70">
                {analysisReport.recommendations.map((rec, index) => (
                  <li key={index} className="whitespace-pre-wrap text-sm">{rec}</li>
                ))}
              </ul>
            </div>
            )}
            
            <div className="mt-6 p-4 border rounded-md border-yellow-400/80 bg-yellow-100/50 backdrop-blur-sm bg-opacity-70">
              <p className="text-sm font-semibold uppercase text-yellow-700">{t_noDynamic('compAnalysisDisclaimerTitle')}</p>
              <p className="text-xs whitespace-pre-wrap text-yellow-600">{analysisReport.disclaimer}</p>
            </div>

            <div className="mt-8 p-6 rounded-lg shadow-xl text-white bg-gradient-to-r from-sky-400 to-blue-400">
              <h4 className="text-xl font-semibold mb-3 text-center uppercase">{t_noDynamic('compAnalysisContactCallCenterTitle')}</h4>
              <p className="text-sm mb-4 text-center text-sky-50" dangerouslySetInnerHTML={{__html: t_noDynamic('compAnalysisContactCallCenterText')}} />
              <a 
                href="tel:+998732000073" 
                className="block w-full max-w-xs mx-auto text-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 uppercase"
                aria-label={t_noDynamic('compAnalysisCallButtonAriaLabel')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 inline-block mr-2 align-middle">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                +998 73 200 00 73
              </a>
            </div>
            <div className="flex space-x-4 mt-8">
              <button
                  onClick={exportToPDF}
                  className="flex-1 p-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg transition-colors uppercase"
                  aria-label={t_noDynamic('compAnalysisExportPdfAriaLabel')}
              >
                  {t_noDynamic('compAnalysisExportPdfButton')}
              </button>
              <button
                  onClick={() => { 
                      setCurrentStep('upload'); 
                      setAnalysisReport(null); 
                      setUploadedFiles([]); 
                      setPrivacyConsent(false);
                      setFileErrors([]);
                      setClarifyingQuestions(getInitialQuestions());
                  }}
                  className="flex-1 p-3 font-semibold rounded-lg transition-colors uppercase bg-slate-200/80 hover:bg-slate-300/90 text-slate-700 border border-slate-300/80"
                  aria-label={t_noDynamic('compAnalysisNewAnalysisAriaLabel')}
              >
                  {t_noDynamic('compAnalysisNewAnalysisButton')}
              </button>
            </div>
          </div>
        )}
        {currentStep === 'report' && !analysisReport && !isLoading && (
              <div className="text-center py-10">
                  <p className="text-xl mb-4 uppercase text-red-500" role="alert">{t_noDynamic('compAnalysisReportError')}</p>
                   <AdPlaceholder 
                    adType="banner_320x100" 
                    className="max-w-md mx-auto mb-4"
                    titleText={t_noDynamic('adPlaceholderErrorView')}
                  />
                  {fileErrors.length > 0 && (
                      <div className="border px-4 py-3 rounded-md space-y-1 mb-4 max-w-md mx-auto bg-red-100/70 border-red-300 text-red-700 backdrop-blur-sm">
                          <p className="font-semibold uppercase">{t_noDynamic('compAnalysisErrorDetailsTitle')}</p>
                          {fileErrors.map((err, idx) => <p key={idx} className="text-sm">{err}</p>)}
                      </div>
                  )}
                  <button
                      onClick={() => { 
                          setCurrentStep('questions'); 
                          setFileErrors([]); 
                      }}
                      className="p-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition-colors uppercase"
                      aria-label={t_noDynamic('compAnalysisRetryButtonAriaLabel')}
                  >
                      {t_noDynamic('compAnalysisRetryButton')}
                  </button>
                  <button
                      onClick={() => { 
                          setCurrentStep('upload'); 
                          setAnalysisReport(null); 
                          setUploadedFiles([]); 
                          setPrivacyConsent(false);
                          setFileErrors([]);
                          setClarifyingQuestions(getInitialQuestions());
                      }}
                      className="ml-4 p-3 font-semibold rounded-lg transition-colors uppercase bg-slate-200/80 hover:bg-slate-300/90 text-slate-700 border border-slate-300/80"
                      aria-label={t_noDynamic('compAnalysisStartOverAriaLabel')}
                  >
                      {t_noDynamic('compAnalysisStartOverButton')}
                  </button>
              </div>
          )}
          {isLoading && currentStep === 'report' && (
              <div className="flex flex-col items-center justify-center py-10">
                  <div className="heartbeat-loader blue mb-3">
                    <span></span><span></span><span></span>
                  </div>
                  <p className="text-lg uppercase text-slate-600">{t_noDynamic('compAnalysisAiAnalyzingDocs')}</p>
                  <AdPlaceholder 
                    adType="banner_320x100" 
                    className="max-w-md mx-auto mt-2"
                    titleText={t_noDynamic('adPlaceholderLoadingView')} 
                    />
                  <p className="text-sm uppercase text-slate-500">{t_noDynamic('compAnalysisWaitMessage')}</p>
              </div>
          )}
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

export default ComprehensiveAnalysisMode;