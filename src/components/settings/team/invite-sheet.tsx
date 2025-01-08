'use client';

import { Button } from '@/components/ui/button';
import { Plus } from '@/assets/icons';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { useFormStatus } from 'react-dom';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { useState, useActionState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { inviteUsers } from '@/actions/organization-invitation';

type InviteSheetProps = {
  organization: string;
};

export const InviteSheet = ({ organization }: InviteSheetProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [state, action] = useActionState(inviteUsers, {
    errors: {},
    success: false,
  });

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="size-5" />
          Invite People
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Invite to your organisation</SheetTitle>
          <SheetDescription>
            Invite a new user to your organization. They will receive an email
            with a link to join your organization.
          </SheetDescription>
          <form action={action} className="space-y-6 pt-4">
            <input type="hidden" name="organization" value={organization} />
            {state.success && (
              <Alert variant="success">
                <AlertTitle>Invites sent successfully</AlertTitle>
              </Alert>
            )}
            {state.errors?.emails && (
              <Alert variant="destructive">
                <AlertTitle>{state.errors.emails}</AlertTitle>
              </Alert>
            )}
            {state.errors?.organization && (
              <Alert variant="destructive">
                <AlertTitle>{state.errors.organization}</AlertTitle>
              </Alert>
            )}
            {state.errors?._form && (
              <Alert variant="destructive">
                <AlertTitle>{state.errors._form}</AlertTitle>
              </Alert>
            )}
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="email">Emails</Label>
              <Textarea
                id="emails"
                name="emails"
                required
                placeholder="email@example.com; email2@example.com..."
                className="min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground">
                Separate emails with a semicolon (;)
              </p>
            </div>
            <Separator />
            <div className="space-x-2">
              <Button variant="outline" type="reset" onClick={handleCancel}>
                Cancel
              </Button>
              <SubmitButton />
            </div>
          </form>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Sending...' : 'Send Invites'}
    </Button>
  );
}
