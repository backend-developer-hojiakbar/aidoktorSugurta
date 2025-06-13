import React from 'react';

const IdleTimerIcon = (props: React.SVGProps<SVGSVGElement> & { title?: string }) => (
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
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
    <path d="M12 6v6l4 2"/>
    <path d="M12 22v-2"/>
    <path d="M12 4V2"/>
    <path d="M5 12H3"/>
    <path d="M21 12h-2"/>
    <path d="M18.36 18.36l-1.41-1.41"/>
    <path d="M7.05 7.05l-1.41-1.41"/>
    <path d="M18.36 5.64l-1.41 1.41"/>
    <path d="M7.05 16.95l-1.41 1.41"/>
  </svg>
);

export default IdleTimerIcon;