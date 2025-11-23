'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { MESSAGES, ERRORS } from '@/lib/constants';

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshMe, user, loading } = useAuth();

  useEffect(() => {
    const urlError = searchParams.get('error');
    if (urlError) {
      const timeoutId = setTimeout(() => {
        router.push(`/login?error=${ERRORS.AUTH_FAILED}`);
      }, 2000);
      return () => clearTimeout(timeoutId);
    }

    const handleCallback = async () => {
      await refreshMe();
    };

    handleCallback();
  }, [refreshMe, searchParams, router]);

  useEffect(() => {
    if (!loading) {
      const urlError = searchParams.get('error');
      if (urlError) {
        return;
      }
      if (user) {
        router.push('/notes');
      } else {
        router.push(`/login?error=${ERRORS.AUTH_FAILED}`);
      }
    }
  }, [user, loading, router, searchParams]);

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <p className="text-lg">{MESSAGES.COMPLETING_AUTH}</p>
      </div>
    </div>
  );
}
