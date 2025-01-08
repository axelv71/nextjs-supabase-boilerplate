import * as React from 'react';
import { SVGProps } from 'react';
const Code02 = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m17 17 5-5-5-5M7 7l-5 5 5 5m7-14-4 18"
    />
  </svg>
);
export default Code02;
