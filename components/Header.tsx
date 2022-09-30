import { AnimatePresence, motion } from 'framer-motion';
import React, { useRef, useState } from 'react';
import { searchAtom, viewAtom } from '../store/store';
import ListViewIcon from './icons/ListViewIcon';
import RefreshIcon from './icons/RefreshIcon';
import SearchIcon from './icons/SearchIcon';
import { useAtom } from 'jotai';
import clsx from 'clsx';
import CrossIcon from './icons/CrossIcon';

export default function Header({ refresh }: { refresh: () => void }) {
  const [refreshAnimate, setRefreshAnimate] = useState(false);
  const [view, setView] = useAtom(viewAtom);
  const [search, setSearch] = useAtom(searchAtom);

  function handleRefresh() {
    setRefreshAnimate(true);
    refresh();
  }

  function handleAnimationComplete() {
    setRefreshAnimate(false);
  }

  function handleClearSearch() {
    setSearch('');
    if (searchInput.current) searchInput.current.value = '';
  }

  const searchInput = useRef<any>(null);

  return (
    <div className='flex gap-4 items-center p-5 sticky top-0 left-0 right-0'>
      <label htmlFor='search' className='flex gap-3 flex-1'>
        <SearchIcon />
        <input
          type='text'
          placeholder='Find Stations'
          className='bg-transparent text-black placeholder:text-black text-[18px] transition placeholder:transition placeholder:transition-duration-[100ms] tracking-wide leading-[100%] focus:outline-none focus:placeholder:!text-black/30'
          name='search'
          id='search'
          ref={searchInput}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>
      {search && (
        <div className='p-1 cursor-pointer' onClick={() => handleClearSearch()}>
          <CrossIcon />
        </div>
      )}
      {!search && (
        <>
          <motion.div
            className='p-1 cursor-pointer'
            animate={{ rotate: refreshAnimate ? 180 : 0 }}
            transition={{ duration: refreshAnimate ? 0.3 : 0 }}
            onClick={() => handleRefresh()}
            onAnimationComplete={() => handleAnimationComplete()}
          >
            <RefreshIcon />
          </motion.div>
          <div
            className={clsx('p-1 cursor-pointer w-7 flex justify-center')}
            onClick={() => setView(view === 'list' ? 'full' : 'list')}
          >
            {view === 'full' && <ListViewIcon />}
            {view === 'list' && <CrossIcon />}
          </div>
        </>
      )}
    </div>
  );
}
