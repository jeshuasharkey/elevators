import { useAtom } from 'jotai';
import { useRef, useState } from 'react';
import { BottomSheet, BottomSheetRef } from 'react-spring-bottom-sheet';
// import 'react-spring-bottom-sheet/dist/style.css';
import { moreMenuItemAtom, searchAtom, stopsAtom } from '../store/store';
import FullCard from './FullCard';
import MoreMenu from './MoreMenu';
import SmallCard from './SmallCard';

export default function Search() {
  const [search, setSearch] = useAtom(searchAtom);
  const [stops, setStops] = useAtom(stopsAtom);
  const [moreMenuItem, setMoreMenuItem] = useAtom(moreMenuItemAtom);
  const [activeItem, setActiveItem] = useState(null);

  const sheetRef = useRef<BottomSheetRef>();

  const results = stops?.filter((item: any) =>
    item?.name?.toUpperCase().includes(search.toUpperCase())
  );

  function handleSmallCardClick(item: any) {
    setActiveItem(item);
  }

  function handleClose() {
    setActiveItem(null);
    setMoreMenuItem(null);
  }

  return (
    <>
      <div className='flex flex-1 snap-center w-screen overflow-scroll flex-col gap-3 p-5 pt-0'>
        {results?.map((item: any, i: number) => (
          <div key={item.id} onClick={() => handleSmallCardClick(item)}>
            <SmallCard item={item} i={i} searchStyle={true} />
          </div>
        ))}
      </div>

      <BottomSheet
        open={!!activeItem}
        onDismiss={handleClose}
        expandOnContentDrag={true}
        defaultSnap={({ maxHeight }) => maxHeight}
        snapPoints={({ maxHeight }) => [maxHeight]}
      >
        <FullCard item={activeItem} i={0} overlayStyle={true} />
        <MoreMenu />
      </BottomSheet>
    </>
  );
}
