'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Card } from '@/components/ui';
import { MESSAGES } from '@/constants';
import { userApi } from '@/services';
import { useAppSelector } from '@/store/hooks';
import { formatDate } from '@/utils';

export default function UserPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-lg">{MESSAGES.LOADING}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">User Profile</h1>

      <Card>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">ID</label>
            <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">{user.id}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
            <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">{user.email}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
            <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">{user.name}</p>
          </div>

          {user.googleId && (
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Google ID
              </label>
              <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">{user.googleId}</p>
            </div>
          )}

          {user.createdAt && (
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Created At
              </label>
              <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">
                {formatDate(user.createdAt)}
              </p>
            </div>
          )}

          {user.updatedAt && (
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Updated At
              </label>
              <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">
                {formatDate(user.updatedAt)}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
