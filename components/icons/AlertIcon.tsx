import React from 'react';

export default function AlertIcon({
  color = 'black',
  className,
}: {
  color?: string;
  className?: string;
}) {
  return (
    <svg
      width='26'
      height='26'
      viewBox='0 0 26 26'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        d='M13 25C19.6274 25 25 19.6274 25 13C25 6.37258 19.6274 1 13 1C6.37258 1 1 6.37258 1 13C1 19.6274 6.37258 25 13 25Z'
        stroke={color}
        strokeWidth='2'
        strokeMiterlimit='10'
      />
      <path
        d='M13 7V14'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M13 20C13.8284 20 14.5 19.3284 14.5 18.5C14.5 17.6716 13.8284 17 13 17C12.1716 17 11.5 17.6716 11.5 18.5C11.5 19.3284 12.1716 20 13 20Z'
        fill={color}
      />
    </svg>
  );
}
