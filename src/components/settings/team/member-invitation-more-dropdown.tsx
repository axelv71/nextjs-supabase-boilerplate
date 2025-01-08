'use client';

import { Enums, Tables } from '@/types/database.types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { revokeInvitation } from '@/actions/organization-invitation';

type MemberMoreDropdownProps = {
  member: Tables<'organization_members_view'>;
  userRole: Enums<'organization_member_role'>;
  invitationId: string;
};

export const MemberInvitationMoreDropdown = ({
  member,
  userRole,
  invitationId,
}: MemberMoreDropdownProps) => {
  if (userRole !== 'owner' && userRole !== 'admin') return null;

  const handleRevokeInvitation = async () => {
    toast.promise(revokeInvitation(invitationId), {
      loading: 'Revoking invitation...',
      success: () => {
        return 'Invitation revoked successfully';
      },
      error: (error) => {
        return error.message;
      },
    });
  };

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <DotsHorizontal />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DialogTrigger asChild>
            <DropdownMenuItem>Revoke invitation</DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Revoke invite for {member.username}?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-[#5F6064]">
          Are you sure you would like to revoke {member.email}’s invitation?
        </p>
        <Separator className="my-2" />
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <DialogClose asChild>
            <Button variant="destructive" onClick={handleRevokeInvitation}>
              Confirm
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
