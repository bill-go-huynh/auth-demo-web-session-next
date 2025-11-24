import Link from 'next/link';

import { Button, Card } from '@/components/ui';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card className="text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Session Client</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          This is the Session client using Redux Toolkit and session-based authentication.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button variant="primary">Go to Login</Button>
          </Link>
          <Link href="/notes">
            <Button variant="secondary">View Notes</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
