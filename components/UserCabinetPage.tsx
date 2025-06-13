import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { User } from '@/types'; 
import UserIcon from '@/assets/icons/UserIcon';
import LogoutIcon from '@/assets/icons/LogoutIcon';
import HistoryIcon from '@/assets/icons/HistoryIcon';
import DocumentTextIcon from '@/assets/icons/DocumentTextIcon';
import PillIcon from '@/assets/icons/PillIcon';
import SettingsIcon from '@/assets/icons/SettingsIcon';
import AdPlaceholder from '@/components/AdPlaceholder';
import FeatureComingSoonModal from '@/components/FeatureComingSoonModal';
import InsuranceCardIcon from '@/assets/icons/InsuranceCardIcon'; // Yangi ikona

interface UserCabinetPageProps {
  currentUser: User | null;
  onLogout: () => void;
  onBack: () => void;
  onNavigateToGetInsurance: () => void; 
}

type CabinetSection = 'profile' | 'insurance' | 'diagnosisHistory' | 'analysisReports' | 'drugLookups' | 'settings' | 'myMedications';

const UserCabinetPage: React.FC<UserCabinetPageProps> = ({ currentUser, onLogout, onBack, onNavigateToGetInsurance }) => {
  const { t, t_noDynamic } = useTranslation();
  const [activeSection, setActiveSection] = useState<CabinetSection>('profile');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);

  const handleFeatureComingSoon = () => {
    setIsFeatureModalOpen(true);
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAccount = () => {
    setShowDeleteConfirm(false);
    handleFeatureComingSoon(); 
  };

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto p-6 md:p-10 shadow-2xl rounded-lg text-center bg-white/80 backdrop-blur-md text-slate-800">
        <p className="text-red-500">{t_noDynamic('userCabinetErrorUserNotFound')}</p>
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
      </div>
    );
  }
  
  const ProfileFieldDisplay: React.FC<{ labelKey: string; value?: string | null; placeholderKey?: string; isTextarea?: boolean }> = ({ labelKey, value, placeholderKey, isTextarea = false }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-500 mb-1">{t_noDynamic(labelKey)}:</label>
      {isTextarea ? (
        <textarea
          readOnly
          value={value || ''}
          placeholder={t_noDynamic(placeholderKey || 'compAnalysisNoAnswer')}
          className="w-full p-2.5 border rounded-lg outline-none border-slate-300/80 bg-purple-50/60 text-slate-700 placeholder-slate-400 min-h-[80px]"
          rows={3}
        />
      ) : (
        <input
          type="text"
          readOnly
          value={value || ''}
          placeholder={t_noDynamic(placeholderKey || 'compAnalysisNoAnswer')}
          className="w-full p-2.5 border rounded-lg outline-none border-slate-300/80 bg-purple-50/60 text-slate-700 placeholder-slate-400"
        />
      )}
    </div>
  );


  const renderSectionContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-purple-600 uppercase">{t_noDynamic('userCabinetProfileSectionTitle')}</h3>
            <div className="bg-purple-50/50 backdrop-blur-xs p-4 sm:p-6 rounded-lg shadow border border-purple-200/70">
              <ProfileFieldDisplay labelKey="userCabinetProfileUsername" value={currentUser.username} placeholderKey="compAnalysisNoAnswer" />
              <ProfileFieldDisplay labelKey="userCabinetProfileEmail" value={currentUser.email} placeholderKey="compAnalysisNoAnswer" />
              <ProfileFieldDisplay labelKey="userCabinetProfileFullName" value={currentUser.fullName} placeholderKey="comingSoonText"/>
              <ProfileFieldDisplay labelKey="userCabinetProfileDob" value={currentUser.dob} placeholderKey="comingSoonText"/>
              <ProfileFieldDisplay labelKey="userCabinetProfileGender" value={currentUser.gender} placeholderKey="comingSoonText"/>
              <ProfileFieldDisplay labelKey="userCabinetProfilePhone" value={currentUser.phone} placeholderKey="comingSoonText"/>
              <ProfileFieldDisplay labelKey="userCabinetProfileAllergies" value={currentUser.allergies} placeholderKey="userCabinetProfileAllergiesPlaceholder" isTextarea />
              <ProfileFieldDisplay labelKey="userCabinetProfileChronicDiseases" value={currentUser.chronicDiseases} placeholderKey="userCabinetProfileChronicDiseasesPlaceholder" isTextarea />
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button onClick={handleFeatureComingSoon} className="flex-1 py-2.5 px-4 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-md transition-colors uppercase text-sm">
                    {t_noDynamic('userCabinetProfileEditButton')}
                </button>
                <button onClick={handleFeatureComingSoon} className="flex-1 py-2.5 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-colors uppercase text-sm">
                    {t_noDynamic('userCabinetProfileChangePasswordButton')}
                </button>
            </div>
          </div>
        );
      case 'insurance':
        return (
            <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-purple-600 uppercase">{t_noDynamic('userCabinetInsuranceSectionTitle')}</h3>
                <div className="bg-purple-50/50 backdrop-blur-xs p-4 sm:p-6 rounded-lg shadow border border-purple-200/70">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-500 mb-1">{t_noDynamic('userCabinetInsuranceStatus')}:</label>
                        <p className={`w-full p-2.5 border rounded-lg outline-none border-slate-300/80 text-slate-700 placeholder-slate-400 ${currentUser.hasInsurance ? 'bg-green-100/70' : 'bg-red-100/70'}`}>
                            {currentUser.hasInsurance ? t_noDynamic('userCabinetInsuranceStatusActive') : t_noDynamic('userCabinetInsuranceStatusInactive')}
                        </p>
                    </div>
                    {currentUser.hasInsurance && (
                        <ProfileFieldDisplay labelKey="userCabinetInsuranceNumber" value={currentUser.insuranceNumber} placeholderKey="userCabinetInsuranceNoNumber" />
                    )}
                </div>
                <button 
                    onClick={!currentUser.hasInsurance ? onNavigateToGetInsurance : handleFeatureComingSoon} 
                    className="w-full py-2.5 px-4 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-md transition-colors uppercase text-sm"
                >
                    {!currentUser.hasInsurance ? t_noDynamic('getInsuranceButtonModal') : t_noDynamic('userCabinetAddInsuranceButton')}
                </button>
            </div>
        );
      // Other cases (diagnosisHistory, analysisReports, etc.)
      case 'diagnosisHistory':
      case 'analysisReports':
      case 'drugLookups':
      case 'myMedications':
      case 'settings':
      default:
        return (
          <div className="text-center py-10">
            <h3 className="text-2xl font-semibold text-purple-600 uppercase mb-4">
              {activeSection === 'diagnosisHistory' ? t_noDynamic('userCabinetDiagnosisHistoryTitle') :
               activeSection === 'analysisReports' ? t_noDynamic('userCabinetAnalysisReportsTitle') :
               activeSection === 'drugLookups' ? t_noDynamic('userCabinetDrugLookupsTitle') :
               activeSection === 'myMedications' ? t_noDynamic('userCabinetMyMedications') :
               t_noDynamic('userCabinetSettingsTitle')}
            </h3>
            <p className="text-slate-500 animate-fadeInOut">{t_noDynamic('featureComingSoonShort')}</p>
            <AdPlaceholder adType="banner_320x100" className="max-w-xs mx-auto mt-4" titleText={t_noDynamic('adPlaceholderCabinetSection')} />
          </div>
        );
    }
  };

  const navItems = [
    { id: 'profile', labelKey: 'userCabinetNavProfile', icon: <UserIcon className="w-5 h-5 mr-2" /> },
    { id: 'insurance', labelKey: 'userCabinetNavInsurance', icon: <InsuranceCardIcon className="w-5 h-5 mr-2" /> },
    { id: 'myMedications', labelKey: 'userCabinetMyMedications', icon: <PillIcon className="w-5 h-5 mr-2" /> },
    { id: 'diagnosisHistory', labelKey: 'userCabinetNavDiagnosisHistory', icon: <HistoryIcon className="w-5 h-5 mr-2" /> },
    { id: 'analysisReports', labelKey: 'userCabinetNavAnalysisReports', icon: <DocumentTextIcon className="w-5 h-5 mr-2" /> },
    { id: 'drugLookups', labelKey: 'userCabinetNavDrugLookups', icon: <PillIcon className="w-5 h-5 mr-2" /> }, // Reusing PillIcon or create specific
    { id: 'settings', labelKey: 'userCabinetNavSettings', icon: <SettingsIcon className="w-5 h-5 mr-2" /> },
  ];

  return (
    <>
      <div className="max-w-5xl mx-auto p-4 md:p-8 shadow-2xl rounded-lg bg-gradient-to-br from-purple-50/80 via-fuchsia-50/70 to-pink-50/60 backdrop-blur-md text-slate-800">
        <div className="flex flex-col items-center mb-8">
          <UserIcon className="w-20 h-20 text-purple-500 mb-3" title={t_noDynamic('userCabinetUserIconTitle')} />
          <h2 className="text-3xl font-bold uppercase text-slate-800">{t_noDynamic('userCabinetTitle')}</h2>
          <p className="text-lg text-slate-600">{t('userCabinetWelcome', { username: currentUser.username })}</p>
        </div>

        <div className="md:flex md:space-x-8">
          {/* Navigation Panel (Sidebar on md+) */}
          <aside className="md:w-1/4 mb-8 md:mb-0">
            <nav className="space-y-2">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as CabinetSection)}
                  className={`w-full flex items-center py-2.5 px-4 rounded-md text-left transition-colors text-sm font-medium
                              ${activeSection === item.id 
                                ? 'bg-purple-500 text-white shadow-md' 
                                : 'text-slate-700 hover:bg-purple-100/80 hover:text-purple-700'}`}
                >
                  {item.icon}
                  {t_noDynamic(item.labelKey)}
                </button>
              ))}
            </nav>
            <AdPlaceholder adType="banner_300x250" className="w-full mt-6 hidden md:block" titleText={t_noDynamic('adPlaceholderCabinetSection')} />
          </aside>

          {/* Main Content Area */}
          <main className="md:w-3/4">
            {renderSectionContent()}
             <AdPlaceholder adType="banner_468x60" className="w-full mt-6 md:hidden" titleText={t_noDynamic('adPlaceholderCabinetSection')} />
          </main>
        </div>

         <div className="mt-10 pt-6 border-t border-purple-200/80 flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
                onClick={handleDeleteAccount}
                className="py-2 px-4 bg-red-100 hover:bg-red-200 text-red-600 font-medium rounded-md transition-colors uppercase text-xs border border-red-300/70"
            >
                {t_noDynamic('userCabinetSettingsDeleteAccountButton')} (Tez kunda)
            </button>
            <button
                onClick={onLogout}
                className="py-2.5 px-6 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors uppercase text-sm flex items-center"
            >
                <LogoutIcon className="w-5 h-5 mr-2" />
                {t_noDynamic('userCabinetLogoutButton')}
            </button>
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

      {isFeatureModalOpen && (
        <FeatureComingSoonModal 
            isOpen={isFeatureModalOpen} 
            onClose={() => setIsFeatureModalOpen(false)}
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeInScaleUp" role="dialog" aria-modal="true" aria-labelledby="deleteConfirmTitle">
            <div className="bg-white/95 p-6 rounded-xl shadow-2xl max-w-sm w-full text-center">
                <h2 id="deleteConfirmTitle" className="text-lg font-semibold text-red-600 mb-3">{t_noDynamic('confirmAction')}</h2>
                <p className="text-slate-600 mb-6 text-sm">{t_noDynamic('deleteAccountConfirmation')}</p>
                <div className="flex justify-around">
                    <button onClick={() => setShowDeleteConfirm(false)} className="py-2 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md text-sm uppercase">{t_noDynamic('cancelButton')}</button>
                    <button onClick={confirmDeleteAccount} className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm uppercase">{t_noDynamic('confirmButton')}</button>
                </div>
            </div>
        </div>
      )}
    </>
  );
};

export default UserCabinetPage;