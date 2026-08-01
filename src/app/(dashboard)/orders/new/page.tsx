'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardOrderRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/orders/new');
  }, [router]);

  return (
    <div className="p-8 text-center text-slate-400">
      Loading Studio Order Booking System...
    </div>
  );
}
