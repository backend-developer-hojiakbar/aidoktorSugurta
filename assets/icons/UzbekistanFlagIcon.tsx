import React from 'react';

const UzbekistanFlagIcon = (props: React.SVGProps<SVGSVGElement> & { title?: string }) => (
  <svg viewBox="0 0 20 12" xmlns="http://www.w3.org/2000/svg" {...props}>
    {props.title && <title>{props.title}</title>}
    <defs>
      <clipPath id="uz-clip">
        <rect width="20" height="12" rx="1"/>
      </clipPath>
    </defs>
    <g clipPath="url(#uz-clip)">
      <rect width="20" height="12" fill="#1EB53A"/>
      <rect width="20" height="8" y="2" fill="#FFFFFF"/>
      <rect width="20" height="4" y="4" fill="#CE1126"/>
      <rect width="20" height="4" fill="#0072CE"/>
       {/* Simplified representation, full crescent and stars are complex for a quick add */}
      <circle cx="3.5" cy="2" r="1" fill="#fff"/>
    </g>
  </svg>
);

export default UzbekistanFlagIcon;