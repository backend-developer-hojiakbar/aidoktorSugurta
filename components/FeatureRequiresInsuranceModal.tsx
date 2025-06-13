import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import InsuranceCardIcon from '@/assets/icons/InsuranceCardIcon';

interface FeatureRequiresInsuranceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddInsurance: () => void; // Navigates to UserCabinet or GetInsurance page to add existing insurance
  onGetInsurance: () => void;  // Navigates to GetInsuranceMode to learn about new insurance
}

const FeatureRequiresInsuranceModal: React.FC<FeatureRequiresInsuranceModalProps> = ({ 
  isOpen, 
  onClose,
  onAddInsurance,
  onGetInsurance
}) => {
  const { t_noDynamic } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeInScaleUp" role="dialog" aria-modal="true" aria-labelledby="insuranceRequiredTitle">
      <div className="bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-xl shadow-2xl max-w-md w-full text-center max-h-[90vh] overflow-y-auto custom-scrollbar text-slate-800">
        <div className="flex justify-center mb-4">
            <InsuranceCardIcon className="w-12 h-12 text-red-500" title={t_noDynamic('attentionTitle')} />
        </div>
        <h2 id="insuranceRequiredTitle" className="text-xl font-bold text-red-600 mb-3 uppercase">
          {t_noDynamic('featureRequiresInsuranceTitle')}
        </h2>
        <p className="text-slate-600 mb-6 text-sm">
          {t_noDynamic('featureRequiresInsuranceMessage')}
        </p>
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:space-x-3">
            <button
            onClick={onAddInsurance} // This might navigate to UserCabinet or GetInsuranceMode
            className="flex-1 py-2.5 px-5 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition-colors uppercase"
            >
            {t_noDynamic('addInsuranceButtonModal')}
            </button>
            <button
            onClick={onGetInsurance}
            className="flex-1 py-2.5 px-5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors uppercase"
            >
            {t_noDynamic('getInsuranceButtonModal')}
            </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 px-5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors uppercase text-sm"
        >
          {t_noDynamic('cancelButton')}
        </button>
      </div>
    </div>
  );
};

export default FeatureRequiresInsuranceModal;