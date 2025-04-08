import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: title */
const WebSvg = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 32 32"
    {...props}
  >
    <Path
      fill="#1A1718"
      fillRule="evenodd"
      d="M10 0C4.5 0 0 4.5 0 10s4.5 10 10 10 10-4.5 10-10S15.5 0 10 0Zm6.9 6H14c-.3-1.3-.8-2.4-1.4-3.6 1.8.7 3.4 1.9 4.3 3.6ZM10 2c.8 1.2 1.5 2.5 1.9 4H8.1c.4-1.4 1.1-2.8 1.9-4ZM2.3 12c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2h3.4c-.1.7-.1 1.3-.1 2s.1 1.3.1 2H2.3Zm.8 2H6c.3 1.3.8 2.4 1.4 3.6-1.8-.7-3.4-1.9-4.3-3.6ZM6 6H3.1c1-1.7 2.5-2.9 4.3-3.6C6.8 3.6 6.3 4.7 6 6Zm4 12c-.8-1.2-1.5-2.5-1.9-4h3.8c-.4 1.4-1.1 2.8-1.9 4Zm2.3-6H7.7c-.1-.7-.2-1.3-.2-2s.1-1.3.2-2h4.7c.1.7.2 1.3.2 2s-.2 1.3-.3 2Zm.3 5.6c.6-1.1 1.1-2.3 1.4-3.6h2.9c-.9 1.7-2.5 2.9-4.3 3.6Zm1.8-5.6c.1-.7.1-1.3.1-2s-.1-1.3-.1-2h3.4c.2.6.3 1.3.3 2s-.1 1.4-.3 2h-3.4Z"
    />
  </Svg>
);
export default WebSvg;
