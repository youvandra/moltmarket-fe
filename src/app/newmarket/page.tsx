'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewMarketRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/marketforadmin');
  }, [router]);

  return null;
}
