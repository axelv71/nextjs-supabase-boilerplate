'use client';

import { Enums, Tables } from '@/types/database.types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { DotsHorizontal } from '@/assets/icons';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  changeRole,
  removeOrganizationMember,
} from '@/actions/organization-members';

type MemberMoreDropdownProps = {
  member: Tables<'organization_members_view'>;
  userRole: Enums<'organization_member_role'>;
  organization: string;
  userId: string;
};

export const MemberMoreDropdown = ({
  member,
  userRole,
  organization,
  userId,
}: MemberMoreDropdownProps) => {
  const [dropdownOpen, setDropdownOpen] = React.useState<boolean>(false);

  if (
    member.user_id === userId ||
    (userRole !== 'owner' && userRole !== 'admin') ||
    (userRole === 'admin' && member.role === 'owner')
  )
    return null;

  const handleRemove = () => {
    toast.promise(
      removeOrganizationMember(organization, member.user_id ?? ''),
      {
        loading: 'Removing member...',
        success: 'Member removed',
        error: (error) => error.message,
      },
    );
  };

  const handleRoleChange = (role: Enums<'organization_member_role'>) => {
    setDropdownOpen(false);
    toast.promise(changeRole(organization, member.user_id ?? '', role), {
      loading: 'Changing role...',
      success: 'Role changed',
      error: (error) => error.message,
    });
  };

  return (
    <Dialog>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <DotsHorizontal />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Change role</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="w-48">
                {member.role !== 'owner' && (
                  <DropdownMenuItem onClick={() => handleRoleChange('owner')}>
                    Set to Owner
                  </DropdownMenuItem>
                )}
                {member.role !== 'admin' && (
                  <DropdownMenuItem onClick={() => handleRoleChange('admin')}>
                    Set to Admin
                  </DropdownMenuItem>
                )}
                {member.role !== 'member' && (
                  <DropdownMenuItem onClick={() => handleRoleChange('member')}>
                    Set to Member
                  </DropdownMenuItem>
                )}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DialogTrigger asChild>
            <DropdownMenuItem>Remove</DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove {member.username} from the team?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-[#5F6064]">
          Are you sure you want to remove {member.email} from the team? They
          will lose access to all organization resources.
        </p>
        <Separator className="my-2" />
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <DialogClose asChild>
            <Button variant="destructive" onClick={handleRemove}>
              Confirm
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
