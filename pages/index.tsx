import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';

const Home: NextPage = () => {
  const [data, setData] = useState({});

  // useEffect(() => {
  //   fetchData();
  // }, [])

  const fetchData = (event) => {
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
        targetAmount: event.target.value,
      }),
    };
    fetch(`https://api.sandbox.transferwise.tech/v3/quotes/`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setData(data);
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <>
      <Head>
        <link rel='manifest' href='manifest.json' />
      </Head>
      <div>
        <div>
          $
          <input
            type='text'
            onChange={(event) => {
              fetchData(event);
            }}
          />
          USD
        </div>
        {data?.paymentOptions && (
          <div>NZD: ${data?.paymentOptions[0].sourceAmount}</div>
        )}
        {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      </div>
    </>
  );
};

export default Home;
