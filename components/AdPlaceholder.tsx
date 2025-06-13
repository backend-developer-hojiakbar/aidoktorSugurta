


import React from 'react';

interface AdPlaceholderProps {
  adType: 'banner_320x50' | 'banner_320x100' | 'banner_468x60' | 'banner_728x90' | 'banner_300x250';
  className?: string;
  titleText?: string; // Optional custom title for the ad slot
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ adType, className, titleText }) => {
  let text = titleText || "Reklama Maydoni";
  let dimensions = "";
  let minHeightClass = "min-h-[50px]"; // Default min height

  switch (adType) {
    case 'banner_320x50': dimensions = "320x50"; minHeightClass = "min-h-[50px]"; break;
    case 'banner_320x100': dimensions = "320x100"; minHeightClass = "min-h-[100px]"; break;
    case 'banner_468x60': dimensions = "468x60"; minHeightClass = "min-h-[60px]"; break;
    case 'banner_728x90': dimensions = "728x90"; minHeightClass = "min-h-[90px]"; break;
    case 'banner_300x250': dimensions = "300x250 (MREC)"; minHeightClass = "min-h-[250px]"; break;
  }
  const fullText = `${text} (Taxminiy o'lcham: ${dimensions})`;

  return (
    <div 
      className={`flex items-center justify-center bg-slate-100/60 border border-dashed border-slate-300/70 rounded-lg p-4 my-6 text-center text-slate-400 text-xs sm:text-sm uppercase ${minHeightClass} ${className}`}
      aria-label="Reklama uchun ajratilgan joy"
      role="complementary" // Indicates a supporting section
    >
      {fullText}
    </div>
  );
};

export default AdPlaceholder;