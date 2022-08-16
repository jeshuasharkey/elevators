import clsx from 'clsx';
import React from 'react';

export default function SingleStation({
  item,
  size,
}: {
  item: any;
  size?: string;
}) {
  if (!item) return null;
  if (size === 'small') return <SmallCard item={item} />;
  return <FullCard item={item} />;
}

function SmallCard({ item }: { item: any }) {
  return <div className='bg-white'>{item.station}</div>;
}

function FullCard({ item }: { item: any }) {
  const totalInactive = item.equipment.filter(
    (e: any) => e.isactive !== 'Y'
  ).length;
  return (
    <div className='bg-white rounded-[50px] w-screen flex-shrink-0 overflow-scroll grid'>
      <div className='pt-11 pb-8 px-8 grid gap-6'>
        <div className='grid gap-3'>
          <div className='text-black font-extrabold text-[38px] leading-[100%]'>
            {item.station}
          </div>
          <div className='flex justify-between items-center'>
            <div className='flex gap-2'>
              {item.trainno.split('/').map((line: string) => (
                <div
                  key={line}
                  className='w-8 h-8 rounded-full bg-black text-[18px] font-bold flex items-center justify-center'
                >
                  {line}
                </div>
              ))}
            </div>
            <div className='text-black font-bold text-[20px]'>
              {totalInactive > 0 ? totalInactive + ' Inactive' : 'All Active'}
            </div>
          </div>
        </div>
        <div className='grid gap-3 auto-rows-fr'>
          {item.equipment.map((equipment: any) => (
            <div
              key={equipment.equipmentno}
              className={clsx(
                'flex items-center rounded-[26px] p-4 gap-3',
                equipment.isactive === 'Y' ? 'bg-[#CB97C0]' : 'bg-[#C5C5C5]'
              )}
            >
              <div className='flex-1'>{equipment.serving}</div>
              <div className=''>
                {equipment.isactive === 'Y' ? 'Active' : 'Inactive'}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='bg-[#000000] p-8 rounded-[40px] max-w-full overflow-x-scroll'>
        <pre className='text-[12px] font-extralight text-white'>
          {JSON.stringify(item, null, 2)}
        </pre>
      </div>
    </div>
  );
}
