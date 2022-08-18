import clsx from 'clsx';
import { useAtom } from 'jotai';
import type { NextPage } from 'next';
import Head from 'next/head';
import { UIEvent, useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import MoreMenu from '../components/MoreMenu';
import Search from '../components/Search';
import SingleStation from '../components/SingleStation';
import {
  accDataAtom,
  accOutagesAtom,
  favouritesAtom,
  routesAtom,
  searchAtom,
  slideAtom,
  stopsAtom,
  viewAtom,
} from '../store/store';
import { humanTimeAgo } from '../utils/human-time-ago';

const Home: NextPage = () => {
  const [accData, setAccData] = useAtom(accDataAtom);
  const [, setAccOutages] = useAtom(accOutagesAtom);
  const [, setStops] = useAtom(stopsAtom);
  const [, setRoutes] = useAtom(routesAtom);
  const [favourites, setFavourites] = useAtom(favouritesAtom);
  const [lastUpdate, setLastUpdate] = useState<any>();
  const [timeAgo, setTimeAgo] = useState<any>();
  const [view, setView] = useAtom(viewAtom);
  const [search] = useAtom(searchAtom);

  useEffect(() => {
    const f = localStorage.getItem('favourites');
    console.log(f);

    if (f) setFavourites(f.split(','));
  }, []);

  // ALL EQUIPMENT
  const fetchData = (val = 0) => {
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
              stationId: item.elevatorsgtfsstopid,
              equipment: [item],
            };
          }
        });
        console.log('accData', newData);

        setAccData(newData);
      })
      .catch((error) => {
        alert(error);
      });

    //CURRENT OUTAGES
    fetch(
      `https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fnyct_ene.json`,
      {
        headers: {
          'x-api-key': 'AqCSA6XBVykDbZjZEXrd6PYhJJVcNbQ5HjQL7QP5',
        },
      }
    )
      .then((response) => response.json())
      .then((data: any) => {
        setAccOutages(data);
      })
      .catch((error) => {
        alert(error);
      });

    fetch(`https://www.goodservice.io/api/stops`)
      .then((response) => response.json())
      .then((data: any) => {
        console.log(data);
        setStops(data.stops);
      })
      .catch((error) => {
        alert(error);
      });

    fetch(`https://www.goodservice.io/api/routes`)
      .then((response) => response.json())
      .then((data: any) => {
        setRoutes(data);
      })
      .catch((error) => {
        alert(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setTimeAgo(humanTimeAgo(lastUpdate));
    }, 1000);
  }),
    [lastUpdate];

  const [slide, setSlide] = useAtom(slideAtom);
  const [activeSlide, setActiveSlide] = useState(0);

  function handleStationScroll(e: UIEvent) {
    const w = window.innerWidth;
    const t = e?.target as HTMLDivElement;
    const s = t.scrollLeft;
    setActiveSlide(Math.round(s / w));
  }

  useEffect(() => {
    if (ref.current) ref.current.scrollLeft = window.innerWidth * slide;
  }, [view]);

  const ref = useRef<HTMLDivElement>(null);

  return (
    <>
      <Head>
        <link rel='manifest' href='manifest.json' />
        <title>ELEVATORS</title>
      </Head>
      <div className='bg-pink h-screen w-screen text-white flex flex-col text-[12px]'>
        <Header refresh={() => fetchData()} />
        {search && <Search />}
        {!search && (
          <>
            <div
              className={clsx(
                'flex snap-center h-screen fixed top-0 pt-16 w-screen items-start overflow-scroll',
                view === 'list'
                  ? 'flex-col gap-3 p-5'
                  : 'flex-row snap-x snap-mandatory no-scrollbar'
              )}
              onScroll={(e) => handleStationScroll(e)}
              ref={ref}
            >
              {favourites.map((item, i) => (
                <SingleStation key={item} item={accData?.[item]} i={i} />
              ))}
            </div>
            {view === 'full' && (
              <div className='p-4 pb-8 flex w-full gap-2 justify-center bg-pink rounded-t-[50px] fixed bottom-0 left-0 right-0'>
                {favourites.map((item, i) => (
                  <div
                    className={clsx(
                      'w-2 h-2 bg-white rounded-full transition',
                      i === activeSlide ? 'opacity-100' : 'opacity-30',
                      favourites.length <= 1 && 'opacity-0'
                    )}
                    key={item}
                    onClick={() => setSlide(i)}
                  ></div>
                ))}
                {timeAgo && (
                  <div className='text-[13px] tracking-wider absolute right-10 top-3'>
                    {timeAgo} ago
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
      <MoreMenu />
    </>
  );
};

export default Home;
