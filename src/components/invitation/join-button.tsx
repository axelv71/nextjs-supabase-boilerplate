'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { acceptInvitation } from '@/actions/organization-invitation';

type JoinButtonProps = {
  invitationId: string;
};

export const JoinButton = ({ invitationId }: JoinButtonProps) => {
  const [pending, setPending] = useState<boolean>(false);

  const handleJoin = async () => {
    setPending(true);

    toast.promise(acceptInvitation(invitationId), {
      loading: 'Joining...',
      success: () => {
        setPending(false);
        return 'Successfully joined';
      },
      error: (error) => {
        setPending(false);
        return error.message;
      },
    });
  };

  return (
    <Button size="sm" onClick={handleJoin} disabled={pending}>
      {pending ? 'Joining...' : 'Join'}
    </Button>
  );
};
