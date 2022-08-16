import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import Moment from 'react-moment';
import { accOutagesAtom, slideAtom, stopsAtom, viewAtom } from '../store/store';
import AlertIcon from './icons/AlertIcon';
import ElevatorIcon from './icons/ElevatorIcon';
import EscalatorIcon from './icons/EscalatorIcon';
import TickIcon from './icons/TickIcon';

export default function SingleStation({ item, i }: { item: any; i: number }) {
  const [view] = useAtom(viewAtom);

  if (!item) return null;
  if (view === 'list') return <SmallCard item={item} i={i} />;
  return <FullCard item={item} i={i} />;
}

function SmallCard({ item, i }: { item: any; i: number }) {
  const [, setView] = useAtom(viewAtom);
  const [slide, setSlide] = useAtom(slideAtom);
  function handleSmallCardClick(station: string) {
    setView('full');
    setSlide(i);
  }

  return (
    <motion.div
      className='bg-white'
      onClick={() => handleSmallCardClick(item.station)}
    >
      <div className='grid gap-3'>
        <motion.div className='text-black font-extrabold text-[38px] leading-[100%]'>
          {item.station}
        </motion.div>
      </div>
    </motion.div>
  );
}

function FullCard({ item, i }: { item: any; i: number }) {
  const [slide, setSlide] = useAtom(slideAtom);
  const [accOutages] = useAtom(accOutagesAtom);

  const [stops] = useAtom(stopsAtom);
  const [stopData, setStopData] = useState<any>(null);

  function fetchData() {
    fetch(`https://www.goodservice.io/api/stops/${item.stationId}`)
      .then((response) => response.json())
      .then((data: any) => {
        console.log(data);
        const merge = [
          ...data.upcoming_trips.north,
          ...data.upcoming_trips.south,
        ].sort((a, b) =>
          a.current_stop_arrival_time > b.current_stop_arrival_time ? 1 : -1
        );
        console.log(merge);

        setStopData(merge);
      })
      .catch((error) => {
        alert(error);
      });
  }

  useEffect(() => {
    if (!item) return;
    fetchData();
  }, [item]);

  function findDest(id: any) {
    if (!stops) return;
    const dest = stops.stops.find((stop: any) => stop.id === id);
    return dest.name;
  }

  const totalInactive = accOutages?.filter(
    (o: any) => o.station === item.station
  ).length;

  return (
    <motion.div
      className='bg-white rounded-[50px] w-screen flex-shrink-0 overflow-scroll grid snap-center'
      id={'slide-' + i}
    >
      <div className='pt-11 pb-8 px-8 grid gap-6'>
        <div className='grid gap-3'>
          <motion.div className='text-black font-extrabold text-[38px] leading-[100%]'>
            {item.station}
          </motion.div>
          <div className='flex justify-between items-start gap-4'>
            <div className='flex gap-2 flex-wrap'>
              {item.trainno.split('/').map((line: string) => (
                <div
                  key={line}
                  className='w-8 h-8 rounded-full bg-black text-[18px] font-bold flex items-center justify-center'
                >
                  {line}
                </div>
              ))}
            </div>
            <div className='text-black font-bold text-[20px] flex gap-2 items-center whitespace-nowrap'>
              {totalInactive > 0 ? <AlertIcon /> : <TickIcon />}
              {totalInactive > 0 ? totalInactive + ' Inactive' : 'All Active'}
            </div>
          </div>
        </div>
        <div className='grid gap-3'>
          {item.equipment.map((equipment: any) => {
            const outage = accOutages?.find(
              (o: any) => o.equipment === equipment.equipmentno
            );
            return (
              <div
                key={equipment.equipmentno}
                className={clsx(
                  'flex items-center rounded-[26px] min-h-[72px] p-4 gap-3',
                  !outage ? 'bg-pink' : 'bg-[#C5C5C5]'
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
                    !outage ? 'text-pink' : 'text-[#C5C5C5]'
                  )}
                >
                  {!outage ? 'Active' : 'Inactive'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className='bg-[#000000] p-8 rounded-[40px] max-w-full overflow-x-scroll'>
        {stopData &&
          stopData.map((trip: any) => {
            return (
              <div key={trip.id} className='flex gap-4'>
                <div className='w-4'>{trip.route_id}</div>
                <div className='flex-1'>
                  to {findDest(trip.destination_stop)}
                </div>
                <div className='w-20 flex justify-end'>
                  <Moment
                    date={trip.estimated_current_stop_arrival_time * 1000}
                    fromNow
                    format='m'
                  />
                  <div className=''>mins</div>
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
  );
}
