import clsx from 'clsx';
import { motion, useScroll } from 'framer-motion';
import { useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import Moment from 'react-moment';
import {
  accDataAtom,
  accOutagesAtom,
  moreMenuItemAtom,
  stopsAtom,
} from '../store/store';
import AlertIcon from './icons/AlertIcon';
import ElevatorIcon from './icons/ElevatorIcon';
import EscalatorIcon from './icons/EscalatorIcon';
import MoreMenuIcon from './icons/MoreMenuIcon';
import TickIcon from './icons/TickIcon';

export default function FullCard({ item, i }: { item: any; i: number }) {
  const [accOutages] = useAtom(accOutagesAtom);

  const [stops] = useAtom(stopsAtom);
  const [stopData, setStopData] = useState<any>(null);
  const [accData, setAccData] = useAtom(accDataAtom);

  function fetchData() {
    const id = item.stationId ? item.stationId : item.id;
    if (id.includes('/')) {
      const ids = id.split('/');
      let all: any[] = [];
      let count = 0;
      ids.forEach((id: string) => {
        fetch(`https://www.goodservice.io/api/stops/${id}`)
          .then((response) => response.json())
          .then((data: any) => {
            const merge = [
              ...data.upcoming_trips.north,
              ...data.upcoming_trips.south,
            ];
            all = [...all, ...merge];
            count++;
            if (count === ids.length) {
              const allSorted = all.sort((a, b) => {
                return (
                  a.current_stop_arrival_time - b.current_stop_arrival_time
                );
              });
              setStopData(allSorted);
            }
          })
          .catch((error) => {
            alert(error);
          });
      });
    } else {
      fetch(`https://www.goodservice.io/api/stops/${id}`)
        .then((response) => response.json())
        .then((data: any) => {
          const merge = [
            ...data.upcoming_trips.north,
            ...data.upcoming_trips.south,
          ].sort((a, b) => {
            return a.current_stop_arrival_time - b.current_stop_arrival_time;
          });
          setStopData(merge);
        })
        .catch((error) => {
          alert(error);
        });
    }
  }

  useEffect(() => {
    if (!item) return;
    fetchData();
  }, [item]);

  function findDest(id: any) {
    if (!stops) return;
    const dest = stops.find((stop: any) => stop.id === id);
    return dest.name;
  }

  const totalInactive = accOutages?.filter(
    (o: any) => o.station === item.station
  ).length;

  const lines = item.trainno
    ? item.trainno.split('/')
    : Object.keys(item.routes);

  const equipment = accData[item.station ? item.station : item.name]?.equipment;

  const [moreMenuItem, setMoreMenuItem] = useAtom(moreMenuItemAtom);
  function handleToggleMoreMenu() {
    setMoreMenuItem(item.station ? item.station : item.name);
  }

  const card = useRef(null);
  const top = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    container: card,
  });

  const [scrollPos, setScrollPos] = useState(0);

  useEffect(() => {
    scrollYProgress.onChange((progress) => {
      setScrollPos(progress);
    });
  }),
    [scrollYProgress];

  return (
    <>
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
        className='bg-white relative rounded-[50px] w-screen flex-shrink-0 grid snap-center origin-top overflow-scroll h-full'
        id={'slide-' + i}
        ref={card}
      >
        <div className='pt-11 pb-8 px-8 grid gap-8 content-start'>
          <div className='grid gap-4 content-start sticky top-6' ref={top}>
            <div
              className='absolute py-4 px-2 top-[-10px] right-0 transition'
              style={{
                transform: `translate(${scrollPos > 0.04 ? '0, 4px' : '0, 0'})`,
              }}
              onClick={() => handleToggleMoreMenu()}
            >
              <MoreMenuIcon />
            </div>
            <div
              className={clsx(
                'text-black font-extrabold text-[46px] leading-[100%] origin-top-left transition duration-500'
              )}
              style={{
                transform: `scale(${scrollPos > 0.04 ? 0.5 : 1})`,
              }}
            >
              {item.station ? item.station : item.name}
            </div>
            <div className='flex justify-between items-start gap-4'>
              <div className='flex gap-2 flex-wrap'>
                {lines.map((line: string, i: number) => (
                  <div
                    key={line}
                    className='w-8 h-8 rounded-full bg-black text-[18px] font-bold flex items-center justify-center transition duration-300'
                    style={{
                      transform: `translateY(${
                        scrollPos > 0.03 ? '-60px' : '0'
                      })`,
                      opacity: scrollPos > 0.03 ? '0' : '1',
                      transitionDelay: `${i * 0.05}s`,
                    }}
                  >
                    {line}
                  </div>
                ))}
              </div>
              <div
                className='text-black font-bold text-[20px] flex gap-2 items-center whitespace-nowrap transition'
                style={{
                  transform: `translate(${
                    scrollPos > 0.04 ? '46px, -65px' : '0, 0'
                  })`,
                }}
              >
                {totalInactive > 0 ? <AlertIcon /> : <TickIcon />}
                <span
                  style={{
                    opacity: scrollPos > 0.04 ? '0' : '1',
                  }}
                >
                  {totalInactive > 0
                    ? totalInactive + ' Inactive'
                    : 'All Active'}
                </span>
              </div>
            </div>
          </div>
          <div className='grid gap-3'>
            {equipment &&
              equipment.map((equipment: any) => {
                const outage = accOutages?.find(
                  (o: any) => o.equipment === equipment.equipmentno
                );
                return (
                  <div
                    key={equipment.equipmentno}
                    className={clsx(
                      'flex items-center rounded-[26px] min-h-[72px] p-4 gap-3',
                      !outage ? 'bg-[#BD8A5B]' : 'bg-[#C5C5C5]'
                    )}
                  >
                    {equipment.equipmenttype === 'EL' && <ElevatorIcon />}
                    {equipment.equipmenttype === 'ES' && <EscalatorIcon />}
                    <div className='grid gap-2 flex-1 '>
                      <div className='capitalize text-[15px] font-medium tracking-wide leading-tight'>
                        {equipment.shortdescription}
                        {outage && ' (' + outage.reason + ')'}
                      </div>
                      {outage && (
                        <div className='grid gap-1 leading-[100%] font-medium text-[12px]'>
                          <div className='flex gap-2 items-center'>
                            <AlertIcon className='w-4 h-4' color='white' />
                            <Moment
                              date={outage.outagedate}
                              format='h:mma ddd Mo MMM YY'
                            />
                          </div>
                          <div className='flex gap-2 items-center'>
                            <TickIcon className='w-4 h-4' color='white' />
                            <Moment
                              date={outage.estimatedreturntoservice}
                              format='h:mma ddd Mo MMM YY'
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <div
                      className={clsx(
                        'text-[14px] font-semibold tracking-wide uppercase bg-white rounded-full leading-[100%] py-1 px-2',
                        !outage ? 'text-[#BD8A5B]' : 'text-[#C5C5C5]'
                      )}
                    >
                      {!outage ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <div className='bg-[#000000] p-8 pb-24 rounded-t-[40px] max-w-full grid gap-3 sticky top-0'>
          {stopData &&
            stopData
              .filter(
                (t: any) =>
                  t.estimated_current_stop_arrival_time * 1000 > Date.now()
              )
              .map((trip: any) => {
                const timeUntil = Math.round(
                  (trip.estimated_current_stop_arrival_time * 1000 -
                    Date.now()) /
                    1000 /
                    60
                );
                return (
                  <div
                    key={trip.id}
                    className='flex gap-4 items-center w-full overflow-hidden'
                  >
                    <div className='w-6 h-6 bg-white rounded-full text-black font-bold text-[16px] flex items-center justify-center'>
                      {trip.route_id}
                    </div>
                    <div className='flex-1 overflow-hidden whitespace-nowrap text-ellipsis text-[16px] font-medium tracking-wider'>
                      to {findDest(trip.destination_stop)}
                    </div>
                    <div className='w-20 flex justify-end'>
                      {timeUntil > 0 && (
                        <div className='flex gap-2 items-baseline'>
                          <div className='text-[22px] font-bold tracking-wide'>
                            {timeUntil}
                          </div>
                          <div className='text-[16px] font-medium tracking-wider'>
                            min
                          </div>
                        </div>
                      )}
                      {timeUntil === 0 && (
                        <div className='text-[22px] font-bold tracking-wide'>
                          Now
                        </div>
                      )}
                    </div>
                    {/* <pre
                    key={trip.id}
                    className='text-[12px] font-extralight text-white'
                  >
                    {JSON.stringify(trip, null, 2)}
                  </pre> */}
                  </div>
                );
              })}
        </div>
      </motion.div>
    </>
  );
}
