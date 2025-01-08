import { Separator } from '@/components/ui/separator';
import { Suspense } from 'react';
import { SearchMembers } from '@/components/settings/team/search-members';
import { InviteSheet } from '@/components/settings/team/invite-sheet';
import {
  MembersTable,
  MembersTableSkeleton,
} from '@/components/settings/team/members-table';
import { getOrganizationBySlug } from '@/services/organization';
import { getUserProfile } from '@/services/user';

type Props = {
  searchParams?: Promise<{
    query?: string;
  }>;
  params: Promise<{
    organization: string;
  }>;
};

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;
  const { organization } = await props.params;
  const query = searchParams?.query || '';

  const { organization: org, userRole } =
    await getOrganizationBySlug(organization);
  const user = await getUserProfile();

  return (
    <div className="p-8 space-y-10">
      <div className="space-y-4">
        <h1 className="font-britti text-2xl">Members</h1>
        <p className="text-[#5F6064]">
          Manage who has access to this organisation.
        </p>
      </div>
      <Separator />
      <div className="grid grid-cols-6">
        <div className="col-start-1 col-span-6 xl:col-span-3 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Manage members</h3>
            <p className="text-sm text-[#5F6064]">
              On the Free plan all members in a workspace are administrators.
              Upgrade to a paid plan to add the ability to assign or remove
              administrator roles.
            </p>
          </div>
          <Suspense>
            <SearchMembers />
          </Suspense>
        </div>
        <div className="col-span-6 xl:col-span-3 flex items-end justify-end">
          <InviteSheet organization={organization} />
        </div>
      </div>
      <div>
        <Suspense key={query} fallback={<MembersTableSkeleton />}>
          <MembersTable
            organizationId={org.id}
            query={query}
            userRole={userRole}
            organizationSlug={organization}
            userId={user.user?.id}
          />
        </Suspense>
        <Separator />
      </div>
    </div>
  );
}
