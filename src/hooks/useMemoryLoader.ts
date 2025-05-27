
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { loadMemoryAtom } from '@atoms/mnode';

export const useMemoryLoader = () => {
  const load = useSetAtom(loadMemoryAtom);

  useEffect(() => {
    load();
  }, [load]);
};