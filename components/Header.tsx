import React from 'react';
import ListViewIcon from './icons/ListViewIcon';
import RefreshIcon from './icons/RefreshIcon';
import SearchIcon from './icons/SearchIcon';

export default function Header() {
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
      <div className='p-1'>
        <RefreshIcon />
      </div>
      <div className='p-1'>
        <ListViewIcon />
      </div>
    </div>
  );
}
