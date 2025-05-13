'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import DateFilter from './DateFilter';

export default function DateFilterWrapper() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (startDate: string, endDate: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    router.push(`?${params.toString()}`);
  };

  return <DateFilter onFilterChange={handleFilterChange} />;
} 