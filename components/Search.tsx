import React, { useState } from 'react';
import { searchAtom, stopsAtom } from '../store/store';
import { useAtom } from 'jotai';
import SmallCard from './SmallCard';
import FullCard from './FullCard';
import { AnimatePresence, motion } from 'framer-motion';

export default function Search() {
  const [search, setSearch] = useAtom(searchAtom);
  const [stops, setStops] = useAtom(stopsAtom);
  const [activeItem, setActiveItem] = useState(null);

  const results = stops?.filter((item: any) =>
    item?.name?.toUpperCase().includes(search.toUpperCase())
  );

  function handleSmallCardClick(item: any) {
    setActiveItem(item);
  }

  function handleClose() {
    setActiveItem(null);
  }

  return (
    <>
      <div className='flex flex-1 snap-center w-screen overflow-scroll flex-col gap-3 p-5 pt-0'>
        {results?.map((item: any, i: number) => (
          <div key={item.id} onClick={() => handleSmallCardClick(item)}>
            <SmallCard item={item} i={i} />
          </div>
        ))}
      </div>
      <AnimatePresence>
        {activeItem && (
          <div className='fixed top-0 left-0 right-0 bottom-0 overflow-scroll py-12 w-screen max-w-screen'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className='bg-black/80 fixed top-0 left-0 w-full h-full'
              onClick={() => handleClose()}
            ></motion.div>
            <motion.div
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              exit={{ y: '110%' }}
              transition={{ duration: 0.4 }}
              className='z-10 relative'
            >
              <FullCard item={activeItem} i={0} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
