import React from 'react';

const StethoscopeIcon = (props: React.SVGProps<SVGSVGElement> & { title?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5" // Adjusted stroke width for a slightly more delicate look
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {props.title && <title>{props.title}</title>}
    <path d="M4 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2.5" />
    <path d="M15.5 6a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v2.34c0 .38.2.73.5.94L11 12l-1.5 6.09A1.5 1.5 0 0 0 11 20h2a1.5 1.5 0 0 0 1.5-1.91L13 12l2-2.72c.3-.21.5-.56.5-.94V6Z" />
    <circle cx="12" cy="18" r="3" />
    <path d="M12 21v-3" />
    <path d="M12 6V2" />
    <path d="M7 6H5" />
    <path d="M19 6h-2" />
  </svg>
);

export default StethoscopeIcon;