'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { declineInvitation } from '@/actions/organization-invitation';

type DeclineButtonProps = {
  invitationId: string;
};

export const DeclineButton = ({ invitationId }: DeclineButtonProps) => {
  const [pending, setPending] = useState<boolean>(false);

  const handleDecline = async () => {
    setPending(true);

    toast.promise(declineInvitation(invitationId), {
      loading: 'Declining...',
      success: () => {
        setPending(false);
        return 'Successfully declined';
      },
      error: (error) => {
        setPending(false);
        return error.message;
      },
    });
  };

  return (
    <Button variant="outline" disabled={pending} onClick={handleDecline}>
      {pending ? 'Declining...' : 'Decline'}
    </Button>
  );
};
