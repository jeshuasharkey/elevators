import clsx from 'clsx';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
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

  const equipment = accData[item.station ? item.station : item.name]?.equipment;

  const card = useRef(null);
  const { scrollY } = useScroll({
    container: card,
  });
  const [scrollPos, setScrollPos] = useState(0);

  useEffect(() => {
    scrollY.onChange((progress) => {
      setScrollPos(progress);
    });
  }),
    [scrollY];

  return (
    <>
      <motion.div
        onAnimationComplete={() => {
          setScrollPos(0);
        }}
        className={clsx(
          'bg-white relative w-screen flex-shrink-0 grid content-start snap-center origin-top overflow-scroll h-full no-scrollbar overscroll-none',
          overlayStyle ? ' rounded-t-[36px]' : ' rounded-[36px]'
        )}
        id={'slide-' + i}
        ref={card}
      >
        <Heading
          item={item}
          scrollPos={scrollPos}
          overlayStyle={overlayStyle}
        />
        <div className='pt-3 pb-8 px-8 grid gap-8 content-start'>
          {!equipment && (
            <div className='text-[#D0D7DC] rounded-[20px] border-2 font-medium border-[#EBF0F4] p-5'>
              Not an accessible station.
            </div>
          )}
          {equipment && (
            <div className='grid gap-3'>
              {equipment.map((equipment: any) => {
                const outage = accOutages?.find(
                  (o: any) => o.equipment === equipment.equipmentno
                );
                return (
                  <div
                    key={equipment.equipmentno}
                    className={clsx(
                      'flex items-center rounded-[26px] min-h-[72px] p-4 gap-3',
                      !outage
                        ? 'bg-[#EBF0F4] text-[#202020]'
                        : 'bg-[#E68C79] text-white'
                    )}
                  >
                    {equipment.equipmenttype === 'EL' && (
                      <ElevatorIcon stroke={!outage ? '#202020' : '#ffffff'} />
                    )}
                    {equipment.equipmenttype === 'ES' && (
                      <EscalatorIcon stroke={!outage ? '#202020' : '#ffffff'} />
                    )}
                    <div className='grid gap-2 flex-1 '>
                      <div className='capitalize text-[15px] font-semibold leading-tight'>
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
                        'text-[14px] font-bold uppercase bg-white rounded-full leading-[100%] py-1 px-2',
                        !outage ? 'text-[#000000]' : 'text-[#E68C79]'
                      )}
                    >
                      {!outage ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div
          className={clsx(
            'p-8 pt-3 rounded-t-[40px] max-w-full grid gap-3 top-0 relative',
            !overlayStyle && 'rounded-b-[50px]'
          )}
        >
          <AnimatePresence>
            {stopData &&
              stopData
                .filter(
                  (t: any) =>
                    t.estimated_current_stop_arrival_time * 1000 > Date.now()
                )
                .map((trip: any, i: number) => {
                  const timeUntil = Math.round(
                    (trip.estimated_current_stop_arrival_time * 1000 -
                      Date.now()) /
                      1000 /
                      60
                  );
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i }}
                      key={trip.id}
                      className='flex gap-4 items-center w-full overflow-hidden text-[#202020]'
                    >
                      <RouteIndicator id={trip.route_id} small />
                      <div className='flex-1 overflow-hidden whitespace-nowrap text-ellipsis text-[16px] font-semibold'>
                        to {findDest(trip.destination_stop)}
                      </div>
                      <div className='w-20 flex justify-end'>
                        {timeUntil > 0 && (
                          <div className='flex gap-[6px] items-baseline'>
                            <div className='text-[22px] font-bold'>
                              {timeUntil}
                            </div>
                            <div className='text-[16px] font-medium'>min</div>
                          </div>
                        )}
                        {timeUntil === 0 && (
                          <div className='text-[22px] font-bold tracking-wide'>
                            Now
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}

function Heading({
  item,
  scrollPos,
  overlayStyle,
}: {
  item: any;
  scrollPos: number;
  overlayStyle?: boolean;
}) {
  const [accOutages] = useAtom(accOutagesAtom);
  const [moreMenuItem, setMoreMenuItem] = useAtom(moreMenuItemAtom);
  const [moreMenuTrainNo, setMoreMenuTrainNo] = useAtom(moreMenuTrainNoAtom);

  const [accData, setAccData] = useAtom(accDataAtom);
  function handleToggleMoreMenu() {
    setMoreMenuItem(item.station ? item.station : item.name);
    setMoreMenuTrainNo(
      item.trainno ? item.trainno : Object.keys(item.routes).join('/')
    );
  }
  const equipment = accData[item.station ? item.station : item.name]?.equipment;

  const totalInactive = accOutages?.filter(
    (o: any) =>
      o.station ===
      (item.name?.replace(' - ', '-') || item.station?.replace(' - ', '-'))
  ).length;

  console.log(accOutages);

  const lines = item.trainno
    ? item.trainno.split('/')
    : Object.keys(item.routes);
  const top = useRef<any>(null);

  return (
    <>
      <div
        className={clsx(
          'top-0 px-8 sticky h-0 w-full transition duration-[0.6s] z-10',
          scrollPos > 120 ? 'translate-y-0' : 'translate-y-[-400px]'
        )}
        ref={top}
      >
        <div className='bg-white w-full pt-[14px] pb-1 relative grid gap-[6px] content-start '>
          <div
            className='absolute py-4 px-2 top-2 right-0 transition'
            onClick={() => handleToggleMoreMenu()}
          >
            <MoreMenuIcon />
          </div>
          <div
            className={clsx(
              'text-black font-extrabold text-[24px] leading-[100%] origin-top-left transition duration-500 mr-10'
            )}
          >
            {item.station ? item.station : item.name}
          </div>
          <div className='flex justify-between items-start gap-2'>
            <div className='flex gap-1 flex-wrap'>
              {lines.map((line: string, i: number) => (
                <RouteIndicator id={line} key={line} extraSmall />
              ))}
            </div>
            {equipment && (
              <div className='text-black font-bold text-[20px] flex gap-2 items-center whitespace-nowrap transition scale-[0.7] origin-top-right'>
                {totalInactive > 0 ? (
                  <AlertIcon color='#E68C79' />
                ) : (
                  <TickIcon color='#000000' />
                )}
                <span
                  className={clsx(
                    'transition',
                    totalInactive > 0 ? 'text-[#E68C79]' : 'text-[#000000]'
                  )}
                >
                  {totalInactive > 0 && totalInactive}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className={clsx(
          'grid gap-4 mx-8 content-start top-0 pb-8 relative',
          overlayStyle ? 'pt-2' : 'pt-9'
        )}
        ref={top}
      >
        <div
          className={clsx(
            'absolute py-4 px-2 right-0 transition',
            overlayStyle ? 'top-0' : 'top-4'
          )}
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
                <AlertIcon color='#E68C79' />
              ) : (
                <TickIcon color='#000000' />
              )}
              <span
                className={clsx(
                  'transition',
                  totalInactive > 0 ? 'text-[#E68C79]' : 'text-[#000000]'
                )}
              >
                {totalInactive > 0 ? totalInactive + ' Inactive' : 'All Active'}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
