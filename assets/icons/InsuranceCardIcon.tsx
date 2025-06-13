import React from 'react';

const InsuranceCardIcon = (props: React.SVGProps<SVGSVGElement> & { title?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" // Slightly thinner for a more modern feel
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    {props.title && <title>{props.title}</title>}
    {/* Card shape */}
    <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
    {/* Line indicating a strip or section */}
    <line x1="2" y1="10" x2="22" y2="10" />
    {/* Small abstract health symbol (e.g., simplified cross or heart) */}
    <path d="M7 14h2m-1-1v2" /> 
    {/* Placeholder for a chip or logo */}
    <rect x="15" y="13" width="4" height="3" rx="0.5" />
  </svg>
);

export default InsuranceCardIcon;