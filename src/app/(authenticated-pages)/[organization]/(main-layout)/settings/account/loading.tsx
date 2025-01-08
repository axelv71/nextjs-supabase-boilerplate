import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Fragment } from 'react';

export default function Loading() {
  return (
    <div className="p-8 space-y-10">
      <div className="space-y-4">
        <Skeleton className="w-32 h-8" />
        <Skeleton className="w-64 h-4" />
      </div>
      <Separator />
      <div className="grid grid-cols-6">
        <div className="col-start-1 col-span-6 xl:col-span-3">
          <div className="flex flex-row items-center gap-6">
            <Skeleton className="min-w-48 w-48 h-48 rounded-lg" />

            <div className="space-y-3">
              <Skeleton className="w-36 h-6" />
              <div className="space-y-1">
                <Skeleton className="w-96 h-4" />
                <Skeleton className="w-48 h-4" />
              </div>
              <Skeleton className="w-32 h-10" />
            </div>
          </div>
        </div>
      </div>
      <Separator />
      {Array.from({ length: 3 }).map((_, index) => (
        <Fragment key={index}>
          <div className="grid grid-cols-6">
            <div className="col-start-1 col-span-2 space-y-4">
              <Skeleton className="w-24 h-6" />
              <div className="space-y-1">
                <Skeleton className="w-96 h-4" />
                <Skeleton className="w-36 h-4" />
              </div>
            </div>
            <div className="col-start-5 col-span-2 space-y-4">
              <Skeleton className="w-32 ml-auto h-6" />
              <Skeleton className="w-full h-12" />
            </div>
          </div>
          <Separator />
        </Fragment>
      ))}
    </div>
  );
}
