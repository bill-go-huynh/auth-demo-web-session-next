'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { Provider } from 'react-redux';

import { store } from '@/store';
import { fetchMe } from '@/store/features/auth';
import { useAppDispatch } from '@/store/hooks';

function AuthInitializer({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const hasTriedFetchRef = useRef(false);

  useEffect(() => {
    if (!hasTriedFetchRef.current) {
      hasTriedFetchRef.current = true;
      dispatch(fetchMe()).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
}
