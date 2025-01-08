'use client';

import { Input } from '@/components/ui/input';
import { SearchMd } from '@/assets/icons';
import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export const SearchMembers = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((query: string) => {
    const params = new URLSearchParams(searchParams);

    if (query) {
      params.set('query', query);
    } else {
      params.delete('query');
    }

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="group flex shadow-sm transition-colors pl-3 rounded-lg border border-border focus-within:ring-2 focus-within:ring-[#CBE1FF] focus-within:border-secondary-foreground">
      <div className="flex flex-col justify-center">
        <SearchMd className="size-5 text-[#7F8082] fill-[#EAEAEA] group-focus-within:text-black" />
      </div>
      <Input
        placeholder="Search by name or email"
        className="border-0 shadow-none ring-0 focus-within:ring-0 pl-2"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
      />
    </div>
  );
};
