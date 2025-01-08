import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { MembersTableSkeleton } from '@/components/settings/team/members-table';

export default function Loading() {
  return (
    <div className="p-8 space-y-10">
      <div className="space-y-4">
        <Skeleton className="w-32 h-8" />
        <Skeleton className="w-64 h-4" />
      </div>
      <Separator />
      <div className="grid grid-cols-6">
        <div className="col-start-1 col-span-6 xl:col-span-3 space-y-6">
          <div className="space-y-4">
            <Skeleton className="w-24 h-6" />
            <div className="space-y-1">
              <Skeleton className="w-96 h-4" />
              <Skeleton className="w-36 h-4" />
            </div>
          </div>
          <Skeleton className="w-full h-12" />
        </div>
        <div className="col-span-6 xl:col-span-3 flex items-end justify-end">
          <Skeleton className="w-32 h-12" />
        </div>
      </div>
      <div>
        <div className="space-y-2">
          <Skeleton className="w-64 h-4" />
          <MembersTableSkeleton />
        </div>
        <Separator />
      </div>
    </div>
  );
}
