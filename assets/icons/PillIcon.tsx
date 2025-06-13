import React from 'react';

const PillIcon = (props: React.SVGProps<SVGSVGElement> & { title?: string }) => ( 
  <svg 
    viewBox="0 0 64 64"
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {props.title && <title>{props.title}</title>}
    {/* Simple Capsule Shape */}
    <path d="M44,12H20A12,12,0,0,0,20,36H44A12,12,0,0,0,44,12Zm0,18H20A6,6,0,0,1,20,18H44A6,6,0,0,1,44,30Z" transform="rotate(45 32 32)"/>
  </svg>
);

export default PillIcon;