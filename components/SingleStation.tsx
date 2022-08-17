import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { slideAtom, viewAtom } from '../store/store';
import FullCard from './FullCard';
import SmallCard from './SmallCard';

export default function SingleStation({ item, i }: { item: any; i: number }) {
  const [view, setView] = useAtom(viewAtom);
  const [slide, setSlide] = useAtom(slideAtom);
  function handleSmallCardClick(station: string) {
    setView('full');
    setSlide(i);
  }

  if (!item) return null;
  if (view === 'list')
    return (
      <div onClick={() => handleSmallCardClick(item.station)}>
        <SmallCard item={item} i={i} />
      </div>
    );
  return <FullCard item={item} i={i} />;
}
