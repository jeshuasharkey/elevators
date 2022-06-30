import type { NextPage } from 'next';
import Head from 'next/head';
import { useRef, useState } from 'react';

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    paymentOptions: [
      {
        sourceAmount: 0,
      },
    ],
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchData = (val = 0) => {
    setLoading(true);
    const requestOptions = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Origin: '*',
        Authorization: 'Bearer dda84288-5500-4b79-95b5-cfc36ec41350',
      },
      method: 'POST',
      body: JSON.stringify({
        sourceCurrency: 'NZD',
        targetCurrency: 'USD',
        targetAmount: val,
      }),
    };
    fetch(`https://api.sandbox.transferwise.tech/v3/quotes/`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        alert(error);
        setLoading(false);
      });
  };

  const setNumber = (num: number) => {
    fetchData(num);
    if (inputRef && inputRef.current) inputRef.current.value = num.toString();
  };

  return (
    <>
      <Head>
        <link rel='manifest' href='manifest.json' />
      </Head>
      <div className='bg-black/90 p-5 h-screen w-screen flex gap-4 items-center justify-center flex-col'>
        <p className='text-lg text-center text-white leading-5 font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-600'>
          Check USD prices in NZD from Wise
        </p>
        <svg
          width='272'
          height='10'
          viewBox='0 0 272 10'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='mb-4'
        >
          <path
            d='M100.342 6.83808C138.937 10.1444 177.895 5.34385 216.544 5.34385C230.923 5.34385 245.338 5.29386 259.689 6.83808C260.533 6.92891 271.33 8.14098 269.863 7.50218C262.468 4.28154 253.274 5.01758 245.789 4.59674C215.377 2.88689 184.925 2.52143 154.495 2.52143C116.355 2.52143 78.2106 3.24386 40.0725 3.84963C28.1721 4.03865 -7.46571 6.75521 4.37789 5.0118C39.1286 -0.103588 75.0674 3.15447 109.905 2.68745C129.919 2.41915 149.937 2.24431 169.952 2.3554C170.888 2.3606 183.514 0.932083 184.463 3.76662C184.811 4.80639 182.907 3.84963 182.128 3.84963C179.033 3.84963 175.938 3.84963 172.843 3.84963C158.573 3.84963 144.302 3.84963 130.032 3.84963C113.13 3.84963 96.2275 3.84963 79.3254 3.84963'
            stroke='white'
            strokeWidth='2'
            strokeLinecap='round'
          />
        </svg>

        <div className='flex w-full relative max-w-xs'>
          <div className='text-white absolute left-2 h-full text-xs flex items-center opacity-30'>
            $
          </div>
          <input
            className='w-full bg-white/20 rounded-xl text-white px-6 py-2 focus:outline-none focus:b placeholder:opacity-20'
            placeholder='1000.00'
            ref={inputRef}
            onChange={(event) => {
              fetchData(parseInt(event.target.value));
            }}
            type='number'
            min='0'
            inputMode='numeric'
            style={{ WebkitAppearance: 'none' }}
          />
          <div className='text-white absolute right-2 h-full flex items-center text-xs opacity-30'>
            USD
          </div>
        </div>
        <div className='flex gap-2'>
          {[100, 200, 2395].map((num) => {
            return (
              <div
                key={num}
                className='text-[14px] cursor-pointer py-[5px] px-[10px] rounded-md bg-white/10 font-normal text-white/50'
                onClick={() => {
                  setNumber(num);
                }}
              >
                ${num}
              </div>
            );
          })}
        </div>
        {data?.paymentOptions && !loading && (
          <div className='text-white flex items-baseline gap-1 text-xl font-bold'>
            $
            {data?.paymentOptions[data?.paymentOptions.length - 1].sourceAmount}
            <div className='text-xs opacity-30'>NZD</div>
          </div>
        )}
        {loading && (
          <div className='text-xs h-[45px] text-white/50 animate-pulse flex items-center'>
            Loading...
          </div>
        )}
        {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      </div>
    </>
  );
};

export default Home;
