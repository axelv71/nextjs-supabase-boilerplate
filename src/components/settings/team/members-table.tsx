import { createClient } from '@/lib/supabase/server';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MemberInvitationMoreDropdown } from '@/components/settings/team/member-invitation-more-dropdown';
import { Enums } from '@/types/database.types';
import { MemberMoreDropdown } from '@/components/settings/team/member-more-dropdown';
import { Skeleton } from '@/components/ui/skeleton';

type MembersTableProps = {
  query?: string;
  organizationId: string;
  organizationSlug: string;
  userRole: Enums<'organization_member_role'>;
  userId: string;
};

export const MembersTable = async ({
  query,
  organizationId,
  organizationSlug,
  userRole,
  userId,
}: MembersTableProps) => {
  const supabase = await createClient();
  const { data } = await supabase.rpc('get_organization_members', {
    org_id: organizationId,
    search: query,
  });

  if (!data) {
    return <p>No members found.</p>;
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold">{data.length} active members</p>
      {data.length > 0 ? (
        <Table>
          <TableBody>
            {data.map((member, index) => (
              <TableRow key={index} className="hover:bg-transparent">
                <TableCell
                  className={cn(
                    'flex items-center space-x-3 pl-0',
                    member.user_status === 'invited' && 'opacity-50',
                  )}
                >
                  <Avatar>
                    <AvatarFallback>{member.username[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold">{member.username}</span>
                    <span className="text-[#5F6064]">{member.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className="capitalize">{member.role}</span>
                    {member.user_status === 'invited' && (
                      <Badge variant="secondary">Pending</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell align="right">
                  {member.user_status === 'invited' && (
                    <>
                      <MemberInvitationMoreDropdown
                        /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
                        /* @ts-ignore */
                        member={member}
                        userRole={userRole}
                        invitationId={member.invitation_id ?? ''}
                      />
                    </>
                  )}

                  {member.user_status === 'member' && (
                    <>
                      <MemberMoreDropdown
                        /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
                        /* @ts-ignore */
                        member={member}
                        userRole={userRole}
                        organization={organizationSlug}
                        userId={userId}
                      />
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No members found.</p>
      )}
    </div>
  );
};

export const MembersTableSkeleton = () => {
  return (
    <Table>
      <TableBody>
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index} className="hover:bg-transparent">
            <TableCell className={cn('flex items-center space-x-3 pl-0')}>
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex flex-col space-y-2">
                <Skeleton className="w-20 h-4" />
                <Skeleton className="w-52 h-4" />
              </div>
            </TableCell>
            <TableCell>
              <Skeleton className="w-20 h-4" />
            </TableCell>
            <TableCell align="right">
              <Skeleton className="size-6 rounded-full" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
