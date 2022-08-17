import clsx from 'clsx';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
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

  return (
    <>
      <div
        className='bg-white relative rounded-[50px] w-screen flex-shrink-0 overflow-scroll grid snap-center'
        id={'slide-' + i}
      >
        <div
          className='absolute py-4 px-2 top-5 right-8'
          onClick={() => handleToggleMoreMenu()}
        >
          <MoreMenuIcon />
        </div>
        <div className='pt-11 pb-8 px-8 grid gap-6 content-start'>
          <div className='grid gap-3 content-start'>
            <div className='text-black font-extrabold text-[38px] leading-[100%]'>
              {item.station ? item.station : item.name}
            </div>
            <div className='flex justify-between items-start gap-4'>
              <div className='flex gap-2 flex-wrap'>
                {lines.map((line: string) => (
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
        <div className='bg-[#000000] p-8 rounded-[40px] max-w-full grid gap-3'>
          {stopData &&
            stopData.map((trip: any) => {
              const timeUntil = Math.round(
                (trip.estimated_current_stop_arrival_time * 1000 - Date.now()) /
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
      </div>
    </>
  );
}
