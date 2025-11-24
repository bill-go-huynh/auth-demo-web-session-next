'use client';

import { Suspense, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';

import { ERRORS, MESSAGES } from '@/constants';
import { fetchMe } from '@/store/features/auth';
import { useAppDispatch } from '@/store/hooks';

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    // Only process OAuth callback once
    if (hasProcessedRef.current) return;
    hasProcessedRef.current = true;

    const urlError = searchParams.get('error');
    if (urlError) {
      toast.error(ERRORS.AUTH_FAILED);
      router.replace('/login');
      return;
    }

    // With session-based auth, the session cookie is set by the backend
    // We just need to fetch user info
    dispatch(fetchMe())
      .unwrap()
      .then(() => {
        toast.success(MESSAGES.LOGIN_SUCCESS);
        router.replace('/notes');
      })
      .catch(() => {
        toast.error(ERRORS.AUTH_FAILED);
        router.replace('/login');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount - searchParams is stable in Next.js

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <p className="text-lg">{MESSAGES.COMPLETING_AUTH}</p>
      </div>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">{MESSAGES.COMPLETING_AUTH}</div>}>
      <OAuthCallbackContent />
    </Suspense>
  );
}
