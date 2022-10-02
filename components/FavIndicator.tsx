import clsx from 'clsx';
import { useAtom } from 'jotai';
import React from 'react';
import { favouritesAtom } from '../store/store';
import FavouriteIcon from './icons/FavouriteIcon';

export default function FavIndicator({
  item,
  small,
}: {
  item: any;
  small?: boolean;
}) {
  const [favourites, setFavourites] = useAtom(favouritesAtom);

  function isFavourite() {
    if (!favourites || !item) return false;
    return favourites?.findIndex((i) => i === item?.id) > -1;
  }
  if (isFavourite())
    return (
      <div className='mr-2'>
        <FavouriteIcon
          className={clsx(small ? 'w-4' : 'w-5')}
          fill='#B87079'
          stroke='#B87079'
        />
      </div>
    );
  return null;
}
