import React from 'react';

const PlayStoreIcon = (props: React.SVGProps<SVGSVGElement> & { title?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    {props.title && <title>{props.title}</title>}
    <path d="M3 20.517V3.483A2.5 2.5 0 014.653 1.2L16.117 11.1a2.002 2.002 0 010 3.8L4.653 24.8a2.5 2.5 0 01-1.653-2.283zM20.856 11.997L6.094 4.03l-.001 17.94 14.763-7.973z"/>
    <path d="M15.695 13.032l-2.807-1.501 2.635-2.575 4.545 2.51-.011.004-4.362 1.562zM20.044 9.86l-4.311-2.371L3.087 1.517 15.737 12l-3.005-2.928 7.312.791zM3.088 24.483l12.649-10.517-7.311.791 3.004-2.928-12.65 5.973.001.004zM15.704 12.968l4.351 1.562.012.004-4.546 2.51-2.634-2.575 2.813-1.501z"/>
  </svg>
);

export default PlayStoreIcon;