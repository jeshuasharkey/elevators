import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import { dataAtom, favouritesAtom } from '../store/store';
import { humanTimeAgo } from '../utils/human-time-ago';
import { useAtom } from 'jotai';
import SingleStation from '../components/SingleStation';
import clsx from 'clsx';

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useAtom(dataAtom);
  const [favourites] = useAtom(favouritesAtom);
  const inputRef = useRef<HTMLInputElement>(null);
  const [lastUpdate, setLastUpdate] = useState<any>();
  const [view, setView] = useState('full');

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
      .then((data: any) => {
        setLastUpdate(Date.now());
        const reduce: any = data.reduce(
          (ac: any, a: any) => ({ ...ac, [a.station]: a }),
          {}
        );
        const newData: any = {};
        data.forEach((item: any) => {
          const exsits = !!newData[item.station];
          if (exsits) {
            newData[item.station].equipment.push(item);
          } else {
            newData[item.station] = {
              station: item.station,
              borough: item.borough,
              trainno: item.trainno,
              equipment: [item],
            };
          }
        });
        setData(newData);
        setLoading(false);
      })
      .catch((error) => {
        alert(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Head>
        <link rel='manifest' href='manifest.json' />
        <title>ELEVATORS</title>
      </Head>
      <div className='bg-pink h-screen w-screen text-white flex flex-col text-[12px]'>
        <Header />
        <div
          className={clsx(
            'flex flex-1 w-screen overflow-scroll snap-x snap-mandatory',
            view === 'list'
          )}
        >
          {favourites.map((item) => (
            <SingleStation
              key={item}
              item={data?.[item]}
              size={view === 'list' ? 'small' : 'full'}
            />
          ))}
        </div>
        {/* <pre className='text-[12px] font-extralight'>
          {JSON.stringify(data, null, 2)}
        </pre> */}
      </div>
    </>
  );
};

export default Home;
