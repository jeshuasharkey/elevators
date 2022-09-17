import clsx from 'clsx';
import { motion, useScroll } from 'framer-motion';
import { useAtom } from 'jotai';
import { loadDefaultErrorComponents } from 'next/dist/server/load-components';
import { useEffect, useRef, useState } from 'react';
import Moment from 'react-moment';
import {
  accDataAtom,
  accOutagesAtom,
  moreMenuItemAtom,
  moreMenuTrainNoAtom,
  stopsAtom,
} from '../store/store';
import AlertIcon from './icons/AlertIcon';
import ElevatorIcon from './icons/ElevatorIcon';
import EscalatorIcon from './icons/EscalatorIcon';
import MoreMenuIcon from './icons/MoreMenuIcon';
import TickIcon from './icons/TickIcon';
import RouteIndicator from './RouteIndicator';

export default function FullCard({
  item,
  i,
  overlayStyle,
}: {
  item: any;
  i: number;
  overlayStyle?: boolean;
}) {
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
  const [moreMenuTrainNo, setMoreMenuTrainNo] = useAtom(moreMenuTrainNoAtom);
  function handleToggleMoreMenu() {
    setMoreMenuItem(item.station ? item.station : item.name);
    setMoreMenuTrainNo(
      item.trainno ? item.trainno : Object.keys(item.routes).join('/')
    );
  }

  const card = useRef(null);
  const top = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    container: card,
  });

  const [animating, setAnimating] = useState(true);
  const [scrollPos, setScrollPos] = useState(0);

  useEffect(() => {
    if (animating) return;
    scrollYProgress.onChange((progress) => {
      setScrollPos(progress);
    });
  }),
    [scrollYProgress];

  return (
    <>
      <motion.div
        onAnimationComplete={() => {
          setAnimating(false);
          setScrollPos(0);
        }}
        className={clsx(
          'bg-white relative w-screen flex-shrink-0 grid snap-center origin-top overflow-scroll h-full no-scrollbar overscroll-none',
          overlayStyle ? ' rounded-t-[40px]' : ' rounded-[50px]'
        )}
        id={'slide-' + i}
        ref={card}
      >
        <div className='pt-3 pb-8 px-8 grid gap-8 content-start'>
          <div
            className='grid gap-4 content-start top-0 pt-6 overflow-hidden'
            ref={top}
          >
            <div
              className='absolute py-4 px-2 top-4 right-7 transition'
              onClick={() => handleToggleMoreMenu()}
            >
              <MoreMenuIcon />
            </div>
            <div
              className={clsx(
                'text-black font-extrabold text-[46px] leading-[100%] origin-top-left transition duration-500 mr-10'
              )}
            >
              {item.station ? item.station : item.name}
            </div>
            <div className='flex justify-between items-start gap-4'>
              <div className='flex gap-2 flex-wrap'>
                {lines.map((line: string, i: number) => (
                  <RouteIndicator id={line} key={line} />
                ))}
              </div>
              {equipment && (
                <div className='text-black font-bold text-[20px] flex gap-2 items-center whitespace-nowrap transition'>
                  {totalInactive > 0 ? (
                    <AlertIcon color='#c5c5c5' />
                  ) : (
                    <TickIcon color='#000000' />
                  )}
                  <span
                    className={clsx(
                      'transition',
                      totalInactive > 0 ? 'text-[#C5C5C5]' : 'text-[#000000]'
                    )}
                  >
                    {totalInactive > 0
                      ? totalInactive + ' Inactive'
                      : 'All Active'}
                  </span>
                </div>
              )}
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
                      !outage ? 'bg-[#000000]' : 'bg-[#C5C5C5]'
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
                              format='h:mma ddd Do MMM YY'
                            />
                          </div>
                          <div className='flex gap-2 items-center'>
                            <TickIcon className='w-4 h-4' color='white' />
                            <Moment
                              date={outage.estimatedreturntoservice}
                              format='h:mma ddd Do MMM YY'
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <div
                      className={clsx(
                        'text-[14px] font-semibold tracking-wide uppercase bg-white rounded-full leading-[100%] py-1 px-2',
                        !outage ? 'text-[#000000]' : 'text-[#C5C5C5]'
                      )}
                    >
                      {!outage ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <div
          className={clsx(
            'bg-[#000000] p-8 rounded-t-[40px] max-w-full grid gap-3 top-0 relative',
            !overlayStyle && 'rounded-b-[50px]'
          )}
        >
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
                    <RouteIndicator id={trip.route_id} small />
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
                  </div>
                );
              })}
        </div>
      </motion.div>
    </>
  );
}
