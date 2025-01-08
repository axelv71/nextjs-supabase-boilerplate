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
import { Alert, AlertTitle } from '@/components/ui/alert';
import { useState, useActionState } from 'react';
import { updateOrganizationName } from '@/actions/organization';

type NameSheetProps = {
  name: string;
  organization: string;
};

export const NameSheet = ({ name, organization }: NameSheetProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [state, action] = useActionState(updateOrganizationName, {
    errors: {},
    success: false,
  });

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <div className="flex space-x-2">
        <Input value={name} disabled />
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="w-12 shadow-none">
            <PencilLine className="w-4 h-4 text-[#7F8082] fill-[#EAEAEA]" />
          </Button>
        </SheetTrigger>
      </div>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Change Organization name</SheetTitle>
          <SheetDescription>
            Update your organization name. This will be displayed in your
            proposals and invoices.
          </SheetDescription>
          <form action={action} className="space-y-6 pt-4">
            <input type="hidden" name="organization" value={organization} />
            {state.success && (
              <Alert variant="success">
                <AlertTitle>Organization name updated successfully</AlertTitle>
              </Alert>
            )}
            {state.errors?.name && (
              <Alert variant="destructive">
                <AlertTitle>{state.errors.name}</AlertTitle>
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
              <Label htmlFor="current-name">Current Organization name</Label>
              <Input id="current-name" value={name} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">New Organization name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                placeholder="New organization name"
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
