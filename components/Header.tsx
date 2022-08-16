import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { viewAtom } from '../store/store';
import ListViewIcon from './icons/ListViewIcon';
import RefreshIcon from './icons/RefreshIcon';
import SearchIcon from './icons/SearchIcon';
import { useAtom } from 'jotai';
import clsx from 'clsx';

export default function Header({ refresh }: { refresh: () => void }) {
  const [refreshAnimate, setRefreshAnimate] = useState(false);
  const [view, setView] = useAtom(viewAtom);

  function handleRefresh() {
    setRefreshAnimate(true);
    refresh();
  }

  function handleAnimationComplete() {
    setRefreshAnimate(false);
  }

  return (
    <div className='flex gap-4 items-center p-5'>
      <label htmlFor='search' className='flex gap-3 flex-1'>
        <SearchIcon />
        <input
          type='text'
          placeholder='Find Stations'
          className='bg-transparent text-white placeholder:text-white text-[18px] transition placeholder:transition placeholder:transition-duration-[100ms] tracking-wide leading-[100%] focus:outline-none focus:placeholder:text-white/30'
          name='search'
          id='search'
        />
      </label>
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
        className={clsx(
          'p-1',
          view === 'list' ? 'opacity-30' : 'cursor-pointer'
        )}
        onClick={() => setView('list')}
      >
        <ListViewIcon />
      </div>
    </div>
  );
}
