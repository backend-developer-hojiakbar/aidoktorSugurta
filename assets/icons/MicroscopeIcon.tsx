import React from 'react';

const MicroscopeIcon = (props: React.SVGProps<SVGSVGElement> & { title?: string }) => ( 
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {props.title && <title>{props.title}</title>}
    <path d="M6 18H4a2 2 0 0 1-2-2v-5c0-1.1.9-2 2-2h2"></path>
    <path d="M6 9V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6"></path>
    <path d="M12 18V9.5c0-.8.7-1.5 1.5-1.5H16c.8 0 1.5.7 1.5 1.5V18"></path>
    <path d="M8 22h8"></path>
    <path d="M12 18v4"></path>
    <path d="m18.5 3.5-3 3"></path>
    <path d="m18.5 6.5-3-3"></path>
  </svg>
);

export default MicroscopeIcon;