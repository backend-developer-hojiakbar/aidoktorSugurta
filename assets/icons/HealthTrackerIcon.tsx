import React from 'react';

const HealthTrackerIcon = (props: React.SVGProps<SVGSVGElement> & { title?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    {props.title && <title>{props.title}</title>}
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

export default HealthTrackerIcon;