import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import React from 'react';
import {
  viewAtom,
  slideAtom,
  accDataAtom,
  accOutagesAtom,
} from '../store/store';
import AlertIcon from './icons/AlertIcon';
import ElevatorIcon from './icons/ElevatorIcon';
import EscalatorIcon from './icons/EscalatorIcon';

export default function SmallCard({ item, i }: { item: any; i: number }) {
  const [, setView] = useAtom(viewAtom);
  const [accData] = useAtom(accDataAtom);
  const [accOutages] = useAtom(accOutagesAtom);

  const totalEl = accData?.[
    item.station ? item.station : item.name
  ]?.equipment.filter((e: any) => e.equipmenttype === 'EL').length;

  const totalEs = accData?.[
    item.station ? item.station : item.name
  ]?.equipment.filter((e: any) => e.equipmenttype === 'ES').length;

  const totalInactiveEl = accOutages?.filter(
    (o: any) =>
      o.station === (item.station ? item.station : item.name) &&
      o.equipmenttype === 'EL'
  ).length;

  const totalInactiveEs = accOutages?.filter(
    (o: any) =>
      o.station === (item.station ? item.station : item.name) &&
      o.equipmenttype === 'ES'
  ).length;

  const lines = item.trainno
    ? item.trainno.split('/')
    : Object.keys(item.routes);

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className='bg-white px-6 py-5 rounded-[30px] cursor-pointer'
    >
      <div className='grid gap-2'>
        <div className='text-black font-extrabold text-[24px] leading-[100%]'>
          {item.station ? item.station : item.name}
        </div>
        <div className='flex gap-2 items-end'>
          <div className='flex gap-1 flex-wrap flex-1'>
            {lines.map((line: string) => (
              <div
                key={line}
                className='w-6 h-6 rounded-full bg-black text-[14px] font-bold flex items-center justify-center'
              >
                {line}
              </div>
            ))}
          </div>
          <div className='flex gap-1'>
            {totalEs > 0 && (
              <div
                className={clsx(
                  'flex gap-1 rounded-full items-center py-[2px] px-2 text-[16px] leading-[100%]',
                  totalInactiveEs > 0 ? 'bg-[#C5C5C5]' : 'bg-pink'
                )}
              >
                {totalEs}
                <EscalatorIcon className='w-4' />
              </div>
            )}
            {totalEl > 0 && (
              <div
                className={clsx(
                  'flex gap-1 rounded-full items-center py-[2px] px-2 text-[16px] leading-[100%]',
                  totalInactiveEs > 0 ? 'bg-[#C5C5C5]' : 'bg-pink'
                )}
              >
                {totalEl}
                <ElevatorIcon className='w-4' />
              </div>
            )}
            {(totalInactiveEs > 0 || totalInactiveEl > 0) && (
              <AlertIcon className='w-6' />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
