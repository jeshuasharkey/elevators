import { atom } from 'jotai';

export const ataAtom = atom(null);
export const accDataAtom = atom<any>(null);
export const accOutagesAtom = atom<any>(null);
export const stopsAtom = atom<any>(null);
export const routesAtom = atom<any>(null);
export const favouritesAtom = atom(['Flushing Av', 'Marcy Av', 'Fulton St']);
export const viewAtom = atom('full');
export const slideAtom = atom(0);
export const searchAtom = atom('');
export const moreMenuItemAtom = atom('');
