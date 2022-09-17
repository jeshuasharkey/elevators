import clsx from 'clsx';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { routesAtom } from '../store/store';

export default function RouteIndicator({
  id,
  small,
  extraSmall,
}: {
  id: string;
  small?: boolean;
  extraSmall?: boolean;
}) {
  const [routes] = useAtom(routesAtom);
  const [route, setRoute] = useState(null);

  useEffect(() => {
    if (!routes) return;
    setRoute(routes.routes[id]);
  }, [routes]);

  return (
    <div
      className={clsx(
        'rounded-full font-bold flex items-center justify-center',
        small ? 'w-6 h-6 text-[16px]' : 'w-8 h-8 text-[18px]'
      )}
      style={{
        backgroundColor: route?.['color'],
        color: route?.['text_color'] || 'white',
      }}
    >
      {id}
    </div>
  );
}
