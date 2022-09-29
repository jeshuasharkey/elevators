import clsx from 'clsx';
import useEmblaCarousel from 'embla-carousel-react';
import { useAtom } from 'jotai';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
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
  const [stops, setStops] = useAtom(stopsAtom);
  const [, setRoutes] = useAtom(routesAtom);
  const [favourites, setFavourites] = useAtom(favouritesAtom);
  const [lastUpdate, setLastUpdate] = useState<any>();
  const [timeAgo, setTimeAgo] = useState<any>();
  const [view, setView] = useAtom(viewAtom);
  const [search] = useAtom(searchAtom);

  useEffect(() => {
    const f = localStorage.getItem('favourites');
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
          const station = item.station.replace('-', ' - ');
          const exsits = !!newData[station];
          if (exsits) {
            newData[station].equipment.push(item);
          } else {
            newData[station] = {
              station: station,
              borough: item.borough,
              trainno: item.trainno,
              stationId: item.elevatorsgtfsstopid,
              equipment: [item],
            };
          }
        });
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
    setSlide(0);
    fetchData();
  }, [favourites]);

  useEffect(() => {
    setTimeout(() => {
      setTimeAgo(humanTimeAgo(lastUpdate));
    }, 1000);
  }),
    [lastUpdate];

  const [slide, setSlide] = useAtom(slideAtom);
  const [activeSlide, setActiveSlide] = useState<number | null>(null);

  useEffect(() => {
    if (ref.current) ref.current.scrollLeft = window.innerWidth * slide;
  }, [view]);

  const ref = useRef<HTMLDivElement>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel();

  useEffect(() => {
    if (emblaApi) {
      emblaApi.scrollTo(slide, true);
    }
  }, [slide, emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      if (!emblaApi.selectedScrollSnap() && !emblaApi.canScrollPrev()) {
        setActiveSlide(0);
      }
      emblaApi.on('select', () => {
        const active = emblaApi.selectedScrollSnap();
        setActiveSlide(active);
      });
    }
  }, [emblaApi]);

  function getStop(name: string) {
    return stops.find((i: any) => i.name === name);
  }

  return (
    <>
      <Head>
        <link rel='manifest' href='manifest.json' />
        <title>ELEVATORS</title>
      </Head>
      <div className='bg-[#EBF0F4] h-screen w-screen text-white flex flex-col text-[12px]'>
        <Header refresh={() => fetchData()} />
        {search && <Search />}
        {!search && (
          <>
            {view === 'list' && (
              <div
                className={clsx(
                  'flex flex-1 snap-center w-screen overflow-scroll',
                  view === 'list'
                    ? 'flex-col gap-3 p-5'
                    : 'flex-row snap-x snap-mandatory no-scrollbar items-start'
                )}
                ref={ref}
              >
                {favourites.map((item, i) => (
                  <SingleStation
                    key={item}
                    item={accData?.[item] || getStop(item)}
                    i={i}
                  />
                ))}
              </div>
            )}
            {view === 'full' && (
              <>
                <div className='embla' ref={emblaRef}>
                  <div className='embla__container'>
                    {favourites.map((item, i) => (
                      <div className='embla__slide' key={item}>
                        <pre className='text-black'></pre>
                        <SingleStation
                          item={accData?.[item] || getStop(item)}
                          i={i}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className='p-4 pb-8 flex w-full gap-2 justify-center relative'>
                  {favourites.map((item, i) => (
                    <div
                      className={clsx(
                        'w-2 h-2 bg-black rounded-full transition',
                        i === activeSlide ? 'opacity-100' : 'opacity-30',
                        favourites.length <= 1 && 'opacity-0'
                      )}
                      key={item}
                      onClick={() => setSlide(i)}
                    ></div>
                  ))}
                  {timeAgo && (
                    <div className='text-[13px] tracking-wider absolute right-10 top-3 text-black'>
                      {timeAgo} ago
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
      <MoreMenu />
    </>
  );
};

export default Home;
