import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Suspense } from 'react';
import { UserInfo } from '@/components/layout/user-info';

export const Sidebar = () => {
  return (
    <aside className="h-screen bg-primary fixed text-primary-foreground w-72 transition-transform -translate-x-full sm:translate-x-0">
      <div className="flex flex-col h-full justify-between">
        <div className="flex items-center justify-between px-5 py-6">
          <Link
            href="/"
            className="relative z-20 flex items-center text-lg font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            Acme Inc
          </Link>

          <Button variant="ghost" size="icon">
            <ChevronLeft />
          </Button>
        </div>

        <Suspense fallback={null}>
          <UserInfo />
        </Suspense>
      </div>
    </aside>
  );
};
