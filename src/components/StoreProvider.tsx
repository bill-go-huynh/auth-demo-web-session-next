'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { Provider } from 'react-redux';

import { type RootState, store } from '@/store';
import { fetchMe } from '@/store/features/auth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

function AuthInitializer({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const hasTriedFetchRef = useRef(false);

  useEffect(() => {
    if (!user && !hasTriedFetchRef.current) {
      hasTriedFetchRef.current = true;
      dispatch(fetchMe()).catch(() => {
        // Ignore errors, they're handled by the slice
      });
    }

    if (!user) {
      hasTriedFetchRef.current = false;
    }
  }, [user, dispatch]);

  return <>{children}</>;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
}
