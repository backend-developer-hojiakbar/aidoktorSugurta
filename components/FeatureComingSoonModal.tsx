
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface FeatureComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

const FeatureComingSoonModal: React.FC<FeatureComingSoonModalProps> = ({ 
  isOpen, 
  onClose,
  title,
  message 
}) => {
  const { t_noDynamic } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeInScaleUp" role="dialog" aria-modal="true" aria-labelledby="featureComingSoonTitle">
      <div className="bg-slate-800/95 backdrop-blur-sm p-6 md:p-8 rounded-lg shadow-2xl max-w-md w-full text-center max-h-[90vh] overflow-y-auto custom-scrollbar">
        <h2 id="featureComingSoonTitle" className="text-xl font-bold text-sky-400 mb-4 uppercase">
          {title || t_noDynamic('featureComingSoonTitle')}
        </h2>
        <p className="text-gray-300 mb-6 text-sm">
          {message || t_noDynamic('featureComingSoonMessage')}
        </p>
        <button
          onClick={onClose}
          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors uppercase"
          aria-label={t_noDynamic('closeButtonAriaLabel')} 
        >
          {t_noDynamic('closeButtonCap')}
        </button>
      </div>
    </div>
  );
};

export default FeatureComingSoonModal;
