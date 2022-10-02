import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
// import 'react-spring-bottom-sheet/dist/style.css';
import { searchAtom, stopsAtom } from '../store/store';
import FullCard from './FullCard';
import MoreMenu from './MoreMenu';
import SmallCard from './SmallCard';

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

  // useEffect(() => {
  //   // click listener detect class
  //   const handleClick = (e: any) => {
  //     if (e.target.classList.contains('react-modal-sheet-backdrop')) {
  //       handleClose();
  //     }
  //   };

  //   document.addEventListener('click', handleClick);
  //   return () => {
  //     document.removeEventListener('click', handleClick);
  //   };
  // }, []);

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
        snapPoints={({ minHeight, maxHeight }) => [minHeight, maxHeight]}
      >
        <FullCard item={activeItem} i={0} overlayStyle={true} />
        <MoreMenu />
      </BottomSheet>

      {/* <Sheet isOpen={!!activeItem} onClose={() => handleClose()}>
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            <FullCard item={activeItem} i={0} overlayStyle={true} />
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet> */}

      {/* <AnimatePresence>
        {activeItem && (
          <div className='fixed top-0 left-0 right-0 bottom-0 overflow-scroll pt-12 w-screen max-w-screen h-screen flex items-end'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className='bg-[rgb(235,240,244,0.8)] fixed top-0 left-0 w-full h-full'
              onClick={() => handleClose()}
            ></motion.div>
            <motion.div
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              exit={{ y: '110%' }}
              transition={{ duration: 0.4 }}
              className='z-10 relative mt-auto'
            >
              <FullCard item={activeItem} i={0} overlayStyle={true} />
            </motion.div>
          </div>
        )}
      </AnimatePresence> */}
    </>
  );
}
