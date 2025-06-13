import React from 'react';

const QrCodePlaceholderIcon = (props: React.SVGProps<SVGSVGElement> & { title?: string }) => {
  const {
    title,
    width = "100",
    height = "100",
    viewBox = "0 0 100 100",
    xmlns = "http://www.w3.org/2000/svg",
    ...otherProps // Renamed from restProps
  } = props;


  return (
    <svg width={width} height={height} viewBox={viewBox} xmlns={xmlns} {...otherProps}>
      {title && <title>{title}</title>}
      {/* Finder Patterns (main squares are currentColor, inner squares are white) */}
      <rect x="10" y="10" width="30" height="30" fill="currentColor"/>
      <rect x="15" y="15" width="20" height="20" fill="white"/>
      <rect x="20" y="20" width="10" height="10" fill="currentColor"/>

      <rect x="60" y="10" width="30" height="30" fill="currentColor"/>
      <rect x="65" y="15" width="20" height="20" fill="white"/>
      <rect x="70" y="20" width="10" height="10" fill="currentColor"/>


      <rect x="10" y="60" width="30" height="30" fill="currentColor"/>
      <rect x="15" y="65" width="20" height="20" fill="white"/>
      <rect x="20" y="70" width="10" height="10" fill="currentColor"/>

      {/* Simplified Alignment Pattern (often one smaller square) */}
      <rect x="65" y="65" width="15" height="15" fill="currentColor"/>
      <rect x="68" y="68" width="9" height="9" fill="white"/>
      <rect x="70.5" y="70.5" width="4" height="4" fill="currentColor"/>


      {/* Data modules (random dots to simulate QR - all currentColor) */}
      <rect x="45" y="10" width="5" height="5" fill="currentColor"/>
      <rect x="52" y="12" width="5" height="5" fill="currentColor"/>
      <rect x="12" y="45" width="5" height="5" fill="currentColor"/>
      <rect x="20" y="50" width="5" height="5" fill="currentColor"/>
      <rect x="30" y="42" width="5" height="5" fill="currentColor"/>
      <rect x="40" y="30" width="5" height="5" fill="currentColor"/>
      <rect x="50" y="40" width="5" height="5" fill="currentColor"/>
      <rect x="60" y="50" width="5" height="5" fill="currentColor"/>
      <rect x="70" y="40" width="5" height="5" fill="currentColor"/>
      <rect x="45" y="55" width="5" height="5" fill="currentColor"/>
      <rect x="55" y="45" width="5" height="5" fill="currentColor"/>
      <rect x="52" y="72" width="5" height="5" fill="currentColor"/>
      <rect x="40" y="80" width="5" height="5" fill="currentColor"/>
      <rect x="30" y="55" width="5" height="5" fill="currentColor"/>
      <rect x="48" y="48" width="10" height="10" fill="currentColor"/>
      <rect x="25" y="35" width="5" height="5" fill="currentColor"/>
      <rect x="35" y="25" width="5" height="5" fill="currentColor"/>
      <rect x="65" y="25" width="5" height="5" fill="currentColor"/>
      <rect x="75" y="35" width="5" height="5" fill="currentColor"/>
      <rect x="25" y="65" width="5" height="5" fill="currentColor"/>
      <rect x="35" y="75" width="5" height="5" fill="currentColor"/>
    </svg>
  );
};

export default QrCodePlaceholderIcon;