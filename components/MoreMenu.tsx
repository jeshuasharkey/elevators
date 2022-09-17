import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import FavouriteIcon from './icons/FavouriteIcon';
import NavigateIcon from './icons/NavigateIcon';
import RemoveIcon from './icons/RemoveIcon';
import { useAtom } from 'jotai';
import {
  favouritesAtom,
  moreMenuItemAtom,
  moreMenuTrainNoAtom,
} from '../store/store';
import Link from 'next/link';

export default function MoreMenu() {
  const [moreMenuItem, setMoreMenuItem] = useAtom(moreMenuItemAtom);
  const [moreMenuTrainNo, setMoreMenuTrainNo] = useAtom(moreMenuTrainNoAtom);
  const [favourites, setFavourites] = useAtom(favouritesAtom);

  function isFavourite() {
    return favourites.findIndex((i) => i === moreMenuItem) > -1;
  }

  function handleToggleFavourite() {
    if (isFavourite()) {
      const newArr = favourites.filter((i) => i !== moreMenuItem);
      setFavourites(newArr);
      localStorage.setItem('favourites', newArr.join(','));
    } else {
      const newArr = [...favourites, moreMenuItem];
      setFavourites(newArr);
      localStorage.setItem('favourites', newArr.join(','));
    }

    handleClearMoreMenu();
  }

  function handleClearMoreMenu() {
    setMoreMenuItem('');
    setMoreMenuTrainNo('');
  }

  return (
    <AnimatePresence>
      {moreMenuItem && (
        <div className='fixed top-0 left-0 right-0 bottom-0 flex flex-col justify-end overflow-scroll p-5 z-[99999999]'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='bg-gradient-to-b from-transparent to-black fixed top-0 left-0 w-full h-full'
            onClick={() => handleClearMoreMenu()}
          ></motion.div>
          <motion.div
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            exit={{ y: '110%' }}
            transition={{ duration: 0.4 }}
            className='z-10 relative flex flex-col gap-5 text-black text-[18px] font-semibold'
          >
            <div className='bg-white rounded-[32px]'>
              <div
                className='flex gap-4 items-center p-6 border-b border-gray-100'
                onClick={() => handleToggleFavourite()}
              >
                {isFavourite() && (
                  <>
                    <RemoveIcon />
                    <div className=''>Remove from favourites</div>
                  </>
                )}
                {!isFavourite() && (
                  <>
                    <FavouriteIcon />
                    <div className=''>Add to favourites</div>
                  </>
                )}
              </div>
              <Link
                href={`https://www.google.com/maps/search/?api=1&query=${moreMenuItem.replace(
                  ' ',
                  '+'
                )}+${moreMenuTrainNo}+Subway+Station`}
                passHref
              >
                <a target='_blank' className='contents'>
                  <div className='flex gap-4 items-center p-6'>
                    <NavigateIcon />
                    <div className=''>Navigate here</div>
                  </div>
                </a>
              </Link>
            </div>
            <div
              className='bg-white rounded-[24px] text-center p-4'
              onClick={() => handleClearMoreMenu()}
            >
              Cancel
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
