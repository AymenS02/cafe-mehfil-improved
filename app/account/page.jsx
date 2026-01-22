import { Suspense } from 'react';
import AccountContent from './AccountContent';

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-fg mb-2">My Account</h1>
            <p className="text-secondary">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <AccountContent />
    </Suspense>
  );
}

