import type { SVGProps } from 'react';

export const CricketBatIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <path d="m15.89 15.89-2.82 2.82" />
    <path d="M12.06 12.06 2.4 21.72a2.83 2.83 0 0 0 4 4l9.66-9.66" />
    <path d="M18.37.63a2.83 2.83 0 0 0-4 0l-1.06 1.06 5.06 5.06 1.06-1.06a2.83 2.83 0 0 0 0-4Z" />
  </svg>
);

export const CricketBallIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12a14.5 14.5 0 0 0 20 0 14.5 14.5 0 0 0-20 0" />
  </svg>
);
