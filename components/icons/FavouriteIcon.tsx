import React from 'react';

export default function FavouriteIcon({
  fill = 'none',
  stroke = 'black',
  className,
}: {
  fill?: string;
  stroke?: string;
  className?: string;
}) {
  return (
    <svg
      width='27'
      height='24'
      viewBox='0 0 27 24'
      fill={fill}
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        d='M13.5 23C13.5 23 1 16 1 7.50001C1 5.99737 1.52062 4.54114 2.47328 3.37908C3.42593 2.21703 4.75178 1.42093 6.22525 1.12624C7.69871 0.831543 9.22876 1.05646 10.5551 1.76272C11.8814 2.46898 12.9221 3.61296 13.5 5.00001C14.0779 3.61296 15.1186 2.46898 16.4449 1.76272C17.7712 1.05646 19.3013 0.831543 20.7748 1.12624C22.2482 1.42093 23.5741 2.21703 24.5267 3.37908C25.4794 4.54114 26 5.99737 26 7.50001C26 16 13.5 23 13.5 23Z'
        stroke={stroke}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
