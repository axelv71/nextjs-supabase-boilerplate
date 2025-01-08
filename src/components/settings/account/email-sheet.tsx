'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PencilLine } from '@/assets/icons';
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
import { updateUserEmail } from '@/actions/user';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { useState, useActionState } from 'react';

type EmailSheetProps = {
  email: string;
};

export const EmailSheet = ({ email }: EmailSheetProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [state, action] = useActionState(updateUserEmail, {
    errors: {},
    success: false,
  });

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <div className="flex space-x-2">
        <Input value={email} disabled />
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="w-12 shadow-none">
            <PencilLine className="w-4 h-4 text-[#7F8082] fill-[#EAEAEA]" />
          </Button>
        </SheetTrigger>
      </div>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Change email address</SheetTitle>
          <SheetDescription>
            Your billing information & proposal updates will be sent to this
            email address
          </SheetDescription>
          <form action={action} className="space-y-6 pt-4">
            {state.success && (
              <Alert variant="success">
                <AlertTitle>Email changed successfully</AlertTitle>
              </Alert>
            )}
            {state.errors?.email && (
              <Alert variant="destructive">
                <AlertTitle>{state.errors.email}</AlertTitle>
              </Alert>
            )}
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="current-mail">Current email address</Label>
              <Input id="current-mail" value={email} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">New email address</Label>
              <Input
                id="email"
                name="email"
                autoComplete="email"
                type="email"
                required
                placeholder="New email address"
              />
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
      {pending ? 'Saving...' : 'Save Changes'}
    </Button>
  );
}
