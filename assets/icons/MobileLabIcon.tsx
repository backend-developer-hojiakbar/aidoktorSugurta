import React from 'react';

const MobileLabIcon = (props: React.SVGProps<SVGSVGElement> & { title?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {props.title && <title>{props.title}</title>}
    {/* Bus body */}
    <rect x="1" y="6" width="18" height="12" rx="2"></rect>
    {/* Wheels */}
    <circle cx="5.5" cy="18" r="2.5"></circle>
    <circle cx="14.5" cy="18" r="2.5"></circle>
    {/* Front of bus (simplified) */}
    <path d="M19 7h3v8h-3z"></path>
    {/* Medical cross on side */}
    <line x1="8" y1="10.5" x2="12" y2="10.5"></line> {/* Horizontal part of cross */}
    <line x1="10" y1="8.5" x2="10" y2="12.5"></line> {/* Vertical part of cross */}
     {/* Main side Window */}
    <rect x="3" y="8" width="4" height="3" rx="0.5"></rect>
  </svg>
);

export default MobileLabIcon;