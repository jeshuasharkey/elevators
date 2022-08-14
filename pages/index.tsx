import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { humanTimeAgo } from '../utils/human-time-ago';

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [lastUpdate, setLastUpdate] = useState<any>();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = (val = 0) => {
    setLoading(true);
    fetch(
      `https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fnyct_ene_equipments.json`,
      {
        headers: {
          'x-api-key': 'AqCSA6XBVykDbZjZEXrd6PYhJJVcNbQ5HjQL7QP5',
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setLastUpdate(Date.now());
        setData(
          data.filter(
            (item: any) =>
              item.station === 'Flushing Av' && item.equipmenttype === 'EL'
          )
        );
        setLoading(false);
      })
      .catch((error) => {
        alert(error);
        setLoading(false);
      });
  };

  return (
    <>
      <Head>
        <link rel='manifest' href='manifest.json' />
        <title>ELEVATORS</title>
      </Head>
      <div className='bg-[#202020] p-5 h-screen w-screen text-white flex flex-col text-[12px]'>
        {/* <pre className='text-[12px] font-extralight'>
          {JSON.stringify(data, null, 2)}
        </pre> */}
        <div className='grid gap-3 flex-1 content-start'>
          <div className='font-bold'>Flushing Ave (J)(M)</div>
          {data.map((item: any, i) => (
            <div className='' key={item.equipmentno}>
              <div className=''>Elevator #{i + 1}</div>
              <div className='capitalize'>{item.shortdescription}</div>
              <div className=''>
                status:{' '}
                <span
                  className={`font-bold inline-block ${
                    item.isactive === 'Y' ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {item.isactive === 'Y' ? 'Active' : 'Out Of Service'}
                </span>
              </div>
              {/* <div>{JSON.stringify(item, null, 2)}</div> */}
            </div>
          ))}
        </div>
        <div className=''>
          <a onClick={() => fetchData()} className='underline cursor-pointer'>
            Refresh
          </a>
          <div className=''>Last Updated {humanTimeAgo(lastUpdate)} ago</div>
        </div>
      </div>
    </>
  );
};

export default Home;
