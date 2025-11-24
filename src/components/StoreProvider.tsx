'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { Provider } from 'react-redux';

import { store } from '@/store';
import { fetchMe } from '@/store/features/auth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

function AuthInitializer({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);
  const hasTriedFetchRef = useRef(false);

  useEffect(() => {
    // Fetch user info on mount if not loading and no user
    if (!loading && !user && !hasTriedFetchRef.current) {
      hasTriedFetchRef.current = true;
      dispatch(fetchMe()).catch(() => {
        // Ignore errors, they're handled by the slice
      });
    }

    // Reset hasTriedFetch if user is removed
    if (!user) {
      hasTriedFetchRef.current = false;
    }
  }, [user, loading, dispatch]);

  return <>{children}</>;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
}
